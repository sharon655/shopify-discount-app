import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Checkbox,
  Icon,
  InlineGrid,
  InlineStack,
  Layout,
  Link,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { InfoIcon } from "@shopify/polaris-icons";

function CartWidget({ data, onChange }: any) {
  const forceRefreshOptions = [
    { label: "Disable", value: "disable" },
    { label: "Enable", value: "enable" },
  ];

  const updateField = (field: string) => (value: any) => {
    onChange({ ...data, [field]: value });
  };

  console.log("🚀 ~ data:", data);

  return (
    <>
      <Layout>
        <Layout.Section>
          <Box paddingBlockStart="200">
            <InlineGrid
              columns={{
                xs: "1fr",
                md: ["oneThird", "twoThirds"],
              }}
              gap="400"
            >
              <Box paddingBlockStart={"500"}>
                <Text variant="headingSm" as="h2">
                  Cart Widget Settings
                </Text>
              </Box>
              <Card>
                <InlineStack align="space-between">
                  <Text variant="headingMd" as="h2">
                    What is Cart Widget Feature?
                  </Text>
                </InlineStack>

                <BlockStack gap="200">
                  <Box paddingBlockStart={"200"}>
                    <Text as="span" variant="bodyMd" fontWeight="bold">
                      Transform your cart into a subscription powerhouse!{" "}
                    </Text>
                    <Text as="span" variant="bodyMd">
                      The Cart Widget seamlessly converts one-time shoppers into
                      loyal subscribers at the most critical moment - checkout.
                      With just one click, customers can upgrade any product to
                      a recurring subscription, unlock exclusive discounts, and
                      customize delivery schedules without ever leaving their
                      cart.
                    </Text>
                  </Box>
                </BlockStack>

                <Box paddingBlockStart={"200"}>
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Key Benefits:
                  </Text>

                  <Box paddingBlockStart={"100"}>
                    <Text as="p" variant="bodyMd">
                      ✓ Boost conversion by 30%+ with frictionless subscription
                      upgrades
                    </Text>
                    <Text as="p" variant="bodyMd">
                      ✓ Increase customer lifetime value by 2-3x
                    </Text>
                    <Text as="p" variant="bodyMd">
                      ✓ Reduce cart abandonment with inline subscription options
                    </Text>
                    <Text as="p" variant="bodyMd">
                      ✓ Display dynamic discounts that incentivize recurring
                      purchases
                    </Text>
                    <Text as="p" variant="bodyMd">
                      ✓ Let customers control delivery frequency instantly
                    </Text>
                    <Text as="p" variant="bodyMd">
                      ✓ Works seamlessly across all devices and themes
                    </Text>
                  </Box>

                  <Box paddingBlockStart={"200"}>
                    <Text as="p" variant="bodyMd">
                      This powerful widget captures impulse subscription
                      decisions right when purchase intent is highest, turning
                      browsers into subscribers and dramatically increasing your
                      recurring revenue stream.{" "}
                      <Link removeUnderline>Learn more.</Link>
                    </Text>
                  </Box>
                </Box>

                <Box paddingBlockStart="400">
                  <Checkbox
                    checked={data.enableWidget}
                    onChange={updateField("enableWidget")}
                    disabled
                    label={
                      <InlineStack gap="100" align="center">
                        <Box
                          as="span"
                          borderBlockEndWidth="025"
                          borderStyle="dashed"
                          borderColor="border-hover"
                          paddingBlockEnd="025"
                        >
                          Enable Cart Widget Feature
                        </Box>
                        <Icon source={InfoIcon} tone="subdued" />
                      </InlineStack>
                    }
                    helpText={
                      <Text as="span" variant="bodySm" tone="subdued">
                        Upgrade your plan to <Link>BUSINESS</Link> to enable
                        this feature.
                      </Text>
                    }
                  />
                </Box>

                {data.showBanner && (
                  <Box paddingBlockStart="400">
                    <Banner
                      tone="info"
                      onDismiss={() => updateField("showBanner")(false)}
                    >
                      <Text as="span" variant="bodyMd">
                        By default, Shopify shows the subscription plan name and
                        price on the cart page under each product. However, this
                        might not work on older themes. You can manually display
                        the selling plan name and price using the data explained
                        in <Button variant="plain">this article</Button> or{" "}
                        <Button variant="plain">contact us</Button> for help
                        integrating the widget into your theme.
                      </Text>
                    </Banner>
                  </Box>
                )}
              </Card>
            </InlineGrid>
          </Box>
        </Layout.Section>

        <Layout.Section>
          <Box>
            <InlineGrid
              columns={{
                xs: "1fr", // full width on mobile
                md: ["oneThird", "twoThirds"], // split from tablet upwards
              }}
              gap={"400"}
            >
              <Box paddingBlockStart={"500"}>
                <Text variant="headingSm" as="h2">
                  Cart Widget Labels
                </Text>
              </Box>

              <Card>
                <Box>
                  <BlockStack gap="400">
                    <BlockStack gap="400">
                      <TextField
                        label="One-time Purchase Text"
                        value={data.oneTimePurchaseText}
                        onChange={updateField("oneTimePurchaseText")}
                        autoComplete="off"
                      />

                      <TextField
                        label={
                          <InlineStack gap="100" align="center">
                            <span>Subscription Option Initial Text</span>
                            <Icon source={InfoIcon} tone="subdued" />
                          </InlineStack>
                        }
                        value={data.subscriptionInitialText}
                        onChange={updateField("subscriptionInitialText")}
                        autoComplete="off"
                      />

                      <TextField
                        label={
                          <InlineStack gap="100" align="center">
                            <span>Subscription Option Selected Text</span>
                            <Icon source={InfoIcon} tone="subdued" />
                          </InlineStack>
                        }
                        value={data.subscriptionSelectedText}
                        onChange={updateField("subscriptionSelectedText")}
                        autoComplete="off"
                      />

                      <TextField
                        label={
                          <InlineStack gap="100" align="center">
                            <span>Select Delivery Option Text</span>
                            <Icon source={InfoIcon} tone="subdued" />
                          </InlineStack>
                        }
                        value={data.selectDeliveryText}
                        onChange={updateField("selectDeliveryText")}
                        autoComplete="off"
                      />

                      <TextField
                        label={
                          <InlineStack gap="100" align="center">
                            <span>Delivery Frequency Text</span>
                            <Icon source={InfoIcon} tone="subdued" />
                          </InlineStack>
                        }
                        value={data.deliveryFrequencyText}
                        onChange={updateField("deliveryFrequencyText")}
                        autoComplete="off"
                      />

                      <Select
                        label="Force Refresh on Cart Page"
                        options={forceRefreshOptions}
                        value={data.forceRefresh}
                        onChange={updateField("forceRefresh")}
                      />

                      <TextField
                        label="Frequency Text (combined cart widget)"
                        value={data.frequencyText}
                        onChange={updateField("frequencyText")}
                        autoComplete="off"
                      />
                    </BlockStack>
                  </BlockStack>
                </Box>
              </Card>
            </InlineGrid>
          </Box>
        </Layout.Section>
      </Layout>
    </>
  );
}

export default CartWidget;
