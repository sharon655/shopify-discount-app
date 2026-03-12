import React from "react";
import { Box, BlockStack } from "@shopify/polaris";
import CohortHeatmap from "./CohortHeatmap";
import ReasonAnalyticsCard from "./ReasonAnalyticsCard";

interface ReasonData {
  reason: string;
  count: number;
}

function Cohort({
  activeDateRange,
  setPopoverActive,
  ranges,
  popoverActive,
  setActiveDateRange,
  inputValues,
  setInputValues,
  month,
  year,
  setDate,
  mdDown,
  lgUp,
}: {
  activeDateRange: any;
  setPopoverActive: (active: boolean) => void;
  ranges: any[];
  popoverActive: boolean;
  setActiveDateRange: (range: any) => void;
  inputValues: { since?: string; until?: string };
  setInputValues: React.Dispatch<React.SetStateAction<{ since?: string; until?: string }>>;
  month: number;
  year: number;
  setDate: React.Dispatch<React.SetStateAction<{ month: number; year: number }>>;
  mdDown: boolean;
  lgUp: boolean;
}) {
  // Mock data, empty for now
  const cancellationData: ReasonData[] = [];
  const pauseData: ReasonData[] = [];

  return (
    <Box paddingBlockStart={"200"}>
      <BlockStack gap="400">
        <CohortHeatmap />
        <ReasonAnalyticsCard
          title="Subscription cancellation reason analytics"
          tooltipContent="This chart displays the distribution of reasons provided by customers for canceling their subscriptions within the selected date range. Each segment represents a cancellation reason and its corresponding count."
          hasDateButton={true}
          activeDateRange={activeDateRange}
          setPopoverActive={setPopoverActive}
          ranges={ranges}
          popoverActive={popoverActive}
          setActiveDateRange={setActiveDateRange}
          inputValues={inputValues}
          setInputValues={setInputValues}
          month={month}
          year={year}
          setDate={setDate}
          mdDown={mdDown}
          lgUp={lgUp}
          data={cancellationData}
        />
        <ReasonAnalyticsCard
          title="Subscription pause reason analytics"
          tooltipContent="This chart displays the distribution of reasons provided by customers for pausing their subscriptions within the selected date range. Each segment represents a pause reason and its corresponding count."
          hasDateButton={false}
          data={pauseData}
        />
      </BlockStack>
      <Box paddingBlockEnd={"400"}/>
    </Box>
  );
}

export default Cohort;