export interface ConfigurationField {
  key: string;
  fieldType: 'checkbox' | 'text input' | 'options - dropdown' | 'number input' | 'multi-select' | 'color';
  fieldLabel: string;
  fieldTooltipContent?: string;
  fieldValue: string | boolean;
  fieldPlaceholder?: string;
  fieldDescription?: string;
  disable?: boolean;
  fieldOptions?: string;
  suffix?: string;
}

export interface ConfigurationSection {
  title: string;
  description?: string;
  fields: ConfigurationField[];
}

export const customizationSections: ConfigurationSection[] = [
  {
    title: "Customer Portal Visibility",
    description: "Control which elements are visible to your customers in the portal",
    fields: [
      {
        key: "hideOrderNowButtonOnPrepaidContracts",
        fieldType: "checkbox",
        fieldLabel: "Hide 'Order Now' button on prepaid contracts",
        fieldValue: false,
      },
      {
        key: "hideResumeSubscriptionButton",
        fieldType: "checkbox",
        fieldLabel: "Hide 'Resume Subscription' button (for cancelled subscriptions)",
        fieldValue: false,
      },
      {
        key: "hideRescheduleAllOrdersOption",
        fieldType: "checkbox",
        fieldLabel: "Hide 'Reschedule All Orders' option",
        fieldValue: false,
      },
      {
        key: "hideTimePicker",
        fieldType: "checkbox",
        fieldLabel: "Hide Time Picker",
        fieldValue: false,
      },
      {
        key: "useSystemDefaultFontSize",
        fieldType: "checkbox",
        fieldLabel: "Use System Default Font Size",
        fieldValue: false,
      },
    ],
  },
  {
    title: "Portal Features & Navigation",
    description: "Manage which tabs and features are available to customers",
    fields: [
      {
        key: "hideOrderNote",
        fieldType: "checkbox",
        fieldLabel: "Hide Order Note",
        fieldValue: false,
      },
      {
        key: "hideLoyaltyDetails",
        fieldType: "checkbox",
        fieldLabel: "Hide Loyalty Details",
        fieldValue: false,
      },
      {
        key: "hideSwapProductButtonForOneTimePurchases",
        fieldType: "checkbox",
        fieldLabel: "Hide 'Swap Product' button for one-time purchases",
        fieldValue: false,
      },
      {
        key: "hidePastOrdersTab",
        fieldType: "checkbox",
        fieldLabel: "Hide 'Past Orders' Tab",
        fieldValue: false,
      },
      {
        key: "hideUpcomingOrdersTab",
        fieldType: "checkbox",
        fieldLabel: "Hide 'Upcoming Orders' Tab",
        fieldValue: false,
      },
    ],
  },
  {
    title: "Display Settings",
    description: "Adjust how your customer portal appears",
    fields: [
      {
        key: "textSizeInPixels",
        fieldType: "text input",
        fieldLabel: "Text Size (in pixels)",
        fieldValue: "",
        suffix: "px",
      },
    ],
  },
  {
    title: "Branding & Colors",
    description: "Customize your portal's appearance to match your brand Read here.",
    fields: [
      {
        key: "primaryButtonColor",
        fieldType: "color",
        fieldLabel: "Primary Button Color",
        fieldValue: "",
      },
      {
        key: "primaryButtonTextColor",
        fieldType: "color",
        fieldLabel: "Primary Button Text Color",
        fieldValue: "",
      },
      {
        key: "secondaryButtonColor",
        fieldType: "color",
        fieldLabel: "Secondary Button Color",
        fieldValue: "",
      },
      {
        key: "tertiaryButtonColor",
        fieldType: "color",
        fieldLabel: "Tertiary Button Color",
        fieldValue: "",
      },
      {
        key: "cancelButtonColor",
        fieldType: "color",
        fieldLabel: "Cancel Button Color",
        fieldValue: "",
      },
    ],
  },
];