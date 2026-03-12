import React from "react";
import { BlockStack, InlineGrid, Box } from "@shopify/polaris";
import AnalyticsCard from "./AnalyticsCard";
import SubscriptionChartCard from "./SubscriptionChartCard";

function Subscriptions({
  activeDateRange,
  setPopoverActive,
}: {
  activeDateRange: any;
  setPopoverActive: (active: boolean) => void;
}) {
  // Sample data for charts
  const chartData1 = [
    { name: "Jan", totalsubscription: 2 },
    { name: "Feb", totalsubscription: 4 },
    { name: "Mar", totalsubscription: 6 },
    { name: "Apr", totalsubscription: 8 },
    { name: "May", totalsubscription: 10 },
  ];

  const chartData2 = [
    { name: "7 days", subscribed: 3, unsubscribed: 1 },
    { name: "30 days", subscribed: 5, unsubscribed: 2 },
  ];

  const chartData3 = [
    { name: "Jan", totalsubscription: 1 },
    { name: "Feb", totalsubscription: 3 },
    { name: "Mar", totalsubscription: 5 },
    { name: "Apr", totalsubscription: 7 },
    { name: "May", totalsubscription: 9 },
  ];

  const selectOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  return (
    <>
      <BlockStack gap="400">
        {/* Analytics Cards */}
        <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
          <AnalyticsCard
            tooltipContent="The total count of subscriptions that were created within the selected date range and remain active as of the current moment the report is generated. Subscriptions that were active in the period but have since been paused or cancelled are not included."
            title="Total Active Subscriptions"
            leftButton="date"
            value="0"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The count of unique subscription contracts that transitioned from a 'paused' or 'canceled' status to 'active' within the selected date range. This includes reactivations from the merchant portal, customer portal, and bulk automations. Each unique contract is counted once as reactivated within the period, regardless of multiple reactivations."
            title="Total Re-Activated Subscriptions"
            leftButton="date"
            value="0"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The total count of subscriptions that were paused within the selected date range and remain in a 'paused' status as of the current moment the report is generated. Subscriptions that were paused in the period but have since been reactivated or canceled are not included."
            title="Total Paused Subscriptions"
            leftButton="date"
            value="0"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The total count of subscriptions that were canceled within the selected date range and remain in a 'canceled' status as of the current moment the report is generated. Subscriptions that were canceled in the period but have since been reactivated are not included."
            title="Total Cancelled Subscriptions"
            leftButton="date"
            value="0"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The number of subscriptions that were created and subsequently canceled on the exact same day within the selected date range, and remain in a 'canceled' status as of the current moment the report is generated. Subscriptions that were reactivated after a same-day cancellation are not included."
            title="Total Same Day Cancellations"
            leftButton="date"
            value="0"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The total count of successful recurring orders that were processed within the selected date range."
            title="Total Recurring Orders"
            leftButton="date"
            value="0"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The total count of recurring order attempts that failed payment processing within the selected date range."
            title="Total Failed Recurring Orders"
            leftButton="date"
            value="0"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The total count of recurring orders that were skipped due to reasons such as manual skipping by a customer or merchant, dunning management (failed payment retries), or inventory management issues within the selected date range."
            title="Total Skipped Orders"
            leftButton="date"
            value="0"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The percentage change in new subscriptions created this period compared to the previous one. You gained 0 new subscriptions in this period, compared to 0 in the prior period."
            title="Growth Rate (%)"
            leftButton="date"
            value="Not enough data"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The percentage of subscriptions that were active at the start of the selected period and were subsequently canceled during that same period. There were no active subscriptions at the start of this period to calculate churn."
            title="Churn Rate"
            leftButton="date"
            value="0.0%"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The percentage of successful recurring order attempts out of all attempts within the selected date range. There were no payment attempts in this period."
            title="Approval Rate"
            leftButton="date"
            value="0.0%"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
          <AnalyticsCard
            tooltipContent="The percentage of new subscriptions from this period that are already inactive (paused or canceled). No new subscriptions were created in this period."
            title="Cancellation Rate"
            leftButton="date"
            value="0.0%"
            activeDateRange={activeDateRange}
            setPopoverActive={setPopoverActive}
          />
        </InlineGrid>

        {/* Chart Cards */}
        <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
          <SubscriptionChartCard
            title="subscription per month"
            tooltipContent="This chart displays the total number of new subscription contracts that were created each day, week, or month (based on your selection) within the chosen date range."
            showSelect={true}
            selectOptions={selectOptions}
            defaultSelectValue="monthly"
            chartData={chartData1}
            yAxisValues={[0, 5, 10]}
            legends={["Total Subscription"]}
          />
          <SubscriptionChartCard
            title="Subscribed vs. Unsubscribed"
            tooltipContent="This chart compares the volume of newly created subscriptions that are currently active ('Subscribed') against those that were created and subsequently canceled within the past 7, 30, and 90 days ('Unsubscribed'). 'Unsubscribed' specifically refers to subscriptions created and canceled within the same respective period, and which remain in a canceled status."
            showSelect={false}
            chartData={chartData2}
            yAxisValues={[0, 5, 10]}
            xAxisValues={["7 days", "30 days"]}
            legends={["Subscribed", "Unsubscribed"]}
          />
        </InlineGrid>
        <SubscriptionChartCard
          title="Total Active Subscriptions Over Time"
          tooltipContent="This chart illustrates the cumulative number of active subscriptions over time. For each day in the selected range, it shows the total count of subscriptions that were active on that specific day, providing a snapshot of your active subscriber base trend."
          showSelect={false}
          chartData={chartData3}
          yAxisValues={[0, 5, 10]}
          legends={["Total Subscription"]}
        />
        <Box paddingBlockEnd={"400"} />
      </BlockStack>
    </>
  );
}

export default Subscriptions;