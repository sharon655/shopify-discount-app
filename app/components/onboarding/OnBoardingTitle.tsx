import { Box, Text } from "@shopify/polaris";

function OnBoardingTitle({ shopName }: { shopName: string }) {
  return (
    <Box paddingBlockStart={"200"}>
      <Text as="h1" variant="headingXl" alignment="center">
        Welcome, {shopName}!
      </Text>
    </Box>
  );
}

export default OnBoardingTitle;