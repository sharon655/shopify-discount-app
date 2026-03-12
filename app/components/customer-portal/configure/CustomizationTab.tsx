import {
  Box,
  BlockStack,
  Text,
  TextField,
  Card,
  FormLayout,
  Checkbox,
  InlineGrid,
  Tooltip,
} from "@shopify/polaris";
import { Link } from "@remix-run/react";
import ColorField from "../../subscriptions-widget/ColorField";
import { customizationSections } from "../../../utils/customer-portal/customization-data";

interface CustomizationTabProps {
  data: Record<string, string>;
  onChange: (
    updater: (prev: Record<string, string>) => Record<string, string>
  ) => void;
}

const renderDescription = (description?: string) => {
  if (!description || description === "none") return null;

  const lines = description.split("\n");
  return (
    <BlockStack gap="100">
      {lines.map((line, index) => {
        const parts = line.split(/(BUSINESS|this link|Upgrade)/);
        return (
          <Text key={index} as="p" variant="bodyMd" tone="subdued">
            {parts.map((part, partIndex) => {
              if (part === "BUSINESS" || part === "Upgrade") {
                return (
                  <Link
                    key={partIndex}
                    to="/app/billing"
                    style={{ color: "inherit", textDecoration: "underline" }}
                  >
                    {part}
                  </Link>
                );
              } else if (part === "this link") {
                return (
                  <a
                    key={partIndex}
                    href="https://date-fns.org/v2.25.0/docs/format"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "underline" }}
                  >
                    {part}
                  </a>
                );
              } else {
                return part;
              }
            })}
          </Text>
        );
      })}
    </BlockStack>
  );
};

export default function CustomizationTab({
  data,
  onChange,
}: CustomizationTabProps) {

  const renderFieldsInRows = (fields: any[]) => {
    const rows: any[][] = [];
    for (let i = 0; i < fields.length; i += 2) {
      rows.push(fields.slice(i, i + 2));
    }

    return (
      <BlockStack gap="300">
        {rows.map((row, rowIndex) => (
          <InlineGrid key={rowIndex} columns={{ xs: "1fr", md: ["oneHalf", "oneHalf"] }} gap="400">
            {row.map((field) => {
              const labelWithTooltip =
                field.fieldTooltipContent &&
                field.fieldTooltipContent !== "none" ? (
                  <Tooltip
                    content={field.fieldTooltipContent}
                    hasUnderline
                    zIndexOverride={500}
                    width="wide"
                  >
                    <span>{field.fieldLabel}</span>
                  </Tooltip>
                ) : (
                  <span>{field.fieldLabel}</span>
                );

              const fieldComponent = (() => {
                switch (field.fieldType) {
                  case "checkbox":
                    return (
                      <div style={{ marginBottom: "8px" }}>
                        <Checkbox
                          label={labelWithTooltip}
                          checked={data[field.key] === "true"}
                          disabled={field.disable}
                          onChange={(checked) =>
                            onChange((prev) => ({
                              ...prev,
                              [field.key]: checked ? "true" : "false",
                            }))
                          }
                        />
                        {renderDescription(field.fieldDescription) && (
                          <div style={{ paddingLeft: "24px" }}>
                            {renderDescription(field.fieldDescription)}
                          </div>
                        )}
                      </div>
                    );
                  case "text input":
                    return (
                      <BlockStack gap="100">
                        <TextField
                          label={labelWithTooltip}
                          value={data[field.key] || ""}
                          onChange={(value) =>
                            onChange((prev) => ({
                              ...prev,
                              [field.key]: value,
                            }))
                          }
                          placeholder={field.fieldPlaceholder}
                          disabled={field.disable}
                          autoComplete="off"
                          suffix={field.suffix}
                        />
                        {renderDescription(field.fieldDescription)}
                      </BlockStack>
                    );
                  case "color":
                    return (
                      <BlockStack gap="100">
                        {field.fieldTooltipContent &&
                        field.fieldTooltipContent !== "none" ? (
                          <Tooltip
                            content={field.fieldTooltipContent}
                            hasUnderline
                            zIndexOverride={500}
                            width="wide"
                          >
                            <Text as="p" variant="bodyMd">
                              {field.fieldLabel}
                            </Text>
                          </Tooltip>
                        ) : (
                          <Text as="p" variant="bodyMd">
                            {field.fieldLabel}
                          </Text>
                        )}
                        <ColorField
                          label={field.fieldLabel}
                          value={data[field.key] || ""}
                          onChange={(value) =>
                            onChange((prev) => ({
                              ...prev,
                              [field.key]: value,
                            }))
                          }
                        />
                        {renderDescription(field.fieldDescription)}
                      </BlockStack>
                    );
                  default:
                    return null;
                }
              })();

              return <div key={field.key}>{fieldComponent}</div>;
            })}
            {row.length === 1 && <div />} {/* Empty div for odd number of fields */}
          </InlineGrid>
        ))}
      </BlockStack>
    );
  };

  return (
    <>
      {customizationSections.map((section, sectionIndex) => (
        <Box key={section.title}>
          <InlineGrid
            columns={{
              xs: "1fr",
              md: ["oneThird", "twoThirds"],
            }}
            gap="400"
          >
            <Box paddingBlockStart={"600"} paddingBlockEnd={"400"}>
              <Text variant="headingMd" as="h2">
                {section.title.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < section.title.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </Text>
              {section.description && (
                <Box paddingBlockStart={"200"}>
                  <Text variant="bodyMd" tone="subdued" as="p">
                    {section.description}
                  </Text>
                </Box>
              )}
            </Box>
            <Card>
              <Box>
                <BlockStack gap="200">
                  <FormLayout>
                    {renderFieldsInRows(section.fields)}
                  </FormLayout>
                </BlockStack>
              </Box>
            </Card>
          </InlineGrid>
          {sectionIndex < customizationSections.length - 1 && (
            <Box paddingBlockStart="400" paddingBlockEnd="400">
              <Box borderBlockStartWidth="025" borderColor="border" />
            </Box>
          )}
        </Box>
      ))}
    </>
  );
}