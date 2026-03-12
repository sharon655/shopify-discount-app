import { Box, Button, ColorPicker, hexToRgb, hsbToRgb, InlineStack, Popover, rgbToHex, rgbToHsb, Text, TextField, Tooltip } from "@shopify/polaris";
import { RefreshIcon, ResetIcon, XSmallIcon } from "@shopify/polaris-icons";
import { useState, useEffect } from "react";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  defaultValue?: string;
  placeholder?: string;
}

function ColorField({
  label,
  value,
  onChange,
  placeholder = "No color set",
}: ColorFieldProps) {
  const [popoverActive, setPopoverActive] = useState(false);
  const [hsb, setHsb] = useState(
    value && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
      ? rgbToHsb(hexToRgb(value))
      : { hue: 0, saturation: 0, brightness: 1 }
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (value && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      setHsb(rgbToHsb(hexToRgb(value)));
    } else {
      setHsb({ hue: 0, saturation: 0, brightness: 1 });
    }
  }, [value]);

  // Sync hidden input for form dirty detection - only after initial load
  useEffect(() => {
    if (!isInitialLoad && value) {
      const input = document.querySelector(`input[name="${label}"]`) as HTMLInputElement;
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    setIsInitialLoad(false);
  }, [value,isInitialLoad]);

  const togglePopover = () => setPopoverActive((prev) => !prev);

  const handleColorChange = (newColor: any) => {
    setHsb(newColor); // keep HSBA locally
    const rgb = hsbToRgb(newColor);
    const hex = rgbToHex(rgb);
    onChange(hex);
  };

  const handleTextFieldChange = (newValue: string) => {
    onChange(newValue); // always pass up

    const validHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (validHex.test(newValue)) {
      const rgb = hexToRgb(newValue);
      const hsbValue = rgbToHsb(rgb);
      setHsb(hsbValue); // update picker if valid
    }
  };

  const handleTextFieldFocus = () => {
    if (!popoverActive) {
      setPopoverActive(true);
    }
  };

  const isValidColor =
    value && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);

  return (
    <Box>
      <Popover
        active={popoverActive}
        activator={
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            {/* Top part: TextField + placeholder */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                // onClick={() => setPopoverActive(true)}
                style={{ cursor: "text" }}
              >
                <TextField
                  labelHidden
                  label={label}
                  name={label}
                  value={value}
                  onChange={handleTextFieldChange}
                  onFocus={handleTextFieldFocus}
                  autoComplete="off"
                  prefix={
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePopover();
                      }}
                      style={{
                        width: "24px",
                        height: "20px",
                        backgroundColor: isValidColor ? value : "#fff",
                        border: isValidColor
                          ? "1px solid #ccc"
                          : "1px dashed #ccc",
                        borderRadius: "3px",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    />
                  }
                />
              </div>
              <Text as="span" variant="bodySm">
                {!value ? placeholder : null}
              </Text>
            </div>

            {/* Bottom row: Reset button aligned right */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "4px",
              }}
            >
              <Tooltip content="Reset to default">
                <Button
                  size="slim"
                  onClick={() => onChange("")}
                  variant="plain"
                  icon={ResetIcon}
                  tone="critical"
                />
              </Tooltip>
            </div>
          </div>
        }
        onClose={togglePopover}
        preferredAlignment="left"
      >
        <Box padding="400">
          <InlineStack align="space-between" blockAlign="center">
            <Text as="span" variant="bodyMd" alignment="center">
              {`${isValidColor ? value : "Select a color"}`}
            </Text>
            <Button
              variant="secondary"
              icon={XSmallIcon}
              onClick={togglePopover}
              accessibilityLabel="Close color picker"
            >
              Close
            </Button>
          </InlineStack>

          <Box paddingBlockStart="300">
            <ColorPicker color={hsb} onChange={handleColorChange} />
          </Box>

          <Box paddingBlockStart="300">
            <InlineStack gap="200">
              <Button
                size="slim"
                onClick={() => onChange("")}
                variant="plain"
                icon={RefreshIcon}
                tone="critical"
              >
                Reset color
              </Button>
            </InlineStack>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}

export default ColorField;