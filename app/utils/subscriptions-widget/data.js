// tabsConfig.ts
// const tabsConfig = [
//   { id: "settings", content: "Settings" },
//   { id: "labels", content: "Labels" },
//   { id: "customization", content: "Customization" },
//   { id: "cart-widget", content: "Cart Widget" },
//   { id: "add-to-subscription", content: "Add to Subscription" },
//   { id: "page-builder", content: "Page builder & Home / Collection Page" },
//   { id: "more-views", content: "More views" },
// ];

// pageConfig.ts
const pageConfig = {
  title: "Widget",
  subtitle: "Manage all your widget settings",
  secondaryActions: [{ content: "View Tutorials", action: "viewTutorials" }],
  backAction: { content: "Billing", url: "/app/billing" },
};

/* ---------------- primary tabs ---------------- */
const primaryTabsConfig = [
  { id: "settings", content: "Settings" },
  { id: "labels", content: "Labels" },
  { id: "customization", content: "Customization" },
  { id: "cart-widget", content: "Cart Widget" },
  { id: "add-to-subscription", content: "Add to Subscription" },
];

/* ---------------- dynamic tabs ---------------- */
const dynamicTabsConfig = [
  { id: "page-builder", content: "Page builder & Home / Collection Page" },
  { id: "subscription-price", content: "Subscription Price" },
  { id: "checkout-extension", content: "Checkout Extension" },
];

// widgetStyles.ts
const widgetStyles = [
  { id: "luminic", label: "Luminic — Modern & Clean", plan: "FREE" },
  {
    id: "classic",
    label: "Classic Radio Selection — Simple & Traditional",
    plan: "FREE",
  },
  {
    id: "compact",
    label: "Compact Dropdown Selection — Space-Saving",
    plan: "FREE",
  },
  {
    id: "grid",
    label: "Simple Grid Display — Equal-Width Options",
    plan: "BUSINESS",
    helpText: "Upgrade your plan to BUSINESS to enable this feature.",
  },
  {
    id: "grid-savings",
    label: "Grid Savings Display — Highlight Discounts",
    plan: "BUSINESS",
    helpText: "Upgrade your plan to BUSINESS to enable this feature.",
  },
  {
    id: "button",
    label: "Simple Button Options — Streamlined Look",
    plan: "BUSINESS",
    helpText: "Upgrade your plan to BUSINESS to enable this feature.",
  },
  {
    id: "stacked",
    label: "Stacked Card Selector — Premium Appearance",
    plan: "BUSINESS",
    helpText: "Upgrade your plan to BUSINESS to enable this feature.",
  },
];

// customizationConfig.ts
const customizationConfig = {
  generalSettings: [
    {
      id: "preselect",
      label: "Pre-select subscription option for customers",
      description:
        "When enabled, the subscription option will be pre-selected when customers visit your product page, encouraging subscription conversions.",
    },
    {
      id: "showOnProductPages",
      label: "Show subscription options on product pages",
      description:
        "Turn subscription options on or off across your store. Disable temporarily to hide all subscription options without deleting your settings.",
      defaultChecked: true,
    },
    {
      id: "showForSoldOut",
      label: "Show subscription widget for sold-out products",
      description:
        "Allow customers to subscribe to products that are temporarily out of stock, ensuring they receive the item when it becomes available.",
      defaultChecked: true,
    },
    {
      id: "tooltipIcon",
      label: "Display information tooltip icon",
      description:
        "Adds an information icon that customers can hover over to learn more about your subscription program benefits.",
      defaultChecked: true,
    },
    {
      id: "alwaysShowInfo",
      label: "Always show subscription information (no hover needed)",
      description:
        "Displays subscription details permanently below the widget instead of requiring customers to hover over an icon - better for mobile users.",
    },
  ],
  additionalFeatures: [
    {
      id: "autoUpdatePrice",
      label: "Auto-Update Price on Quantity Change",
      type: "select",
      options: ["Disable", "Enable"],
      description:
        "This feature is only available when 'Classic Radio Selection' or 'Compact Dropdown Selection' or 'Luminic' is selected on widget types",
    },
    {
      id: "sendFulfillmentCount",
      label: "Send Fulfillment count via property",
      type: "select",
      options: ["Disable", "Enable"],
    },
    {
      id: "poweredBy",
      label: 'Show "Powered by Appstle" attribution',
      description:
        'Displays a small "Powered by Appstle" text in the subscription tooltip. Disabling may require a higher-tier plan.',
      type: "checkbox",
      defaultChecked: true,
    },
    {
      id: "displayFrequencies",
      label:
        "Display subscription frequencies in the order set in subscription plans",
      description:
        "When enabled, displays subscription options in the same order you set in the admin, rather than automatically sorting by price.",
      type: "checkbox",
    },
    {
      id: "displayBeforeOneTime",
      label: "Display subscription options before one-time purchase option",
      description:
        "Prioritizes subscriptions by showing them first in the widget, which can increase subscription conversion rates.",
      type: "checkbox",
    },
    {
      id: "compareAtPrice",
      label: "Show compare-at price for one-time purchases",
      description:
        "Displays the original price alongside the current price for one-time purchases, helping highlight any discounts.",
      type: "checkbox",
    },
    {
      id: "prepaidPlans",
      label: "Display prepaid plans in a separate section",
      description:
        "Shows prepaid subscription plans (where customers pay upfront for multiple deliveries) in their own distinct section, making the difference clearer to customers.",
      type: "checkbox",
      defaultChecked: true,
    },
  ],
};

