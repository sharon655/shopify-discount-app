import { ReminderType } from "@prisma/client";
import prisma from "../db.server";
import { unauthenticated } from "../shopify.server";
import { sendFreeProductOutOfStockEmail, type OutOfStockItem } from "./email.server";

export interface FreeProductStockStats {
  success: boolean;
  checkedDiscounts: number;
  emailsSent: number;
  skipped: number;
  failed: number;
  resetAlerts: number;
  durationMs: number;
  error?: string;
}

const INVENTORY_QUERY = `
  query getInventory($ids: [ID!]!) {
    nodes(ids: $ids) {
      id
      __typename
      ... on ProductVariant {
        id
        title
        inventoryQuantity
        product {
          id
          title
        }
      }
      ... on Product {
        id
        title
        variants(first: 250) {
          nodes {
            id
            title
            inventoryQuantity
          }
        }
      }
    }
  }
`;

export async function processFreeProductStockWarnings(): Promise<FreeProductStockStats> {
  const startTime = Date.now();
  console.log(`[free-product-stock] Job started at ${new Date().toISOString()}`);

  let checkedDiscounts = 0;
  let emailsSent = 0;
  let skipped = 0;
  let failed = 0;
  let resetAlerts = 0;

  try {
    // 1. Retrieve all active discounts having special products
    const discounts = await prisma.discountThreshold.findMany({
      where: {
        isActive: true,
        specialProducts: {
          not: null,
        },
      },
    });

    console.log(`[free-product-stock] Retrieved ${discounts.length} active discounts with special products to evaluate.`);

    // 2. Filter discounts that actually have special products and group by shop
    const shopDiscountsMap = new Map<string, typeof discounts>();
    for (const discount of discounts) {
      if (!discount.specialProducts) continue;
      
      let specialProducts: any[] = [];
      try {
        specialProducts = JSON.parse(discount.specialProducts);
      } catch (e) {
        console.error(`[free-product-stock] Failed to parse specialProducts for discount ${discount.id}:`, e);
        continue;
      }

      if (specialProducts.length === 0) continue;

      const shopDiscounts = shopDiscountsMap.get(discount.shop) || [];
      shopDiscounts.push(discount);
      shopDiscountsMap.set(discount.shop, shopDiscounts);
    }

    console.log(`[free-product-stock] Found ${shopDiscountsMap.size} shops with active free product discounts.`);

    // 3. For each shop, fetch inventory of variants and products
    for (const [shop, shopDiscounts] of shopDiscountsMap.entries()) {
      console.log(`[free-product-stock] Processing ${shopDiscounts.length} discounts for shop: ${shop}`);

      // Gather all GIDs to query
      const gidsToQuery = new Set<string>();
      for (const discount of shopDiscounts) {
        const specialProducts = JSON.parse(discount.specialProducts!);
        for (const sp of specialProducts) {
          if (Array.isArray(sp.variants) && sp.variants.length > 0) {
            for (const v of sp.variants) {
              if (v.id) gidsToQuery.add(v.id);
            }
          } else if (sp.productId) {
            gidsToQuery.add(sp.productId);
          }
        }
      }

      if (gidsToQuery.size === 0) {
        console.log(`[free-product-stock] No products or variants to query for shop: ${shop}`);
        continue;
      }

      // Initialize Shopify Admin API client for the shop
      let admin: any;
      try {
        const result = await unauthenticated.admin(shop);
        admin = result.admin;
      } catch (err) {
        console.error(`[free-product-stock] Failed to authenticate for shop: ${shop}`, err);
        failed += shopDiscounts.length;
        continue;
      }

      // Query inventory in batches of 100 GIDs
      const variantInventoryMap = new Map<string, { id: string; title: string; qty: number; productTitle: string; productId: string }>();
      const productInventoryMap = new Map<string, { id: string; title: string; variants: { id: string; title: string; qty: number }[] }>();

      const gidsArray = Array.from(gidsToQuery);
      const batchSize = 100;
      for (let i = 0; i < gidsArray.length; i += batchSize) {
        const batch = gidsArray.slice(i, i + batchSize);
        try {
          const response = await admin.graphql(INVENTORY_QUERY, { variables: { ids: batch } });
          const result = await response.json() as any;
          const nodes = result?.data?.nodes || [];

          for (const node of nodes) {
            if (!node) continue;
            if (node.__typename === "ProductVariant") {
              variantInventoryMap.set(node.id, {
                id: node.id,
                title: node.title,
                qty: node.inventoryQuantity ?? 0,
                productTitle: node.product?.title || "Unknown Product",
                productId: node.product?.id || "",
              });
            } else if (node.__typename === "Product") {
              const productVariants = node.variants?.nodes || [];
              productInventoryMap.set(node.id, {
                id: node.id,
                title: node.title,
                variants: productVariants.map((v: any) => ({
                  id: v.id,
                  title: v.title,
                  qty: v.inventoryQuantity ?? 0,
                })),
              });
            }
          }
        } catch (err) {
          console.error(`[free-product-stock] Failed to query inventory batch for shop ${shop}:`, err);
        }
      }

      // Evaluate each discount
      for (const discount of shopDiscounts) {
        checkedDiscounts++;
        const specialProducts = JSON.parse(discount.specialProducts!);
        const outOfStockItems: OutOfStockItem[] = [];

        for (const sp of specialProducts) {
          const hasVariantsConfigured = Array.isArray(sp.variants) && sp.variants.length > 0;

          if (hasVariantsConfigured) {
            for (const vConfig of sp.variants) {
              const vId = vConfig.id;
              const vData = variantInventoryMap.get(vId);

              // If variant doesn't exist on Shopify, or is out of stock (qty <= 0)
              if (!vData || vData.qty <= 0) {
                outOfStockItems.push({
                  productTitle: sp.productTitle || vData?.productTitle || "Unknown Product",
                  variantTitle: vData?.title || "Unknown Variant",
                  productId: sp.productId,
                  variantId: vId,
                });
              }
            }
          } else if (sp.productId) {
            const pData = productInventoryMap.get(sp.productId);

            // If product doesn't exist on Shopify, or all of its variants are out of stock
            if (!pData) {
              outOfStockItems.push({
                productTitle: sp.productTitle || "Unknown Product",
                productId: sp.productId,
              });
            } else {
              const allOutOfStock = pData.variants.length === 0 || pData.variants.every((v) => v.qty <= 0);
              if (allOutOfStock) {
                outOfStockItems.push({
                  productTitle: pData.title || sp.productTitle || "Unknown Product",
                  productId: sp.productId,
                });
              }
            }
          }
        }

        const hasOutOfStock = outOfStockItems.length > 0;

        if (hasOutOfStock) {
          console.log(`[free-product-stock] Discount "${discount.title}" has ${outOfStockItems.length} out-of-stock items.`);

          // Check if FREE_PRODUCT_OUT_OF_STOCK log exists
          const existingLog = await prisma.discountReminderLog.findFirst({
            where: {
              discountId: discount.id,
              reminderType: ReminderType.FREE_PRODUCT_OUT_OF_STOCK,
              status: "SUCCESS",
            },
          });

          if (existingLog) {
            console.log(`[free-product-stock] Skip: Out of stock notification already sent to ${existingLog.sentTo} for discount ${discount.id}`);
            skipped++;
            continue;
          }

          // Fetch recipient email address
          let sentTo = process.env.REMINDER_EMAIL || "";
          if (!sentTo) {
            const session = await prisma.session.findUnique({
              where: { shop: discount.shop },
            });
            sentTo = session?.email || `merchant@${discount.shop}`;
          }

          try {
            await sendFreeProductOutOfStockEmail({
              discount: {
                id: discount.id,
                title: discount.title,
                discountCode: discount.discountCode,
                shop: discount.shop,
              },
              outOfStockItems,
            });

            // Log Success
            await prisma.discountReminderLog.upsert({
              where: {
                discountId_reminderType: {
                  discountId: discount.id,
                  reminderType: ReminderType.FREE_PRODUCT_OUT_OF_STOCK,
                },
              },
              update: {
                sentTo,
                status: "SUCCESS",
                errorMessage: null,
                sentAt: new Date(),
              },
              create: {
                discountId: discount.id,
                reminderType: ReminderType.FREE_PRODUCT_OUT_OF_STOCK,
                sentTo,
                status: "SUCCESS",
              },
            });

            emailsSent++;
          } catch (err: any) {
            const errorMessage = err?.message || String(err);
            console.error(`[free-product-stock] Failed to send email for discount ${discount.id}:`, err);

            try {
              await prisma.discountReminderLog.upsert({
                where: {
                  discountId_reminderType: {
                    discountId: discount.id,
                    reminderType: ReminderType.FREE_PRODUCT_OUT_OF_STOCK,
                  },
                },
                update: {
                  sentTo,
                  status: "FAILED",
                  errorMessage: errorMessage.substring(0, 1000),
                  sentAt: new Date(),
                },
                create: {
                  discountId: discount.id,
                  reminderType: ReminderType.FREE_PRODUCT_OUT_OF_STOCK,
                  sentTo,
                  status: "FAILED",
                  errorMessage: errorMessage.substring(0, 1000),
                },
              });
            } catch (dbErr) {
              console.error(`[free-product-stock] Failed to update FAILED status in DB for discount ${discount.id}:`, dbErr);
            }

            failed++;
          }
        } else {
          // No products are out of stock. If an alert log exists, delete it (reset the alert)
          const existingLog = await prisma.discountReminderLog.findFirst({
            where: {
              discountId: discount.id,
              reminderType: ReminderType.FREE_PRODUCT_OUT_OF_STOCK,
            },
          });

          if (existingLog) {
            console.log(`[free-product-stock] Reset: Free products are back in stock for discount ${discount.id}. Deleting alert log.`);
            await prisma.discountReminderLog.delete({
              where: {
                discountId_reminderType: {
                  discountId: discount.id,
                  reminderType: ReminderType.FREE_PRODUCT_OUT_OF_STOCK,
                },
              },
            });
            resetAlerts++;
          } else {
            skipped++;
          }
        }
      }
    }

    const durationMs = Date.now() - startTime;
    console.log(
      `[free-product-stock] Job completed in ${durationMs}ms. Summary: Checked: ${checkedDiscounts}, EmailsSent: ${emailsSent}, Skipped: ${skipped}, Failed: ${failed}, ResetAlerts: ${resetAlerts}`
    );

    return {
      success: true,
      checkedDiscounts,
      emailsSent,
      skipped,
      failed,
      resetAlerts,
      durationMs,
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error(`[free-product-stock] Fatal error in free product stock warnings process:`, error);
    return {
      success: false,
      checkedDiscounts,
      emailsSent,
      skipped,
      failed,
      resetAlerts,
      durationMs,
      error: error?.message || String(error),
    };
  }
}
