import {
  Box,
  BlockStack,
  Text,
  TextField,
  Card,
  FormLayout,
  Checkbox,
  InlineGrid,
  Layout,
} from "@shopify/polaris";

interface MagicLinkCustomizationProps {
  data: Record<string, string>;
  onChange: (
    updater: (prev: Record<string, string>) => Record<string, string>
  ) => void;
}

export default function MagicLinkCustomization({
  data,
  onChange,
}: MagicLinkCustomizationProps) {
  return (
    <>
      <Layout>
        <Layout.Section>
          <InlineGrid
            columns={{
              xs: "1fr",
              md: ["oneThird", "twoThirds"],
            }}
            gap="400"
          >
            <Box paddingBlockStart={"500"}>
              <Text variant="headingMd" as="h2">
                Permissions
              </Text>
            </Box>
            <Card>
              <Box>
                <BlockStack gap="400">
                  <Checkbox
                    label="Allow customers to manage their subscriptions without login"
                    checked={data.allowCustomersNoLogin === "true"}
                    onChange={(checked) =>
                      onChange((prev) => ({
                        ...prev,
                        allowCustomersNoLogin: checked ? "true" : "false",
                      }))
                    }
                  />
                </BlockStack>
              </Box>
            </Card>
          </InlineGrid>
        </Layout.Section>
        
        <Layout.Section>
          <Box borderBlockStartWidth="025" borderColor="border" />
        </Layout.Section>

        <Layout.Section>
          <InlineGrid
            columns={{
              xs: "1fr",
              md: ["oneThird", "twoThirds"],
            }}
            gap="400"
          >
            <Box paddingBlockStart={"500"}>
              <Text variant="headingMd" as="h2">
                Magic Link Email Labels
              </Text>
            </Box>
            <Card>
              <Box>
                <BlockStack gap="400">
                  <FormLayout>
                    <TextField
                      label="Retrieve Magic Link Text"
                      value={data.retrieveMagicLinkText}
                      onChange={(value) =>
                        onChange((prev) => ({
                          ...prev,
                          retrieveMagicLinkText: value,
                        }))
                      }
                      autoComplete="off"
                    />

                    <TextField
                      label="Send Email Address Text"
                      value={data.sendEmailAddressText}
                      onChange={(value) =>
                        onChange((prev) => ({
                          ...prev,
                          sendEmailAddressText: value,
                        }))
                      }
                      autoComplete="off"
                    />

                    <TextField
                      label="Email Address Textbox Placeholder Text"
                      value={data.emailAddressPlaceholderText}
                      onChange={(value) =>
                        onChange((prev) => ({
                          ...prev,
                          emailAddressPlaceholderText: value,
                        }))
                      }
                      autoComplete="off"
                    />

                    <TextField
                      label="Email Triggered Successfully Text"
                      value={data.emailTriggeredSuccessText}
                      onChange={(value) =>
                        onChange((prev) => ({
                          ...prev,
                          emailTriggeredSuccessText: value,
                        }))
                      }
                      autoComplete="off"
                    />

                    <TextField
                      label="Customer Email Not Exist Message Text"
                      value={data.customerEmailNotExistText}
                      onChange={(value) =>
                        onChange((prev) => ({
                          ...prev,
                          customerEmailNotExistText: value,
                        }))
                      }
                      autoComplete="off"
                    />

                    <TextField
                      label="Customer Email Is Disabled Message Text"
                      value={data.customerEmailDisabledText}
                      onChange={(value) =>
                        onChange((prev) => ({
                          ...prev,
                          customerEmailDisabledText: value,
                        }))
                      }
                      autoComplete="off"
                    />

                    <TextField
                      label="Please Enter Valid Email Text"
                      value={data.pleaseEnterValidEmailText}
                      onChange={(value) =>
                        onChange((prev) => ({
                          ...prev,
                          pleaseEnterValidEmailText: value,
                        }))
                      }
                      autoComplete="off"
                    />
                  </FormLayout>
                </BlockStack>
              </Box>
            </Card>
          </InlineGrid>
        </Layout.Section>
      </Layout>
    </>
  );
}
