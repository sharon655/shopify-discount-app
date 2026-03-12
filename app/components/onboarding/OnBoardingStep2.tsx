import {
  Box,
  InlineGrid,
  BlockStack,
  Text,
  InlineStack,
  Button,
  MediaCard,
  VideoThumbnail,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";

function OnBoardingStep2() {
  return (
    <Box paddingInlineStart={"300"} paddingBlockEnd={"400"}>
      <InlineGrid columns={{ sm: 1, lg: 2 }} gap="400" alignItems="start">
        {/* LEFT SIDE */}
        <BlockStack gap="400">
          {/* Heading */}
          <InlineStack>
            <Text as="h5" variant="headingLg" tone="base">
              <i>Build incredible subscription experiences</i>
            </Text>
          </InlineStack>

          {/* Sub descriptions */}
          <BlockStack gap="400">
            <Text as="h3" variant="headingSm">
              Create subscription selling plans for your products, establishing
              rules such as discounts, billing intervals, and more.
            </Text>
            <Text as="h3" variant="headingSm">
              Forget about compromise. Focus on building great experiences.
            </Text>
          </BlockStack>

          {/* Start Now + Arrow + Button */}
          <InlineStack gap="400" blockAlign="center">
            <Text as="h5" variant="headingLg" tone="base">
              <i>Start Now</i>
            </Text>

            {/* Arrow SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="11"
              viewBox="0 0 34 9"
              style={{ marginBottom: "4px" }}
            >
              <path
                fill="currentColor"
                d="m33.042 5.727-6.92 1.934L27.907.7zM1.258 5.558c4.929 2.282 9.058 1.667 13.199.539 4.11-1.12 8.364-2.808 13.214-2.381l-.109 1.24c-4.561-.402-8.493 1.174-12.778 2.342-4.255 1.159-8.73 1.852-14.049-.61z"
              ></path>
            </svg>

            <Button variant="secondary" icon={PlusIcon}>
              Create Plan
            </Button>
          </InlineStack>
        </BlockStack>

        {/* RIGHT SIDE - Plain HTML/Flex wrapper */}
        <div
          style={{
            minHeight: "500px", // match other steps for consistency
            backgroundColor: "rgb(247,247,247)",
            borderRadius: "0.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // padding: "1rem",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              borderRadius: "10px",
              background: "white",
              padding: "10px",
              paddingRight: "25px",
              width: "100%",
            }}
          >
            <MediaCard
              portrait
              title="Customizable Customer Portal"
              description="Give your customers the experience they deserve. Have a dev team? Building your own portal is a breeze with Appstle"
            >
              <VideoThumbnail
                thumbnailUrl="https://i0.wp.com/appstle.com/wp-content/uploads/2022/11/Customizable_Customer_Portal.png"
                onClick={() => {
                  console.log("Play video clicked!");
                }}
              />
            </MediaCard>
          </div>
        </div>
      </InlineGrid>
    </Box>
  );
}

export default OnBoardingStep2;