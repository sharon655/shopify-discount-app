import { BlockStack, Box, Text } from "@shopify/polaris";
import LabeledTextField from "./LabeledTextField";
import {
  orderFrequencyConfig,
  productManagementConfig,
  productActionConfig,
  skipAndQueueConfig,
  skipAndQueueActionsConfig,
  deletionConfirmationConfig,
  pauseAndResumeConfig,
  cancellationConfig,
  cancellationContConfig,
  cancellationReasonsConfig,
  freezeSubscriptionConfig,
  cycleManagementConfig,
  bannersConfig,
} from "../../../../utils/customer-portal/subscription-management-data";

function SubscriptionManagementTab({
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
          {orderFrequencyConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {orderFrequencyConfig.fields.map((field) => (
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
          {productManagementConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {productManagementConfig.fields.map((field) => (
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
          {productActionConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {productActionConfig.fields.map((field) => (
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
          {skipAndQueueConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {skipAndQueueConfig.fields.map((field) => (
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
          {skipAndQueueActionsConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {skipAndQueueActionsConfig.fields.map((field) => (
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
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {deletionConfirmationConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {deletionConfirmationConfig.fields.map((field) => (
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
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {pauseAndResumeConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {pauseAndResumeConfig.fields.map((field) => (
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
          {cancellationConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {cancellationConfig.fields.map((field) => (
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
          {cancellationContConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {cancellationContConfig.fields.map((field) => (
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
          {cancellationReasonsConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {cancellationReasonsConfig.fields.map((field) => (
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
          {freezeSubscriptionConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {freezeSubscriptionConfig.fields.map((field) => (
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
          {cycleManagementConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {cycleManagementConfig.fields.map((field) => (
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
      <Box borderBlockStartWidth="025" borderColor="border" />
      <Box padding="400">
        <Text variant="headingSm" as="h3">
          {bannersConfig.title}
        </Text>
        <Box paddingBlockStart={"400"}>
          <BlockStack gap="400">
            {bannersConfig.fields.map((field) => (
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

export default SubscriptionManagementTab;