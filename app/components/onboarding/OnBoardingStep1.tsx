import { Box } from "@shopify/polaris";
import OnBoardingTitle from "./OnBoardingTitle";
import OnBoardingSelection from "./OnBoardingSelection";
import OnBoardingReview from "./OnBoardingReview";

function OnBoardingStep1({ selected, setSelected, shopName }: { selected: string; setSelected: Function; shopName: string }) {
  return (
    <Box>
      <OnBoardingTitle shopName={shopName} />
      <OnBoardingSelection selected={selected} setSelected={setSelected} />
      <OnBoardingReview />
    </Box>
  );
}

export default OnBoardingStep1;