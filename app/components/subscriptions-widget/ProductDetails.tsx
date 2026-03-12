import {
  Box,
  Button,
  Card,
  Checkbox,
  InlineStack,
  Modal,
  ResourceItem,
  ResourceList,
  Text,
  TextField,
} from "@shopify/polaris";

import { useCallback, useEffect, useState } from "react";
import PurchaseOptions from "./PurchaseOptions";

type ProductItem = {
  id: string;
  title: string;
  media?: string;
};

const productPreview = {
  title: "Dummy Product Preview",
  description:
    "The widget preview cannot load because your Shopify store is password-protected. Please disable the storefront password in your Shopify settings or preview the widget on a live store.",
  image:
    "https://images.unsplash.com/photo-1697201358649-ca8e6ecc3ac0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  productTitle: "Power Energy Drink — 12CT Case",
  options: [
    {
      id: "oneTime",
      label: "One-time purchase",
      price: 27.99,
    },
    {
      id: "subscribe",
      label: "Subscribe and save",
      badge: { tone: "success", label: "SAVE 10%" },
      originalPrice: 27.99,
      discountedPrice: 20.99,
    },
  ],
  buttons: [
    {
      type: "secondary",
      label: "Subscription details",
      icon: "InfoIcon",
      tooltip:
        "Have complete control of your subscriptions. Skip, reschedule, edit, or cancel deliveries anytime, based on your needs.",
    },
    { type: "primary", label: "ADD TO CART", fullWidth: true },
  ],
};

