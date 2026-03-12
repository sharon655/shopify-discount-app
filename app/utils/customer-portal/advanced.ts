export const advancedLabelConfig = {
  title: "Advanced Label",
  fields: [
    {
      key: "discountCouponAppliedText",
      label: "Discount Coupon Applied Text",
      hasInfo: false,
      defaultValue: "Discount Coupon Applied",
    },
    {
      key: "subscriptionUpdateErrorMessage",
      label: "Subscription Update Error Message",
      hasInfo: false,
      defaultValue: "Unable to update subscription status",
      description:
        "Error message shown when unable to pause, resume, or cancel a subscription",
    },
    {
      key: "subscriptionCancelSuccessMessage",
      label: "Subscription Paused Success Message",
      hasInfo: false,
      defaultValue: "Subscription paused",
      description: "Success message shown after pausing a subscription",
    },
    {
      key: "subscriptionResumeSuccessMessage",
      label: "Subscription Resumed Success Message",
      hasInfo: false,
      defaultValue: "Subscription activated",
      description: "Success message shown after resuming a paused subscription",
    },
    {
      key: "popupSuccessMessageText",
      label: "Popup Success Message Text",
      hasInfo: false,
      defaultValue: "Successful",
    },
    {
      key: "popupErrorMessageText",
      label: "Popup Error Message Text",
      hasInfo: false,
      defaultValue: "Operation Failed. Please try again.",
    },
    {
      key: "minimumCommitmentNotMetMessage",
      label: "Minimum Commitment Not Met Message",
      hasInfo: false,
      defaultValue:
        "Subscription requires minimum billing iterations of {{minCycles}} before it can be cancelled.",
      description:
        "Message shown when trying to cancel before minimum billing cycles are completed",
    },
    {
      key: "subscriptionLockedMessage",
      label: "Subscription Locked Message",
      hasInfo: false,
      defaultValue:
        "Subscription cannot be modified until {{minCycles}} orders have completed.",
      description:
        "Message shown when subscription modifications are temporarily restricted",
    },
    {
      key: "messageForFrozenContract",
      label:
        "Message shown when subscription modifications are temporarily restricted",
      hasInfo: false,
      defaultValue: "Your subscription contract is frozen by your shop owner.",
      description:
        "Message explaining why the subscription contract cannot be modified at this time",
    },
    {
      key: "expiredTokenText",
      label: "Expired Token Text",
      hasInfo: false,
      defaultValue:
        "Your magic link has expired. Please access Subscription Portal by logging into your account using the same email that you used to buy subscription.",
    },
    {
      key: "noProductFoundMessageText",
      label: "No Product Found Message Text",
      hasInfo: false,
      defaultValue: "There are no product available on given search result",
    },
    {
      key: "tooCloseToNextOrderMessage",
      label: "Too Close to Next Order Message",
      hasInfo: false,
      defaultValue:
        "You can not cancel/pause the subscription before {{preventDays}} days from your next order date.",
      description:
        "Message shown when trying to pause/cancel too close to the next order date",
    },
    {
      key: "shopPayPaymentUpdateInstructionText",
      label: "ShopPay Payment Update Instruction Text",
      hasInfo: false,
      defaultValue:
        "You are using Shop Pay, please use this article for updating the payment methods. <a href='https://help.shop.app/hc/en-us/articles/4412203886996-How-do-I-manage-my-subscription-orders-with-Shop-Pay-' target='_blank'>click here</a>",
    },
    {
      key: "initialDiscountNoteDescription",
      label: "Initial Discount Note Description",
      hasInfo: false,
      defaultValue:
        "Initial price - {{initialProductPrice}}  <span class='as-compare-discount-price'>{{originalPrice}}</span><span class='as-nbsp'>&nbsp;</span><span class='as-badge'>({{initialDiscount}} off)</span> <br>",
      description:
        "These fields also support {{originalPrice}} to show the product's original price, {{initialProductPrice}} for the discounted price, and {{initialDiscount}} for the total discount applied to the original price.",
    },
    {
      key: "afterCycleDiscountNoteDescription",
      label: "After Cycle Discount Note Description",
      hasInfo: false,
      defaultValue:
        "After {{numberOfOrderCycle}} cycle - {{afterCycleProductPrice}}  <span class='as-compare-discount-price'>{{originalPrice}}</span><span class='as-nbsp'>&nbsp;</span><span class='as-badge' style=''>({{afterCycleDiscount}} off)</span>",
      description:
        "These field support {{originalPrice}} to display the product's original price, {{numberOfOrderCycle}} for the minimum billing cycle required before a discount is applied, {{afterCycleProductPrice}} for the updated price after reaching this billing cycle, and {{afterCycleDiscount}} for the total discount applied once the minimum billing cycle is completed.",
    },
  ],
};
