import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// Shopify GraphQL to update a metafield on a discount with the current remaining threshold
const UPDATE_METAFIELD_MUTATION = `
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id key value }
      userErrors { field message }
    }
  }
`;

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, payload, admin } = await authenticate.webhook(request);

  const order = payload as any;
  const orderId = String(order.id);
  const discountCodes: Array<{ code: string; amount: string; type: string }> =
    order.discount_codes || [];

  if (!discountCodes || discountCodes.length === 0) {
    // No discount codes applied — nothing to do
    return new Response(null, { status: 200 });
  }

  for (const appliedDiscount of discountCodes) {
    const code = appliedDiscount.code?.toUpperCase();
    if (!code) continue;

    // Actual discount amount deducted from this order
    const actualDeducted = parseFloat(appliedDiscount.amount || "0");
    if (actualDeducted <= 0) continue;

    // Find our discount record
    const discountRecord = await prisma.discountThreshold.findFirst({
      where: { shop, discountCode: code, isActive: true },
    });

    if (!discountRecord) continue;

    // Idempotency guard: check if this order was already processed for this discount
    const alreadyProcessed = await prisma.processedOrder.findUnique({
      where: {
        shop_orderId_discountGid: {
          shop,
          orderId,
          discountGid: discountRecord.discountGid,
        },
      },
    });

    if (alreadyProcessed) {
      console.log(`[webhook] Order ${orderId} already processed for discount ${code}. Skipping.`);
      continue;
    }

    // Use a Prisma transaction with optimistic locking (version check)
    // This ensures first-come-first-serve: two simultaneous webhook calls won't double-deduct
    let success = false;
    let retries = 3;

    while (!success && retries > 0) {
      retries--;
      try {
        await prisma.$transaction(async (tx) => {
          // Re-read inside transaction to get latest version
          const freshRecord = await tx.discountThreshold.findFirst({
            where: { shop, discountCode: code, isActive: true },
          });

          if (!freshRecord) throw new Error("Discount not found");

          const deductAmount = Math.min(actualDeducted, freshRecord.remainingAmount);
          const newUsed = freshRecord.usedAmount + deductAmount;
          const newRemaining = Math.max(0, freshRecord.totalThreshold - newUsed);

          // Optimistic lock: only update if version matches (no concurrent update happened)
          const updated = await tx.discountThreshold.updateMany({
            where: {
              id: freshRecord.id,
              version: freshRecord.version, // Version must match or this fails
            },
            data: {
              usedAmount: newUsed,
              remainingAmount: newRemaining,
              version: freshRecord.version + 1,
            },
          });

          if (updated.count === 0) {
            throw new Error("Version conflict — retrying");
          }

          // Record this order as processed (idempotency)
          await tx.processedOrder.create({
            data: {
              shop,
              orderId,
              discountGid: freshRecord.discountGid,
              deducted: deductAmount,
            },
          });

          // Update the Shopify metafield so the Function reads the new remaining threshold
          // We do this after transaction to not hold DB lock during network call
          try {
            const newMetafieldValue = JSON.stringify({
              percentage: freshRecord.percentage,
              remaining_threshold: newRemaining,
              total_threshold: freshRecord.totalThreshold,
            });

            await admin.graphql(UPDATE_METAFIELD_MUTATION, {
              variables: {
                metafields: [{
                  ownerId: freshRecord.discountGid,
                  namespace: "$app",
                  key: "discount_config",
                  type: "json",
                  value: newMetafieldValue,
                }],
              },
            });
          } catch (mfError) {
            console.error("[webhook] Failed to update metafield after order:", mfError);
            // Non-fatal: DB is source of truth; metafield sync can retry
          }
        });

        success = true;
        console.log(`[webhook] Threshold deducted for code ${code}: ₹${actualDeducted} from order ${orderId}`);
      } catch (err: any) {
        if (err.message?.includes("Version conflict") && retries > 0) {
          // Wait a short time before retrying on version conflict
          await new Promise((res) => setTimeout(res, 100));
          continue;
        }
        console.error(`[webhook] Error processing discount ${code} for order ${orderId}:`, err);
        break;
      }
    }
  }

  return new Response(null, { status: 200 });
};
