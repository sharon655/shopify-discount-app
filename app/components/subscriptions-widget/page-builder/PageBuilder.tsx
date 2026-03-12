import { Box, Button, CalloutCard, Layout, Link, Text } from "@shopify/polaris";
import { ClipboardIcon } from "@shopify/polaris-icons";
import { useCallback } from "react";

function PageBuilder({data, onChange}: any) {
  const handleCopy = useCallback(async () => {
    const code = `<span class="appstle_stand_alone_selector" data-product-handle="{{ product.handle }}" style="display:none;"></span>`;
    await navigator.clipboard.writeText(code);

    shopify.toast.show("Copied!");
  }, []);

  return (
    <Layout>
      {/* Page Builder Integration */}
      <Layout.Section>
        <Box paddingBlockStart={"200"}>
          <CalloutCard
            title="Page Builder Integration"
            illustration="/PageBuilders.png"
            primaryAction={{ content: "Chat with us", url: "#" }}
          >
            <Text as="p" variant="bodyMd">
              <strong>Works seamlessly with all major page builders!</strong>{" "}
              Appstle&apos;s subscription widget integrates perfectly with
              PageFly, GemPages, Shogun, LayoutHub, and 50+ other page builders.
              Our flexible standalone selector system ensures compatibility with
              any custom layout or third-party app. Get help with integration or
              use our simple snippet for manual setup.
            </Text>
          </CalloutCard>
        </Box>
      </Layout.Section>

      {/* Home & Collection Page Widget */}
      <Layout.Section>
        <CalloutCard
          title="Home & Collection Page Widget"
          illustration="/HomeCollectionpage.png"
          primaryAction={{ content: "Chat with us", url: "#" }}
        >
          <Text as="p" variant="bodyMd">
            <strong>
              Display subscription options anywhere in your store!
            </strong>{" "}
            Show &quot;Subscribe & Save&quot; options on collection pages,
            homepage featured products, quick view modals, and more. This
            powerful feature lets customers discover subscription savings before
            reaching product pages, increasing conversion by up to 40%.
            We&apos;ll configure it for you, or use the snippet below for DIY
            setup following our <Link>documentation</Link>.
          </Text>

          {/* Code Snippet with Copy Button */}
          <Box padding={"200"} paddingBlockStart={"400"}>
            <div className="flex justify-between">
              <code style={{ fontSize: "0.8rem" }}>
                <span style={{ color: "#d73a49" }}>&lt;span</span>{" "}
                <span style={{ color: "#6f42c1" }}>class</span>
                <span style={{ color: "#032f62" }}>=</span>
                <span style={{ color: "#005cc5" }}>
                  "appstle_stand_alone_selector"
                </span>{" "}
                <span style={{ color: "#6f42c1" }}>data-product-handle</span>
                <span style={{ color: "#032f62" }}>=</span>
                <span style={{ color: "#005cc5" }}>
                  "{"{{ product.handle }}"}
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

          <Text as="span" variant="bodySm" tone="subdued" alignment="end">
            Available only in the Business and above plan.
          </Text>
        </CalloutCard>
      </Layout.Section>
    </Layout>
  );
}

export default PageBuilder;