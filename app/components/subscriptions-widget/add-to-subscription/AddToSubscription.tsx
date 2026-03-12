import { Badge, Banner, BlockStack, Box, Card, Checkbox, Divider, InlineGrid, InlineStack, Layout, Link, Select, Text, TextField } from "@shopify/polaris";
import { RewardIcon } from "@shopify/polaris-icons";
import React from "react";

function AddToSubscription({data, onChange}: any) {
  const purchaseOptionsConfig = [
    { label: "One-time only", value: "oneTime" },
    { label: "Subscription only", value: "subscription" },
    { label: "Both", value: "both" },
  ];

  const updateField = (field: string) => (value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Layout>
      <Layout.Section>
        <Box paddingBlockStart="200">
          <InlineGrid
            columns={{
              xs: "1fr", // full width on mobile
              md: ["oneThird", "twoThirds"], // split from tablet upwards
            }}
            gap="400"
          >
            {/* LEFT HEADER */}
            <Box paddingBlockStart={"400"}>
              <Text variant="headingMd" as="h2">
                Add to Subscription Feature
              </Text>
            </Box>

            {/* RIGHT CARD */}
            <Card>
              <InlineStack gap={"200"}>
                <Text variant="headingMd" as="h2">
                  What is Add to Subscription Feature?
                </Text>
                <Badge tone="info" icon={RewardIcon}>
                  ENTERPRISE+
                </Badge>
              </InlineStack>

              <Box paddingBlockStart={"400"}>
                <Text as="span" variant="bodyMd">
                  Boost customer convenience and increase order value! This
                  feature lets your existing subscribers instantly add any
                  product to their upcoming subscription delivery with just one
                  click. No login hassles, no duplicate shipping fees, no
                  separate orders – customers can seamlessly expand their
                  subscriptions while shopping, leading to higher retention and
                  increased revenue per customer.{" "}
                  <Link removeUnderline>Learn more.</Link>
                </Text>
              </Box>

              <Box paddingBlockStart="400">
                <Banner tone="info" onDismiss={() => {}}>
                  <Text as="span" variant="bodyMd">
                    Note: This feature can also be purchased as an add-on with
                    any plan for $200/month.
                  </Text>
                </Banner>
              </Box>

              <Box paddingBlockStart="400" paddingInlineStart={"400"}>
                <Box paddingBlockEnd={"400"}>
                  <Checkbox
                    checked={data.enableAddToSub}
                    onChange={updateField("enableAddToSub")}
                    disabled
                    label={
                      <InlineStack gap="100" align="center">
                        <Box
                          as="span"
                          // borderBlockEndWidth="025"
                          // borderStyle="dashed"
                          // borderColor="border-hover"
                          // paddingBlockEnd="025"
                        >
                          Enable Add to Subscription Feature
                        </Box>
                        {/* <Icon source={InfoIcon} tone="subdued" /> */}
                      </InlineStack>
                    }
                    helpText={
                      <Text as="span" variant="bodySm" tone="subdued">
                        <Link>Upgrade</Link> your plan to enable this feature.
                      </Text>
                    }
                  />
                </Box>
                <Box paddingBlockEnd={"400"}>
                  <Checkbox
                    checked={data.enableAddToSub}
                    onChange={updateField("enableAddToSub")}
                    disabled
                    label={
                      <InlineStack gap="100" align="center">
                        <Box
                          as="span"
                          // borderBlockEndWidth="025"
                          // borderStyle="dashed"
                          // borderColor="border-hover"
                          // paddingBlockEnd="025"
                        >
                          Display Add to Subscription Button for Not Logged In
                          User
                        </Box>
                        {/* <Icon source={InfoIcon} tone="subdued" /> */}
                      </InlineStack>
                    }
                    helpText={
                      <Text as="span" variant="bodySm" tone="subdued">
                        <Link>Upgrade</Link> your plan to enable this feature.
                      </Text>
                    }
                  />
                </Box>
                <Box paddingBlockEnd={"400"}>
                  <Checkbox
                    checked={data.enableAddToSub}
                    onChange={updateField("enableAddToSub")}
                    disabled
                    label={
                      <InlineStack gap="100" align="center">
                        <Box
                          as="span"
                          // borderBlockEndWidth="025"
                          // borderStyle="dashed"
                          // borderColor="border-hover"
                          // paddingBlockEnd="025"
                        >
                          Show add to subcription button only on subscription
                          product
                        </Box>
                        {/* <Icon source={InfoIcon} tone="subdued" /> */}
                      </InlineStack>
                    }
                    helpText={
                      <Text as="span" variant="bodySm" tone="subdued">
                        <Link>Upgrade</Link> your plan to enable this feature.
                      </Text>
                    }
                  />
                </Box>
              </Box>
            </Card>
          </InlineGrid>
        </Box>
      </Layout.Section>

      {/* LABELS CONFIG */}
      <Layout.Section>
        <Divider />
        <Box paddingBlockStart={"400"}>
          <InlineGrid
            columns={{
              xs: "1fr", // full width on mobile
              md: ["oneThird", "twoThirds"], // split from tablet upwards
            }}
            gap={"400"}
          >
            <Box paddingBlockStart={"400"}>
              <Text variant="headingMd" as="h2">
                Add to Subscription Labels
              </Text>
            </Box>
            <Card>
              <BlockStack gap={"400"}>
                <TextField
                  label="Add to existing subscription button text"
                  value={data.buttonText}
                  onChange={updateField("buttonText")}
                  autoComplete="off"
                />
                <TextField
                  label="Add to existing subscription tooltip text"
                  value={data.tooltipText}
                  onChange={updateField("tooltipText")}
                  autoComplete="off"
                />
                <TextField
                  label="Add to existing subscription processing text"
                  value={data.processingText}
                  onChange={updateField("processingText")}
                  autoComplete="off"
                />
                <TextField
                  label="Add to existing subscription success text"
                  value={data.successText}
                  onChange={updateField("successText")}
                  autoComplete="off"
                />
                <TextField
                  label="Add to existing subscription error text"
                  value={data.errorText}
                  onChange={updateField("errorText")}
                  autoComplete="off"
                />
              </BlockStack>
            </Card>
          </InlineGrid>
        </Box>
      </Layout.Section>

      <Layout.Section>
        <Divider />
        <Box paddingBlockStart={"400"}>
          <InlineGrid
            columns={{
              xs: "1fr", // full width on mobile
              md: ["oneThird", "twoThirds"], // split from tablet upwards
            }}
            gap={"400"}
          >
            <Box paddingBlockStart={"400"}>
              <Text variant="headingMd" as="h2">
                Labels (Customer Portal)
              </Text>
            </Box>
            <Card>
              <BlockStack gap={"400"}>
                <TextField
                  label="Add To Subscription Title"
                  value={data.addToSubTitle}
                  onChange={updateField("addToSubTitle")}
                  autoComplete="off"
                />
                <TextField
                  label="Add to Subscription product added success message"
                  value={data.successMsg}
                  onChange={updateField("successMsg")}
                  autoComplete="off"
                />
                <TextField
                  label="Add to order Label text"
                  value={data.orderLabelText}
                  onChange={updateField("orderLabelText")}
                  autoComplete="off"
                />
                <Select
                  label="Show Purchase Options"
                  options={purchaseOptionsConfig}
                  value={data.purchaseOptions}
                  onChange={updateField("purchaseOptions")}
                />
              </BlockStack>
            </Card>
          </InlineGrid>
        </Box>
      </Layout.Section>
    </Layout>
  );
}

export default AddToSubscription;