import React from "react";
import { Layout, Box, CalloutCard, Text, Link } from "@shopify/polaris";

function AdvanceAnalytics() {
  return (
    <>
      <Layout>
        <Layout.Section>
          <Box paddingBlockStart={"200"}>
            <CalloutCard
              title="Product Report Feature for Reporting and Analytics"
              illustration="/subPrice.svg" // replace with your actual illustration path
              primaryAction={{ content: "Chat with us", url: "#" }}
            >
              <Text as="p" variant="bodyMd">
                As we apply tags directly to both customers and orders in your
                Shopify. These tags are very beneficial when you need to do in
                depth analysis based on certain order/customer tags. Application
                of these tags to the Shopify Store enables detailed Reporting
                and Analytics to be generated based on the store's
                customers and products.
              </Text>

              <Box paddingBlockStart="200">
                <Text as="p" variant="bodyMd">
                  <strong>
                    This article will go over on how you can efficiently use the
                    tags being applied to your orders and customers from Appstle
                    Subscriptions app.
                  </strong>
                </Text>
              </Box>

              <Box paddingBlockStart="100">
                <Text as="p" variant="bodyMd">
                  Checkout our <Link url="#" removeUnderline>documentation</Link> for more
                  details.
                </Text>
              </Box>
            </CalloutCard>
          </Box>
        </Layout.Section>
      </Layout>
    </>
  );
}

export default AdvanceAnalytics;