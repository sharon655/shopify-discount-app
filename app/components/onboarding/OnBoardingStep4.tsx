import { Box, InlineGrid, BlockStack, Text, List, Button, InlineStack } from "@shopify/polaris";

function OnBoardingStep4() {
  return (
    <Box paddingInlineStart={"300"} paddingBlockEnd={"400"}>
      <InlineGrid columns={{ sm: 1, lg: 2 }} gap="400" alignItems="start">
        {/* LEFT SIDE */}
        <BlockStack gap="400">
          {/* Heading */}
          <InlineStack>
            <Text as="h5" variant="headingLg" tone="base">
              <i>Add Appstle to your store theme</i>
            </Text>
          </InlineStack>

          {/* Description + numbered steps */}
          <BlockStack gap="400">
            <Text as="h4" variant="headingSm">
              To integrate the subscription widget, you need to add the Appstle
              Subscription feature as an app embed in your Shopify theme
              settings.
            </Text>

            <List type="number">
              <List.Item>
                Click on "Open Shopify Theme Setting" button below.
              </List.Item>
              <List.Item>
                It will redirect you to Shopify Theme Setting.
              </List.Item>
              <List.Item>
                Click on the "Save" button at the top right to add Appstle
                Subscription to your store.
              </List.Item>
              <List.Item>And then come back to this window.</List.Item>
            </List>
          </BlockStack>

          {/* Button */}
          <Box paddingBlockStart="100" paddingInlineStart={"200"}>
            <Button
              variant="secondary"
              onClick={() => {
                // Replace with real redirect
                window.open(
                  "/admin/themes/current/editor?context=apps",
                  "_blank"
                );
              }}
            >
              Open Shopify Theme Setting
            </Button>
          </Box>

          {/* Note */}
          <Box paddingBlockStart="300" paddingInlineEnd={"300"}>
            <Text as="p" variant="bodyMd">
              We encourage you to do this now, but you can always choose to do
              it later ⏳.
            </Text>
          </Box>
        </BlockStack>

        {/* RIGHT SIDE - Plain HTML */}
        <div
          style={{
            minHeight: "500px",
            borderRadius: "0.5rem",
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            position: "relative",
          }}
        >
          <div
            style={{
              borderRadius: "10px",
              background: "white",
              padding: "25px",
            }}
          >
            <img
              src="https://appstle-assets.s3.us-west-1.amazonaws.com/subscription/App-Embed.gif"
              alt="App Embed Preview"
              style={{
                padding: "10px",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </InlineGrid>
    </Box>
  );
}

export default OnBoardingStep4;