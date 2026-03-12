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
  const fixedAmount = parseFloat(config.fixedAmount) || 0;
  const remainingThreshold = parseFloat(config.remaining_threshold) || 0;

  if (remainingThreshold <= 0) {
    return { operations: [] };
  }

  if (type === "percentage" && percentage <= 0) {
    return { operations: [] };
  }

  if (type === "fixed" && fixedAmount <= 0) {
    return { operations: [] };
  }

  // Get cart subtotal
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
    calculatedDiscount = fixedAmount;
    baseMessage = `₹${fixedAmount.toFixed(2)} discount`;
  }

  // Cap with subtotal so we don't discount more than the cart value
  const maxPossibleDiscountForCart = Math.min(calculatedDiscount, subtotalAmount);
  
  // Apply the threshold cap
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