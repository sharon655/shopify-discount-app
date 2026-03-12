import React from "react";
import { Card, InlineStack, Tooltip, Button, Box, Text } from "@shopify/polaris";

function AnalyticsCard({
  title,
  leftButton,
  value,
  tooltipContent,
  activeDateRange,
  setPopoverActive,
}: {
  title: string;
  leftButton: "date" | null;
  value: string;
  tooltipContent: React.ReactNode;
  activeDateRange: any;
  setPopoverActive: (active: boolean) => void;
}) {
  return (
    <>
      <Card>
        <InlineStack gap="200" align="space-between" blockAlign="center">
          <Tooltip
            content={tooltipContent}
            hasUnderline
            zIndexOverride={500}
            width="wide"
          >
            <span style={{ fontWeight: "700" }}>{title}</span>
          </Tooltip>

          {leftButton === "date" ? (
            <Button variant="plain" onClick={() => setPopoverActive(true)}>
              {activeDateRange.period.since.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }) +
                " - " +
                activeDateRange.period.until.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </Button>
          ) : null}
        </InlineStack>

        <Box paddingBlockStart={"200"}>
          <Text as="h1" variant="headingLg">
            {value}
          </Text>
        </Box>
      </Card>
    </>
  );
}

export default AnalyticsCard;