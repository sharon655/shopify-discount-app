import { BlockStack, Box } from "@shopify/polaris";
import Accordion from "../Accordion";
import LabelledTextField from "../LabelledTextField";

function Labels({ accordionOpen, setAccordionOpen, data, onChange }: any) {
  // const [labelsForm, setLabelsForm] =
  //   useState<typeof localizationStrings>(localizationStrings);
  // const setLF = (key: keyof typeof labelsForm) => (val: string) =>
  //   setLabelsForm((p) => ({ ...p, [key]: val }));

  // const handleAccordionToggle = (id: string) => {
  //   setAccordionOpen((prev: string) => (prev === id ? "" : id));
  // };

  const setLF = (key: keyof typeof data) => (val: string) =>
    onChange((prev: typeof data) => ({ ...prev, [key]: val }));

  const handleAccordionToggle = (id: string) => {
    setAccordionOpen((prev: string) => (prev === id ? "" : id));
  };

  return (
    <>
      {/* 1) Purchase Option Text Labels */}
      <Accordion
        title="Purchase Option Text Labels"
        open={accordionOpen === "purchase-options"}
        onToggle={() => handleAccordionToggle("purchase-options")}
      >
        <Box paddingBlockStart="400" paddingBlockEnd={"400"}>
          <BlockStack gap="300">
            <LabelledTextField
              id="purchaseOptionsHeading"
              label="Purchase Options Heading"
              value={data.purchaseOptionsHeading}
              onChange={setLF("purchaseOptionsHeading")}
              description="The main heading above all purchase options (e.g., 'How would you like to purchase?')."
            />
            <LabelledTextField
              id="oneTimePurchaseLabel"
              label="One-Time Purchase Label"
              value={data.oneTimePurchaseLabel}
              onChange={setLF("oneTimePurchaseLabel")}
              description="Text for the one-time purchase option. E.g., 'Buy Once' or 'One-time Purchase.'"
            />
            <LabelledTextField
              id="oneTimePurchaseSubtext"
              label="One-Time Purchase Subtext"
              value={data.oneTimePurchaseSubtext}
              onChange={setLF("oneTimePurchaseSubtext")}
              description="Additional text that appears below the one-time purchase option (optional)."
            />
            <LabelledTextField
              id="subscriptionPurchaseLabel"
              label="Subscription Purchase Label"
              value={data.subscriptionPurchaseLabel}
              onChange={setLF("subscriptionPurchaseLabel")}
              description="Label for the subscription option. You can use variables to show dynamic information."
              variables={[
                "{{selectedDiscountPercentage}}",
                "{{sellingPlanName}}",
                "{{price}}",
              ]}
            />
            <LabelledTextField
              id="subscriptionPurchaseSubtext"
              label="Subscription Purchase Subtext"
              value={data.subscriptionPurchaseSubtext}
              onChange={setLF("subscriptionPurchaseSubtext")}
              description="Additional text that appears below the Subscription purchase option (optional)."
            />
          </BlockStack>
        </Box>
      </Accordion>

      {/* 2) Widget Content Labels */}
      <Accordion
        title="Widget Content Labels"
        open={accordionOpen === "widget-content"}
        onToggle={() => handleAccordionToggle("widget-content")}
      >
        <Box paddingBlockStart="400" paddingBlockEnd={"400"}>
          <BlockStack gap="300">
            <LabelledTextField
              id="deliveryFrequencyLabel"
              label="Delivery Frequency Label"
              value={data.deliveryFrequencyLabel}
              onChange={setLF("deliveryFrequencyLabel")}
              description="The label shown above the dropdown where customers select delivery frequency (e.g., 'Deliver every')."
            />
            {/* <LabelledTextField
              id="subscriberRewardsTitle"
              label="Subscriber Rewards Section Title"
              value={data.subscriberRewardsTitle}
              onChange={setLF("subscriberRewardsTitle")}
              description="Heading for the section that displays subscription loyalty rewards and benefits."
            />
            <LabelledTextField
              id="addToCartButtonText"
              label="Add to cart button text"
              value={data.addToCartButtonText}
              onChange={setLF("addToCartButtonText")}
              description="Kindly update the Add to Cart button text or specify the message you would like it to display."
              variables={[
                "{{price}}",
                "{{sellingPlanName}}",
                "{{selectedDiscountPercentage}}",
              ]}
            />
            <LabelledTextField
              id="addToCartButtonSelector"
              label="Add to cart button text selector"
              value={data.addToCartButtonSelector}
              onChange={setLF("addToCartButtonSelector")}
              description="Incorrect 'Add to Cart' button selector can break the subscription widget, Please reach out to support if you are unsure about this field."
            /> */}
          </BlockStack>
        </Box>
      </Accordion>

      {/* 3) Selling Plan Labels */}
      {/* <Accordion
        title="Selling Plan Labels"
        open={accordionOpen === "selling-plan"}
        onToggle={() => handleAccordionToggle("selling-plan")}
      >
        <Box paddingBlockStart="400" paddingBlockEnd={"400"}>
          <BlockStack gap="300">
            <LabelledTextField
              id="freeProductLabel"
              label="Subscription Free Product Label Text"
              value={data.freeProductLabel}
              onChange={setLF("freeProductLabel")}
              description="This label helps highlight any free items customers receive when they subscribe to a product (e.g., 'Included with Subscription' or 'Free Bonus')."
            />
            <LabelledTextField
              id="prepaidPlanFormat"
              label="Prepaid Plan Display Format"
              value={data.prepaidPlanFormat}
              onChange={setLF("prepaidPlanFormat")}
              description="How prepaid plan options appear to customers. Variables like {{sellingPlanName}} and {{totalPrice}} show dynamic content."
              variables={[
                "{{sellingPlanName}}",
                "{{sellingPlanPrice}}",
                "{{totalPrice}}",
              ]}
            />
            <LabelledTextField
              id="regularPlanFormat"
              label="Regular Subscription Display Format"
              value={data.regularPlanFormat}
              onChange={setLF("regularPlanFormat")}
              description="How regular (pay-as-you-go) subscription options appear to customers. Use variables to show plan details."
              variables={["{{sellingPlanName}}"]}
            />
            <LabelledTextField
              id="payAsYouGoPriceFormat"
              label="Pay-As-You-Go Price Display Format"
              value={data.payAsYouGoPriceFormat}
              onChange={setLF("payAsYouGoPriceFormat")}
              description="How prices are displayed for standard subscriptions. Use {{price}} to show the subscription price."
              variables={["{{price}}"]}
            />
            <LabelledTextField
              id="bundleDiscountText"
              label="Bundle Discount Text"
              value={data.bundleDiscountText}
              onChange={setLF("bundleDiscountText")}
              description="Text showing bundle/pack savings for subscriptions."
              variables={["{{bundleDiscount}}"]}
            />
          </BlockStack>
        </Box>
      </Accordion> */}

      {/* 4) Price Labels */}
      <Accordion
        title="Price Labels"
        open={accordionOpen === "price-labels"}
        onToggle={() => handleAccordionToggle("price-labels")}
      >
        <Box paddingBlockStart="400" paddingBlockEnd={"400"}>
          <BlockStack gap="300">
            <LabelledTextField
              id="oneTimePriceFormat"
              label="One-time Price Format"
              value={data.oneTimePriceFormat}
              onChange={setLF("oneTimePriceFormat")}
              description="How one-time purchase prices are displayed. Use {{price}} to show the product price."
              variables={["{{price}}"]}
            />
            {/* <LabelledTextField
              id="prepaidPerDeliveryPriceFormat"
              label="Prepaid Per-Delivery Price Format"
              value={data.prepaidPerDeliveryPriceFormat}
              onChange={setLF("prepaidPerDeliveryPriceFormat")}
              description="For prepaid plans, how to show the per-delivery price. Use {{prepaidPerDeliveryPrice}} to show the price per delivery."
              variables={["{{prepaidPerDeliveryPrice}}"]}
            />
            <LabelledTextField
              id="collectionPageSubscriptionPriceFormat"
              label="Collection Page Subscription Price Format"
              value={data.collectionPageSubscriptionPriceFormat}
              onChange={setLF("collectionPageSubscriptionPriceFormat")}
              description="How subscription prices appear on collection pages. Use {{subscriptionPrice}} to show the lowest subscription price."
              variables={["{{subscriptionPrice}}"]}
            /> */}
            <LabelledTextField
              id="discountBadgeFormat"
              label="Discount Badge Format"
              value={data.discountBadgeFormat}
              onChange={setLF("discountBadgeFormat")}
              description="How discount amounts appear in badges. Use {{selectedDiscountPercentage}} to show the discount amount or percentage."
              variables={["{{selectedDiscountPercentage}}"]}
            />
            {/* <LabelledTextField
              id="productPageUnitPriceSelector"
              label="Product Page Unit Price Selector"
              value={data.productPageUnitPriceSelector}
              onChange={setLF("productPageUnitPriceSelector")}
              description="This unit price selector will only work if unit price has been setup inside Shopify."
            /> */}
          </BlockStack>
        </Box>
      </Accordion>

      {/* 5) Prepaid and Prepay labels */}
      {/* <Accordion
        title="Prepaid and Prepay labels"
        open={accordionOpen === "prepaid-labels"}
        onToggle={() => handleAccordionToggle("prepaid-labels")}
      >
        <Box paddingBlockStart="400" paddingBlockEnd={"400"}>
          <BlockStack gap="300">
            <LabelledTextField
              id="prepaidSaveBadgeText"
              label="Prepaid save badge text"
              value={data.prepaidSaveBadgeText}
              onChange={setLF("prepaidSaveBadgeText")}
              description="How discount appears in prepaid save badges."
              variables={["{{selectedDiscountPercentage}}"]}
            />
            <LabelledTextField
              id="prepaidLabelText"
              label="Prepaid Label text"
              value={data.prepaidLabelText}
              onChange={setLF("prepaidLabelText")}
            />
            <LabelledTextField
              id="selectedPrepaidPlanPriceText"
              label="Selected Prepaid Selling Plan Price Text"
              value={data.selectedPrepaidPlanPriceText}
              onChange={setLF("selectedPrepaidPlanPriceText")}
              variables={["{{totalPrice}}"]}
            />
            <LabelledTextField
              id="prepayPlanLabelText"
              label="Prepay Selling plan label Text"
              value={data.prepayPlanLabelText}
              onChange={setLF("prepayPlanLabelText")}
            />
          </BlockStack>
        </Box>
      </Accordion> */}

      {/* 6) Subscription Information Tooltip Content */}
      <Accordion
        title="Subscription Information Tooltip Content"
        open={accordionOpen === "tooltip-content"}
        onToggle={() => handleAccordionToggle("tooltip-content")}
      >
        <Box paddingBlockStart="400" paddingBlockEnd={"400"}>
          <BlockStack gap="300">
            <LabelledTextField
              id="tooltipTitle"
              label="Tooltip Title"
              value={data.tooltipTitle}
              onChange={setLF("tooltipTitle")}
              description="The heading shown at the top of the subscription information tooltip (e.g., 'Subscription Benefits')."
            />
            <LabelledTextField
              id="defaultTooltipDescription"
              label="Default Tooltip Description"
              value={data.defaultTooltipDescription}
              onChange={setLF("defaultTooltipDescription")}
              multiline={4}
              description="Main content explaining subscription benefits to your customers. HTML formatting is supported."
            />
            <LabelledTextField
              id="prepaidPlanTooltip"
              label="Prepaid Plan Description on tooltip"
              value={data.prepaidPlanTooltip}
              onChange={setLF("prepaidPlanTooltip")}
              multiline={3}
              variables={["{{totalPrice}}", "{{prepaidPerDeliveryPrice}}"]}
            />
            <LabelledTextField
              id="discountTierTooltip"
              label="Discount Tier explanation on tooltip"
              value={data.discountTierTooltip}
              onChange={setLF("discountTierTooltip")}
              multiline={3}
              variables={["{{discountOne}}", "{{discountTwo}}"]}
            />
            <LabelledTextField
              id="tooltipCustomization"
              label="Tooltip Description Customization"
              value={data.tooltipCustomization}
              onChange={setLF("tooltipCustomization")}
              multiline={3}
              variables={[
                "{{{defaultTooltipDescription}}}",
                "{{{prepaidDetails}}}",
                "{{{discountDetails}}}",
              ]}
            />
          </BlockStack>
        </Box>
      </Accordion>

      {/* 7) Manage Subscription Labels (Account Page) */}
      {/* <Accordion
        title="Manage Subscription Labels (Account Page)"
        open={accordionOpen === "manage-subscription"}
        onToggle={() => handleAccordionToggle("manage-subscription")}
      >
        <Box paddingBlockStart="400" paddingBlockEnd={"400"}>
          <BlockStack gap="300">
            <LabelledTextField
              id="manageBoxTitle"
              label="Manage Subscription box title (This box will be visible to buyer on order summary page)"
              value={data.manageBoxTitle}
              onChange={setLF("manageBoxTitle")}
            />
            <LabelledTextField
              id="manageBoxDescription"
              label="Manage Subscription box description"
              value={data.manageBoxDescription}
              onChange={setLF("manageBoxDescription")}
            />
            <LabelledTextField
              id="manageBoxButtonText"
              label="Manage Subscription box Button text"
              value={data.manageBoxButtonText}
              onChange={setLF("manageBoxButtonText")}
              variables={["{{customerEmail}}"]}
            />
            <LabelledTextField
              id="manageButtonHTML"
              label="Manage Subscription Button HTML"
              value={data.manageButtonHTML}
              onChange={setLF("manageButtonHTML")}
              multiline={3}
            />
            <LabelledTextField
              id="duplicateValidationMessage"
              label="Duplicate Subscription validation message."
              value={data.duplicateValidationMessage}
              onChange={setLF("duplicateValidationMessage")}
            />
          </BlockStack>
        </Box>
      </Accordion> */}
    </>
  );
}

export default Labels;
