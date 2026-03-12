import Accordion from "../Accordion";
import CssEditor from "../CssEditor";
import {
  Banner,
  BlockStack,
  Box,
  Checkbox,
  InlineStack,
  Link,
  RadioButton,
  Text,
} from "@shopify/polaris";

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
    // {
    //   id: "showForSoldOut",
    //   label: "Show subscription widget for sold-out products",
    //   description:
    //     "Allow customers to subscribe to products that are temporarily out of stock, ensuring they receive the item when it becomes available.",
    //   defaultChecked: true,
    // },
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
  // additionalFeatures: [
  //   {
  //     id: "autoUpdatePrice",
  //     label: "Auto-Update Price on Quantity Change",
  //     type: "select",
  //     options: ["Disable", "Enable"],
  //     description:
  //       "This feature is only available when 'Classic Radio Selection' or 'Compact Dropdown Selection' or 'Luminic' is selected on widget types",
  //   },
  //   {
  //     id: "sendFulfillmentCount",
  //     label: "Send Fulfillment count via property",
  //     type: "select",
  //     options: ["Disable", "Enable"],
  //   },
  //   {
  //     id: "poweredBy",
  //     label: 'Show "Powered by Appstle" attribution',
  //     description:
  //       'Displays a small "Powered by Appstle" text in the subscription tooltip. Disabling may require a higher-tier plan.',
  //     type: "checkbox",
  //     defaultChecked: true,
  //   },
  //   {
  //     id: "displayFrequencies",
  //     label:
  //       "Display subscription frequencies in the order set in subscription plans",
  //     description:
  //       "When enabled, displays subscription options in the same order you set in the admin, rather than automatically sorting by price.",
  //     type: "checkbox",
  //   },
  //   {
  //     id: "displayBeforeOneTime",
  //     label: "Display subscription options before one-time purchase option",
  //     description:
  //       "Prioritizes subscriptions by showing them first in the widget, which can increase subscription conversion rates.",
  //     type: "checkbox",
  //   },
  //   {
  //     id: "compareAtPrice",
  //     label: "Show compare-at price for one-time purchases",
  //     description:
  //       "Displays the original price alongside the current price for one-time purchases, helping highlight any discounts.",
  //     type: "checkbox",
  //   },
  //   {
  //     id: "prepaidPlans",
  //     label: "Display prepaid plans in a separate section",
  //     description:
  //       "Shows prepaid subscription plans (where customers pay upfront for multiple deliveries) in their own distinct section, making the difference clearer to customers.",
  //     type: "checkbox",
  //     defaultChecked: true,
  //   },
  // ],
};

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

function Settings({
  accordionOpen,
  setAccordionOpen,
  data,
  onChange,
}: {
  accordionOpen: string;
  setAccordionOpen: any;
  data: any;
  onChange: (d: any) => void;
}) {
  const handleAccordionToggle = (id: string) => {
    setAccordionOpen((prev: string) => (prev === id ? "" : id));
  };

  const handleRadioChange = (value: string) => {
    onChange({ ...data, widgetStyle: value });
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    onChange({ ...data, [id]: checked });
  };

  // const handleSelectChange = (id: string, value: string) => {
  //   onChange({ ...data, [id]: value });
  // };

  return (
    <>
      {accordionsConfig.map((accordion) => (
        <Accordion
          key={accordion.id}
          title={accordion.title}
          open={accordionOpen === accordion.id}
          onToggle={() => handleAccordionToggle(accordion.id)}
        >
          {accordion.id === "css" ? (
            <CssEditor
              value={data.customCss || ""}
              onChange={(css) => onChange({ ...data, customCss: css })}
            />
          ) : accordion.id === "customization" ? (
            <>
              <Box paddingBlockStart="200">
                <Text as="h4" variant="headingSm">
                  General Settings
                </Text>
              </Box>
              <BlockStack gap="200">
                {customizationConfig.generalSettings.map((setting) => (
                  <Checkbox
                    key={setting.id}
                    label={setting.label}
                    helpText={setting.description}
                    checked={
                      data[setting.id] ?? setting.defaultChecked ?? false
                    }
                    onChange={(checked) =>
                      handleCheckboxChange(setting.id, checked)
                    }
                  />
                ))}
              </BlockStack>

              {/* <Divider /> */}

              {/* <Box paddingBlockStart="100">
                <Text as="h4" variant="headingSm">
                  Additional Features
                </Text>
              </Box> */}
              {/* <Box paddingBlockEnd={"200"}>
                <BlockStack gap="200">
                  {customizationConfig.additionalFeatures.map((feature) =>
                    feature.type === "select" ? (
                      <Select
                        key={feature.id}
                        label={feature.label}
                        options={feature.options}
                        value={
                          data[feature.id] ??
                          (feature.options ? feature.options[0] : "")
                        }
                        onChange={(value) =>
                          handleSelectChange(feature.id, value)
                        }
                        helpText={feature.description}
                      />
                    ) : (
                      <Checkbox
                        key={feature.id}
                        label={feature.label}
                        helpText={feature.description}
                        checked={
                          data[feature.id] ?? feature.defaultChecked ?? false
                        }
                        onChange={(checked) =>
                          handleCheckboxChange(feature.id, checked)
                        }
                      />
                    )
                  )}
                </BlockStack>
              </Box> */}
            </>
          ) : accordion.type === "styles" ? (
            <>
              {widgetStyles.map((style) => (
                <RadioButton
                  key={style.id}
                  label={
                    <InlineStack gap="200" blockAlign="center">
                      <span>{style.label}</span>
                    </InlineStack>
                  }
                  helpText={
                    style.plan === "BUSINESS" ? (
                      <Text as="p" variant="bodySm">
                        Upgrade your plan to{" "}
                        <Link url="https://your-upgrade-link.com">
                          BUSINESS
                        </Link>{" "}
                        to enable this feature.{" "}
                      </Text>
                    ) : (
                      style?.helpText
                    )
                  }
                  checked={data.widgetStyle === style.id}
                  id={style.id}
                  name="widgetStyle"
                  onChange={() => handleRadioChange(style.id)}
                />
              ))}
              <Banner tone="info" onDismiss={() => {}}>
                Please refer to the article <Link>here</Link> to listen to our
                widget events and implement your solution on top of it. If you
                plan to build the entire widget yourself, check{" "}
                <Link url="https://shopify.dev">Shopify’s guide</Link>.
              </Banner>
            </>
          ) : (
            <Text as="p" variant="bodyMd">
              {accordion.content}
            </Text>
          )}
        </Accordion>
      ))}
    </>
  );
}

export default Settings;
