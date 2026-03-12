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

interface SearchableField {
  key: string;
  label: string;
  hasInfo: boolean;
  value: string;
  section: string;
  sectionTitle: string;
}

// Simplified SearchResultsTab component
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
    (acc: Record<string, { title: string; fields: SearchableField[] }>, field) => {
      if (!acc[field.section]) {
        acc[field.section] = { title: field.sectionTitle, fields: [] };
      }
      acc[field.section].fields.push(field);
      return acc;
    },
    {}
  );

  return (
    <Box>
      <Box padding="400">
        <BlockStack gap="200">
          <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
            Search Results for "{searchQuery}"
          </div>
          <div style={{ background: '#e3f2fd', padding: '8px 12px', borderRadius: '4px' }}>
            {`${searchResults.length} label${searchResults.length !== 1 ? "s" : ""} found`}
          </div>
        </BlockStack>
      </Box>

      {Object.entries(groupedResults).map(([sectionKey, section]) => (
        <div key={sectionKey}>
          <Box borderBlockStartWidth="025" borderColor="border" />
          <Box padding="400">
            <div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '1rem' }}>
              {section.title}
            </div>
            <Box paddingBlockStart={"400"}>
              <BlockStack gap="400">
                {section.fields.map((field) => (
                  <div key={field.key} style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{field.label}</div>
                    <input
                      type="text"
                      value={data[field.key] || ''}
                      onChange={(e) => onChange((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </div>
                ))}
              </BlockStack>
            </Box>
          </Box>
        </div>
      ))}

      {searchResults.length === 0 && (
        <Box padding="400">
          <div style={{ textAlign: 'center', color: '#666' }}>
            No labels found matching "{searchQuery}". Try a different search term.
          </div>
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

  return (
    <Box
      // background="bg-surface"
      // borderWidth="025"
      // borderColor="border"
      // borderRadius="200"
    >
      <BlockStack gap="0">
        <Box>
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