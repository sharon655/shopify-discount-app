import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  InlineStack,
  Layout,
  Link,
  Text,
} from "@shopify/polaris";

function CheckoutExtension({ data, onChange }: any) {
  return (
    <Layout>
      <Layout.Section>
        <Box paddingBlockStart="200">
          <Card>
            <BlockStack gap="400">
              {/* Content with overlay */}
              <Box position="relative">
                <BlockStack gap="400">
                  {/* Header */}
                  <InlineStack gap="200" align="start">
                    <Text as="h2" variant="headingSm" fontWeight="bold">
                      Checkout Widget
                    </Text>
                    <Badge tone="info">Shopify Plus+</Badge>
                  </InlineStack>

                  {/* Description */}
                  <Text as="p" variant="bodyMd">
                    Add subscription options directly to your checkout page,
                    allowing customers to convert any product to a subscription
                    before completing their purchase.
                  </Text>

                  {/* Key Features */}
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm" fontWeight="bold">
                      <strong>Key Features:</strong>
                    </Text>
                    <BlockStack gap="100">
                      <Text as="p" variant="bodyMd">
                        • <b>Flexible Purchase Options:</b> Customers can toggle
                        between one-time purchase and subscription directly in
                        checkout
                      </Text>
                      <Text as="p" variant="bodyMd">
                        • <b>Delivery Frequency Selection:</b> Display all
                        available subscription plans with customizable delivery
                        frequencies
                      </Text>
                      <Text as="p" variant="bodyMd">
                        • <b>Seamless Integration:</b> Works automatically for
                        products with subscription plans – no additional setup
                        required
                      </Text>
                      <Text as="p" variant="bodyMd">
                        • <b>Real-time Updates:</b> Instant price adjustments
                        when customers switch between purchase options
                      </Text>
                    </BlockStack>
                  </BlockStack>

                  {/* How it works */}
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm" fontWeight="bold">
                      <strong>How it works:</strong>
                    </Text>
                    <Text as="p" variant="bodyMd">
                      When enabled, a subscription selector appears below each
                      eligible product in the checkout. Customers can easily
                      upgrade to a subscription or change delivery frequency
                      without leaving the checkout flow, reducing friction and
                      increasing subscription conversions.
                    </Text>
                  </BlockStack>

                  {/* Footer button */}
                  <InlineStack gap="200" align="start">
                    <Button variant="secondary">Chat with us</Button>
                  </InlineStack>
                </BlockStack>

                {/* Overlay over the content */}
                <div
                  style={{
                    position: "absolute",
                    zIndex: 30,
                    width: "100%",
                    height: "100%",
                    background: "white",
                    top: 0,
                    left: 0,
                    opacity: 0.5,
                    cursor: "auto",
                    borderRadius: "var(--p-border-radius-2xl)",
                  }}
                ></div>
              </Box>

              {/* Upgrade message (not covered by overlay) */}
              <Text as="span" tone="subdued" variant="bodySm">
                Upgrade your plan to <Link>BUSINESS PREMIUM</Link> to enable
                this feature.
              </Text>
            </BlockStack>
          </Card>
        </Box>
      </Layout.Section>
    </Layout>
  );
}

export default CheckoutExtension;