// accordionsConfig.ts
const accordionsConfig = [
  {
    id: "styles",
    title: "Widget Styles",
    type: "styles", // special type so FE knows to render radio buttons
  },
  {
    id: "customization",
    title: "Widget Customization",
    content:
      "Put your customization controls here (colors, badges, price text, etc.).",
  },
  {
    id: "css",
    title: "Custom Widget CSS",
    content: "Provide a code editor or textarea for custom CSS overrides.",
  },
];

// productPreview.ts
const productPreview = {
  title: "Dummy Product Preview",
  description:
    "The widget preview cannot load because your Shopify store is password-protected. Please disable the storefront password in your Shopify settings or preview the widget on a live store.",
  image:
    "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=687&auto=format&fit=crop",
  productTitle: "Power Energy Drink — 12CT Case",
  options: [
    {
      id: "oneTime",
      label: "One-time purchase",
      price: 27.99,
    },
    {
      id: "subscribe",
      label: "Subscribe and save",
      badge: { tone: "success", label: "SAVE 10%" },
      originalPrice: 27.99,
      discountedPrice: 20.99,
    },
  ],
  buttons: [
    {
      type: "secondary",
      label: "Subscription details",
      icon: "AlertCircleIcon",
    },
    { type: "primary", label: "ADD TO CART", fullWidth: true },
  ],
};

// default settings data
const defaultSettings = {
  widgetStyle: "luminic",
  preselect: false,
  showOnProductPages: true,
  showForSoldOut: true,
  tooltipIcon: true,
  alwaysShowInfo: false,
  autoUpdatePrice: "Disable",
  sendFulfillmentCount: "Disable",
  poweredBy: true,
  displayFrequencies: false,
  displayBeforeOneTime: false,
  compareAtPrice: false,
  prepaidPlans: true,
  customCss: "",
};

