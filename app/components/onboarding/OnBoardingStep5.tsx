import { Box, InlineGrid, BlockStack, Text, List, Button, InlineStack } from "@shopify/polaris";

function OnBoardingStep5() {
  return (
    <Box paddingInlineStart={"300"} paddingBlockEnd={"400"}>
      <InlineGrid columns={{ sm: 1, lg: 2 }} gap="400" alignItems="start">
        {/* LEFT SIDE */}
        <BlockStack gap="400">
          {/* Heading */}
          <InlineStack>
            <Text as="h5" variant="headingLg" fontWeight="bold">
              <i>
                This adds a convenient 'Manage Subscription' link to your
                store's Account, Orders, and Order Status pages
              </i>
            </Text>
          </InlineStack>

          {/* Description + numbered steps */}
          <BlockStack gap="400">
            <Text as="h4" variant="headingSm">
              To integrate the Manage Subscription Button extension, please
              follow the steps below.
            </Text>

            <List type="number">
              <List.Item>
                Click on "Embed Manage Subscription Button" button below.
              </List.Item>
              <List.Item>
                It will redirect you to Shopify Theme Setting.
              </List.Item>
              <List.Item>
                Find the <b>Manage Subscription Button</b> extension and add it
                to the required pages.
              </List.Item>
              <List.Item>Click on "Save" button.</List.Item>
            </List>
          </BlockStack>

          {/* Button */}
          <Box paddingInlineStart={"200"} paddingBlockStart={"100"}>
            <Button
              variant="secondary"
              onClick={() => {
                window.open(
                  "/admin/themes/current/editor?context=apps",
                  "_blank"
                );
              }}
              fullWidth={false}
            >
              Embed Manage Subscription Button
            </Button>
          </Box>
        </BlockStack>

        {/* RIGHT SIDE - Plain HTML */}
        <div
          style={{
            minHeight: "500px",
            backgroundColor: "rgb(247, 247, 247)",
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
              src="https://appstle-assets.s3.us-west-1.amazonaws.com/subscription/Manage+Subs+Button.gif"
              alt="Manage Subscription Button Preview"
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

export default OnBoardingStep5;