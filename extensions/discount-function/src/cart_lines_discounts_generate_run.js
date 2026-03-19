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
  // Parse the discount configuration stored in the metafield
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
  // fixedAmount is stored in shop's default currency (e.g., INR)
  const fixedAmountInShopCurrency = parseFloat(config.fixedAmount) || 0;
  // remaining_threshold is also stored in shop's default currency
  const remainingThresholdInShopCurrency = parseFloat(config.remaining_threshold) || 0;

  // presentmentCurrencyRate converts shop currency -> customer's presentment currency
  // e.g., if shop is INR and customer sees USD, rate ≈ 0.012
  const presentmentCurrencyRate = parseFloat(input.presentmentCurrencyRate) || 1;

  // Convert threshold to presentment currency so comparison with cart subtotal is correct
  const remainingThreshold = remainingThresholdInShopCurrency * presentmentCurrencyRate;

  if (remainingThreshold <= 0) {
    return { operations: [] };
  }

  if (type === "percentage" && percentage <= 0) {
    return { operations: [] };
  }

  if (type === "fixed" && fixedAmountInShopCurrency <= 0) {
    return { operations: [] };
  }

  // Get cart subtotal — this is already in the customer's presentment currency
  const subtotalAmount = parseFloat(input.cart?.cost?.subtotalAmount?.amount || "0");

  if (subtotalAmount <= 0) {
    return { operations: [] };
  }

  let calculatedDiscount = 0;
  let baseMessage = "";

  if (type === "percentage") {
    calculatedDiscount = subtotalAmount * (percentage / 100);
    baseMessage = `${percentage}% discount`;
  } else {
    // Convert fixed amount from shop currency to presentment currency
    calculatedDiscount = fixedAmountInShopCurrency * presentmentCurrencyRate;
    baseMessage = `${calculatedDiscount.toFixed(2)} discount`;
  }

  // Cap with subtotal so we don't discount more than the cart value
  const maxPossibleDiscountForCart = Math.min(calculatedDiscount, subtotalAmount);

  // Apply the threshold cap (remainingThreshold is now in presentment currency)
  const finalDiscountAmount = Math.min(maxPossibleDiscountForCart, remainingThreshold);
  const discountAmountStr = finalDiscountAmount.toFixed(2);

  let message = baseMessage;
  if (finalDiscountAmount < calculatedDiscount) {
    message += ` (capped at budget of ${discountAmountStr})`;
  }

  return {
    operations: [
      {
        orderDiscountsAdd: {
          candidates: [
            {
              message,
              targets: [{ orderSubtotal: { excludedCartLineIds: [] } }],
              value: {
                fixedAmount: {
                  amount: parseFloat(discountAmountStr)
                }
              }
            }
          ],
          selectionStrategy: OrderDiscountSelectionStrategy.First
        }
      }
    ]
  };
}