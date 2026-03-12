import { BlockStack, Box, Text } from "@shopify/polaris";
import LabeledTextField from "./LabeledTextField";
import {
  purchaseOptionsLabelsConfig,
  purchaseOptionsActionsConfig,
} from "../../../../utils/customer-portal/purchase-options-data";

function PurchaseOptionsTab({
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
          {purchaseOptionsLabelsConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {purchaseOptionsLabelsConfig.fields.map((field) => (
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
          {purchaseOptionsActionsConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {purchaseOptionsActionsConfig.fields.map((field) => (
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
              </BlockStack>
            ))}
          </BlockStack>
        </Box>
      </Box>
    </Box>
  );
}

export default PurchaseOptionsTab;