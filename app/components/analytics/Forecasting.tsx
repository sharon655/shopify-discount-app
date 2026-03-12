import React from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Tooltip,
  Box,
  Button,
  Badge,
  Text,
  Popover,
  TextField,
  Spinner,
  OptionList,
  IndexTable,
} from "@shopify/polaris";
import DateRangePicker from "./DateRangePicker";

function Forecasting({
  forecastingDateRange,
  setForecastingDateRange,
  forecastingPopoverActive,
  setForecastingPopoverActive,
  forecastingInputValues,
  setForecastingInputValues,
  forecastingMonth,
  setForecastingMonth,
  searchValue,
  setSearchValue,
  suggestions,
  setSuggestions,
  loading,
  setLoading,
  showSuggestions,
  setShowSuggestions,
  filteredData,
  ranges,
  mdDown,
  lgUp,
}: {
  forecastingDateRange: any;
  setForecastingDateRange: (range: any) => void;
  forecastingPopoverActive: boolean;
  setForecastingPopoverActive: (active: boolean) => void;
  forecastingInputValues: { since?: string; until?: string };
  setForecastingInputValues: React.Dispatch<
    React.SetStateAction<{ since?: string; until?: string }>
  >;
  forecastingMonth: { month: number; year: number };
  setForecastingMonth: React.Dispatch<
    React.SetStateAction<{ month: number; year: number }>
  >;
  searchValue: string;
  setSearchValue: (value: string) => void;
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  filteredData: any[];
  ranges: any[];
  mdDown: boolean;
  lgUp: boolean;
}) {
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value.length > 0) {
      setLoading(true);
      // Simulate API call for suggestions
      setTimeout(() => {
        const allProducts = [
          "Product A",
          "Product B",
          "Product C",
          "Product D",
        ];
        const filteredSuggestions = allProducts.filter((product) =>
          product.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        setLoading(false);
        setShowSuggestions(filteredSuggestions.length > 0);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
  };

  return (
    <Card>
      <BlockStack>
        {/* Header */}
        <InlineStack gap="200" align="space-between" blockAlign="center">
          <Box>
            <Tooltip
              content="Forecasts the expected quantity of products needed for upcoming recurring orders in the next 7, 30, 90, and 365 days. These numbers are calculated based on your currently active subscriptions and their scheduled upcoming orders from today's date, regardless of the historical date range selected for other analytics. It does not include prepaid one-time subscription products."
              hasUnderline
              zIndexOverride={500}
              width="wide"
            >
              <span style={{ fontWeight: "700" }}>
                Product Delivery Forecasting
              </span>
            </Tooltip>
          </Box>
          <InlineStack gap="200">
            <DateRangePicker
              ranges={ranges}
              popoverActive={forecastingPopoverActive}
              setPopoverActive={setForecastingPopoverActive}
              activeDateRange={forecastingDateRange}
              setActiveDateRange={setForecastingDateRange}
              inputValues={forecastingInputValues}
              setInputValues={setForecastingInputValues}
              month={forecastingMonth.month}
              year={forecastingMonth.year}
              setDate={setForecastingMonth}
              mdDown={mdDown}
              lgUp={lgUp}
            />
            <Button variant="primary">Export</Button>
          </InlineStack>
        </InlineStack>

        {/* Note */}
        <Box paddingBlockStart="200">
          <InlineStack gap="200" blockAlign="center">
            <i>
              <Badge tone="info">Note</Badge>
            </i>
            <Text as="p" variant="bodySm">
              Prepaid one-time Subscriptions Products are not included in the
              Product Delivery Forecasting.
            </Text>
          </InlineStack>
        </Box>

        {/* Search */}
        <Box paddingBlockStart="400">
          <Popover
            active={showSuggestions}
            activator={
              <TextField
                label="Search by product or variant name"
                labelHidden
                placeholder="Search by product or variant name"
                value={searchValue}
                onChange={handleSearchChange}
                autoComplete="off"
              />
            }
            onClose={() => setShowSuggestions(false)}
          >
            <Popover.Pane>
              {loading ? (
                <Box padding="400">
                  <InlineStack align="center">
                    <Spinner size="small" />
                    <Text as="span" variant="bodySm">
                      Loading...
                    </Text>
                  </InlineStack>
                </Box>
              ) : (
                <OptionList
                  options={suggestions.map((suggestion) => ({
                    value: suggestion,
                    label: suggestion,
                  }))}
                  selected={[]}
                  onChange={(selected) => handleSuggestionSelect(selected[0])}
                />
              )}
            </Popover.Pane>
          </Popover>
        </Box>

        {/* Table */}
        <IndexTable
          resourceName={{ singular: "item", plural: "items" }}
          itemCount={filteredData.length}
          headings={[
            { title: "Product" },
            { title: "Variant" },
            { title: "Delivery Date" },
            { title: "Quantity" },
          ]}
          selectable={false}
          emptyState={
            <BlockStack align="center" gap="300">
              <InlineStack align="center" blockAlign="center">
                <img src={"/search.svg"} alt="Search Icon" />
              </InlineStack>
              <Text as="h2" variant="headingLg" alignment="center">
                No Items found
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
                Try changing the filters or search term
              </Text>
            </BlockStack>
          }
        >
          {filteredData.map((item, index) => (
            <IndexTable.Row
              id={item.id.toString()}
              key={item.id}
              position={index}
            >
              <IndexTable.Cell>{item.product}</IndexTable.Cell>
              <IndexTable.Cell>{item.variant}</IndexTable.Cell>
              <IndexTable.Cell>{item.deliveryDate}</IndexTable.Cell>
              <IndexTable.Cell>{item.quantity}</IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>
      </BlockStack>
    </Card>
  );
}

export default Forecasting;