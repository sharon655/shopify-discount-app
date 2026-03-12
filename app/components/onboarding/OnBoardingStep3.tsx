import { Box, InlineGrid, BlockStack, Text } from "@shopify/polaris";
import { useState } from "react";
import LabelledTextField from "../subscriptions-widget/LabelledTextField";

function OnBoardingStep3() {
  // State for customization fields
  const [purchaseOptionsHeading, setPurchaseOptionsHeading] =
    useState("Purchase Options");
  const [oneTimePurchaseLabel, setOneTimePurchaseLabel] =
    useState("One Time Purchase");
  const [subscriptionPurchaseLabel, setSubscriptionPurchaseLabel] =
    useState("Subscribe and save");
  const [saveBadgeText, setSaveBadgeText] = useState("SAVE 10%");
  const [tooltipTitle, setTooltipTitle] = useState("Subscription detail");

  // Track which option is selected
  const [selectedOption, setSelectedOption] = useState("subscription");

  function replaceVariables(text: string) {
    // Step 1: Replace the first occurrence
    let replaced = text.replace("{{selectedDiscountPercentage}}", "10%");

    // Step 2: Remove extra occurrences
    replaced = replaced.replace(/{{selectedDiscountPercentage}}/g, "");

    // Step 3: Ensure we always have at least "10%"
    if (!replaced.trim()) {
      replaced = "10%";
    }

    return replaced.trim();
  }

  return (
    <Box
      paddingInlineStart={"300"}
      paddingInlineEnd={"300"}
      paddingBlockEnd={"400"}
    >
      {/* Top description */}
      <Box paddingBlockStart={"100"} paddingBlockEnd="400">
        <Text variant="headingMd" as="h2">
          Change how your widget looks and feels. Adjust labels, colors, and
          shapes with ease. Personalize it to match your brand. Find everything
          in Widget {'>'} Customization! 🚀
        </Text>
      </Box>

      <InlineGrid columns={{ sm: 1, lg: 2 }} gap="400" alignItems="start">
        {/* LEFT SIDE (form fields) */}
        <Box
          background="bg-surface"
          borderColor="border"
          borderWidth="025"
          borderRadius="300"
          shadow="100"
          padding="400"
          minHeight="100%"
        >
          <BlockStack gap="400">
            <Text as="h3" variant="headingMd">
              Widget Labels
            </Text>
            <LabelledTextField
              id="purchaseOptionsHeading"
              label="Purchase Options"
              value={purchaseOptionsHeading}
              onChange={setPurchaseOptionsHeading}
            />
            <LabelledTextField
              id="oneTimePurchaseLabel"
              label="One-time Purchase"
              value={oneTimePurchaseLabel}
              onChange={setOneTimePurchaseLabel}
            />
            <LabelledTextField
              id="subscription&Save"
              label="Subscription & Save"
              value={subscriptionPurchaseLabel}
              onChange={setSubscriptionPurchaseLabel}
            />
            <LabelledTextField
              id="saveBadge"
              label="Save"
              value={saveBadgeText}
              onChange={setSaveBadgeText}
              variables={["{{selectedDiscountPercentage}}"]}
            />
            <LabelledTextField
              id="tooltipTitle"
              label="Tooltip Title"
              value={tooltipTitle}
              onChange={setTooltipTitle}
            />
          </BlockStack>
        </Box>

        {/* RIGHT SIDE (widget preview) */}
        <Box
          background="bg-surface"
          borderColor="border"
          borderWidth="025"
          borderRadius="300"
          shadow="100"
          padding="800"
          minHeight="100%"
        >
          <div>
            {/* Heading */}
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "7px",
              }}
            >
              {purchaseOptionsHeading}
            </h2>

            {/* Options */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {/* One-time Purchase */}
              <div
                style={{
                  border: "1px solid #000",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <label
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input
                    type="radio"
                    name="purchaseOption"
                    checked={selectedOption === "oneTime"}
                    onChange={() => setSelectedOption("oneTime")}
                    style={{
                      border: "2px solid #000",
                      borderRadius: "50%",
                      cursor: "pointer",
                      height: "20px",
                      width: "20px",
                      position: "relative",
                      accentColor: "#000",
                    }}
                  />
                  <span style={{ fontWeight: "700" }}>
                    {oneTimePurchaseLabel}
                  </span>
                </label>
                <span style={{ fontWeight: "700" }}>$20</span>
              </div>

              {/* Subscription */}
              <div
                style={{
                  border: "1px solid #000",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="radio"
                      name="purchaseOption"
                      checked={selectedOption === "subscription"}
                      onChange={() => setSelectedOption("subscription")}
                      style={{
                        border: "2px solid #000",
                        borderRadius: "50%",
                        cursor: "pointer",
                        height: "20px",
                        width: "20px",
                        position: "relative",
                        accentColor: "#000",
                      }}
                    />
                    <span style={{ fontWeight: "700" }}>
                      {subscriptionPurchaseLabel}
                    </span>
                    <span
                      style={{
                        alignItems: "center",
                        background: "#000",
                        borderRadius: "10px",
                        color: "#fff",
                        display: "inline-flex",
                        fontSize: "10px",
                        justifyContent: "center",
                        marginLeft: "7px",
                        overflow: "hidden",
                        padding: "1px 8px",
                        position: "relative",
                      }}
                    >
                      {replaceVariables(saveBadgeText)}
                    </span>
                  </label>
                  <span style={{ fontWeight: "700" }}>$18</span>
                </div>

                {/* Show only when subscription is selected */}
                {selectedOption === "subscription" && (
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      marginLeft: "35px",
                      marginTop: "4px",
                    }}
                  >
                    Monthly Subscription
                  </span>
                )}
              </div>
            </div>

            {/* Subscription detail (only show when subscription is selected) */}
            {
              <div>
                <button
                  style={{
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    color: "#000",
                    cursor: "pointer",
                    display: "flex",
                    fontSize: "14px",
                    gap: "8px",
                    marginTop: "16px",
                    padding: "0",
                  }}
                >
                  <span>{tooltipTitle}</span>
                </button>

                <div
                  style={{
                    background: "#e0e0e0",
                    borderRadius: "5px",
                    fontWeight: "700",
                    marginTop: "5px",
                    padding: "5px 10px",
                  }}
                >
                  <div>{"Preview Text"}</div>
                  <div
                    style={{
                      fontSize: "1em",
                      fontWeight: "var(--p-font-weight-regular)",
                      margin: "0",
                    }}
                  >
                    Easily customize labels, descriptions, and other in the
                    widget settings.
                  </div>
                </div>
              </div>
            }

            {/* Add to cart button */}
            <button
              style={{
                background: "#000",
                border: "none",
                color: "#fff",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                padding: "10px",
                marginTop: "16px",
                transition: "all 0.3s ease-in-out",
                width: "100%",
              }}
            >
              Add to cart
            </button>
          </div>
        </Box>
      </InlineGrid>
    </Box>
  );
}

export default OnBoardingStep3;