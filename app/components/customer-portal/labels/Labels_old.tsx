import { useState, useEffect, useMemo } from "react";
import {
  BlockStack,
  Box,
  Tabs,
} from "@shopify/polaris";
import SubscriptionManagementTab from "./tabs/SubscriptionManagementTab";
import PurchaseOptionsTab from "./tabs/PurchaseOptionsTab";
import ProductsInventoryTab from "./tabs/ProductsInventoryTab";
import PaymentBillingTab from "./tabs/PaymentBillingTab";
import OrderFulfillmentTab from "./tabs/OrderFulfillmentTab";
import DiscountsRewardsTab from "./tabs/DiscountsRewardsTab";
import ShippingDeliveryTab from "./tabs/ShippingDeliveryTab";
import CustomerPortalTab from "./tabs/CustomerPortalTab";
import OrderAttributesDetailsTab from "./tabs/OrderAttributesDetailsTab";
import ButtonsActionsTab from "./tabs/ButtonsActionsTab";
import LabelsTitlesTab from "./tabs/LabelsTitlesTab";
import OrderStatusTab from "./tabs/OrderStatusTab";
import SortingTab from "./tabs/SortingTab";
import AdvancedTab from "./tabs/AdvancedTab";

// Configuration imports
import {
  orderFrequencyConfig,
  productManagementConfig,
  productActionConfig,
  skipAndQueueConfig,
  skipAndQueueActionsConfig,
  deletionConfirmationConfig,
  pauseAndResumeConfig,
  cancellationConfig,
  cancellationContConfig,
  cancellationReasonsConfig,
  freezeSubscriptionConfig,
  cycleManagementConfig,
  bannersConfig,
} from "../../../utils/customer-portal/subscription-management-data";
import {
  purchaseOptionsLabelsConfig,
  purchaseOptionsActionsConfig,
} from "../../../utils/customer-portal/purchase-options-data";
import {
  productListConfig,
  productSwapConfig,
  productSwapContConfig,
  outOfStockConfig,
  productDetailsConfig,
} from "../../../utils/customer-portal/product-inventory-data";
import {
  billingAmountsConfig,
  paymentDetailsConfig,
  cardInformationConfig,
  paymentActionsConfig,
  paymentNotificationConfig,
  paymentLabelsConfig,
  billingStatusConfig,
  billingStatusContConfig,
} from "../../../utils/customer-portal/payment-billing";
import {
  discountCodesConfig,
  discountCodesContConfig,
  discountActionsConfig,
  rewardsConfig,
} from "../../../utils/customer-portal/discounts-rewards";
import {
  orderNavigationConfig,
  orderUpdateMessagesConfig,
  nextOrderDetailsConfig,
  nextOrderDateConfig,
  skipNextOrderConfig,
  fulfillmentStatusConfig,
  fulfillmentStatusContConfig,
  upcomingOrdersChangesConfig,
  upcomingOrdersChangesContConfig,
  orderProcessingConfig,
  manualBillingConfig,
} from "../../../utils/customer-portal/order-fulfillment";
import {
  shippingAddressConfig,
  shippingAddressContConfig,
  shippingOptionsConfig,
  shippingLabelsConfig,
  shippingActions,
  deliveryLabelsConfig,
  deliveryActions,
} from "../../../utils/customer-portal/shipping-delivery";
import {
  emailActionsConfig,
  emailMessagesConfig,
  buildBoxContractConfig,
  emailAddressConfig,
  customerDetailsConfig,
  customerPortalHtmlConfig,
} from "../../../utils/customer-portal/customer-portal";
import {
  orderAttributesConfig,
  orderAttributesContConfig,
} from "../../../utils/customer-portal/order-attributes-details";
import {
  navigationButtons,
  formActionsConfig,
  formActionsContConfig,
  acceptAndConfirmButtons,
} from "../../../utils/customer-portal/buttons-actions";
import {
  generalLabelsConfig,
  purchaseLabelsConfig,
  subscriptionLabelsConfig,
  paymentLabelsConfig as paymentLabelsConfigTitles,
  cardLabelsConfig,
  pauseLabelsConfig,
  statusLabelsConfig,
  statusLabelsContConfig,
  orderAttributesLabelsConfig,
  generalTitlesConfig,
  generalTitleContConfig,
} from "../../../utils/customer-portal/labels-titles";
import { orderStatusLabelsConfig } from "../../../utils/customer-portal/order-status";
import { sortingLabelsConfig } from "../../../utils/customer-portal/sorting";
import { advancedLabelConfig } from "../../../utils/customer-portal/advanced";

