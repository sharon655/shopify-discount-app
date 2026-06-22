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
  
  console.log(`[webhook] Order placed: ${orderId} for shop: ${shop}`);
  console.log("[webhook] Full payload discount_codes:", JSON.stringify(order.discount_codes));
  console.log("[webhook] Full payload discount_applications:", JSON.stringify(order.discount_applications));

  const discountCodes: Array<{ code: string; amount: string; type: string }> =
    order.discount_codes || [];

  if (!discountCodes || discountCodes.length === 0) {
    console.log("[webhook] No discount codes found in order. discount_codes is empty.");
    return new Response(null, { status: 200 });
  }

  for (const appliedDiscount of discountCodes) {
    const code = appliedDiscount.code?.toUpperCase();
    if (!code) continue;

    // Actual discount amount deducted from this order
    const actualDeducted = parseFloat(appliedDiscount.amount || "0");
    console.log(`[webhook] Discount code applied: ${code}, actualDeducted: ${actualDeducted}`);
    if (actualDeducted <= 0) {
      console.log(`[webhook] Skipping code ${code} because actualDeducted is <= 0`);
      continue;
    }

    // Find our discount record
    const discountRecord = await prisma.discountThreshold.findFirst({
      where: { shop, discountCode: code, isActive: true },
    });

    if (!discountRecord) {
      console.log(`[webhook] No active discount record found in DB for code: ${code}`);
      continue;
    } else {
      console.log(`[webhook] Active discount record found:`, JSON.stringify(discountRecord));
    }

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

            const mfRes = await admin.graphql(UPDATE_METAFIELD_MUTATION, {
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
            const mfResJson = await mfRes.json() as any;
            const mfErrors = mfResJson?.data?.metafieldsSet?.userErrors || [];
            if (mfErrors.length > 0) {
              console.error("[webhook] First metafieldsSet errors:", JSON.stringify(mfErrors));
            } else {
              console.log("[webhook] First metafieldsSet successful:", JSON.stringify(mfResJson));
            }
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

          if (discountRecord.discountCategory) {
            categoryMetafields.add(discountRecord.discountCategory);
            if (tagsToAdd.size === 0) {
              const formatted = formatTag(discountRecord.discountCategory);
              tagsToAdd.add(formatted);
            }
          }

          if (discountRecord.paymentType) {
            tagsToAdd.add(discountRecord.paymentType);
          }

          if (tagsToAdd.size > 0 || categoryMetafields.size > 0 || productMetafields.size > 0) {
            const orderGid = order.admin_graphql_api_id || `gid://shopify/Order/${orderId}`;
            const tagsArray = Array.from(tagsToAdd);
            
            if (tagsArray.length > 0) {
              try {
                const tagsResponse = await admin.graphql(
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
                const tagsResult = await tagsResponse.json() as any;
                const tagsErrors = tagsResult?.data?.tagsAdd?.userErrors || [];
                if (tagsErrors.length > 0) {
                  console.error("[webhook] tagsAdd errors:", JSON.stringify(tagsErrors));
                } else {
                  console.log("[webhook] tagsAdd successful");
                }
              } catch (tagMutationError) {
                console.error("[webhook] tagsAdd GraphQL request failed:", tagMutationError);
              }
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

            if (discountRecord.paymentType && discountRecord.paymentType.trim() !== "" && discountRecord.paymentType.toLowerCase() !== "none") {
              metafieldsInput.push({
                ownerId: orderGid,
                namespace: "custom",
                key: "discount_payment_method",
                type: "single_line_text_field",
                value: discountRecord.paymentType
              });
            }

            if (metafieldsInput.length > 0) {
              try {
                const mfResponse = await admin.graphql(
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
                const mfResult = await mfResponse.json() as any;
                const mfErrors = mfResult?.data?.metafieldsSet?.userErrors || [];
                if (mfErrors.length > 0) {
                  console.error("[webhook] metafieldsSet errors:", JSON.stringify(mfErrors));
                } else {
                  console.log("[webhook] metafieldsSet successful");
                }
              } catch (mfMutationError) {
                console.error("[webhook] metafieldsSet GraphQL request failed:", mfMutationError);
              }
            }

            console.log(`[webhook] Attempted tags [${tagsArray.join(", ")}] and separated metafields for order ${orderId}`);
          }
        } catch (tagError) {
          console.error("[webhook] Failed to process order tagging/metafields:", tagError);
        }

        // New logic to update discount configuration at the bottom after all existing functionality
        try {
          console.log(`[webhook] Starting post-tagging discount update for code: "${code}"`);
          const freshRecord = await prisma.discountThreshold.findFirst({
            where: { shop, discountCode: code, isActive: true },
          });

          if (freshRecord) {
            let specialProducts: any[] = [];
            if (freshRecord.specialProducts) {
              try {
                specialProducts = JSON.parse(freshRecord.specialProducts);
              } catch (e) {}
            }

            console.log(`[webhook] Original specialProducts from DB:`, JSON.stringify(specialProducts));

            const lineItems = order.line_items || [];
            const freeGiftProductIds = new Set<string>();
            const freeGiftVariantIds = new Set<string>();

            for (const item of lineItems) {
              const properties = item.properties || [];
              console.log(`[webhook] Checking line item product_id: ${item.product_id}, variant_id: ${item.variant_id}, properties:`, JSON.stringify(properties));
              let isFreeGift = false;
              if (Array.isArray(properties)) {
                isFreeGift = properties.some((p: any) => {
                  const name = String(p.name || p.key || "").toLowerCase();
                  const value = String(p.value || "").toUpperCase();
                  console.log(`[webhook] Array property name: "${name}", value: "${value}". Checking match against: "${code}"`);
                  return (name === "free_gift_code" || name === "_free_gift_code") && value === code;
                });
              } else if (properties && typeof properties === "object") {
                const val = (properties as any).free_gift_code || (properties as any)._free_gift_code;
                console.log(`[webhook] Object property free_gift_code/_free_gift_code value: "${val}". Checking match against: "${code}"`);
                isFreeGift = val && String(val).toUpperCase() === code;
              }

              if (isFreeGift) {
                console.log(`[webhook] MATCHED free gift item product_id: ${item.product_id}, variant_id: ${item.variant_id}`);
                if (item.product_id) freeGiftProductIds.add(String(item.product_id));
                if (item.variant_id) freeGiftVariantIds.add(String(item.variant_id));
              }
            }

            console.log("[webhook] Identified freeGiftProductIds:", Array.from(freeGiftProductIds));
            console.log("[webhook] Identified freeGiftVariantIds:", Array.from(freeGiftVariantIds));

            const updatedSpecialProducts = specialProducts.filter((sp) => {
              const spProductId = sp.productId ? String(sp.productId).split("/").pop() : "";
              if (spProductId && freeGiftProductIds.has(spProductId)) {
                console.log(`[webhook] Removing special product ${sp.productTitle || spProductId} from configured discount ${code}`);
                return false;
              }
              if (sp.variants && Array.isArray(sp.variants)) {
                const hasMatchingVariant = sp.variants.some((v: any) => {
                  const vId = v.id ? String(v.id).split("/").pop() : "";
                  return vId && freeGiftVariantIds.has(vId);
                });
                if (hasMatchingVariant) {
                  console.log(`[webhook] Removing special product ${sp.productTitle} (via variant match) from configured discount ${code}`);
                  return false;
                }
              }
              return true;
            });

            const updatedSpecialProductsStr = JSON.stringify(updatedSpecialProducts);
            console.log("[webhook] updatedSpecialProducts string to save in DB and metafield:", updatedSpecialProductsStr);

            await prisma.discountThreshold.update({
              where: { id: freshRecord.id },
              data: { specialProducts: updatedSpecialProductsStr },
            });

            const metafieldConfig: Record<string, unknown> = {
              type: freshRecord.discountType,
              remaining_threshold: freshRecord.remainingAmount,
              total_threshold: freshRecord.totalThreshold,
              discountCategory: freshRecord.discountCategory,
              specialProducts: updatedSpecialProductsStr,
            };

            if (freshRecord.discountType === "fixed") {
              metafieldConfig.fixedAmount = freshRecord.fixedValue ?? 0;
            } else {
              metafieldConfig.percentage = freshRecord.percentage ?? 0;
            }

            console.log(`[webhook] Sending post-tagging metafield update with values:`, JSON.stringify(metafieldConfig));
            const mfRes = await admin.graphql(UPDATE_METAFIELD_MUTATION, {
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
            const mfResJson = await mfRes.json() as any;
            const mfErrors = mfResJson?.data?.metafieldsSet?.userErrors || [];
            if (mfErrors.length > 0) {
              console.error("[webhook] metafieldsSet errors after order post-tagging:", JSON.stringify(mfErrors));
            } else {
              console.log("[webhook] metafieldsSet successful after order post-tagging:", JSON.stringify(mfResJson));
            }
          }
        } catch (discUpdateError) {
          console.error("[webhook] Failed to update discount configuration/metafield after tagging:", discUpdateError);
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
