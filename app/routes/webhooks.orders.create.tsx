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

    // Use a Prisma transaction with optimistic locking (version check).
    // Idempotency check is INSIDE the transaction to prevent double-deduction
    // when Shopify delivers the same webhook twice concurrently.
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

          // Idempotency guard inside transaction — safe against concurrent webhook calls
          const existingOrder = await tx.processedOrder.findUnique({
            where: {
              shop_orderId_discountGid: {
                shop,
                orderId,
                discountGid: freshRecord.discountGid,
              },
            },
          });
          if (existingOrder) throw new Error("Already processed");

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

          // Update the Shopify metafield so the Function reads the new remaining threshold.
          // IMPORTANT: Preserve ALL config fields (type, fixedAmount/percentage) so the
          // function does not lose the discount type after an order is processed.
          try {
            const metafieldConfig: Record<string, unknown> = {
              type: freshRecord.discountType,
              remaining_threshold: newRemaining,
              total_threshold: freshRecord.totalThreshold,
              discountCategory: freshRecord.discountCategory,
              specialProducts: freshRecord.specialProducts,
            };

            if (freshRecord.discountType === "fixed") {
              metafieldConfig.fixedAmount = freshRecord.fixedValue ?? 0;
            } else {
              metafieldConfig.percentage = freshRecord.percentage ?? 0;
            }

            await admin.graphql(UPDATE_METAFIELD_MUTATION, {
              variables: {
                metafields: [{
                  ownerId: freshRecord.discountGid,
                  namespace: "$app",
                  key: "discount_config",
                  type: "json",
                  value: JSON.stringify(metafieldConfig),
                }],
              },
            });
          } catch (mfError) {
            console.error("[webhook] Failed to update metafield after order:", mfError);
            // Non-fatal: DB is source of truth; metafield sync can retry
          }
        });

        success = true;
        console.log(`[webhook] Threshold deducted for code ${code}: ${actualDeducted} from order ${orderId}`);

        try {
          const tagsToAdd = new Set<string>();
          const categoryMetafields = new Set<string>();
          const productMetafields = new Set<string>();
          const lineItems = order.line_items || [];
          let specialProducts: any[] = [];
          if (discountRecord.specialProducts) {
            try { specialProducts = JSON.parse(discountRecord.specialProducts); } catch(e){}
          }
          
          const formatTag = (category: string, identifier?: string) => {
            let tag = identifier ? `${category}_${identifier}` : `${category}`;
            if (tag.length > 40) {
              if (identifier) {
                const allowed = 40 - `${category}_`.length;
                if (allowed > 0) {
                  tag = `${category}_${identifier.substring(0, allowed)}`;
                } else {
                  tag = `${category}`.substring(0, 40);
                }
              } else {
                tag = tag.substring(0, 40);
              }
            }
            return tag;
          };

          for (const item of lineItems) {
            // Check if item was actually discounted
            const isDiscounted = item.discount_allocations && item.discount_allocations.length > 0;
            // If we can't determine, we just tag all items to be safe
            if (!isDiscounted && lineItems.some((i: any) => i.discount_allocations && i.discount_allocations.length > 0)) {
               continue; 
            }
            
            const pIdStr = String(item.product_id);
            const vIdStr = String(item.variant_id);
            const match = specialProducts.find(sp => {
              if (!sp.productId.endsWith(`/${pIdStr}`)) return false;
              if (sp.variants && sp.variants.length > 0) {
                return sp.variants.some((v: any) => v.id.endsWith(`/${vIdStr}`));
              }
              return true;
            });
            const identifier = item.sku ? item.sku : item.title;
            
            if (match && match.category) {
              const formatted = formatTag(match.category, identifier);
              tagsToAdd.add(formatted);
              productMetafields.add(formatted);
            } else if (discountRecord.discountCategory) {
              const formatted = formatTag(discountRecord.discountCategory, identifier);
              tagsToAdd.add(formatted);
              categoryMetafields.add(discountRecord.discountCategory);
            }
          }

          if (tagsToAdd.size === 0 && discountRecord.discountCategory) {
            const formatted = formatTag(discountRecord.discountCategory);
            tagsToAdd.add(formatted);
            categoryMetafields.add(discountRecord.discountCategory);
          }

          if (discountRecord.paymentType) {
            tagsToAdd.add(discountRecord.paymentType);
          }

          if (tagsToAdd.size > 0 || categoryMetafields.size > 0 || productMetafields.size > 0) {
            const orderGid = order.admin_graphql_api_id || `gid://shopify/Order/${orderId}`;
            const tagsArray = Array.from(tagsToAdd);
            
            if (tagsArray.length > 0) {
              await admin.graphql(
                `mutation tagsAdd($id: ID!, $tags: [String!]!) {
                  tagsAdd(id: $id, tags: $tags) {
                    userErrors { field message }
                  }
                }`,
                {
                  variables: {
                    id: orderGid,
                    tags: tagsArray
                  }
                }
              );
            }

            const metafieldsInput = [];
            
            if (categoryMetafields.size > 0) {
              metafieldsInput.push({
                ownerId: orderGid,
                namespace: "custom",
                key: "discount_categories",
                type: "list.single_line_text_field",
                value: JSON.stringify(Array.from(categoryMetafields))
              });
            }

            if (productMetafields.size > 0) {
              metafieldsInput.push({
                ownerId: orderGid,
                namespace: "custom",
                key: "discount_products_categories",
                type: "list.single_line_text_field",
                value: JSON.stringify(Array.from(productMetafields))
              });
            }

            if (metafieldsInput.length > 0) {
              await admin.graphql(
                `mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
                  metafieldsSet(metafields: $metafields) {
                    userErrors { field message }
                  }
                }`,
                {
                  variables: {
                    metafields: metafieldsInput
                  }
                }
              );
            }

            console.log(`[webhook] Added tags [${tagsArray.join(", ")}] and separated metafields to order ${orderId}`);
          }
        } catch (tagError) {
          console.error("[webhook] Failed to tag order:", tagError);
        }
      } catch (err: any) {
        if (err.message?.includes("Already processed")) {
          // Concurrent webhook delivery — another call already handled this order
          console.log(`[webhook] Order ${orderId} already processed for discount ${code} (concurrent). Skipping.`);
          success = true;
          break;
        }
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
