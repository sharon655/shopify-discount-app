import { OrderDiscountSelectionStrategy } from '../generated/api';

/**
  * @typedef {import("../generated/api").RunInput} RunInput
  * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
  */

/**
  * @param {RunInput} input
  * @returns {CartLinesDiscountsGenerateRunResult}
  */

export function cartLinesDiscountsGenerateRun(input) {
  let config = {};
  try {
    const metafieldValue = input.discount?.metafield?.value;
    if (metafieldValue) {
      config = JSON.parse(metafieldValue);
    }
  } catch (e) {
    console.error("Failed to parse discount_config metafield:", e);
  }

  const type = config.type || "percentage";
  const percentage = parseFloat(config.percentage) || 0;
  const fixedAmountInShopCurrency = parseFloat(config.fixedAmount) || 0;
  const remainingThresholdInShopCurrency = parseFloat(config.remaining_threshold) || 0;
  const presentmentCurrencyRate = parseFloat(input.presentmentCurrencyRate) || 1;
  const remainingThreshold = remainingThresholdInShopCurrency * presentmentCurrencyRate;

  if (remainingThreshold <= 0) {
    return { operations: [] };
  }

  let specialProducts = [];
  try {
    if (config.specialProducts) specialProducts = JSON.parse(config.specialProducts);
  } catch (e) {}

  const lines = input.cart?.lines || [];
  let totalCalculatedDiscount = 0;
  let candidates = [];

  for (const line of lines) {
    const amount = parseFloat(line.cost?.amountPerQuantity?.amount || "0") * line.quantity;
    if (amount <= 0) continue;

    const productId = line.merchandise?.product?.id;
    const variantId = line.merchandise?.id;
    
    // Check if the product matches any mapping
    const specialMatch = specialProducts.find(sp => sp.productId === productId);
    
    // Check if variants were specifically selected. If variants array exists and is not empty, 
    // it means only specific variants were mapped. If it's empty, the whole product was mapped.
    let isVariantMapped = false;
    if (specialMatch) {
      if (!specialMatch.variants || specialMatch.variants.length === 0) {
        isVariantMapped = true; // Whole product is selected
      } else {
        isVariantMapped = !!specialMatch.variants.find(v => v.id === variantId);
      }
    }

    let lineDiscount = 0;
    let message = "";

    if (specialMatch && isVariantMapped) {
      lineDiscount = amount; // 100% discount
      message = `100% discount (${specialMatch.category})`;
    } else {
      if (type === "percentage" && percentage > 0) {
        lineDiscount = amount * (percentage / 100);
        message = `${percentage}% discount` + (config.discountCategory ? ` (${config.discountCategory})` : "");
      } else if (type === "fixed" && fixedAmountInShopCurrency > 0) {
        const lineFixedAmount = fixedAmountInShopCurrency * presentmentCurrencyRate;
        lineDiscount = Math.min(amount, lineFixedAmount);
        message = `${lineFixedAmount.toFixed(2)} discount` + (config.discountCategory ? ` (${config.discountCategory})` : "");
      }
    }

    if (lineDiscount > 0) {
      candidates.push({
        lineId: line.id,
        calculatedDiscount: lineDiscount,
        message,
        amount
      });
      totalCalculatedDiscount += lineDiscount;
    }
  }

  if (candidates.length === 0) {
    return { operations: [] };
  }

  // Cap against threshold budget
  let scaleFactor = 1;
  let budgetMessageAddon = "";
  if (totalCalculatedDiscount > remainingThreshold) {
    scaleFactor = remainingThreshold / totalCalculatedDiscount;
    budgetMessageAddon = " (capped by budget)";
  }

  const finalCandidates = candidates.map(c => {
    const finalAmount = c.calculatedDiscount * scaleFactor;
    return {
      message: c.message + budgetMessageAddon,
      targets: [{ cartLine: { id: c.lineId } }],
      value: {
        fixedAmount: {
          amount: finalAmount.toFixed(2)
        }
      }
    };
  });

  return {
    operations: [
      {
        productDiscountsAdd: {
          candidates: finalCandidates,
          selectionStrategy: "ALL"
        }
      }
    ]
  };
}