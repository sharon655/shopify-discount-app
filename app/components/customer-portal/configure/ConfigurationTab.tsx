import {
  Box,
  BlockStack,
  Text,
  TextField,
  Card,
  FormLayout,
  Checkbox,
  InlineGrid,
  Select,
  Tooltip,
  LegacyStack,
  Tag,
  Listbox,
  Combobox,
  AutoSelection,
  Icon,
  Button,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { configurationSections } from "../../../utils/customer-portal/configuration-data";

interface ConfigurationTabProps {
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

export default function ConfigurationTab({
  data,
  onChange,
}: ConfigurationTabProps) {
  const [multiSelectSearch, setMultiSelectSearch] = useState("");
  return (
    <>
      {configurationSections.map((section, sectionIndex) => (
        <Box key={section.title}>
          <InlineGrid
            columns={{
              xs: "1fr",
              md: ["oneThird", "twoThirds"],
            }}
            gap="0"
          >
            <Box paddingBlockStart={"400"} paddingBlockEnd={"400"}>
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
                    {section.fields.map((field) => {
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

                      // Conditional rendering for dependent fields
                      if (field.key === 'filterGroupType' && data['createProductFilter'] !== 'true') {
                        return null;
                      }

                      const fieldComponent = (() => {
                        switch (field.fieldType) {
                          case "checkbox":
                            return (
                              <div>
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
                          case "options - dropdown":
                            const options = field.fieldOptions
                              ? field.fieldOptions.split(", ").map((opt) => ({
                                  label: opt,
                                  value: opt,
                                }))
                              : [];
                            const isFilterGroupType = field.key === 'filterGroupType';
                            return (
                              <BlockStack gap="100">
                                {isFilterGroupType ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                      <Select
                                        label="Filter Group Type"
                                        labelInline
                                        options={options}
                                        value={
                                          data[field.key] ||
                                          (field.fieldValue as string)
                                        }
                                        disabled={field.disable}
                                        onChange={(value) =>
                                          onChange((prev) => ({
                                            ...prev,
                                            [field.key]: value,
                                          }))
                                        }
                                      />
                                    </div>
                                    <Button>Add filter</Button>
                                  </div>
                                ) : (
                                  <Select
                                    label={labelWithTooltip}
                                    options={options}
                                    value={
                                      data[field.key] ||
                                      (field.fieldValue as string)
                                    }
                                    disabled={field.disable}
                                    onChange={(value) =>
                                      onChange((prev) => ({
                                        ...prev,
                                        [field.key]: value,
                                      }))
                                    }
                                  />
                                )}
                                {renderDescription(field.fieldDescription)}
                              </BlockStack>
                            );
                          case "number input":
                            return (
                              <BlockStack gap="100">
                                <TextField
                                  label={labelWithTooltip}
                                  type="number"
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
                          case "multi-select":
                            const days = [
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                            ];
                            const selectedValues = data[field.key] && data[field.key] !== ""
                              ? data[field.key].split(", ")
                              : [];

                            const updateSelection = (selected: string) => {
                              const nextSelected = [...selectedValues];
                              const index = nextSelected.indexOf(selected);
                              if (index > -1) {
                                nextSelected.splice(index, 1);
                              } else {
                                nextSelected.push(selected);
                              }
                              onChange((prev) => ({
                                ...prev,
                                [field.key]: nextSelected.join(", "),
                              }));
                              setMultiSelectSearch("");
                            };

                            const verticalContentMarkup =
                              selectedValues.length > 0 ? (
                                <LegacyStack
                                  spacing="extraTight"
                                  alignment="center"
                                >
                                  {selectedValues.map((tag) => (
                                    <Tag
                                      key={tag}
                                      onRemove={() => updateSelection(tag)}
                                    >
                                      {tag}
                                    </Tag>
                                  ))}
                                </LegacyStack>
                              ) : null;

                            const optionMarkup = days.map((option) => (
                              <Listbox.Option
                                key={option}
                                value={option}
                                selected={selectedValues.includes(option)}
                              >
                                <Listbox.TextOption
                                  selected={selectedValues.includes(option)}
                                >
                                  {option}
                                </Listbox.TextOption>
                              </Listbox.Option>
                            ));

                            const listboxMarkup = (
                              <Listbox
                                autoSelection={AutoSelection.None}
                                onSelect={updateSelection}
                              >
                                {optionMarkup}
                              </Listbox>
                            );

                            return (
                              <BlockStack gap="100">
                                <Combobox
                                  allowMultiple
                                  activator={
                                    <Combobox.TextField
                                      prefix={<Icon source={SearchIcon} />}
                                      autoComplete="off"
                                      label={labelWithTooltip}
                                      value={multiSelectSearch}
                                      verticalContent={verticalContentMarkup}
                                      onChange={setMultiSelectSearch}
                                      disabled={field.disable}
                                    />
                                  }
                                >
                                  {listboxMarkup}
                                </Combobox>
                                {renderDescription(field.fieldDescription)}
                              </BlockStack>
                            );
                          default:
                            return null;
                        }
                      })();

                      return <div key={field.key}>{fieldComponent}</div>;
                    })}
                  </FormLayout>
                </BlockStack>
              </Box>
            </Card>
          </InlineGrid>
          {sectionIndex < configurationSections.length - 1 && (
            <Box paddingBlockStart="400" paddingBlockEnd="400">
              <Box borderBlockStartWidth="025" borderColor="border" />
            </Box>
          )}
        </Box>
      ))}
    </>
  );
}
