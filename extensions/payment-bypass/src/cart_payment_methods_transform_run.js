// @ts-check

/**
 * @typedef {import("../generated/api").CartPaymentMethodsTransformRunInput} CartPaymentMethodsTransformRunInput
 * @typedef {import("../generated/api").CartPaymentMethodsTransformRunResult} CartPaymentMethodsTransformRunResult
 */

/**
 * @type {CartPaymentMethodsTransformRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * Reads the threshold_flow.payment_type metafield from applied discounts.
 * "Credit Card" → hide all Net/manual payment methods
 * "Net"         → hide all standard gateways (card, PayPal, etc.)
 * blank/none    → no changes
 *
 * @param {CartPaymentMethodsTransformRunInput} input
 * @returns {CartPaymentMethodsTransformRunResult}
 */
export function cartPaymentMethodsTransformRun(input) {
  const discountApplications = input?.cart?.discountApplications ?? [];
  const paymentMethods = input?.paymentMethods ?? [];

  // Find the first discount with a payment_type metafield
  let requiredPaymentType = null;
  console.error("Input received:", JSON.stringify(input, null, 2));
  
  for (const app of discountApplications) {
    const val = app?.metafield?.value;
    if (val && val.trim() !== "") {
      requiredPaymentType = val.trim();
      break;
    }
  }

  console.error("Found requiredPaymentType:", requiredPaymentType);
  if (!requiredPaymentType) return NO_CHANGES;


  const operations = [];

  if (requiredPaymentType === "Credit Card") {
    // Hide manual/Net payment methods — keep only standard card gateways
    for (const method of paymentMethods) {
      const name = method.name.toLowerCase();
      if (
        name.includes("net") ||
        name.includes("bank transfer") ||
        name.includes("invoice") ||
        name.includes("cod") ||
        name.includes("cash on delivery") ||
        name.includes("manual")
      ) {
        operations.push({ paymentMethodHide: { paymentMethodId: method.id } });
      }
    }
  } else if (requiredPaymentType === "Net") {
    // Hide all standard gateways — keep only Net/manual methods
    for (const method of paymentMethods) {
      const name = method.name.toLowerCase();
      const isNetMethod =
        name.includes("net") ||
        name.includes("bank transfer") ||
        name.includes("invoice") ||
        name.includes("30") ||
        name.includes("60") ||
        name.includes("90");
      if (!isNetMethod) {
        operations.push({
          paymentMethodHide: {
            paymentMethodId: method.id
          }
        });
      }
    }
  }

  console.error("Operations returning:", JSON.stringify(operations, null, 2));
  return { operations };
}