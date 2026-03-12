export const billingAmountsConfig = {
  title: "Billing Amounts",
  fields: [
    {
      key: "amountText",
      label: "Amount Text",
      hasInfo: false,
      defaultValue: "Amount",
    },
    {
      key: "subtotalLabelText",
      label: "Subtotal Label Text",
      hasInfo: false,
      defaultValue: "Subtotal",
    },
    {
      key: "orderTotalText",
      label: "Order Total Text",
      hasInfo: false,
      defaultValue: "Order Total",
    },
    {
      key: "totalLabelText",
      label: "Total Label Text",
      hasInfo: false,
      defaultValue: "Total",
    },
    {
      key: "priceLabelText",
      label: "Price Label Text",
      hasInfo: false,
      defaultValue: "Price:",
    },
  ],
};

export const paymentDetailsConfig = {
  title: "Payment Details",
  fields: [
    {
      key: "paymentDetailAccordionTitle",
      label: "Payment Detail Accordion Title",
      hasInfo: false,
      defaultValue: "Payment Details",
    },
    {
      key: "paymentInfoText",
      label: "Payment Info Text",
      hasInfo: false,
      defaultValue: "Payment Info",
    },
    {
      key: "cardTypeText",
      label: "Card Type Text",
      hasInfo: false,
      defaultValue: "Card Type",
    },
    {
      key: "selectPaymentDetailDropdownDefaultOptionText",
      label: "Select Payment Detail Dropdown Default Option Text",
      hasInfo: false,
      defaultValue: "Select Payment Detail",
    },
    {
      key: "paymentMethodTypeText",
      label: "Payment Method Type Text",
      hasInfo: false,
      defaultValue: "Payment Method Type",
    },
  ],
};

export const cardInformationConfig = {
  title: "Card Information",
  fields: [
    {
      key: "last4DigitsOfTheCardText",
      label: "Last 4 Digits of the Card Text",
      hasInfo: false,
      defaultValue: "Card Last 4 Digit",
    },
    {
      key: "cardExpiryText",
      label: "Card Expiry Text",
      hasInfo: false,
      defaultValue: "Card Expiry",
    },
    {
      key: "creditCardText",
      label: "Credit Card Text",
      hasInfo: false,
      defaultValue: "Credit Card",
    },
    {
      key: "endingWithText",
      label: "Ending With Text",
      hasInfo: false,
      defaultValue: "Ending With",
    },
    {
      key: "cardHolderNameText",
      label: "Card Holder Name Text",
      hasInfo: false,
      defaultValue: "Card Holder Name",
    },
    {
      key: "noPaymentMethodText",
      label: "No Payment Method Text",
      hasInfo: false,
      defaultValue: "There is no payment method associated with this contract.",
    },
  ],
};

export const paymentActionsConfig = {
  title: "Payment Actions",
  fields: [
    {
      key: "editPaymentButtonText",
      label: "Edit Payment Button Text",
      hasInfo: false,
      defaultValue: "Edit",
    },
    {
      key: "updatePaymentButtonText",
      label: "Update Payment Button Text",
      hasInfo: false,
      defaultValue: "Update Payment",
    },
    {
      key: "updatePaymentMessage",
      label: "Update Payment Message",
      hasInfo: false,
      defaultValue:
        "We've sent you an email to {{customer_email_id}} with instructions on how to update your payment details. If you do not receive the email, please try again.",
    },
    {
      key: "changePaymentMessage",
      label: "Change Payment Message",
      hasInfo: false,
      defaultValue:
        "The selected payment method has been updated successfully.",
    },
    {
      key: "updatePaymentMethodTitleText",
      label: "Update payment Method Title Text",
      hasInfo: false,
      defaultValue: "Update payment method.",
    },
  ],
};

export const paymentNotificationConfig = {
  title: "Payment Notification",
  fields: [
    {
      key: "shopPayPaymentUpdateInstructionText",
      label: "ShopPay Payment Update Instruction Text",
      hasInfo: false,
      defaultValue:
        "You are using Shop Pay, please use this article for updating the payment methods. <a href='https://help.shop.app/hc/en-us/articles/4412203886996-How-do-I-manage-my-subscription-orders-with-Shop-Pay-' target='_blank'>click here</a>",
    },
    {
      key: "chooseAnotherPaymentMethodTitleText",
      label: "Choose Another Payment Method Title Text",
      hasInfo: false,
      defaultValue: "Choose another payment method",
    },
    {
      key: "selectPaymentMethodText",
      label: "Select Payment Method",
      hasInfo: false,
      defaultValue: "Select Payment Method",
    },
    {
      key: "paymentNotificationText",
      label: "Payment Notification Text",
      hasInfo: false,
      defaultValue: "You will receive an email to update your payment info.",
    },
    {
      key: "unknownPaymentReachOutUsText",
      label: "Unknown Payment Reach Out Us Text",
      hasInfo: false,
      defaultValue: "Unknown. Please reach out us.",
    },
  ],
};

export const paymentLabelsConfig = {
  title: "Payment Labels",
  fields: [
    {
      key: "paypalLabelText",
      label: "Paypal Label Text",
      hasInfo: false,
      defaultValue: "Paypal",
    },
    {
      key: "shopPayLabelText",
      label: "Shop Pay label Text",
      hasInfo: false,
      defaultValue: "ShopPay",
    },
  ],
};

export const billingStatusConfig = {
  title: "Billing Status",
  fields: [
    {
      key: "billingAttemptText",
      label: "Billing Attempt Text",
      hasInfo: false,
      defaultValue: "Billing Attempt",
    },
    {
      key: "orderDateText",
      label: "Order Date Text",
      hasInfo: false,
      defaultValue: "Order Date",
    },
    {
      key: "paidText",
      label: "Paid",
      hasInfo: false,
      defaultValue: "PAID",
    },
    {
      key: "refundedText",
      label: "Refunded",
      hasInfo: false,
      defaultValue: "REFUNDED",
    },
    {
      key: "partiallyRefundedText",
      label: "Partially Refunded",
      hasInfo: false,
      defaultValue: "PARTIALLY REFUNDED",
    },
  ],
};

export const billingStatusContConfig = {
  title: "Billing Status (cont.)",
  fields: [
    {
      key: "partiallyPaidText",
      label: "Partially Paid",
      hasInfo: false,
      defaultValue: "PARTIALLY PAID",
    },
    {
      key: "voidedText",
      label: "Voided",
      hasInfo: false,
      defaultValue: "VOIDED",
    },
    {
      key: "unpaidText",
      label: "Unpaid",
      hasInfo: false,
      defaultValue: "UNPAID",
    },
  ],
};
