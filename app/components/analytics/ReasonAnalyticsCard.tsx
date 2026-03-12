import React from "react";
import { Card, Tooltip, IndexTable, Text } from "@shopify/polaris";
import DateRangePicker from "./DateRangePicker";

interface ReasonData {
  reason: string;
  count: number;
}

interface ReasonAnalyticsCardProps {
  title: string;
  tooltipContent: string;
  hasDateButton: boolean;
  activeDateRange?: any;
  setPopoverActive?: (active: boolean) => void;
  ranges?: any[];
  popoverActive?: boolean;
  setActiveDateRange?: (range: any) => void;
  inputValues?: { since?: string; until?: string };
  setInputValues?: React.Dispatch<React.SetStateAction<{ since?: string; until?: string }>>;
  month?: number;
  year?: number;
  setDate?: React.Dispatch<React.SetStateAction<{ month: number; year: number }>>;
  mdDown?: boolean;
  lgUp?: boolean;
  data: ReasonData[];
}

const ReasonAnalyticsCard: React.FC<ReasonAnalyticsCardProps> = ({
  title,
  tooltipContent,
  hasDateButton,
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
  data,
}) => {
  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Tooltip
          content={tooltipContent}
          hasUnderline
          zIndexOverride={500}
          width="wide"
        >
          <span style={{ fontWeight: "700" }}>{title}</span>
        </Tooltip>
        {hasDateButton && activeDateRange && setPopoverActive && ranges && popoverActive !== undefined && setActiveDateRange && inputValues && setInputValues && month !== undefined && year !== undefined && setDate && mdDown !== undefined && lgUp !== undefined && (
          <DateRangePicker
            ranges={ranges}
            popoverActive={popoverActive}
            setPopoverActive={setPopoverActive}
            activeDateRange={activeDateRange}
            setActiveDateRange={setActiveDateRange}
            inputValues={inputValues}
            setInputValues={setInputValues}
            month={month}
            year={year}
            setDate={setDate}
            mdDown={mdDown}
            lgUp={lgUp}
          />
        )}
      </div>
      {data.length === 0 ? (
        <Text as="p" variant="bodyMd" alignment="center">
          No sufficient data available
        </Text>
      ) : (
        <IndexTable
          resourceName={{ singular: "reason", plural: "reasons" }}
          itemCount={data.length}
          headings={[{ title: "Reason" }, { title: "Count" }]}
          selectable={false}
        >
          {data.map((item, index) => (
            <IndexTable.Row
              id={item.reason}
              key={item.reason}
              position={index}
            >
              <IndexTable.Cell>{item.reason}</IndexTable.Cell>
              <IndexTable.Cell>{item.count}</IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>
      )}
    </Card>
  );
};

export default ReasonAnalyticsCard;