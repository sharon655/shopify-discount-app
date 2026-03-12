export const generalLabelsConfig = {
  title: "General Labels",
  fields: [
    {
      key: "deliveryIntervalLabel",
      label: "Delivery Interval Text",
      hasInfo: true,
      defaultValue: "Delivery Interval",
    },
    {
      key: "amountLabel",
      label: "Amount Text",
      hasInfo: false,
      defaultValue: "Amount",
    },
    {
      key: "totalProductsLabel",
      label: "Total Products Text",
      hasInfo: false,
      defaultValue: "Total Products",
    },
    {
      key: "productsLabel",
      label: "Products Label Text",
      hasInfo: false,
      defaultValue: "Products",
    },
    {
      key: "selectProductHeaderLabel",
      label: "Select Product Label Text",
      hasInfo: false,
      defaultValue: "Select Product",
      description:
        "Header text shown when customers select products to add to their subscription",
    },
  ],
};

export const purchaseLabelsConfig = {
  title: "Purchase Labels",
  fields: [
    {
      key: "purchaseOptionLabel",
      label: "Purchase Option Label Text",
      hasInfo: false,
      defaultValue: "Purchase Option",
    },
    {
      key: "finishLabel",
      label: "Finish Label Text",
      hasInfo: false,
      defaultValue: "Finish",
    },
    {
      key: "emailAddressPlaceholder",
      label: "Email Address Textbox Placeholder Text",
      hasInfo: false,
      defaultValue: "example@mail.com",
    },
    {
      key: "skippedInventoryManagementLabel",
      label: "Skipped inventory managment Text",
      hasInfo: false,
      defaultValue: "Skipped Inventory MGMT",
    },
  ],
};

export const subscriptionLabelsConfig = {
  title: "Subscription Labels",
  fields: [
    {
      key: "addToSubscriptionLabel",
      label: "Add To Subscription Title",
      hasInfo: false,
      defaultValue: "Add to Subscription",
    },
    {
      key: "oneTimePurchaseLabel",
      label: "One-time Purchase Title",
      hasInfo: false,
      defaultValue: "One-time Only",
    },
    {
      key: "everyLabel",
      label: "Every Label Text",
      hasInfo: false,
      defaultValue: "Every",
    },
    {
      key: "attributeNameLabel",
      label: "Attribute Name label text",
      hasInfo: true,
      defaultValue: "Attribute Name",
    },
    {
      key: "attributeValueLabel",
      label: "Attribute Value label text",
      hasInfo: true,
      defaultValue: "Attribute Value",
    },
  ],
};

export const paymentLabelsConfig = {
  title: "Payment Labels",
  fields: [
    {
      key: "selectSplitMethodLabel",
      label: "Select Split Method Label Text",
      hasInfo: false,
      defaultValue: "Select Split Method",
    },
    {
      key: "splitWithOrderPlacedLabel",
      label: "Split With Order Placed Select Option Text",
      hasInfo: false,
      defaultValue: "Split with order placed",
    },
    {
      key: "splitWithoutOrderPlacedLabel",
      label: "Split Without Order Placed Select Option Text",
      hasInfo: false,
      defaultValue: "Split without order placed",
    },
    {
      key: "subtotalLabel",
      label: "Subtotal Label Text",
      hasInfo: false,
      defaultValue: "Subtotal",
    },
    {
      key: "paymentDetailAccordionLabel",
      label: "Payment Detail Accordion Title",
      hasInfo: false,
      defaultValue: "Payment Details",
    },
  ],
};

export const cardLabelsConfig = {
  title: "Card Labels",
  fields: [
    {
      key: "cardNumberLabel",
      label: "Card Expiry Text",
      hasInfo: false,
      defaultValue: "Card Expiry",
    },
    {
      key: "nextOrderDateLabel",
      label: "Next Order Date Label",
      hasInfo: false,
      defaultValue: "Next Order Date",
    },
    {
      key: "subscriptionNumberLabel",
      label: "Subscription Number Text",
      hasInfo: false,
      defaultValue: "Subscription",
    },
    {
      key: "activeOrderBadgeLabel",
      label: "Active Order badge Text",
      hasInfo: false,
      defaultValue: "Active",
    },
    {
      key: "cancelledOrderBadgeLabel",
      label: "Cancelled Order badge Text",
      hasInfo: false,
      defaultValue: "Closed",
    },
  ],
};

