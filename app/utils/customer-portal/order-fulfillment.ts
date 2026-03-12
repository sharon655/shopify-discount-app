export const orderNavigationConfig = {
  title: "Order Navigation",
  fields: [
    {
      key: "finishLabelText",
      label: "Finish Label Text",
      hasInfo: false,
      defaultValue: "Finish",
    },
    {
      key: "nextButtonText",
      label: "Next Button Text",
      hasInfo: false,
      defaultValue: "Next",
    },
    {
      key: "previousButtonText",
      label: "Previous Button Text",
      hasInfo: false,
      defaultValue: "Previous",
    },
    {
      key: "closeButtonText",
      label: "Close Button Text",
      hasInfo: false,
      defaultValue: "Close",
    },
    {
      key: "clickHereText",
      label: "Click Here Text",
      hasInfo: false,
      defaultValue: "Click here",
    },
  ],
};

export const orderUpdateMessagesConfig = {
  title: "Order Update Messages",
  fields: [
    {
      key: "contractUpdateMessage",
      label: "Contract Update Message Text",
      hasInfo: false,
      defaultValue: "Your contract updated successfully",
    },
    {
      key: "addProductFinishedMessage",
      label: "Add Product Finished Message Text",
      hasInfo: false,
      defaultValue: "Finished!",
    },
  ],
};

export const nextOrderDetailsConfig = {
  title: "Next Order Details",
  fields: [
    {
      key: "nextOrderText",
      label: "Next Order Text",
      hasInfo: false,
      defaultValue: "Next Order",
    },
    {
      key: "nextDeliveryText",
      label: "Next Delivery Text",
      hasInfo: false,
      defaultValue: "Next Delivery",
    },
    {
      key: "nextOrderDeliveryFromAndToDateText",
      label: "Next Order Delivery From and To Date Text",
      hasInfo: false,
      defaultValue: "{{fromDate}} - {{toDate}}",
    },
    {
      key: "nextDeliveryDateText",
      label: "Next Delivery Date Text",
      hasInfo: false,
      defaultValue: "Next Delivery Date",
    },
    {
      key: "nextOrderDateLabel",
      label: "Next Order Date Label",
      hasInfo: false,
      defaultValue: "Next Order Date",
    },
  ],
};

export const nextOrderDateConfig = {
  title: "Next Order Date",
  fields: [
    {
      key: "nextOrderDateText",
      label: "Next Order Date Text",
      hasInfo: false,
      defaultValue: "Next Order Date",
    },
  ],
};

export const skipNextOrderConfig = {
  title: "Skip Next Order",
  fields: [
    {
      key: "skipProductForNextOrderText",
      label: "Skip Product For Next Order Label Text",
      hasInfo: false,
      defaultValue: "Skip For Next Order",
    },
    {
      key: "unskipProductForNextOrderText",
      label: "Unskip Product For Next Order Label Text",
      hasInfo: false,
      defaultValue: "Unskip For Next Order",
    },
    {
      key: "skipProductForNextOrderConfirmationMsgText",
      label: "Skip Product For Next Order Confirmation Msg Text",
      hasInfo: false,
      defaultValue:
        "Are you sure you want to skip this product for the next order?",
    },
    {
      key: "unskipProductForNextOrderConfirmationMsgText",
      label: "Unskip Product For Next Order Confirmation Msg Text",
      hasInfo: false,
      defaultValue:
        "Are you sure you want to unskip this product for the next order?",
    },
  ],
};

export const fulfillmentStatusConfig = {
  title: "Fulfillment Status",
  fields: [
    {
      key: "orderNumberLabel",
      label: "Order Number Label",
      hasInfo: false,
      defaultValue: "ORDER",
    },
    {
      key: "upcomingFulfillmentText",
      label: "Upcoming Fulfillment Text",
      hasInfo: false,
      defaultValue: "Upcoming Fulfillment",
    },
    {
      key: "fulfillmentTabTableText",
      label: "Fulfilment Tab table Text",
      hasInfo: false,
      defaultValue: "Fulfilments",
    },
    {
      key: "fulfilledText",
      label: "Fulfilled Text",
      hasInfo: false,
      defaultValue: "fulfilled",
    },
    {
      key: "fulfilled",
      label: "Fulfilled",
      hasInfo: false,
      defaultValue: "FULFILLED",
    },
  ],
};

export const fulfillmentStatusContConfig = {
  title: "Fulfillment Status (cont.)",
  fields: [
    {
      key: "unfulfilled",
      label: "Unfulfilled",
      hasInfo: false,
      defaultValue: "UNFULFILLED",
    },
    {
      key: "partiallyFulfilled",
      label: "Partially Fulfilled",
      hasInfo: false,
      defaultValue: "PARTIALLY FULFILLED",
    },
  ],
};

export const upcomingOrdersChangesConfig = {
  title: "Upcoming Orders Changes",
  fields: [
    {
      key: "upcomingOrdersSuccessPopupTitleText",
      label: "Upcoming Orders Success Popup Title Text",
      hasInfo: false,
      defaultValue: "Successfully Updated!",
    },
    {
      key: "upcomingOrdersSuccessPopupDescriptionText",
      label: "Upcoming Orders Success Popup Description Text",
      hasInfo: false,
      defaultValue:
        "Your subscription has been updated! Your changes can be reviewed in the Upcoming Orders section.",
    },
    {
      key: "upcomingOrdersSuccessPopupCloseButtonText",
      label: "Upcoming Orders Success Popup Close button Text",
      hasInfo: false,
      defaultValue: "Okay",
    },
  ],
};

export const upcomingOrdersChangesContConfig = {
  title: "Upcoming Orders Changes (cont.)",
  fields: [
    {
      key: "upcomingOrdersFailurePopupTitleText",
      label: "Upcoming Orders Failure Popup Title Text",
      hasInfo: false,
      defaultValue: "Try Again!",
    },
    {
      key: "upcomingOrdersFailurePopupDescriptionText",
      label: "Upcoming Orders Failure Popup Description Text",
      hasInfo: false,
      defaultValue: "Something went wrong! Please try again.",
    },
    {
      key: "upcomingOrdersFailurePopupCloseButtonText",
      label: "Upcoming Orders Failure Popup Close button Text",
      hasInfo: false,
      defaultValue: "Close",
    },
  ],
};

export const orderProcessingConfig = {
  title: "Order Processing",
  fields: [
    {
      key: "processingLabelText",
      label: "Processing label text",
      hasInfo: false,
      defaultValue: "Order In Progress...",
    },
    {
      key: "addToSubscriptionProductAddedSuccessMsg",
      label: "Add to Subscription product added success message",
      hasInfo: false,
      defaultValue: "Product {{productName}} Added Successfully.",
    },
    {
      key: "downloadInvoiceButtonText",
      label: "Download Invoice Button Text",
      hasInfo: false,
      defaultValue: "Download Invoice",
    },
  ],
};

export const manualBillingConfig = {
  title: "Manual Billing",
  fields: [
    {
      key: "nextOrderDateInfo",
      label: "Next Order Date Information (Manual Billing Attempt)",
      hasInfo: false,
      defaultValue:
        "Billing will be attempted for the order scheduled on {{attemptingOrderDate}}. The next billing date will be rescheduled to {{calculatedNextOrderDate}}.",
      description: `Use the variable {{attemptingOrderDate}} to show the date when billing will be attempted. The variable {{calculatedNextOrderDate}} represents the next billing date. Customize the text according to your shop settings and use these variables to reflect the correct dates.`,
    },
  ],
};
