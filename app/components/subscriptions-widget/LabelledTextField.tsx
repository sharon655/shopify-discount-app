import { BlockStack, Icon, InlineStack, Text, TextField, Tooltip } from "@shopify/polaris";
import { InfoIcon } from "@shopify/polaris-icons";
import VariablePopover from "./VariablePopover";

function LabelledTextField({
  id,
  label,
  value,
  onChange,
  description,
  variables,
  multiline,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  description?: string;
  variables?: string[];
  multiline?: boolean | number;
  placeholder?: string;
}) {
  const insertVariable = (token: string) => {
    onChange(value ? `${value} ${token}` : token);
  };

  return (
    <BlockStack gap="150">
      <InlineStack align="space-between" blockAlign="center">
        <InlineStack gap="150" blockAlign="center">
          <Text as="p" variant="bodyMd">
            {label}
          </Text>
          {description ? (
            <Tooltip content={description}>
              <Icon source={InfoIcon} tone="subdued" />
            </Tooltip>
          ) : null}
        </InlineStack>

        {variables && variables.length > 0 ? (
          <VariablePopover variables={variables} onInsert={insertVariable} />
        ) : null}
      </InlineStack>

      <TextField
        id={id}
        label={label}
        labelHidden
        autoComplete="off" // fixes your TS error
        value={value}
        onChange={(val) => onChange(val)}
        multiline={multiline}
        placeholder={placeholder}
        helpText={description}
      />
    </BlockStack>
  );
}

export default LabelledTextField;