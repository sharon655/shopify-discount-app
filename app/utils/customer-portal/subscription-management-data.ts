export const orderFrequencyConfig = {
  title: "Order Frequency",
  fields: [
    {
      key: "orderFrequencyText",
      label: "Order Frequency Text",
      hasInfo: true,
      defaultValue: "Order frequency",
    },
    {
      key: "deliveryIntervalText",
      label: "Delivery Interval Text",
      hasInfo: true,
      defaultValue: "Delivery Interval",
    },
    {
      key: "editFrequencyButtonText",
      label: "Edit Frequency Button Text",
      hasInfo: true,
      defaultValue: "Edit Frequency",
    },
    {
      key: "updateFrequencyButtonText",
      label: "Update Frequency Button Text",
      hasInfo: true,
      defaultValue: "Update",
    },
    {
      key: "noDeliveryFrequencyText",
      label: "No delivery frequency found text",
      hasInfo: false,
      defaultValue: "No frequency available to change.",
    },
  ],
};

export const productManagementConfig = {
  title: "Product Management",
  fields: [
    {
      key: "productAccordionText",
      label: "Product Accordion Text",
      hasInfo: true,
      defaultValue: "Product in this Subscription",
    },
    {
      key: "productsLabelText",
      label: "Products Label Text",
      hasInfo: false,
      defaultValue: "Products",
    },
    {
      key: "selectProductLabelText",
      label: "Select Product Label Text",
      hasInfo: false,
      defaultValue: "Select Product",
      description:
        "Header text shown when customers select products to add to their subscription",
    },
    {
      key: "selectProductPlaceholder",
      label: "Select Product Filter Placeholder",
      hasInfo: false,
      defaultValue: "Select...",
    },
    {
      key: "productAddMessageText",
      label: "Product Add Message Text",
      hasInfo: false,
      defaultValue: "to add products in this contract.",
    },
    {
      key: "addProductButtonText",
      label: "Add Product Button Text",
      hasInfo: true,
      defaultValue: "Add Product",
    },
    {
      key: "minProductQuantityLabel",
      label: "Minimum product swap quantity label",
      hasInfo: false,
      defaultValue:
        "Please select minmum {{minProductQuantity}} product to proceed",
    },
  ],
};

export const productActionConfig = {
  title: "Product Action",
  fields: [
    {
      key: "searchProductFieldLabelText",
      label: "Search Product Field Label Text",
      hasInfo: false,
      defaultValue: "Search a product to add",
    },
    {
      key: "deleteProductTitleText",
      label: "Delete Product Title Text",
      hasInfo: false,
      defaultValue: "Delete Product",
    },
    {
      key: "productLabelText",
      label: "Product Label Text",
      hasInfo: true,
      defaultValue: "Product",
      description: `Label for "Product" column/field in subscription tables and listings`,
    },
  ],
};

export const skipAndQueueConfig = {
  title: "Skip and Queue",
  fields: [
    {
      key: "skipBadgeText",
      label: "Skip Badge Text",
      hasInfo: true,
      defaultValue: "Skipped",
    },
    {
      key: "queueBadgeText",
      label: "Queue Badge Text",
      hasInfo: true,
      defaultValue: "Queued",
    },
    {
      key: "skipOrderButtonText",
      label: "Skip Order Button Text",
      hasInfo: true,
      defaultValue: "Skip Order",
    },
    {
      key: "upcomingSkipAlertText",
      label: "Upcoming Orders Skip Alert Text",
      hasInfo: false,
      defaultValue:
        "Are you sure you want to skip the next order? Next order date will be changed to {{next_order_date}}.",
      description:
        "You can use the {{next_order_date}} variable to display the updated next order date after a change has been made.",
    },
    {
      key: "confirmSkipOrderText",
      label: "Confirm Skip Order text",
      hasInfo: false,
      defaultValue: "Confirm Skip Order",
    },
    {
      key: "skipForUpcomingOrderText",
      label: "Skip For Upcoming Order Text",
      hasInfo: false,
      defaultValue: "Skipped for upcoming order",
    },
    {
      key: "unskipOrderButtonText",
      label: "Unskip Order Button Text",
      hasInfo: false,
      defaultValue: "Unskip Order",
    },
    {
      key: "unskipOrderUpdateButtonText",
      label: "Unskip Order Update Button Text",
      hasInfo: false,
      defaultValue: "Unskip",
    },
    {
      key: "unskipOrderModalTitleText",
      label: "Unskip Order Modal Title Text",
      hasInfo: false,
      defaultValue: "Unskip Order",
    },
    {
      key: "unskipOrderMessageText",
      label: "Unskip Order Message Text",
      hasInfo: false,
      defaultValue: "Are you sure you want to unskip this order?",
    },
  ],
};

export const skipAndQueueActionsConfig = {
  title: "Skip and Queue Actions",
  fields: [
    {
      key: "skipFulfillmentButtonText",
      label: "Skip Fulfillment Button text",
      hasInfo: true,
      defaultValue: "Skip Fulfillment",
    },
    {
      key: "confirmSkipFulfillmentButtonText",
      label: "Confirm Skip Fulfillment Button text",
      hasInfo: true,
      defaultValue: "Are you sure you want to skip this order?",
    },
  ],
};

