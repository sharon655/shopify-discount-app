import { Box, Button, CalloutCard, Layout, Link, Text } from "@shopify/polaris";
import { ClipboardIcon } from "@shopify/polaris-icons";
import { useCallback } from "react";

function SubscriptionPrice({ data, onChange }: any) {
  const handleCopy = useCallback(async () => {
    const code = `<span class="appstle_stand_alone_price_display_selector" data-product-data="{{ product | json | escape }}" style="display:none;">x</span>`;
    await navigator.clipboard.writeText(code);
    shopify.toast.show("Copied!");
  }, []);

  return (
    <Layout>
      <Layout.Section>
        <Box paddingBlockStart={"200"}>
          <CalloutCard
            title="Subscription Price Display"
            illustration="/subPrice.svg" // replace with your proper image
            primaryAction={{ content: "Chat with us", url: "#" }}
          >
            <Text as="p" variant="bodyMd">
              <strong>
                Show &quot;Subscribe & Save&quot; prices everywhere!
              </strong>{" "}
              Display subscription discounts on collection pages, homepage,
              search results, and any product grid to boost conversions by up to
              40%. When customers see subscription savings upfront, they&apos;re
              more likely to subscribe. Add this snippet wherever you display
              products:
            </Text>

            {/* Code Snippet with Copy Button */}
            <Box paddingBlockStart={"200"}>
              <div className="flex justify-between">
                <code style={{ fontSize: "0.8rem" }}>
                  <span style={{ color: "#d73a49" }}>&lt;span</span>{" "}
                  <span style={{ color: "#6f42c1" }}>class</span>
                  <span style={{ color: "#032f62" }}>=</span>
                  <span style={{ color: "#005cc5" }}>
                    "appstle_stand_alone_price_display_selector"
                  </span>{" "}
                  <span style={{ color: "#6f42c1" }}>data-product-data</span>
                  <span style={{ color: "#032f62" }}>=</span>
                  <span style={{ color: "#005cc5" }}>
                    "{"{{ product | json | escape }}"}"
                  </span>{" "}
                  <span style={{ color: "#6f42c1" }}>style</span>
                  <span style={{ color: "#032f62" }}>=</span>
                  <span style={{ color: "#005cc5" }}>"display:none;"</span>
                  <span style={{ color: "#d73a49" }}>&gt;&lt;/span&gt;</span>
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
              <Text as="span" variant="bodySm" tone="subdued" alignment="start">
                <strong>Features: </strong> ✓ Auto-calculates lowest
                subscription price ✓ Shows &quot;SAVE X%&quot; badges ✓ Replaces
                regular prices ✓ Works with any theme. Available in Business+
                plans. We'll handle the integration for you -{" "}
                <Link>reach out to us</Link>.
              </Text>
            </Box>
          </CalloutCard>
        </Box>
      </Layout.Section>
    </Layout>
  );
}

export default SubscriptionPrice;