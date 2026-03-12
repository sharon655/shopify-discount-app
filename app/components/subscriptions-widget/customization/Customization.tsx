import { Banner, BlockStack, Box, Card, InlineStack, LegacyCard, Tabs, Text } from "@shopify/polaris";
import { useState } from "react";
import CustomizationField from "../CustomizationField";

function Customization({data,onChange}: {data: any; onChange: (d: any) => void}) {
  const [subTab, setSubTab] = useState("visibility");

  const updateField = (field: string) => (value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <BlockStack gap="400">
      {/* Hidden inputs for form dirty detection */}
      {Object.keys(data).map(key => (
        <input key={key} type="hidden" name={key} value={data[key] || ''} />
      ))}

      {/* Info banner */}
      <Box paddingBlockStart="200">
        <Banner tone="info">
          <InlineStack align="start">
            <Text as="p" variant="bodyMd">
              Customize how your subscription widget appears to customers. Hover
              over field labels for more information.
            </Text>
          </InlineStack>
        </Banner>
      </Box>
      {/* Tabs inside white card */}
      <LegacyCard>
        <Tabs
          tabs={[
            { id: "visibility", content: "Visibility" },
            { id: "size", content: "Size & Placement" },
            { id: "colors", content: "Colors & Style" },
          ]}
          selected={["visibility", "size", "colors"].indexOf(subTab)}
          onSelect={(i) => setSubTab(["visibility", "size", "colors"][i])}
          fitted
        >
          <Box paddingBlockStart="200">
            <Card>
              {subTab === "visibility" && (
                <>
                  <Text as="h2" variant="headingSm" alignment="center">
                    Control which elements are visible in your subscription
                    widget.
                  </Text>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                    <CustomizationField
                      label="Hide Loyalty/Subscriber Rewards"
                      tooltip="Hide the section that displays subscriber benefits such as loyalty rewards, savings, or exclusive perks. Useful if you prefer a cleaner layout or manage rewards messaging elsewhere."
                      type="checkbox"
                      value={data.hideLoyaltyRewards}
                      onChange={updateField("hideLoyaltyRewards")}
                    />
                    <CustomizationField
                      label="Hide Discount Badge"
                      tooltip="When enabled, completely hides the discount badges that show savings amounts next to subscription options. Useful if you prefer a cleaner look or have discount information displayed elsewhere."
                      type="checkbox"
                      value={data.hideDiscountBadge}
                      onChange={updateField("hideDiscountBadge")}
                    />
                    <CustomizationField
                      label="Keep frequency dropdown visible at all times"
                      tooltip="If you turn this ON, the subscription option in the widget will always stay open like a dropdown. Even if the customer selects one-time purchase, the subscription section won’t collapse or hide"
                      type="checkbox"
                      value={data.keepFrequencyVisible}
                      onChange={updateField("keepFrequencyVisible")}
                    />
                    <CustomizationField
                      label="Show Tooltips Only When Plan Selected"
                      tooltip="Controls when subscription information tooltips appear. When enabled, tooltips will only be shown after a customer selects a subscription plan, reducing visual clutter. When disabled, tooltips will always be visible regardless of selection."
                      type="checkbox"
                      value={data.showTooltipsOnlyWhenSelected}
                      onChange={updateField("showTooltipsOnlyWhenSelected")}
                    />
                  </div>
                </>
              )}

              {subTab === "size" && (
                <>
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingSm" alignment="center">
                      Adjust dimensions and positioning of your subscription
                      widget.
                    </Text>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                      <CustomizationField
                        label="Label Text Size"
                        tooltip="Adjusts the size of text labels for subscription options. Larger values improve readability but take up more space, while smaller values create a more compact look."
                        type="number"
                        suffix="px"
                        value={data.labelTextSize}
                        onChange={updateField("labelTextSize")}
                        helpText="Size of option labels"
                      />
                      <CustomizationField
                        label="Option Spacing"
                        tooltip="Adjusts the vertical space between subscription options. Increasing this value adds more breathing room between options, making them more distinct. Decreasing creates a more compact widget."
                        type="number"
                        suffix="px"
                        value={data.optionSpacing}
                        onChange={updateField("optionSpacing")}
                        helpText="Space between options"
                      />
                      <CustomizationField
                        label="Border Width"
                        tooltip="Controls the thickness of borders around the subscription widget. Higher values create more prominent borders, while lower values create subtler lines. Use 0 to remove borders completely."
                        type="number"
                        suffix="px"
                        value={data.borderWidth}
                        onChange={updateField("borderWidth")}
                        helpText="0 to remove borders"
                      />
                      <CustomizationField
                        label="Widget Padding"
                        tooltip="Controls inner spacing of the widget (0-20px)"
                        type="number"
                        suffix="px"
                        value={data.widgetPadding}
                        onChange={updateField("widgetPadding")}
                        helpText="Padding inside the widget"
                      />
                      <CustomizationField
                        label="Border Radius"
                        tooltip="Controls corner roundness (0-20px)"
                        type="number"
                        suffix="px"
                        value={data.borderRadius}
                        onChange={updateField("borderRadius")}
                        helpText="0px for sharp corners"
                      />
                    </div>
                  </BlockStack>
                </>
              )}

              {subTab === "colors" && (
                <>
                  <BlockStack gap="300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
                      <CustomizationField
                        label="Discount Badge Color"
                        tooltip="Controls the background color of the discount badge that shows savings amounts (e.g., 'SAVE 10%'). This appears alongside subscription options to highlight savings."
                        type="color"
                        value={data.discountBadgeColor}
                        onChange={updateField("discountBadgeColor")}
                      />
                      <CustomizationField
                        label="Discount Badge Text Color"
                        tooltip="Sets the text color for discount badges that display savings amounts. Choose a color that contrasts well with your discount badge background for maximum visibility."
                        type="color"
                        value={data.discountBadgeTextColor}
                        onChange={updateField("discountBadgeTextColor")}
                      />
                      <CustomizationField
                        label="Widget Background Color"
                        tooltip="Controls call-to-action buttons, selected state backgrounds and link highlights"
                        type="color"
                        value={data.widgetBackgroundColor}
                        onChange={updateField("widgetBackgroundColor")}
                      />
                      <CustomizationField
                        label="Text Color"
                        tooltip="Sets the color for all body copy, plan names and frequency labels"
                        type="color"
                        value={data.textColor}
                        onChange={updateField("textColor")}
                      />
                      <CustomizationField
                        label="Price Text Color:"
                        tooltip="Sets the color for price text throughout the widget, including one-time purchase prices and subscription prices. This helps highlight the cost information."
                        type="color"
                        value={data.priceTextColor}
                        onChange={updateField("priceTextColor")}
                      />
                      <CustomizationField
                        label="Compare Price Color"
                        tooltip="Sets the color for crossed-out original prices shown alongside discounted subscription prices. This helps highlight the savings customers get when subscribing."
                        type="color"
                        value={data.comparePriceColor}
                        onChange={updateField("comparePriceColor")}
                      />
                      <CustomizationField
                        label="Radio Button Color"
                        tooltip="Sets the color for crossed-out original prices shown alongside discounted subscription prices. This helps highlight the savings customers get when subscribing."
                        type="color"
                        value={data.radioButtonColor}
                        onChange={updateField("radioButtonColor")}
                      />
                      <CustomizationField
                        label="Loyalty Icons Color"
                        tooltip="Color of loyalty program icons (e.g., stars, badges) that indicate a customer's loyalty status."
                        type="color"
                        value={data.loyaltyIconsColor}
                        onChange={updateField("loyaltyIconsColor")}
                      />
                      <CustomizationField
                        label="Tooltip Text Color"
                        tooltip="Controls the color of text inside information tooltips. Ensure this contrasts well with your tooltip background color for optimal readability."
                        type="color"
                        value={data.tooltipTextColor}
                        onChange={updateField("tooltipTextColor")}
                      />
                      <CustomizationField
                        label="Tooltip Background Color"
                        tooltip="Sets the background color for information tooltips that appear when customers interact with the subscription widget. Choose a color that contrasts well with your tooltip text."
                        type="color"
                        value={data.tooltipBackgroundColor}
                        onChange={updateField("tooltipBackgroundColor")}
                      />
                    </div>
                  </BlockStack>
                </>
              )}
            </Card>
          </Box>
        </Tabs>
      </LegacyCard>
    </BlockStack>
  );
}

export default Customization;