export const pauseLabelsConfig = {
  title: "Pause Labels",
  fields: [
    {
      key: "pauseReasonDropdownLabel",
      label: "Pause Reason Dropdown Label",
      hasInfo: false,
      defaultValue: "Select Pause Reason*",
      description:
        "Label shown above the dropdown for selecting a pause reason",
    },
    {
      key: "pauseReasonDropdownPlaceholder",
      label: "Pause Reason Dropdown Placeholder",
      hasInfo: false,
      defaultValue: "Select Pause Reason",
      description: `Placeholder text shown in the pause reason dropdown (e.g., "Select a reason")`,
    },
    {
      key: "fulfilledLabel",
      label: "Fulfilled",
      hasInfo: false,
      defaultValue: "FULFILLED",
    },
    {
      key: "unfulfilledLabel",
      label: "Unfulfilled",
      hasInfo: false,
      defaultValue: "UNFULFILLED",
    },
    {
      key: "partiallyFulfilledLabel",
      label: "Partially Fulfilled",
      hasInfo: false,
      defaultValue: "PARTIALLY_FULFILLED",
    },
  ],
};

export const statusLabelsConfig = {
  title: "Status Labels",
  fields: [
    {
      key: "scheduledLabel",
      label: "Scheduled",
      hasInfo: false,
      defaultValue: "SCHEDULED",
    },
    {
      key: "onHoldLabel",
      label: "On Hold",
      hasInfo: false,
      defaultValue: "ON HOLD",
    },
    {
      key: "pendingLabel",
      label: "Pending",
      hasInfo: false,
      defaultValue: "PENDING",
    },
    {
      key: "authorizedLabel",
      label: "Authorized",
      hasInfo: false,
      defaultValue: "AUTHORIZED",
    },
    {
      key: "buildABoxBadgeLabel",
      label: "Build a Box Badge text",
      hasInfo: false,
      defaultValue: "Build a box",
    },
    {
      key: "buildABoxProductBadgeLabel",
      label: "Build a Box Product Badge text",
      hasInfo: false,
      defaultValue: "Build a Box Product",
    },
  ],
};

export const statusLabelsContConfig = {
  title: "Status Labels (cont.)",
  fields: [
    {
      key: "overdueLabel",
      label: "Overdue",
      hasInfo: false,
      defaultValue: "OVERDUE",
    },
    {
      key: "expiringLabel",
      label: "Expiring",
      hasInfo: false,
      defaultValue: "EXPIRING",
    },
    {
      key: "expiredLabel",
      label: "Expired",
      hasInfo: false,
      defaultValue: "EXPIRED",
    },
    {
      key: "upcomingOrdersAccordionLabel",
      label: "Upcoming Orders Accordion Title",
      hasInfo: false,
      defaultValue: "Upcoming Order",
    },
    {
      key: "discountNoteAccordionLabel",
      label: "Discount Note Title",
      hasInfo: false,
      defaultValue: "About Discount",
    },
  ],
};

export const orderAttributesLabelsConfig = {
  title: "Order Attributes Labels",
  fields: [],
};

export const generalTitlesConfig = {
  title: "General Titles",
  fields: [
    {
      key: "accountLinkLabel",
      label: "Account Link Text",
      hasInfo: false,
      defaultValue: "Account Link",
    },
    {
      key: "downloadInvoiceButtonLabel",
      label: "Download Invoice Button Text",
      hasInfo: false,
      defaultValue: "Download Invoice",
    },
    {
      key: "redeemRewardsButtonLabel",
      label: "Redeem Rewards Text",
      hasInfo: false,
      defaultValue: "Redeem Rewards",
    },
    {
      key: "nextOrderLabel",
      label: "Next Order Text",
      hasInfo: false,
      defaultValue: "Next Order",
    },
    {
      key: "nextDeliveryLabel",
      label: "Next Delivery Text",
      hasInfo: false,
      defaultValue: "Next Delivery",
    },
  ],
};

export const generalTitleContConfig = {
  title: "General Titles (cont.)",
  fields: [
    {
      key: "fulfilmentTabLabel",
      label: "Fulfilment Tab table Text",
      hasInfo: false,
      defaultValue: "Fulfilments",
    },
    {
      key: "paymentMethodTypeLabel",
      label: "Payment Method Type Text",
      hasInfo: false,
      defaultValue: "Payment Method Type",
    },
    {
      key: "paymentNotificationLabel",
      label: "Payment Notification Text",
      hasInfo: false,
      defaultValue: "You will receive an email to update your payment info.",
    },
    {
      key: "addDiscountCodeAlertLabel",
      label: "Add Discount Code Alert Text",
      hasInfo: false,
      defaultValue: "Are you sure you want to add a discount code",
    },
    {
      key: "removeDiscountCodeAlertLabel",
      label: "Remove Discount Code Alert Text",
      hasInfo: false,
      defaultValue: "Are you sure you want to remove the discount code",
    },
  ],
};

/*
{
      key: "",
      label: "",
      hasInfo: false,
      defaultValue: "",
    },
    {
      key: "",
      label: "",
      hasInfo: false,
      defaultValue: "",
    },
*/
