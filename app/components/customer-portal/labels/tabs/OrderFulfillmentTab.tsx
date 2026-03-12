import { BlockStack, Box, Text } from "@shopify/polaris";
import LabeledTextField from "./LabeledTextField";
import {
  orderNavigationConfig,
  orderUpdateMessagesConfig,
  nextOrderDetailsConfig,
  nextOrderDateConfig,
  skipNextOrderConfig,
  fulfillmentStatusConfig,
  fulfillmentStatusContConfig,
  upcomingOrdersChangesConfig,
  upcomingOrdersChangesContConfig,
  orderProcessingConfig,
  manualBillingConfig,
} from "../../../../utils/customer-portal/order-fulfillment";

function OrderFulfillmentTab({
  data,
  onChange,
}: {
  data: Record<string, string>;
  onChange: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
}) {
  return (
    <Box>
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {orderNavigationConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {orderNavigationConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
                label={field.label}
                hasInfo={field.hasInfo}
                value={data[field.key]}
                onChange={(value: string) =>
                  onChange((prev) => ({ ...prev, [field.key]: value }))
                }
              />
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {orderUpdateMessagesConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {orderUpdateMessagesConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
                label={field.label}
                hasInfo={field.hasInfo}
                value={data[field.key]}
                onChange={(value: string) =>
                  onChange((prev) => ({ ...prev, [field.key]: value }))
                }
              />
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {nextOrderDetailsConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {nextOrderDetailsConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
                label={field.label}
                hasInfo={field.hasInfo}
                value={data[field.key]}
                onChange={(value: string) =>
                  onChange((prev) => ({ ...prev, [field.key]: value }))
                }
              />
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {nextOrderDateConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {nextOrderDateConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
                label={field.label}
                hasInfo={field.hasInfo}
                value={data[field.key]}
                onChange={(value: string) =>
                  onChange((prev) => ({ ...prev, [field.key]: value }))
                }
              />
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {skipNextOrderConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {skipNextOrderConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
                label={field.label}
                hasInfo={field.hasInfo}
                value={data[field.key]}
                onChange={(value: string) =>
                  onChange((prev) => ({ ...prev, [field.key]: value }))
                }
              />
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {fulfillmentStatusConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {fulfillmentStatusConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
                label={field.label}
                hasInfo={field.hasInfo}
                value={data[field.key]}
                onChange={(value: string) =>
                  onChange((prev) => ({ ...prev, [field.key]: value }))
                }
              />
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {fulfillmentStatusContConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {fulfillmentStatusContConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
                label={field.label}
                hasInfo={field.hasInfo}
                value={data[field.key]}
                onChange={(value: string) =>
                  onChange((prev) => ({ ...prev, [field.key]: value }))
                }
              />
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {upcomingOrdersChangesConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {upcomingOrdersChangesConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
                label={field.label}
                hasInfo={field.hasInfo}
                value={data[field.key]}
                onChange={(value: string) =>
                  onChange((prev) => ({ ...prev, [field.key]: value }))
                }
              />
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {upcomingOrdersChangesContConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {upcomingOrdersChangesContConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
                label={field.label}
                hasInfo={field.hasInfo}
                value={data[field.key]}
                onChange={(value: string) =>
                  onChange((prev) => ({ ...prev, [field.key]: value }))
                }
              />
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {orderProcessingConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {orderProcessingConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
                label={field.label}
                hasInfo={field.hasInfo}
                value={data[field.key]}
                onChange={(value: string) =>
                  onChange((prev) => ({ ...prev, [field.key]: value }))
                }
              />
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {manualBillingConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {manualBillingConfig.fields.map((field) => (
              <BlockStack gap="100" key={field.key}>
                <LabeledTextField
                  label={field.label}
                  hasInfo={field.hasInfo}
                  value={data[field.key]}
                  onChange={(value: string) =>
                    onChange((prev) => ({
                      ...prev,
                      [field.key]: value,
                    }))
                  }
                />
                {field.description && (
                  <Text variant="bodyMd" as="p" tone="subdued">
                    {field.description}
                  </Text>
                )}
              </BlockStack>
            ))}
          </BlockStack>
        </Box>
      </Box>
    </Box>
  );
}

export default OrderFulfillmentTab;