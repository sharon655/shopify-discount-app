import React, { useState, useEffect } from "react";
import { Card, BlockStack, Box, Checkbox } from "@shopify/polaris";

const CohortHeatmap = () => {
  const [ReactApexChart, setReactApexChart] = useState<any>(null);
  const [excludeImported, setExcludeImported] = useState(false);

  useEffect(() => {
    import("react-apexcharts").then((module) => {
      setReactApexChart(() => module.default);
    });
  }, []);

  // Compute today's date for the title
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = today.toLocaleDateString('en-US', { month: 'short' });
  const year = today.getFullYear();
  const formattedToday = `${day} ${month},${year}`;

  // --- build series (your existing logic) ---
  const startDate = new Date(2024, 9, 1); // Oct 2024
  const series = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    const name = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    series.push({
      name,
      data: Array(12).fill(0),
    });
  }
  series.reverse();

  // --- tune these to taste ---
  const ROW_HEIGHT = 44; // px per heatmap row (increase to add vertical spacing)
  const EXTRA_LABEL_SHIFT = 6; // px to push each label *down* relative to its center
  const BASE_MIN_HEIGHT = 500;
  const chartHeight = Math.max(
    BASE_MIN_HEIGHT,
    series.length * ROW_HEIGHT + 120
  );

  // Adjust y-axis label <text> dy safely (store original dy to avoid cumulative increments)
  const adjustYAxisLabels = (chartContext: any) => {
    try {
      const labels = chartContext.el.querySelectorAll(
        ".apexcharts-yaxis-label text"
      );
      labels.forEach((el: SVGTextElement, idx: number) => {
        // store original dy once
        if (!el.getAttribute("data-orig-dy")) {
          el.setAttribute("data-orig-dy", el.getAttribute("dy") || "0");
        }
        const base = parseFloat(el.getAttribute("data-orig-dy") || "0");
        el.setAttribute("dy", String(base + EXTRA_LABEL_SHIFT));
      });
    } catch (e) {
      // defensive
      // console.warn("failed to adjust yaxis labels", e);
    }
  };

  const options: any = {
    chart: {
      type: "heatmap",
      toolbar: { show: true },
      parentHeightOffset: 0,
      events: {
        mounted: (chartContext: any) => {
          // run after DOM paint
          setTimeout(() => adjustYAxisLabels(chartContext), 0);
        },
        updated: (chartContext: any) => {
          // reapply on updates/resizes
          setTimeout(() => adjustYAxisLabels(chartContext), 0);
        },
      },
    },
    grid: {
      padding: {
        // left: 110, // leave room for labels — increase if labels wrap
        // right: 10,
        top: 10,
        // bottom: 10,
      },
    },
    title: {
      text: `Subscriber cohort retention by month (01 Oct,2024 to ${formattedToday})`,
      align: "left",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fill: "#333333",
      },
    },
    subtitle: {
      text: "This heatmap visualizes the retention of monthly cohorts of new subscribers. It shows the percentage of subscriptions from a specific creation month (row) that remained active in subsequent months (columns).",
      align: "left",
      style: {
        fontSize: "10px",
        color: "#666666",
        fontWeight: "400",
        fill: "#666666",
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "11px",
        },
        // offsetY here will shift the whole block; we use per-text dy adjustments instead
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: "#f6f6f7", name: "N/A" },
            { from: 1, to: 10, color: "#e0f5f5", name: "0-10%" },
            { from: 11, to: 20, color: "#bbe5eb", name: "10-20%" },
            { from: 21, to: 30, color: "#99d9d9", name: "20-30%" },
            { from: 31, to: 50, color: "#47c1bf", name: "30-50%" },
            { from: 51, to: 70, color: "#00848e", name: "50-70%" },
            { from: 71, to: 90, color: "#006f5c", name: "70-90%" },
            { from: 91, to: 100, color: "#004c3f", name: "90-100%" },
          ],
        },
      },
    },
    xaxis: {
      categories: [
        "Month 0",
        "Month 1",
        "Month 2",
        "Month 3",
        "Month 4",
        "Month 5",
        "Month 6",
        "Month 7",
        "Month 8",
        "Month 9",
        "Month 10",
        "Month 11",
      ],
      position: "top",
    },
    dataLabels: {
      enabled: true,
      style: { colors: ["#000"] },
      formatter: (val: number) => (val === 0 ? "" : `${val}%`),
    },
    legend: {
      show: true,
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: (val: number) => (val === 0 ? "N/A" : `${val}% active`),
      },
    },
  };

  return (
    <Card>
      <BlockStack gap="400">
        <Box>
          <Checkbox
            label="Exclude Imported Subscriptions"
            helpText="Exclude subscription contracts that were imported into your store from external sources (e.g., migrations from other platforms) from the Cohort Retention analysis. This helps you focus on retention of subscriptions organically created within your Appstle setup."
            checked={excludeImported}
            onChange={setExcludeImported}
          />
        </Box>

        {/* small style injection so SVG y-axis label font-size is consistent */}
        <style>{`.apexcharts-yaxis-label text { font-size: 11px; }`}</style>

        {ReactApexChart && (
          <ReactApexChart
            options={options}
            series={series}
            type="heatmap"
            height={chartHeight}
          />
        )}
      </BlockStack>
    </Card>
  );
};

export default CohortHeatmap;