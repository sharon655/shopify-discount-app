export const orderStatusLabelsConfig = {
  title: "Order Status Labels",
  fields: [
    {
      key: "orderNumberLabel",
      label: "Order Number Label",
      hasInfo: false,
      defaultValue: "ORDER",
    },
    {
      key: "partiallyFulfilledLabel",
      label: "Partially Fulfilled",
      hasInfo: false,
      defaultValue: "PARTIALLY FULFILLED",
    },
    {
      key: "fulfilledLabel",
      label: "Fulfilled",
      hasInfo: false,
      defaultValue: "FULFILLED",
    },
    {
      key: "processingLabel",
      label: "Processing label text",
      hasInfo: false,
      defaultValue: "Order In Progress...",
    },
  ],
};