const allProducts: ProductItem[] = [
  {
    id: "1",
    title: "Gift Card",
    media:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    title: "Selling Plans Ski Wax",
    media:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    title: "The 3p Fulfilled Snowboard",
    media:
      "https://images.unsplash.com/photo-1667314613980-2298adddc2df?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "4",
    title: "The Archived Snowboard",
    media:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "5",
    title: "The Collection Snowboard: Hydrogen",
    media:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=684&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "6",
    title: "Another Product",
    media:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "7",
    title: "Extra Demo Product",
    media:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "8",
    title: "Gift Card",
    media:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "9",
    title: "Selling Plans Ski Wax",
    media:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "10",
    title: "The 3p Fulfilled Snowboard",
    media:
      "https://images.unsplash.com/photo-1667314613980-2298adddc2df?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "11",
    title: "The Archived Snowboard",
    media:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "12",
    title: "The Collection Snowboard: Hydrogen",
    media:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=684&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "13",
    title: "Another Product",
    media:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "14",
    title: "Extra Demo Product",
    media:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "15",
    title: "Gift Card",
    media:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "16",
    title: "Selling Plans Ski Wax",
    media:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "17",
    title: "The 3p Fulfilled Snowboard",
    media:
      "https://images.unsplash.com/photo-1667314613980-2298adddc2df?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "18",
    title: "The Archived Snowboard",
    media:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "19",
    title: "The Collection Snowboard: Hydrogen",
    media:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=684&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "20",
    title: "Another Product",
    media:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "21",
    title: "Extra Demo Product",
    media:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

function ProductDetails({
  settingsData,
  labelsData,
  customizationData,
}: {
  settingsData: any;
  labelsData: any;
  customizationData: any;
}) {
  const [purchase, setPurchase] = useState<"oneTime" | "subscribe">("oneTime");
  const [frequency, setFrequency] = useState("monthly");
  const [infoActive, setInfoActive] = useState(false);

  const frequencyOptions = [
    { label: "Monthly", value: "monthly", discount: 25 },
    { label: "Weekly", value: "weekly", discount: 20 },
    { label: "Daily", value: "daily", discount: 20 },
  ];

  // Modal & product-list states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (settingsData?.preselect) {
      setPurchase("subscribe");
      setFrequency("monthly");
    } else {
      setPurchase("oneTime");
    }
  }, [settingsData?.preselect]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const visibleProducts = allProducts
    .slice(0, visibleCount)
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(allProducts.length, prev + 3));
  };

  const handleModalSelect = () => {
    // Do whatever you need with selectedIds (pass to parent, API, set preview product, etc.)
    console.log("Selected product IDs:", selectedIds);
    // Example: close modal after selecting
    closeModal();
  };

  return (
    <>
      {/* Inject custom CSS styles scoped to `.product-preview` */}
      {settingsData?.customCss && (
        <style
          dangerouslySetInnerHTML={{
            __html: `.product-preview { ${settingsData.customCss} }`,
          }}
        />
      )}
      <div className="product-preview pt-[10px]">
        <Card>
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h2" variant="headingSm">
              {productPreview.title}
            </Text>
            <Button variant="plain" onClick={openModal}>
              Select product
            </Button>
          </InlineStack>

          <Box paddingBlockStart="200">
            <Text as="p" variant="bodyMd">
              {productPreview.description}
            </Text>
          </Box>

          <div
            style={{ height: "800px", overflow: "auto", paddingTop: "10px" }}
          >
            <Box overflowX="hidden" minHeight="300" width="100%">
              <img
                src={productPreview.image}
                alt="Product preview"
                style={{
                  display: "block",
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            {/* Product title */}
            <div className="pt-3">
              <h1 className="!text-[16px] !font-semibold text-black">
                {productPreview.productTitle}
              </h1>
            </div>

            <PurchaseOptions
              customizationData={customizationData}
              frequency={frequency}
              setFrequency={setFrequency}
              frequencyOptions={frequencyOptions}
              infoActive={infoActive}
              setInfoActive={setInfoActive}
              labelsData={labelsData}
              productPreview={productPreview}
              purchase={purchase}
              setPurchase={setPurchase}
              settingsData={settingsData}
            />

            {/* 🔹 Always visible Add to cart */}
            <div className="pt-4">
              <button className="w-full rounded-md bg-black/80 px-4 py-2 text-white text-[15px] hover:bg-gray-900 transition cursor-pointer">
                ADD TO CART
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal: product picker */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title="Select Product"
        primaryAction={{ content: "Select", onAction: handleModalSelect }}
        secondaryActions={
          visibleCount < allProducts.length
            ? [
                {
                  content: "View More",
                  onAction: handleViewMore,
                },
              ]
            : []
        }
      >
        <Modal.Section>
          {/* Search */}
          <TextField
            label="Search for a product"
            labelHidden
            placeholder="Ex: Coffee"
            value={search}
            onChange={(value) => setSearch(value)}
            autoComplete="off"
          />

          {/* Product list */}
          <ResourceList
            resourceName={{ singular: "product", plural: "products" }}
            items={visibleProducts}
            renderItem={(item) => {
              const { id, title, media } = item;
              return (
                <ResourceItem onClick={() => toggleSelect(id)} id={id}>
                  <InlineStack gap="200" blockAlign="center">
                    {/* checkbox on the left (labelHidden keeps UI clean but remains accessible) */}
                    <Checkbox
                      id={`select-${id}`}
                      label={title}
                      labelHidden
                      checked={selectedIds.includes(id)}
                      onChange={() => toggleSelect(id)}
                    />
                    <img
                      src={media}
                      alt="Product preview"
                      style={{
                        display: "block",
                        maxWidth: "40px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    />

                    {/* product title & any meta */}
                    <Box paddingInlineStart="200">
                      <Text as="h3" variant="bodyMd">
                        {title}
                      </Text>
                    </Box>
                  </InlineStack>
                </ResourceItem>
              );
            }}
          />

          {/* View more */}
          {/* {visibleCount < allProducts.length && (
            <Box paddingBlockStart="200">
              <InlineStack align="center">
                <Button variant="secondary" onClick={handleViewMore}>
                  View More
                </Button>
              </InlineStack>
            </Box>
          )} */}
        </Modal.Section>
      </Modal>
    </>
  );
}

export default ProductDetails;
