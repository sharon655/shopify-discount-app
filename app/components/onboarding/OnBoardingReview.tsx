import { BlockStack, Text, InlineStack, Icon } from "@shopify/polaris";
import { StarFilledIcon } from "@shopify/polaris-icons";

function OnBoardingReview() {
  const userReviews = [
    {
      id: 1,
      desciption: `"Best subscription app on Shopify!"`,
    },
    {
      id: 2,
      desciption: `"Migration was seamless and support is amazing"`,
    },
    {
      id: 3,
      desciption: `"5 stars! Switched from another app in 2 days"`,
    },
    {
      id: 4,
      desciption: `"Most feature-rich subscription app we've used"`,
    },
    {
      id: 5,
      desciption: `"Outstanding customer support team"`,
    },
    {
      id: 6,
      desciption: `"Easy setup and powerful features"`,
    },
  ];

  return (
    <BlockStack gap={"400"}>
      <div
        className="flex-col items-center justify-center "
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 12px",
            borderRadius: "16px",
            backgroundColor: "rgb(235, 249, 245)",
          }}
        >
          <Icon source={StarFilledIcon} tone="success" />
          <Text as="p" variant="bodyMd" fontWeight="medium" tone="success">
            Most reviewed (5-star) subscription app on Shopify
          </Text>
        </div>
        <InlineStack gap={"200"}>
          <Text as="p" variant="bodyMd" fontWeight="medium">
            4.9
          </Text>
          <InlineStack gap={"050"}>
            <Icon source={StarFilledIcon} tone="warning" />
            <Icon source={StarFilledIcon} tone="warning" />
            <Icon source={StarFilledIcon} tone="warning" />
            <Icon source={StarFilledIcon} tone="warning" />
            <Icon source={StarFilledIcon} tone="warning" />
          </InlineStack>
          <Text as="p" variant="bodyMd" tone="subdued">
            Average Rating
          </Text>
        </InlineStack>
        <Text as="p" variant="bodyMd" tone="subdued">
          Over 3,900 5-Star Reviews on Shopify
        </Text>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingBottom: "16px",
        }}
      >
        {userReviews?.map((userReview) => (
          <div
            key={userReview?.id}
            style={{
              padding: "20px",
              backgroundColor: "rgb(255, 255, 255)",
              borderRadius: "8px",
              border: "1px solid rgb(229, 231, 235)",
              boxShadow: "rgba(0, 0, 0, 0.04) 0px 1px 2px",
            }}
          >
            <Text as="span" variant="bodyMd" fontWeight="medium">
              {userReview?.desciption}
            </Text>
          </div>
        ))}
      </div>
    </BlockStack>
  );
}

export default OnBoardingReview;