// Separate SearchSection component
function SearchSection({ 
  searchValue, 
  onSearchChange, 
  onClearSearch, 
  placeholder 
}: { 
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  placeholder: string;
}) {
  return (
    <Box
      background="bg-surface"
      borderWidth="025"
      borderColor="border"
      borderRadius="200"
    >
      <Box
        padding="200"
        paddingBlockStart={"400"}
        paddingInlineStart={"400"}
        paddingInlineEnd={"400"}
      >
        <Box paddingBlockEnd="200">
          <InlineStack align="end" gap="200">
            <Button icon={PageDownIcon}>Download as CSV</Button>
            <Button icon={ClipboardIcon}>Copy JSON</Button>
          </InlineStack>
        </Box>
        <TextField
          label=""
          value={searchValue}
          onChange={onSearchChange}
          placeholder={placeholder}
          autoComplete="off"
          suffix={<Icon source={SearchIcon} />}
          clearButton={searchValue.length > 0}
          onClearButtonClick={onClearSearch}
        />
      </Box>
    </Box>
  );
}

interface SearchableField {
  key: string;
  label: string;
  hasInfo: boolean;
  value: string;
  section: string;
  sectionTitle: string;
}

// Inline SearchResultsTab component
function SearchResultsTab({
  searchResults,
  searchQuery,
  data,
  onChange,
}: {
  searchResults: SearchableField[];
  searchQuery: string;
  data: Record<string, string>;
  onChange: (
    updater: (prev: Record<string, string>) => Record<string, string>
  ) => void;
}) {
  // Group results by section
  const groupedResults = searchResults.reduce(
    (acc, field) => {
      if (!acc[field.section]) {
        acc[field.section] = {
          title: field.sectionTitle,
          fields: [],
        };
      }
      acc[field.section].fields.push(field);
      return acc;
    },
    {} as Record<string, { title: string; fields: SearchableField[] }>
  );

  return (
    <Box>
      <Box padding="400">
        <BlockStack gap="200">
          <Text variant="headingMd" as="h2">
            Search Results for "{searchQuery}"
          </Text>
          <Badge tone="info">
            {`${searchResults.length} label${searchResults.length !== 1 ? "s" : ""} found`}
          </Badge>
        </BlockStack>
      </Box>

      {Object.entries(groupedResults).map(([sectionKey, section]) => (
        <div key={sectionKey}>
          <Box borderBlockStartWidth="025" borderColor="border" />
          <Box padding="400">
            <Text variant="headingSm" as="h3">
              {section.title}
            </Text>
            <Box paddingBlockStart={"400"}>
              <BlockStack gap="400">
                {section.fields.map((field) => (
                  <LabeledTextField
                    key={field.key}
                    label={field.label}
                    hasInfo={field.hasInfo}
                    value={data[field.key]}
                    onChange={(value: string) =>
                      onChange((prev) => ({ ...prev, [field.key]: value }))
                    }
                  />
                ))}
              </BlockStack>
            </Box>
          </Box>
        </div>
      ))}

      {searchResults.length === 0 && (
        <Box padding="400">
          <Text variant="bodyMd" as="p" tone="subdued" alignment="center">
            No labels found matching "{searchQuery}". Try a different search
            term.
          </Text>
        </Box>
      )}
    </Box>
  );
}

