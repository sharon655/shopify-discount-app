import { Box, InlineStack, Button } from "@shopify/polaris";
import { ChatIcon } from "@shopify/polaris-icons";

interface OnBoardingButtonsProps {
  step: number;
  totalSteps: number;
  onExit: () => void;
  onNext: () => void;
  onBack: () => void;
  selected: string;
  onComplete: () => void;
}

function OnBoardingButtons({
  step,
  totalSteps,
  onExit,
  onNext,
  onBack,
  selected,
  onComplete,
}: OnBoardingButtonsProps) {

  const isLastStep = step === totalSteps;
  const isCompletionButton = isLastStep || (selected === "migrate" && step === 1);

  return (
    <Box padding="400" borderBlockStartWidth="025" borderColor="border">
      <InlineStack align="space-between">
        {/* Left side → Exit button */}
        <Button onClick={onExit} variant="plain">
          Exit Onboarding
        </Button>

        {/* Right side → Back (if not first) + Next */}
        <InlineStack gap="400">
          {step > 1 && (
            <Button onClick={onBack} variant="secondary">
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={isCompletionButton ? onComplete : onNext}
            disabled={!selected}
            {...(selected === "migrate" ? { icon: ChatIcon } : {})}
          >
            {isLastStep
              ? "Launch Your Program"
              : selected === "migrate"
                ? "Chat with us"
                : "Next"}
          </Button>
        </InlineStack>
      </InlineStack>
    </Box>
  );
}

export default OnBoardingButtons;