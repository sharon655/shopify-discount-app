export const productListConfig = {
  title: "Product List",
  fields: [
    {
      key: "totalProductsText",
      label: "Total Products Text",
      hasInfo: false,
      defaultValue: "Total Products",
    },
    {
      key: "seeMoreButtonText",
      label: "See More Product Button Text",
      hasInfo: false,
      defaultValue: "See More...",
    },
    {
      key: "noProductFoundMessageText",
      label: "No Product Found Message Text",
      hasInfo: false,
      defaultValue: "There are no product available on given search result",
    },
    {
      key: "deletedProductsBannerText",
      label: "Deleted Products Banner Text",
      hasInfo: false,
      defaultValue:
        "Note: You have some products that are no longer available. Please consider swapping them with other available products.",
    },
    {
      key: "clearSingleProductSelectionButtonText",
      label: "Clear Single Product Selection Button Text",
      hasInfo: false,
      defaultValue: "Clear selection",
    },
  ],
};

export const productSwapConfig = {
  title: "Product Swap",
  fields: [
    {
      key: "swapProductLabelText",
      label: "Swap Product Label Text",
      hasInfo: false,
      defaultValue: "to swap the current product.",
      description: `Text displayed for the product swap feature in the customer portal`,
    },
    {
      key: "swapProductSearchBarText",
      label: "Swap Product Search bar text",
      hasInfo: false,
      defaultValue: "Search a product to swap",
    },
    {
      key: "sealedProductMessageText",
      label: "Select Product To Swap Button Text",
      hasInfo: false,
      defaultValue: "Select",
    },
    {
      key: "editSwapProductButtonText",
      label: "Edit Swap Product",
      hasInfo: true,
      defaultValue: "Swap Product",
    },
    {
      key: "swapProductAddButtonText",
      label: "Swap Product Add",
      hasInfo: false,
      defaultValue: "Confirm Swap",
    },
    {
      key: "removeLabelText",
      label: "Remove Label Text",
      hasInfo: false,
      defaultValue: "Remove",
    },
  ],
};

export const productSwapContConfig = {
  title: "Product Swap (cont.)",
  fields: [
    {
      key: "confirmSwapButtonText",
      label: "Confirm Swap text",
      hasInfo: false,
      defaultValue: "Confirm Swap",
    },
    {
      key: "confirmAddProductButtonText",
      label: "Confirm Add Product Text",
      hasInfo: false,
      defaultValue: "Add Product",
    },
    {
      key: "chooseDifferentProductActionText",
      label: "Choose Different Product Action Text",
      hasInfo: false,
      defaultValue: "Choose different product Action",
    },
    {
      key: "chooseDifferentProductText",
      label: "Choose Different Product Text",
      hasInfo: false,
      defaultValue: "Choose different product",
    },
  ],
};

export const outOfStockConfig = {
  title: "Out of Stock",
  fields: [
    {
      key: "outOfStockButtonText",
      label: "Out of Stock Button Text",
      hasInfo: false,
      defaultValue: "Out of Stock",
    },
    {
      key: "placeholderImageUrl",
      label:
        "Placeholder image URL for a product that has been deleted from the Fixed Pricing Bundle",
      hasInfo: false,
      defaultValue: "",
    },
    {
      key: "productOutOfStockQuickActionsText",
      label: "Product Out Of Stock Quick Actions Text",
      hasInfo: false,
      defaultValue:
        "The product you just tried to add is currently out of stock, and cannot be added",
    },
  ],
};

export const productDetailsConfig = {
  title: "Product Details",
  fields: [
    {
      key: "quantityLabel",
      label: "Quantity Label",
      hasInfo: false,
      defaultValue: "Quantity",
    },
    {
      key: "variantLabelText",
      label: "Variant Label Text",
      hasInfo: false,
      defaultValue: "Variant",
    },
    {
      key: "skuLabelText",
      label: "SKU Label Text",
      hasInfo: false,
      defaultValue: "SKU",
    },
    {
      key: "variantLabelText",
      label: "Variant Label Text",
      hasInfo: false,
      defaultValue: "Variant:",
    },
  ],
};