export const deletionConfirmationConfig = {
  title: "Deletion Confirmation",
  fields: [
    {
      key: "deleteConfirmationMessageText",
      label: "Delete Confirmation Message Text",
      hasInfo: true,
      defaultValue: "Are you sure?",
    },
    {
      key: "deleteMessageText",
      label: "Delete Message Text",
      hasInfo: false,
      defaultValue: "You are about to delete this product.",
    },
    {
      key: "yesButtonText",
      label: "Yes Button Text",
      hasInfo: false,
      defaultValue: "Yes",
    },
    {
      key: "noButtonText",
      label: "No Button Text",
      hasInfo: false,
      defaultValue: "No",
    },
    {
      key: "deleteButtonText",
      label: "Delete button Text",
      hasInfo: false,
      defaultValue: "Delete",
    },
  ],
};

export const pauseAndResumeConfig = {
  title: "Pause and Resume",
  fields: [
    {
      key: "pauseSubscriptionButtonText",
      label: "Pause Subscription Button Text",
      hasInfo: true,
      defaultValue: "Pause Subscription",
      description: "Text displayed on the button to pause a subscription",
    },
    {
      key: "resumeSubscriptionButtonText",
      label: "Resume Subscription Button Text",
      hasInfo: true,
      defaultValue: "Resume Subscription",
      description: "Text displayed on the button to resume a subscription",
    },
    {
      key: "pausedStatusBadgeText",
      label: "Paused Status Badge Text",
      hasInfo: false,
      defaultValue: "PAUSED",
      description: "Text shown in the badge when a subscription is paused",
    },
    {
      key: "areYouSureToResumeText",
      label: "Are you sure to resume your subscription?",
      hasInfo: false,
      defaultValue: "Are you sure you want to resume the subscription?",
    },
    {
      key: "areYouSureToPauseText",
      label: "Are you sure to pause your subscription?",
      hasInfo: false,
      defaultValue: "Are you sure you want to pause the subscription?",
    },
    {
      key: "archievedLabelText",
      label: "Archieved Label Text",
      hasInfo: false,
      defaultValue: "Archieved Label Text",
    },
    {
      key: "canceledLabelText",
      label: "Canceled Label Text",
      hasInfo: false,
      defaultValue: "Canceled",
    },
    {
      key: "pauseDurationDropdownLabel",
      label: "Pause Duration Dropdown Label",
      hasInfo: false,
      defaultValue:
        "How many orders/cycles you want subscription to pause for?",
      description: "Label for selecting how many billing cycles to pause",
    },
    {
      key: "pauseFeedbackFieldLabel",
      label: "Pause Feedback Field Label",
      hasInfo: false,
      defaultValue: "Pause Feedback",
      description:
        "Label for the feedback text field when pausing a subscription",
    },
    {
      key: "pauseSubscriptionOrderCycleOptionText",
      label: "Pause Subscription Order Cycle Option Text",
      hasInfo: false,
      defaultValue:
        "How many orders/cycles you want subscription to pause for?",
    },
    {
      key: "pauseSectionTitle",
      label: "Pause Section Title",
      hasInfo: false,
      defaultValue: "",
      description: "Title of the expandable section containing pause options",
    },
    {
      key: "pauseEndDateLabel",
      label: "Pause End Date Label",
      hasInfo: false,
      defaultValue: "Pause Till Date",
      description:
        "Label shown above the date when the subscription will automatically resume",
    },
    {
      key: "pauseReasonDisplayLabel",
      label: "Pause Reason Display Label",
      hasInfo: false,
      defaultValue: "Selected Pause Reason",
      description:
        "Label shown next to the customer's selected reason for pausing",
    },
    {
      key: "pauseNoteLabel",
      label: "Pause Note Label",
      hasInfo: false,
      defaultValue: "Pause Note",
      description:
        "Label for the additional notes field when pausing a subscription",
    },
  ],
};

export const cancellationConfig = {
  title: "Cancellation",
  fields: [
    {
      key: "cancelSubscriptionButtonText",
      label: "Cancel Subscription Button Text",
      hasInfo: true,
      defaultValue: "Cancel Subscription",
      description:
        "Text displayed on the button to initiate subscription cancellation",
    },
    {
      key: "prepaidCancellationConfirmationMessage",
      label: "Prepaid Cancellation Confirmation Message",
      hasInfo: false,
      defaultValue: `Message shown when cancelling a prepaid subscription (e.g., "Are you sure you want to cancel your prepaid subscription?")`,
    },
    {
      key: "payAsYouGoCancellationConfirmationMessage",
      label: "Pay-As-You-Go Cancellation Confirmation Message",
      hasInfo: false,
      defaultValue: "Are you sure you want to cancel your subscription?",
      description: `Message shown when cancelling a pay-as-you-go subscription (e.g., "Are you sure you want to cancel your subscription?")`,
    },
    {
      key: "prepaidCancellationButtonText",
      label: "Prepaid Cancellation Button Text",
      hasInfo: true,
      defaultValue: "Cancel Prepaid Subscription",
      description: `Text on the button to confirm cancellation of a prepaid subscription (e.g., "Cancel Prepaid Subscription")`,
    },
    {
      key: "payAsYouGoCancellationButtonText",
      label: "Pay-As-You-Go Cancellation Button Text",
      hasInfo: true,
      defaultValue: "Cancel Subscription",
      description: `Text on the button to confirm cancellation of a regular subscription (e.g., "Cancel Subscription")`,
    },
  ],
};

