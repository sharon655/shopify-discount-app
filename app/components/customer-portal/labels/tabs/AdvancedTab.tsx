import { BlockStack, Box, Text } from "@shopify/polaris";
import LabeledTextField from "./LabeledTextField";
import {
  advancedLabelConfig,
} from "../../../../utils/customer-portal/advanced";

function AdvancedTab({
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
          {advancedLabelConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {advancedLabelConfig.fields.map((field) => (
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

export default AdvancedTab;