import { Box, Button, CalloutCard, Layout, Link, Text } from "@shopify/polaris";
import { ClipboardIcon } from "@shopify/polaris-icons";
import { useCallback } from "react";

function ManageSubscriptionButton({ data, onChange }: any) {
  const handleCopy = useCallback(async () => {
    const code = `<div id="appstle-subscription-manage-subscription-button-placeholder"></div>`;
    await navigator.clipboard.writeText(code);
    shopify.toast.show("Copied!");
  }, []);

  return (
    <Layout>
      <Layout.Section>
        <Box>
          <CalloutCard
            title="Manage Subscription Button"
            illustration="/subPrice.svg" // You might want to use a different image
            primaryAction={{ content: "Chat with us", url: "#" }}
          >
            <Box>
              <Text as="p" variant="bodyMd">
                By default, the Manage Subscription Button will automatically be
                added to your theme. However, if your theme is not supported,
                you can add the Manage Subscription Button using the Shopify
                block approach.
              </Text>
            </Box>

            <Box paddingBlockStart={"200"}>
              <Text as="p" variant="bodyMd">
                If you would like more control over the button's positioning,
                please use the following snippet and add it to your theme code.
              </Text>
            </Box>

            <Box paddingBlockStart={"200"}>
              <Text as="p" variant="bodyMd">
                Manage Subscription Button HTML code snippet
              </Text>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginTop: "4px", padding: "4px" }}>
                <code style={{ fontSize: "0.85rem" }}>
                  <span style={{ color: "#d73a49" }}>&lt;div</span>{" "}
                  <span style={{ color: "#6f42c1" }}>id</span>
                  <span style={{ color: "#032f62" }}>=</span>
                  <span style={{ color: "#005cc5" }}>
                    "appstle-subscription-manage-subscription-button-placeholder"
                  </span>
                  <span style={{ color: "#d73a49" }}>&gt;&lt;/div&gt;</span>
                </code>
                <div>
                  <Button
                    icon={ClipboardIcon}
                    variant="tertiary"
                    onClick={handleCopy}
                  />
                </div>
              </div>
            </Box>

            <Box paddingBlockStart={"200"}>
              <Text as="p" variant="bodyMd">
                Checkout our{" "}
                <Link url="#" external>
                  documentation
                </Link>{" "}
                that describes both approaches
              </Text>
              <Box paddingBlockStart={"200"}>
                <Text as="p" variant="bodyMd">
                  If you'd rather add the Manage Subscription Button as a menu
                  item, that will be visible at the top of your store at all
                  times. You can follow the approach described in our article{" "}
                  <Link url="#" external>
                    here
                  </Link>
                  .
                </Text>
              </Box>
            </Box>
          </CalloutCard>
        </Box>
      </Layout.Section>
    </Layout>
  );
}

export default ManageSubscriptionButton;
