import React, { useState } from "react";
import { Card, Tooltip, Select } from "@shopify/polaris";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  [key: string]: any;
}

interface SubscriptionChartCardProps {
  title: string;
  tooltipContent: string;
  showSelect: boolean;
  selectOptions?: { label: string; value: string }[];
  defaultSelectValue?: string;
  chartData: ChartData[];
  yAxisValues: number[];
  xAxisValues?: string[];
  legends: string[];
  onSelectChange?: (value: string) => void;
}

const SubscriptionChartCard: React.FC<SubscriptionChartCardProps> = ({
  title,
  tooltipContent,
  showSelect,
  selectOptions = [],
  defaultSelectValue = "",
  chartData,
  yAxisValues,
  xAxisValues,
  legends,
  onSelectChange,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultSelectValue);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    if (onSelectChange) {
      onSelectChange(value);
    }
  };

  const getPeriod = (value: string) => {
    switch (value) {
      case "daily":
        return "day";
      case "weekly":
        return "week";
      case "monthly":
        return "month";
      default:
        return "month";
    }
  };

  const displayTitle = showSelect
    ? title.replace("month", getPeriod(selectedValue))
    : title;

  // Transform data for Recharts LineChart
  const rechartsData = chartData.map((d, index) => {
    const obj: any = { x: xAxisValues ? xAxisValues[index] : index };
    legends.forEach(legend => {
      obj[legend] = d[legend.toLowerCase().replace(" ", "")] || 0;
    });
    return obj;
  });

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

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
          <span style={{ fontWeight: "700" }}>{displayTitle}</span>
        </Tooltip>
        {showSelect && (
          <Select
            label="Select period"
            labelHidden
            options={selectOptions}
            value={selectedValue}
            onChange={handleSelectChange}
          />
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rechartsData}>
          <XAxis dataKey="x" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <RechartsTooltip />
          <Legend />
          {legends.map((legend, index) => (
            <Line key={legend} type="monotone" dataKey={legend} stroke={colors[index % colors.length]} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SubscriptionChartCard;

