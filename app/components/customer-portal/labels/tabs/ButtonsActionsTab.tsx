import { BlockStack, Box, Text } from "@shopify/polaris";
import LabeledTextField from "./LabeledTextField";
import {
  navigationButtons,
  formActionsConfig,
  formActionsContConfig,
  acceptAndConfirmButtons,
} from "../../../../utils/customer-portal/buttons-actions";

function ButtonsActionsTab({
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
          {navigationButtons.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {navigationButtons.fields.map((field) => (
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
          {formActionsConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {formActionsConfig.fields.map((field) => (
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
          {formActionsContConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {formActionsContConfig.fields.map((field) => (
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
          {acceptAndConfirmButtons.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {acceptAndConfirmButtons.fields.map((field) => (
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

export default ButtonsActionsTab;