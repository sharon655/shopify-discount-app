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
 * Reads the $app.payment_type metafield from applied discounts.
 * "Credit Card" → hide all Net/manual payment methods
 * "Net"         → hide all standard gateways (card, PayPal, etc.)
 * blank/none    → no changes
 *
 * @param {CartPaymentMethodsTransformRunInput} input
 * @returns {CartPaymentMethodsTransformRunResult}
 */
export function cartPaymentMethodsTransformRun(input) {
  console.error("----- cartPaymentMethodsTransformRun extension loaded & executing -----");

  const discountApplications = [
    ...(input?.cart?.discountApplications ?? [])
  ];

  const lines = input?.cart?.lines ?? [];
  for (const line of lines) {
    const allocations = line.discountAllocations ?? [];
    for (const alloc of allocations) {
      if (alloc.discountApplication) {
        discountApplications.push(alloc.discountApplication);
      }
    }
  }

  const paymentMethods = input?.paymentMethods ?? [];

  console.error("discountApplications count:", discountApplications.length);
  console.error("discountApplications detailed:", JSON.stringify(discountApplications, null, 2));
  console.error("paymentMethods in cart:", JSON.stringify(paymentMethods.map(m => m.name)));

  // Find the first discount with a payment_type metafield
  let requiredPaymentType = null;
  console.error("Full Input received:", JSON.stringify(input, null, 2));

  for (const app of discountApplications) {
    const val = app?.metafield?.value;
    if (val && val.trim() !== "") {
      requiredPaymentType = val.trim();
      break;
    }
  }

  console.error("Found requiredPaymentType:", requiredPaymentType);
  const operations = [];
  const isNetRequired = requiredPaymentType && requiredPaymentType.toLowerCase().includes("net");

  if (isNetRequired) {
    // Hide all payment methods EXCEPT those containing "net" or standard net aliases
    for (const method of paymentMethods) {
      const name = method.name.toLowerCase();
      let matchesTarget = name.includes("net");

      // Match standard net aliases
      if (
        // name.includes("bank transfer") ||
        //name.includes("invoice") ||
        name.includes("30") ||
        name.includes("60") ||
        name.includes("90")
      ) {
        matchesTarget = true;
      }

      if (!matchesTarget) {
        operations.push({
          paymentMethodHide: {
            paymentMethodId: method.id
          }
        });
      }
    }
  } else {
    // Hide manual/Net/Pay Later payment methods — keep only standard card gateways
    // This runs when:
    // - requiredPaymentType contains "credit card" (or is not net)
    // - No discount is applied (requiredPaymentType is null)
    // - Discount has no payment restriction (requiredPaymentType is empty/none)
    for (const method of paymentMethods) {
      const name = method.name.toLowerCase();
      if (
        name.includes("net") ||
        name.includes("bank transfer") ||
        name.includes("invoice") ||
        name.includes("cod") ||
        name.includes("cash on delivery") ||
        name.includes("manual") ||
        name.includes("pay later") ||
        name.includes("paylater")
      ) {
        operations.push({ paymentMethodHide: { paymentMethodId: method.id } });
      }
    }
  }

  console.error("Operations returning:", JSON.stringify(operations, null, 2));
  return { operations };
}
