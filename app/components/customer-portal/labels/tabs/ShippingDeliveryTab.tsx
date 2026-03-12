import { BlockStack, Box, Text } from "@shopify/polaris";
import LabeledTextField from "./LabeledTextField";
import {
  shippingAddressConfig,
  shippingAddressContConfig,
  shippingOptionsConfig,
  shippingLabelsConfig,
  shippingActions,
  deliveryLabelsConfig,
  deliveryActions,
} from "../../../../utils/customer-portal/shipping-delivery";

function ShippingDeliveryTab({
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
          {shippingAddressConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {shippingAddressConfig.fields.map((field) => (
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
          {shippingAddressContConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {shippingAddressContConfig.fields.map((field) => (
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
          {shippingOptionsConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {shippingOptionsConfig.fields.map((field) => (
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
          {shippingLabelsConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {shippingLabelsConfig.fields.map((field) => (
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
          {shippingActions.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {shippingActions.fields.map((field) => (
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
          {deliveryLabelsConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {deliveryLabelsConfig.fields.map((field) => (
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
          {deliveryActions.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {deliveryActions.fields.map((field) => (
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
    </Box>
  );
}

export default ShippingDeliveryTab;