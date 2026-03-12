import {
  BlockStack,
  Box,
  Button,
  Checkbox,
  InlineStack,
  Text,
  TextField,
  Tooltip,
} from "@shopify/polaris";
import { ResetIcon } from "@shopify/polaris-icons";
import ColorField from "./ColorField";

function CustomizationField({
  label,
  tooltip,
  type,
  value,
  onChange,
  suffix,
  helpText,
}: {
  label: string;
  tooltip: string;
  type: "checkbox" | "number" | "color";
  value: any;
  onChange: (v: any) => void;
  suffix?: string;
  helpText?: string;
}) {
  const resetToEmpty = () => onChange(""); // 🔑 parent decides what to do with empty

  return (
    <div>
      {type === "checkbox" && (
        <InlineStack align="space-between" blockAlign="center">
          <Checkbox
            checked={value}
            onChange={onChange}
            label={
              <Tooltip content={tooltip}>
                <Box
                  as="span"
                  borderBlockEndWidth="025"
                  borderStyle="dashed"
                  borderColor="border-hover"
                  paddingBlockEnd="025"
                >
                  {label}
                </Box>
              </Tooltip>
            }
          />
          <Tooltip content="Reset">
            <Button
              size="micro"
              variant="tertiary"
              tone="critical"
              icon={ResetIcon}
              onClick={resetToEmpty}
            />
          </Tooltip>
        </InlineStack>
      )}

      {(type === "number" || type === "color") && (
        <BlockStack gap="100">
          <InlineStack align="space-between" blockAlign="center">
            <Tooltip content={tooltip}>
              <Box
                as="span"
                borderBlockEndWidth="025"
                borderStyle="dashed"
                borderColor="border-hover"
                paddingBlockEnd="025"
              >
                {label}
              </Box>
            </Tooltip>
          </InlineStack>

          {type === "number" && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1 }}>
                <TextField
                  labelHidden
                  label={label}
                  suffix={suffix}
                  value={value ?? ""}
                  autoComplete="off"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(val) => {
                    if (val === "" || /^\d+$/.test(val)) {
                      if (val !== value) {
                        onChange(val);
                      }
                    }
                    // else do nothing for invalid inputs
                  }}
                />
              </div>

              <Tooltip content="Reset">
                <Button
                  size="micro"
                  variant="tertiary"
                  tone="critical"
                  icon={ResetIcon}
                  onClick={resetToEmpty}
                />
              </Tooltip>
            </div>
          )}

          {helpText && (
            <Text as="p" variant="bodyMd" tone="subdued">
              {helpText}
            </Text>
          )}

          {type === "color" && (
            <ColorField label={label} value={value} onChange={onChange} />
          )}
        </BlockStack>
      )}
    </div>
  );
}

export default CustomizationField;
