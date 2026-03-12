import { BlockStack, Box, Text } from "@shopify/polaris";
import LabeledTextField from "./LabeledTextField";
import {
  productListConfig,
  productSwapConfig,
  productSwapContConfig,
  outOfStockConfig,
  productDetailsConfig,
} from "../../../../utils/customer-portal/product-inventory-data";

function ProductsInventoryTab({
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
          {productListConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {productListConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
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
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {productSwapConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {productSwapConfig.fields.map((field) => (
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
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {productSwapContConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {productSwapContConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
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
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {outOfStockConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {outOfStockConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
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
            ))}
          </BlockStack>
        </Box>
      </Box>
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {productDetailsConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {productDetailsConfig.fields.map((field) => (
              <LabeledTextField
                key={field.key}
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
            ))}
          </BlockStack>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductsInventoryTab;