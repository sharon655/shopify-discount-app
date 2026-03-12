import { Box, Text, InlineStack } from "@shopify/polaris";

function OnBoardingHeader({ step, header }: { step: number; header: string }) {
  const totalSteps = 5;

  return (
    <Box position="relative" padding="300" paddingBlockStart="400">
      {/* Big background step number */}
      <div
        style={{
          fontSize: "64px",
          lineHeight: "45px",
          color: "#EDEEEF",
          fontWeight: "bold",
        }}
      >
        0{step}
      </div>

      {/* Foreground title + step indicator */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          zIndex: 100,
          marginTop: "-18px",
        }}
      >
        <Text as="h2" variant="headingXl" fontWeight="bold">
          {header}
        </Text>

        {/* Step bar (one active, others gray, with gaps) */}
        <InlineStack align="center" gap="100">
          {[...Array(totalSteps)].map((_, i) => {
            const isActive = i + 1 === step; // highlight current step

            return (
              <div
                key={i}
                style={{
                  backgroundColor: isActive
                    ? "var(--p-color-bg-fill-brand)" // blue for current step
                    : "rgb(201, 204, 208)", // gray for inactive
                  flex: "1 1 0%",
                  height: "0.25rem",
                  borderRadius: "0.25rem", // round all for cleaner look
                  transition: "background-color 0.2s ease",
                }}
              />
            );
          })}
        </InlineStack>
      </div>
    </Box>
  );
}

export default OnBoardingHeader;