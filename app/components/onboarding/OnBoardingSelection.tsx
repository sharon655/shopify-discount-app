import { Box, InlineGrid, Icon, Text } from "@shopify/polaris";
import { ImportIcon, PlusCircleIcon } from "@shopify/polaris-icons";

interface OnBoardingSelectionProps {
  selected: string;
  setSelected: Function;
}

function OnBoardingSelection({
  selected,
  setSelected,
}: OnBoardingSelectionProps) {
  const options = [
    {
      id: "migrate",
      icon: ImportIcon,
      title: "I'm migrating from another app or platform",
      description:
        "We'll help you transfer your existing subscriptions seamlessly",
    },
    {
      id: "new",
      icon: PlusCircleIcon,
      title: "I'm setting up subscriptions for the first time",
      description: "Get started with our easy setup wizard",
    },
  ];
  return (
    <Box padding={"400"}>
      <Box
        background="bg-surface-secondary"
        borderRadius="200"
        borderColor="border"
        borderWidth="025"
        padding={"400"}
        shadow="100"
      >
        <Box paddingBlockEnd={"500"}>
          <Text as="h1" variant="headingLg" alignment="center">
            What brings you here today?
          </Text>
        </Box>
        <InlineGrid columns={{ sm: 1, lg: 2 }} gap="400">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              style={{
                cursor: "pointer",
                borderRadius: "8px",
                border: ` solid ${
                  selected === opt.id
                    ? "2px rgb(0, 91, 211)"
                    : "1px rgb(229, 231, 235)"
                }`,
                backgroundColor: "rgb(247, 249, 252)",
                padding: "24px",
                transition: "0.2s",
                minHeight: "150px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                boxShadow:
                  selected === opt.id
                    ? "rgba(0, 91, 211, 0.2) 0px 0px 0px 1px"
                    : "none",
                gap: "12px",
              }}
            >
              <div
                style={{
                  transform: "scale(1.3)",
                  marginBottom: "8px",
                  marginTop: "8px",
                }}
              >
                <Icon source={opt.icon} tone="base" />
              </div>
              <Text as="h3" variant="headingMd" fontWeight="bold">
                {opt.title}
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                {opt.description}
              </Text>
            </div>
          ))}
        </InlineGrid>
      </Box>
    </Box>
  );
}

export default OnBoardingSelection;