// Localization strings for labels the subscription widget
const defaultLabels = {
  // 1) Purchase Option Text Labels
  purchaseOptionsHeading: "Purchase Options",
  oneTimePurchaseLabel: "One Time Purchase",
  oneTimePurchaseSubtext: "",
  subscriptionPurchaseLabel: "Subscribe and save",
  subscriptionPurchaseSubtext: "",

  // 2) Widget Content Labels
  deliveryFrequencyLabel: "DELIVERY FREQUENCY",
  subscriberRewardsTitle: "",
  addToCartButtonText: "",
  addToCartButtonSelector: "",

  // 3) Selling Plan Labels
  freeProductLabel: "Subscription Free Product",
  prepaidPlanFormat: "{{sellingPlanName}} ({{sellingPlanPrice}})/delivery",
  regularPlanFormat: "{{sellingPlanName}}",
  payAsYouGoPriceFormat: "{{price}}",
  bundleDiscountText: "bundle discount extra: {{bundleDiscount}} off",

  // 4) Price Labels
  oneTimePriceFormat: "{{price}}",
  prepaidPerDeliveryPriceFormat: "{{prepaidPerDeliveryPrice}}/delivery",
  collectionPageSubscriptionPriceFormat: "",
  discountBadgeFormat: "SAVE {{selectedDiscountPercentage}}",
  productPageUnitPriceSelector: "",

  // 5) Prepaid and Prepay labels
  prepaidSaveBadgeText: "SAVE {{selectedDiscountPercentage}}",
  prepaidLabelText: "Prepaid",
  selectedPrepaidPlanPriceText: "{{totalPrice}}",
  prepayPlanLabelText: "Prepay",

  // 6) Subscription Information Tooltip Content
  tooltipTitle: "Subscription detail",
  defaultTooltipDescription:
    "<strong>Have complete control of your subscriptions</strong><br/><br/>Skip, reschedule, edit, or cancel deliveries anytime, based on your needs.",
  prepaidPlanTooltip:
    "<b>Prepaid Plan Details</b><br/> Total price: {{totalPrice}} ( Price for every delivery: {{prepaidPerDeliveryPrice}} )",
  discountTierTooltip:
    "<b>Discount Details</b><br/>An initial discount of {{discountOne}} will be applied to your first order. Subsequent orders will have {{discountTwo}}.",
  tooltipCustomization:
    "{{{defaultTooltipDescription}}} </br>  {{{prepaidDetails}}} </br>  {{{discountDetails}}}",

  // 7) Manage Subscription Labels (Account Page)
  manageBoxTitle: "Subscription",
  manageBoxDescription:
    "Continue to your account to view and manage your subscriptions. Please use the same email.",
  manageBoxButtonText: "Manage your subscription",
  manageButtonHTML:
    "<a href='https://shopify.com/account/profile' class='appstle_manageSubBtn'>Manage</a>",
  duplicateValidationMessage: "Buying multiple subscriptions is not allowed.",
};

// default customization data
const defaultCustomization = {
  // Visibility fields
  hideLoyaltyRewards: false,
  hideDiscountBadge: false,
  keepFrequencyVisible: false,
  showTooltipsOnlyWhenSelected: false,

  // Size & Placement fields
  labelTextSize: "",
  optionSpacing: "",
  borderWidth: "",
  borderRadius: "",
  widgetPadding: "",

  // Colors & Style fields
  discountBadgeColor: "",
  discountBadgeTextColor: "",
  widgetBackgroundColor: "",
  textColor: "",
  priceTextColor: "",
  comparePriceColor: "",
  radioButtonColor: "",
  loyaltyIconsColor: "",
  tooltipTextColor: "",
  tooltipBackgroundColor: "",
};

const defaultCartWidget = {
  enableWidget: false,
  oneTimePurchaseText: "One-time Purchase",
  subscriptionInitialText: "Subscribe and save",
  subscriptionSelectedText: "Subscription Selected",
  selectDeliveryText: "Select Delivery Option",
  deliveryFrequencyText: "Delivery Frequency",
  forceRefresh: "disable",
  frequencyText: "Frequency",
  showBanner: true,
};

const defaultAddToSubscription = {
  enableAddToSub: false,
  tooltipText: "Please avoid double delivery charges! Login to add this product to an upcoming delivery.",
  buttonText: "Add to Shipment",
  processingText: "Processing...",
  successText: "Success",
  errorText: "Error",
  addToSubTitle: "Add to Subscription",
  successMsg: "Product {{productName}} Added Successfully.",
  orderLabelText: "You May Also Like",
  purchaseOptions: "both",
};

export const data = {
  pageConfig,
  primaryTabsConfig,
  dynamicTabsConfig,
  accordionsConfig,
  productPreview,
  customizationConfig,
  widgetStyles,
  defaultSettings,
  defaultLabels,
  defaultCustomization,
  defaultCartWidget,
  defaultAddToSubscription,
};