export const cancellationContConfig = {
  title: "Cancellation (cont.)",
  fields: [
    {
      key: "cancellationSectionTitle",
      label: "Cancellation Section Title",
      hasInfo: false,
      defaultValue: "Cancel Subscription",
      description:
        "Title of the expandable section containing cancellation options",
    },
    {
      key: "cancellationReasonDropdownLabel",
      label: "Cancellation Reason Dropdown Label",
      hasInfo: false,
      defaultValue: "Select Cancellation Reason",
      description:
        "Label shown above the dropdown for selecting a cancellation reason",
    },
    {
      key: "cancellationReasonDropdownPlaceholder",
      label: "Cancellation Reason Dropdown Placeholder",
      hasInfo: false,
      defaultValue: "Select Cancellation Reason",
      description: `Placeholder text shown in the cancellation reason dropdown (e.g., "Select a reason")`,
    },
    {
      key: "cancellationFeedbackFieldLabel",
      label: "Cancellation Feedback Text Field Label",
      hasInfo: false,
      defaultValue: "Cancellation Reason",
      description: `Label for the text field where customers provide additional cancellation feedback`,
    },
    {
      key: "cancellationDateLabel",
      label: "Cancellation Date Label",
      hasInfo: false,
      defaultValue: "Cancellation Date",
      description:
        "Label shown next to the date when the subscription will be cancelled",
    },
    {
      key: "optionalFieldIndicatorText",
      label: "Optional Field Indicator Text",
      hasInfo: false,
      defaultValue: "(optional)",
      description: `Text shown to indicate that the reason field is optional (e.g., "(optional)")`,
    },
  ],
};

export const cancellationReasonsConfig = {
  title: "Cancellation Reasons",
  fields: [
    {
      key: "cancellationReasonDisplayLabel",
      label: "Cancellation Reason Display Label",
      hasInfo: false,
      defaultValue: "Selected Cancellation Reason",
      description: `Label shown next to the customer's selected reason for cancellation`,
    },
    {
      key: "cancellationNoteLabel",
      label: "Cancellation Note Label",
      hasInfo: false,
      defaultValue: "Cancellation Note",
      description: `Label for the additional notes field when cancelling a subscription`,
    },
    {
      key: "selectedCancellationReasonTitleText",
      label: "Selected Cancellation Reason Title Text",
      hasInfo: false,
      defaultValue: "No, cancel the subscription",
    },
    {
      key: "selectCancellationReasonRequiredMessageText",
      label: "Select Cancellation Reason Required Message Text",
      hasInfo: false,
      defaultValue: "Please select a reason for cancellation.",
    },
    {
      key: "cancellationDiscountAlreadyUsedMessageText",
      label: "Cancellation Discount Already Used Message Text",
      hasInfo: false,
      defaultValue: "Discount for cancellation already used.",
    },
  ],
};

export const freezeSubscriptionConfig = {
  title: "Freeze Subscription",
  fields: [
    {
      key: "subscriptionLockedMessage",
      label: "Subscription Locked Message",
      hasInfo: true,
      defaultValue:
        "Subscription cannot be modified until {{minCycles}} orders have completed.",
      description: `Message shown when subscription modifications are temporarily restricted`,
    },
    {
      key: "contractModificationRestrictedMessage",
      label: "Contract Modification Restricted Message",
      hasInfo: false,
      defaultValue: "Your subscription contract is frozen by your shop owner.",
      description: `Message explaining why the subscription contract cannot be modified at this time`,
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
  ],
};

export const cycleManagementConfig = {
  title: "Cycle Management",
  fields: [
    {
      key: "minCycleText",
      label: "Min Cycle Text",
      hasInfo: false,
      defaultValue: "Min Cycle",
    },
    {
      key: "maxCycleText",
      label: "Max Cycle Text",
      hasInfo: false,
      defaultValue: "Max Cycle",
    },
    {
      key: "editDeliveryIntervalText",
      label: "Edit Delivery Interval Text",
      hasInfo: false,
      defaultValue: "Edit Delivery Interval",
    },
    {
      key: "deliveryFrequencyText",
      label: "Delivery Frequency Text",
      hasInfo: false,
      defaultValue: "Delivery Frequency",
    },
    {
      key: "currentBillingCycleText",
      label: "Current Billing Cycle Text",
      hasInfo: false,
      defaultValue: "Current billing cycle: ",
    },
  ],
};

export const bannersConfig = {
  title: "Banners",
  fields: [
    {
      key: "securityChallengeBannerText",
      label: "Security Challenge Banner Text",
      hasInfo: false,
      defaultValue:
        "Your last order was security challenged and you should process that first instead of placing another other or changing next billing date.",
    },
  ],
};