function Labels({
  data,
  onChange,
  searchResults,
  shouldShowSearchResults,
  searchQuery
}: {
  data: Record<string, string>;
  onChange: (
    updater: (prev: Record<string, string>) => Record<string, string>
  ) => void;
  searchResults: SearchableField[];
  shouldShowSearchResults: boolean;
  searchQuery: string;
}) {
  const [selectedSubTab, setSelectedSubTab] = useState(0);

  // Update selectedSubTab when search has results or is cleared
  useEffect(() => {
    if (shouldShowSearchResults) {
      setSelectedSubTab(0); // Search Results tab is at index 0
    } else if (searchQuery.length === 0) {
      // Search cleared - go to first regular tab (Subscription Management)
      setSelectedSubTab(0);
    }
  }, [shouldShowSearchResults, searchQuery]);

  // Create dynamic tabs array
  const subTabs = useMemo(() => {
    const regularTabs = [
      { id: "subscription-management", content: "Subscription Management" },
      { id: "purchase-options", content: "Purchase Options" },
      { id: "products-inventory", content: "Products and Inventory" },
      { id: "payment-billing", content: "Payment and Billing" },
      { id: "order-fulfillment", content: "Order and Fulfillment" },
      { id: "discounts-rewards", content: "Discounts and Rewards" },
      { id: "shipping-delivery", content: "Shipping and Delivery" },
      { id: "customer-portal", content: "Customer Portal" },
      { id: "order-attributes-details", content: "Order Attributes and Details" },
      { id: "buttons-actions", content: "Buttons and Actions" },
      { id: "labels-titles", content: "Labels and Titles" },
      { id: "order-status", content: "Order Status" },
      { id: "sorting", content: "Sorting" },
      { id: "advanced", content: "Advanced" },
    ];

    if (shouldShowSearchResults) {
      return [
        {
          id: "search-results",
          content: `Search Results (${searchResults.length})`,
        },
        ...regularTabs,
      ];
    }

    return regularTabs;
  }, [shouldShowSearchResults, searchResults.length]);
    // Tab will be automatically reset by the useEffect
  return (
    <Box
      background="bg-surface"
      borderWidth="025"
      borderColor="border"
      borderRadius="200"
    >
      <BlockStack gap="0">
        <Box padding="200">
          <Tabs
            tabs={subTabs}
            selected={selectedSubTab}
            onSelect={setSelectedSubTab}
            disclosureText="More Options"
          />
        </Box>
        {/* Dynamic tab content rendering */}
        {shouldShowSearchResults && selectedSubTab === 0 && (
          <SearchResultsTab
            searchResults={searchResults}
            searchQuery={searchQuery}
            data={data}
            onChange={onChange}
          />
        )}
        {/* Regular tabs - adjust index based on whether search results tab is shown */}
        {selectedSubTab === (shouldShowSearchResults ? 1 : 0) && (
          <SubscriptionManagementTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 2 : 1) && (
          <PurchaseOptionsTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 3 : 2) && (
          <ProductsInventoryTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 4 : 3) && (
          <PaymentBillingTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 5 : 4) && (
          <OrderFulfillmentTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 6 : 5) && (
          <DiscountsRewardsTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 7 : 6) && (
          <ShippingDeliveryTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 8 : 7) && (
          <CustomerPortalTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 9 : 8) && (
          <OrderAttributesDetailsTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 10 : 9) && (
          <ButtonsActionsTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 11 : 10) && (
          <LabelsTitlesTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 12 : 11) && (
          <OrderStatusTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 13 : 12) && (
          <SortingTab data={data} onChange={onChange} />
        )}
        {selectedSubTab === (shouldShowSearchResults ? 14 : 13) && (
          <AdvancedTab data={data} onChange={onChange} />
        )}
      </BlockStack>
    </Box>
  );
}

export default Labels;
