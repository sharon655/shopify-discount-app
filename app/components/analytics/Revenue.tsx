import React from "react";
import {
  BlockStack,
  InlineGrid,
  Card,
  InlineStack,
  Tooltip,
  Box,
  Select,
  Text,
  IndexTable,
  Button,
} from "@shopify/polaris";
import AnalyticsCard from "./AnalyticsCard";
import SubscriptionChartCard from "./SubscriptionChartCard";

function Revenue({
  activeDateRange,
  setPopoverActive,
  revenueSelectValue,
  setRevenueSelectValue,
}: {
  activeDateRange: any;
  setPopoverActive: (active: boolean) => void;
  revenueSelectValue: string;
  setRevenueSelectValue: (value: string) => void;
}) {
  // Sample data for charts
  const chartData1 = [
    { name: "7 days", estimatedrevenue: 5, historicalrevenue: 3 },
    { name: "30 days", estimatedrevenue: 8, historicalrevenue: 6 },
  ];

  const chartData2 = [
    { name: "Jan", orderamount: 2 },
    { name: "Feb", orderamount: 4 },
    { name: "Mar", orderamount: 6 },
    { name: "Apr", orderamount: 8 },
    { name: "May", orderamount: 10 },
  ];

  const selectOptions = [
    { label: "Next day", value: "next day" },
    { label: "Next 7 days", value: "next 7 days" },
    { label: "Next 30 days", value: "next 30 days" },
    { label: "Next 60 days", value: "next 60 days" },
    { label: "Next 90 days", value: "next 90 days" },
    { label: "Next 120 days", value: "next 120 days" },
    { label: "Next 365 days", value: "next 365 days" },
  ];

  const selectOptions2 = [
    { label: "Monthly", value: "monthly" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
  ];

  return (
    <>
      <BlockStack gap="400">
        <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
          <AnalyticsCard
            tooltipContent="The total gross revenue generated from all successful orders (both initial subscription orders and subsequent recurring orders) processed within the selected date range."
            title="Total Order Revenue"
            leftButton="date"
            value="Rs. 0.00"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The total gross revenue generated specifically from the initial orders of new subscription contracts that were placed within the selected date range."
            title="First Time Order Revenue"
            leftButton="date"
            value="Rs. 0.00"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The total gross revenue generated from all successful recurring orders (subsequent orders after the initial subscription order) that were processed within the selected date range."
            title="Recurring Order Revenue"
            leftButton="date"
            value="Rs. 0.00"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The average monetary value of all successful orders (both initial and recurring) placed within the selected date range. Calculated as: (Total Order Revenue (First + Recurring) / Total Count of Orders (First + Recurring))."
            title="Average Order Value"
            leftButton="date"
            value="Rs. 0.00"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The month-over-month percentage change in your total recurring order revenue, indicating the growth trend of your subscription revenue. Calculated as: ((Current Month Recurring Revenue - Previous Month Recurring Revenue) / Previous Month Recurring Revenue) * 100."
            title="Revenue Growth Rate"
            leftButton={null}
            value="Not enough data"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          {/* Custom card for Next Day Estimated Revenue with select */}
          <Card>
            <InlineStack gap="200" align="space-between" blockAlign="center">
              <Tooltip
                content="The estimated revenue expected from queued recurring orders of currently active subscriptions for the selected future period (e.g., next day, next 7 days). This forecast is based on the current contract terms and scheduled billing attempts."
                hasUnderline
                zIndexOverride={500}
                width="wide"
              >
                <span style={{ fontWeight: "700" }}>
                  Next Day Estimated Revenue
                </span>
              </Tooltip>
              <Select
                label="Select period"
                labelHidden
                options={selectOptions}
                value={revenueSelectValue}
                onChange={setRevenueSelectValue}
              />
            </InlineStack>
            <Box paddingBlockStart={"200"}>
              <Text as="h1" variant="headingLg">
                Rs. 0.00
              </Text>
            </Box>
          </Card>
        </InlineGrid>

        {/* Charts */}
        <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
          <SubscriptionChartCard
            title="Historical Vs Estimated Revenue"
            tooltipContent="This chart compares historical revenue against estimated revenue for the selected periods."
            showSelect={false}
            chartData={chartData1}
            yAxisValues={[0, 5, 10]}
            xAxisValues={["7 days", "30 days"]}
            legends={["Estimated Revenue", "Historical Revenue"]}
          />
          <SubscriptionChartCard
            title="Order Amount Per Month"
            tooltipContent="This chart displays the order amount per month."
            showSelect={true}
            selectOptions={selectOptions2}
            defaultSelectValue="monthly"
            chartData={chartData2}
            yAxisValues={[0, 5, 10]}
            legends={["Order Amount"]}
          />
        </InlineGrid>

        {/* Product Wise Revenue Breakdown */}
        <Card>
          <BlockStack>
            {/* Header */}
            <InlineStack gap="200" align="space-between" blockAlign="center">
              <Box>
                <Tooltip
                  content="This component shows the revenue breakdown by product."
                  hasUnderline
                  zIndexOverride={500}
                  width="wide"
                >
                  <span style={{ fontWeight: "700" }}>
                    Product Wise Revenue Breakdown
                  </span>
                </Tooltip>
              </Box>
              <Button variant="primary">Export</Button>
            </InlineStack>

            {/* Table */}
            <IndexTable
              resourceName={{ singular: "item", plural: "items" }}
              itemCount={0}
              headings={[{ title: "Product" }, { title: "Revenue" }]}
              selectable={false}
              emptyState={
                <BlockStack align="center" gap="300">
                  <InlineStack align="center" blockAlign="center">
                    <img src={"/search.svg"} alt="Search Icon" />
                  </InlineStack>
                  <Text as="h2" variant="headingLg" alignment="center">
                    No Items found
                  </Text>
                  <Text
                    as="p"
                    variant="bodyMd"
                    tone="subdued"
                    alignment="center"
                  >
                    Try changing the filters or search term
                  </Text>
                </BlockStack>
              }
            >
              {/* Empty table */}
            </IndexTable>
          </BlockStack>
        </Card>
        <Box paddingBlockEnd={"400"} />
      </BlockStack>
    </>
  );
}

export default Revenue;