import { BlockStack, Box, Text } from "@shopify/polaris";
import LabeledTextField from "./LabeledTextField";
import {
  sortingLabelsConfig,
} from "../../../../utils/customer-portal/sorting";

function SortingTab({
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
          {sortingLabelsConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {sortingLabelsConfig.fields.map((field) => (
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

export default SortingTab;