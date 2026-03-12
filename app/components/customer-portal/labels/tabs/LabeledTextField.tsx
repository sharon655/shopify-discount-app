import { TextField, InlineStack, Icon } from "@shopify/polaris";
import { InfoIcon } from "@shopify/polaris-icons";

const LabeledTextField = ({
  label,
  hasInfo,
  value,
  onChange,
}: {
  label: string;
  hasInfo: boolean;
  value: string;
  onChange: (val: string) => void;
}) => (
  <TextField
    label={
      hasInfo ? (
        <InlineStack gap="100">
          <span>{label}</span>
          <Icon source={InfoIcon} tone="subdued" />
        </InlineStack>
      ) : (
        label
      )
    }
    value={value}
    onChange={onChange}
    autoComplete="off"
    clearButton
    onClearButtonClick={() => onChange("")}
  />
);

export default LabeledTextField;