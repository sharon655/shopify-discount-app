import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit, useNavigation, Form } from "@remix-run/react";
import { useState, useCallback, useEffect } from "react";
import {
  Page, Layout, Card, Button, Badge, Text, BlockStack,
  InlineStack, EmptyState, Modal, Toast, Frame, FormLayout, TextField,
  Banner, Divider, Select, DatePicker, Popover, Box, Icon, InlineGrid, Tooltip,
  IndexTable, useIndexResourceState, IndexFilters, useSetIndexFiltersMode, Link, Pagination, FooterHelp
} from "@shopify/polaris";
import { CalendarIcon, ClipboardIcon, CheckIcon } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// After activating a discount that has a future startDate, Shopify sets it to ACTIVE.
// We must re-apply the original startsAt so Shopify re-classifies it as SCHEDULED.
async function restoreStartsAtIfFuture(admin: any, discountGid: string, startDate: Date | null) {
  if (!startDate) return;
  const now = new Date();
  if (startDate <= now) return; // already past — no action needed
  await admin.graphql(
    `mutation discountCodeAppUpdate($id: ID!, $discount: DiscountCodeAppInput!) {
      discountCodeAppUpdate(id: $id, codeAppDiscount: $discount) {
        userErrors { field message }
      }
    }`,
    { variables: { id: discountGid, discount: { startsAt: startDate.toISOString() } } }
  ).catch((e: any) => console.error("Failed to restore startsAt:", e));
}

const CREATE_DISCOUNT_MUTATION = `
  mutation discountCodeAppCreate($discount: DiscountCodeAppInput!) {
    discountCodeAppCreate(codeAppDiscount: $discount) {
      codeAppDiscount {
        discountId
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_DISCOUNT_MUTATION = `
  mutation discountCodeAppUpdate($id: ID!, $discount: DiscountCodeAppInput!) {
    discountCodeAppUpdate(id: $id, codeAppDiscount: $discount) {
      userErrors {
        field
        message
      }
    }
  }
`;

const SET_METAFIELD_MUTATION = `
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      userErrors { field message }
    }
  }
`;

const GET_FUNCTIONS_QUERY = `
  query {
    shopifyFunctions(first: 25) {
      nodes {
        id
        title
        apiType
      }
    }
  }
`;

const SHOP_INFO_QUERY = `
  query {
    shop {
      currencyCode
    }
  }
`;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const discounts = await prisma.discountThreshold.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: "desc" },
  });

  // Fetch shop currency
  let currencyCode = "INR";
  try {
    const shopRes = await admin.graphql(SHOP_INFO_QUERY);
    const shopData = await shopRes.json() as any;
    currencyCode = shopData?.data?.shop?.currencyCode || "INR";
  } catch {}

  // Batch-fetch asyncUsageCount and status for each discount via aliased GraphQL (codeDiscountNode)
  const usageCounts: Record<string, number> = {};
  const discountStatuses: Record<string, string> = {};
  if (discounts.length > 0) {
    try {
      const aliases = discounts
        .map((d, i) => `d${i}: codeDiscountNode(id: "${d.discountGid}") { codeDiscount { ... on DiscountCodeApp { asyncUsageCount status } } }`)
        .join("\n      ");
      const batchQuery = `query { ${aliases} }`;
      const usageRes = await admin.graphql(batchQuery);
      const usageData = await usageRes.json() as any;
      discounts.forEach((d, i) => {
        usageCounts[d.id] = usageData?.data?.[`d${i}`]?.codeDiscount?.asyncUsageCount ?? 0;
        discountStatuses[d.id] = usageData?.data?.[`d${i}`]?.codeDiscount?.status ?? "";
      });
    } catch {}
  }

  return json({ discounts, currencyCode, usageCounts, discountStatuses });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const id = formData.get("id") as string;

  if (intent === "delete") {
    const discount = await prisma.discountThreshold.findUnique({ where: { id } });
    if (!discount || discount.shop !== shop) {
      return json({ success: false, actionType: "delete", errors: { general: "Discount not found" } });
    }
    try {
      await admin.graphql(
        `mutation discountCodeDelete($id: ID!) { discountCodeDelete(id: $id) { deletedCodeDiscountId userErrors { field message } } }`,
        { variables: { id: discount.discountGid } }
      );
    } catch (e) {
      console.error("GraphQL delete failed:", e);
    }
    await prisma.discountThreshold.delete({ where: { id } });
    return json({ success: true, actionType: "delete" });
  }

  if (intent === "bulkActivate" || intent === "bulkDeactivate" || intent === "bulkDelete") {
    const ids = JSON.parse(formData.get("ids") as string || "[]");
    if (!Array.isArray(ids) || ids.length === 0) return json({ success: false, actionType: intent, errors: { general: "No discounts selected" } });

    const discounts = await prisma.discountThreshold.findMany({ where: { id: { in: ids }, shop } });

    if (intent === "bulkDelete") {
      // Fire all Shopify deletes in parallel
      await Promise.all(
        discounts.map((discount) =>
          admin.graphql(
            `mutation discountCodeDelete($id: ID!) { discountCodeDelete(id: $id) { userErrors { field message } } }`,
            { variables: { id: discount.discountGid } }
          ).catch((e) => console.error("GraphQL bulk delete failed:", e))
        )
      );
      await prisma.discountThreshold.deleteMany({ where: { id: { in: ids } } });
    } else {
      const mutationName = intent === "bulkActivate" ? "discountCodeActivate" : "discountCodeDeactivate";
      // Fire all Shopify activate/deactivate in parallel
      await Promise.all(
        discounts.map(async (discount) => {
          await admin.graphql(
            `mutation ${mutationName}($id: ID!) { ${mutationName}(id: $id) { userErrors { field message } } }`,
            { variables: { id: discount.discountGid } }
          ).catch((e: any) => console.error(`Failed to bulk ${intent}:`, e));
          // If activating and start date is in the future, restore startsAt so Shopify re-schedules it
          if (intent === "bulkActivate") {
            await restoreStartsAtIfFuture(admin, discount.discountGid, discount.startDate, null);
          }
        })
      );
      const isActive = intent === "bulkActivate";
      await prisma.discountThreshold.updateMany({
        where: { id: { in: ids } },
        data: { isActive },
      });
    }

    return json({ success: true, actionType: intent });
  }

  if (intent === "toggle") {
    const discount = await prisma.discountThreshold.findUnique({ where: { id } });
    if (discount && discount.shop === shop) {
      const currentActive = formData.get("currentIsActive") === "true";
      const newActive = !currentActive;
      const mutationName = newActive ? "discountCodeActivate" : "discountCodeDeactivate";
      
      try {
        await admin.graphql(
          `mutation ${mutationName}($id: ID!) { ${mutationName}(id: $id) { userErrors { field message } } }`,
          { variables: { id: discount.discountGid } }
        );
        // If activating and start date is in the future, restore startsAt so Shopify marks it as SCHEDULED
        if (newActive) {
          await restoreStartsAtIfFuture(admin, discount.discountGid, discount.startDate, null);
        }
      } catch (e) {
        console.error(`Failed to ${newActive ? "activate" : "deactivate"} discount code in Shopify:`, e);
      }

      await prisma.discountThreshold.update({
        where: { id },
        data: { isActive: newActive },
      });
    }
    return json({ success: true, actionType: "toggle" });
  }

  if (intent === "create") {
    const title = (formData.get("title") as string)?.trim();
    const code = (formData.get("code") as string)?.trim().toUpperCase();
    const discountType = formData.get("discountType") as string || "percentage";
    const percentageStr = formData.get("percentage") as string;
    const fixedValueStr = formData.get("fixedValue") as string;
    const thresholdStr = formData.get("threshold") as string;
    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;

    const errors: Record<string, string> = {};
    if (!title) errors.title = "Title is required";
    if (!code || code.length < 3) errors.code = "Code must be at least 3 characters";
    if (!/^[A-Z0-9_-]+$/.test(code || "")) errors.code = "Code can only contain letters, numbers, dashes, and underscores";
    
    let percentage: number | null = null;
    let fixedValue: number | null = null;

    if (discountType === "percentage") {
      percentage = parseFloat(percentageStr);
      if (isNaN(percentage) || percentage <= 0 || percentage > 100) errors.percentage = "Percentage must be between 1 and 100";
    } else {
      fixedValue = parseFloat(fixedValueStr);
      if (isNaN(fixedValue) || fixedValue <= 0) errors.fixedValue = "Fixed value must be a positive number";
    }

    const threshold = parseFloat(thresholdStr);
    if (isNaN(threshold) || threshold <= 0) errors.threshold = "Threshold must be a positive number";

    // Cross-field: fixed discount amount cannot exceed the total budget
    if (discountType === "fixed" && fixedValue !== null && !isNaN(threshold) && fixedValue > threshold) {
      errors.fixedValue = "Fixed discount amount cannot be greater than the total threshold budget";
    }

    let startDate: Date;
    if (startDateStr) {
      const parts = startDateStr.split('-');
      startDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
    } else {
      startDate = new Date();
    }
    
    let endDate: Date | null = null;
    if (endDateStr) {
      const parts = endDateStr.split('-');
      endDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
    }

    if (endDate && endDate <= startDate) {
      errors.endDate = "End date must be after the start date";
    }

    if (Object.keys(errors).length > 0) return json({ errors, success: false, actionType: "create" });

    const existing = await prisma.discountThreshold.findFirst({ where: { shop, discountCode: code } });
    if (existing) return json({ errors: { code: "A discount with this code already exists" }, success: false, actionType: "create" });

    let functionId: string | null = null;
    try {
      const response = await admin.graphql(GET_FUNCTIONS_QUERY);
      const data = await response.json() as any;
      const functions = data?.data?.shopifyFunctions?.nodes || [];
      const ourFunction = functions.find((f: any) => 
        f.title?.toLowerCase().includes("discount") || f.apiType?.toLowerCase().includes("discount")
      ) || functions[0];
      functionId = ourFunction?.id || null;
    } catch {}

    if (!functionId) return json({ errors: { general: "Shopify Function not found." }, success: false, actionType: "create" });

    let discountGid: string | null = null;
    try {
      const response = await admin.graphql(CREATE_DISCOUNT_MUTATION, {
        variables: {
          discount: {
            title, code, startsAt: startDate.toISOString(), ...(endDate ? { endsAt: endDate.toISOString() } : {}), functionId,
            combinesWith: { orderDiscounts: false, productDiscounts: false, shippingDiscounts: false },
            discountClasses: ["ORDER"],
          }
        }
      });
      const data = await response.json() as any;
      const userErrors = data?.data?.discountCodeAppCreate?.userErrors || [];
      if (userErrors.length > 0) return json({ errors: { general: userErrors[0].message }, success: false, actionType: "create" });
      discountGid = data?.data?.discountCodeAppCreate?.codeAppDiscount?.discountId;
    } catch (e: any) {
      return json({ errors: { general: e.message }, success: false, actionType: "create" });
    }

    if (!discountGid) return json({ errors: { general: "Failed to create discount in Shopify" }, success: false, actionType: "create" });

    const metafieldValue = JSON.stringify({ type: discountType, percentage, fixedAmount: fixedValue || 0, remaining_threshold: threshold, total_threshold: threshold });
    try {
      await admin.graphql(SET_METAFIELD_MUTATION, {
        variables: {
          metafields: [{ ownerId: discountGid, namespace: "$app", key: "discount_config", type: "json", value: metafieldValue }],
        }
      });
    } catch {}

    await prisma.discountThreshold.create({
      data: { shop, discountGid, discountCode: code, title, discountType, percentage, fixedValue, totalThreshold: threshold, remainingAmount: threshold, isActive: true, startDate, endDate, version: 0 },
    });

    return json({ success: true, actionType: "create" });
  }

  if (intent === "edit") {
    const title = (formData.get("title") as string)?.trim();
    const discountType = formData.get("discountType") as string || "percentage";
    const percentageStr = formData.get("percentage") as string;
    const fixedValueStr = formData.get("fixedValue") as string;
    const thresholdStr = formData.get("threshold") as string;
    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    
    const discount = await prisma.discountThreshold.findFirst({ where: { id, shop } });
    if (!discount) return json({ errors: { general: "Discount not found" }, success: false, actionType: "edit" });

    const errors: Record<string, string> = {};
    if (!title) errors.title = "Title is required";
    
    let percentage: number | null = null;
    let fixedValue: number | null = null;

    if (discountType === "percentage") {
      percentage = parseFloat(percentageStr);
      if (isNaN(percentage) || percentage <= 0 || percentage > 100) errors.percentage = "Percentage must be between 1 and 100";
    } else {
      fixedValue = parseFloat(fixedValueStr);
      if (isNaN(fixedValue) || fixedValue <= 0) errors.fixedValue = "Fixed value must be a positive number";
    }

    const newTotalThreshold = parseFloat(thresholdStr);
    if (isNaN(newTotalThreshold) || newTotalThreshold <= 0) errors.threshold = "Threshold must be a positive number";
    if (newTotalThreshold < discount.usedAmount) errors.threshold = `Cannot set threshold below already-used amount (₹${discount.usedAmount.toFixed(2)})`;

    // Cross-field: fixed discount amount cannot exceed the total budget
    if (discountType === "fixed" && fixedValue !== null && !isNaN(newTotalThreshold) && fixedValue > newTotalThreshold) {
      errors.fixedValue = "Fixed discount amount cannot be greater than the total threshold budget";
    }

    let startDate: Date;
    if (startDateStr) {
      const parts = startDateStr.split('-');
      startDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
    } else {
      startDate = new Date();
    }
    
    let endDate: Date | null = null;
    if (endDateStr) {
      const parts = endDateStr.split('-');
      endDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
    }

    if (endDate && endDate <= startDate) {
      errors.endDate = "End date must be after the start date";
    }

    if (Object.keys(errors).length > 0) return json({ errors, success: false, actionType: "edit" });

    const newRemaining = newTotalThreshold - discount.usedAmount;
    const metafieldValue = JSON.stringify({ type: discountType, percentage, fixedAmount: fixedValue || 0, remaining_threshold: newRemaining, total_threshold: newTotalThreshold });

    try {
      await admin.graphql(UPDATE_DISCOUNT_MUTATION, {
        variables: {
          id: discount.discountGid,
          discount: {
            title,
            startsAt: startDate.toISOString(),
            ...(endDate ? { endsAt: endDate.toISOString() } : { endsAt: null }),
          }
        }
      });
      await admin.graphql(SET_METAFIELD_MUTATION, {
        variables: {
          metafields: [{ ownerId: discount.discountGid, namespace: "$app", key: "discount_config", type: "json", value: metafieldValue }],
        }
      });
    } catch (e) {
      console.error("Error updating discount in Shopify:", e);
    }

    await prisma.discountThreshold.update({
      where: { id },
      data: { title, discountType, percentage, fixedValue, totalThreshold: newTotalThreshold, remainingAmount: newRemaining, startDate, endDate, version: { increment: 1 } },
    });

    return json({ success: true, actionType: "edit" });
  }

  return json({ success: false });
};

function CopyBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
    >
      <Badge tone="info">{code}</Badge>
      <Tooltip content={copied ? "Copied!" : "Copy Coupon code"}>
        <div
          onClick={handleCopy}
          style={{
            cursor: "pointer",
            opacity: isHovered || copied ? 1 : 0,
            transition: "opacity 0.2s",
            position: "relative", width: "20px", height: "20px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", opacity: copied ? 0 : 1, transition: "opacity 0.2s" }}>
            <Icon source={ClipboardIcon} tone="base" />
          </div>
          <div style={{ position: "absolute", opacity: copied ? 1 : 0, transition: "opacity 0.2s" }}>
            <Icon source={CheckIcon} tone="success" />
          </div>
        </div>
      </Tooltip>
    </div>
  );
}

function getCurrencySymbol(currencyCode: string) {
  try {
    const parts = new Intl.NumberFormat("en", { style: "currency", currency: currencyCode, currencyDisplay: "narrowSymbol" }).formatToParts(0);
    return parts.find(p => p.type === "currency")?.value || currencyCode;
  } catch {
    return currencyCode;
  }
}

function formatCurrency(amount: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)}`;
  }
}

export default function Index() {
  const { discounts, currencyCode, usageCounts, discountStatuses } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = (navigation.state === "submitting" && navigation.formData?.get("intent") === "create") || (navigation.state === "submitting" && navigation.formData?.get("intent") === "edit");

  const [view, setViewState] = useState<"list" | "create" | "edit">(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      return (p.get("view") as "list" | "create" | "edit") || "list";
    }
    return "list";
  });
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("id");
    }
    return null;
  });

  const setView = useCallback((v: "list" | "create" | "edit", id?: string) => {
    setViewState(v);
    setSelectedDiscountId(id || null);
    // Silently update URL for reload persistence — no Remix navigation triggered
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      if (v !== "list") params.set("view", v);
      if (v === "edit" && id) params.set("id", id);
      const qs = params.toString();
      window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    }
  }, []);
  // const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const errors = (actionData as any)?.errors || {};

  useEffect(() => {
    if (actionData?.success) {
      if (actionData.actionType === "create") {
        setView("list");
        setToastMessage("Discount created successfully");
        setToastActive(true);
      } else if (actionData.actionType === "edit") {
        setView("list");
        setToastMessage("Discount updated successfully");
        setToastActive(true);
      } else if (actionData.actionType === "delete") {
        setView("list");
        setToastMessage("Discount deleted successfully");
        setToastActive(true);
      } else if (actionData.actionType === "toggle") {
        setToastMessage("Discount status updated");
        setToastActive(true);
      } else if (actionData.actionType === "bulkActivate") {
        setToastMessage("Discounts activated successfully");
        setToastActive(true);
      } else if (actionData.actionType === "bulkDeactivate") {
        setToastMessage("Discounts deactivated successfully");
        setToastActive(true);
      } else if (actionData.actionType === "bulkDelete") {
        setView("list");
        setToastMessage("Discounts deleted successfully");
        setToastActive(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  const [deleteTargetIds, setDeleteTargetIds] = useState<string[] | null>(null);

  const confirmDelete = useCallback(() => {
    if (!deleteTargetIds || deleteTargetIds.length === 0) return;
    const formData = new FormData();
    if (deleteTargetIds.length === 1) {
      formData.set("intent", "delete");
      formData.set("id", deleteTargetIds[0]);
    } else {
      formData.set("intent", "bulkDelete");
      formData.set("ids", JSON.stringify(deleteTargetIds));
    }
    submit(formData, { method: "post" });
    setDeleteTargetIds(null);
  }, [deleteTargetIds, submit]);

  // const handleToggle = useCallback((id: string, currentIsActive: boolean) => {
  //   const formData = new FormData();
  //   formData.set("intent", "toggle");
  //   formData.set("id", id);
  //   formData.set("currentIsActive", String(currentIsActive));
  //   submit(formData, { method: "post" });
  // }, [submit]);

  const [selectedTab, setSelectedTab] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode();
  const [queryValue, setQueryValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;
  
  const tabs = ['All', 'Active', 'Scheduled', 'Expired'].map((item, index) => ({
    content: item,
    id: `${item}-${index}`,
    onAction: () => setSelectedTab(index),
  }));

  const filteredDiscounts = discounts.filter((d: any) => {
    const status = discountStatuses[d.id] || (d.isActive ? 'ACTIVE' : 'INACTIVE');
    
    if (queryValue && !d.title.toLowerCase().includes(queryValue.toLowerCase()) && !d.discountCode.toLowerCase().includes(queryValue.toLowerCase())) {
      return false;
    }
    if (selectedTab === 1 && status !== 'ACTIVE') return false;
    if (selectedTab === 2 && status !== 'SCHEDULED') return false;
    if (selectedTab === 3 && status !== 'EXPIRED') return false;
    
    return true;
  });

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [queryValue, selectedTab]);

  const totalPages = Math.max(1, Math.ceil(filteredDiscounts.length / PAGE_SIZE));
  const paginatedDiscounts = filteredDiscounts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const startIndex = filteredDiscounts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, filteredDiscounts.length);

  const {selectedResources, allResourcesSelected, handleSelectionChange, clearSelection} = useIndexResourceState(filteredDiscounts as any);

  const handleBulkAction = useCallback((intent: string) => {
    const formData = new FormData();
    formData.set("intent", intent);
    formData.set("ids", JSON.stringify(selectedResources));
    submit(formData, { method: "post" });
    clearSelection();
  }, [selectedResources, submit, clearSelection]);

  const rowMarkup = paginatedDiscounts.map((d: any, index: number) => {
    const status = discountStatuses[d.id] || "";
    const isActive = status === 'ACTIVE' || status === 'SCHEDULED' || (status === "" && d.isActive);
    const startDateLabel = d.startDate ? new Date(d.startDate).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' }) : "-";
    const endDateLabel = d.endDate ? new Date(d.endDate).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' }) : " ";
    const activeDatesLabel = d.endDate ? `${startDateLabel} — ${endDateLabel}` : startDateLabel;

    return (
      <IndexTable.Row id={d.id} key={d.id} selected={selectedResources.includes(d.id)} position={index}>
        <IndexTable.Cell>
          <Box paddingBlock="300">
            <Tooltip content="Edit discount" dismissOnMouseOut>
              <div
                onClick={(e) => { e.stopPropagation(); setView("edit", d.id); }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "none"; }}
                style={{ cursor: "pointer", display: "inline" }}
              >
                <Text as="span" variant="bodyMd" fontWeight="semibold" tone="subdued">{d.title}</Text>
              </div>
            </Tooltip>
          </Box>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Box paddingBlock="300">
            <CopyBadge code={d.discountCode} />
          </Box>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Box paddingBlock="300">
            {d.discountType === "fixed" ? formatCurrency(d.fixedValue, currencyCode) : `${d.percentage}%`}
          </Box>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Box paddingBlock="300">
            {formatCurrency(d.totalThreshold, currencyCode)}
          </Box>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Box paddingBlock="300">
            {formatCurrency(d.usedAmount, currencyCode)}
          </Box>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Box paddingBlock="300">
            <Text as="span" tone={d.remainingAmount > 0 ? "success" : "critical"}>
              {formatCurrency(d.remainingAmount, currencyCode)}
            </Text>
          </Box>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Box paddingBlock="300">
            {activeDatesLabel}
          </Box>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Box paddingBlock="300">
            <Text as="span">{usageCounts[d.id] ?? 0}</Text>
          </Box>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Box paddingBlock="300">
            <Badge tone={status === 'SCHEDULED' ? "attention" : (isActive ? "success" : status === "EXPIRED" ? "enabled" : "enabled")}>
              {status ? status.charAt(0) + status.slice(1).toLowerCase() : (d.isActive ? "Active" : "Inactive")}
            </Badge>
          </Box>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });


  // function RowActions({ id, isActive, onEdit, onToggle, onDelete }: { id: string, isActive: boolean, onEdit: () => void, onToggle: () => void, onDelete: () => void }) {
  //   const [popoverActive, setPopoverActive] = useState(false);
  //   return (
  //     <Popover
  //       active={popoverActive}
  //       activator={<Button variant="tertiary" icon={MenuHorizontalIcon} onClick={() => setPopoverActive((a) => !a)} />}
  //       onClose={() => setPopoverActive(false)}
  //       autofocusTarget="first-node"
  //     >
  //       <ActionList
  //         actionRole="menuitem"
  //         items={[
  //           { content: 'Edit', onAction: () => { setPopoverActive(false); onEdit(); } },
  //           { content: isActive ? 'Deactivate' : 'Activate', destructive: isActive, onAction: () => { setPopoverActive(false); onToggle(); } },
  //           { content: 'Delete', destructive: true, onAction: () => { setPopoverActive(false); onDelete(); } },
  //         ]}
  //       />
  //     </Popover>
  //   );
  // }

  function DateSelectionPicker({ label, dateStr, onChange, helpText, error }: { label: string, dateStr: string, onChange: (date: string) => void, helpText?: string, error?: string }) {
    const [popoverActive, setPopoverActive] = useState(false);
  
    // Default to today if dateStr is empty, or parse DD-MM-YYYY
    let selectedDate = new Date();
    if (dateStr) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        selectedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
      }
    }
    if (isNaN(selectedDate.getTime())) {
      selectedDate = new Date();
    }
    
    // Polaris DatePicker expects { month, year } object for the view
    const [{ month, year }, setDate] = useState({
      month: selectedDate.getMonth(),
      year: selectedDate.getFullYear(),
    });
  
    const handleMonthChange = useCallback((month: number, year: number) => setDate({ month, year }), []);
  
    const handleDateSelection = useCallback(
      ({ end: newSelectedDate }: { end: Date }) => {
        setPopoverActive(false);
        // Format to DD-MM-YYYY consistently
        const dd = String(newSelectedDate.getDate()).padStart(2, '0');
        const mm = String(newSelectedDate.getMonth() + 1).padStart(2, '0');
        const yyyy = newSelectedDate.getFullYear();
        onChange(`${dd}-${mm}-${yyyy}`);
      },
      [onChange]
    );
  
    const displayValue = dateStr ? dateStr : "Select Date (DD-MM-YYYY)";
  
    return (
      <Popover
        active={popoverActive}
        autofocusTarget="none"
        preferredAlignment="left"
        fullWidth
        preferInputActivator={false}
        preferredPosition="below"
        preventCloseOnChildOverlayClick
        onClose={() => setPopoverActive(false)}
        activator={
          <div style={{ position: "relative" }}>
            <TextField
              label={label}
              value={displayValue}
              onChange={() => {}}
              onFocus={() => setPopoverActive(true)}
              autoComplete="off"
              helpText={helpText}
              error={error}
              prefix={<Icon source={CalendarIcon} />}
            />
            {/* Hidden overlay to capture clicks without interfering with input styles */}
            <div 
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer', zIndex: 10 }}
              onClick={() => setPopoverActive(!popoverActive)}
            />
            {/* Hidden input to ensure the value reaches Remix Form POST */}
            <input type="hidden" name={label === "Start Date" ? "startDate" : "endDate"} value={dateStr} />
          </div>
        }
      >
        <Card>
          <DatePicker
            month={month}
            year={year}
            selected={selectedDate}
            onMonthChange={handleMonthChange}
            onChange={handleDateSelection}
          />
        </Card>
      </Popover>
    );
  }

  if (view === "create") {
    return <CreateDiscountView onCancel={() => setView("list")} errors={errors} isSubmitting={isSubmitting} currencyCode={currencyCode} DateSelectionPicker={DateSelectionPicker} />;
  }

  if (view === "edit" && selectedDiscountId) {
    const discount = discounts.find((d: any) => d.id === selectedDiscountId);
    if (!discount) { setView("list"); return null; }
    return <EditDiscountView discount={discount} onCancel={() => setView("list")} errors={errors} isSubmitting={isSubmitting} currencyCode={currencyCode} DateSelectionPicker={DateSelectionPicker} />;
  }

  return (
    <Frame>
      <Page fullWidth title="Discount Threshold" primaryAction={{ content: "Create Discount", onAction: () => setView("create", undefined) }} >
        <Layout>
          <Layout.Section>
            <Card padding="0">
              {discounts.length === 0 ? (
                <Box padding="400">
                  <EmptyState heading="No discount codes yet" image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" action={{ content: "Create your first discount", onAction: () => setView("create", undefined) }}>
                    <p>Create discount codes with a threshold budget to control total discount spend.</p>
                  </EmptyState>
                </Box>
              ) : (
                <>
                  <IndexFilters
                    sortOptions={[]}
                    sortSelected={[]}
                    onSort={() => {}}
                    queryValue={queryValue}
                    queryPlaceholder="Searching in all"
                    onQueryChange={setQueryValue}
                    onQueryClear={() => setQueryValue('')}
                    primaryAction={{ type: 'save', onAction: async () => true, disabled: false, loading: false }}
                    cancelAction={{ onAction: () => {}, disabled: false, loading: false }}
                    tabs={tabs}
                    selected={selectedTab}
                    onSelect={setSelectedTab}
                    canCreateNewView={false}
                    filters={[]}
                    appliedFilters={[]}
                    onClearAll={() => {}}
                    mode={mode}
                    setMode={setMode}
                  />
                  <IndexTable
                    resourceName={{ singular: 'discount', plural: 'discounts' }}
                    itemCount={filteredDiscounts.length}
                    selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                    onSelectionChange={handleSelectionChange}
                    promotedBulkActions={[
                      {
                        content: 'Activate discounts',
                        onAction: () => handleBulkAction("bulkActivate"),
                      },
                      {
                        content: 'Deactivate discounts',
                        onAction: () => handleBulkAction("bulkDeactivate"),
                      },
                      {
                        content: 'Delete discounts',
                        onAction: () => {
                          setDeleteTargetIds(selectedResources);
                          clearSelection();
                        },
                      },
                    ]}
                    headings={[
                      { title: "Name" },
                      { title: "Coupon Code" },
                      { title: "Discount" },
                      { title: "Total Budget" },
                      { title: "Used" },
                      { title: "Remaining" },
                      { title: "Active Dates" },
                      { title: "Code Used" },
                      { title: "Status" },
                    ]}
                  >
                    {rowMarkup}
                  </IndexTable>
                  <Box
                    paddingInline="300"
                    paddingBlock="300"
                    borderBlockStartWidth="025"
                    borderColor="border"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="p" tone="subdued" variant="bodySm">
                        {filteredDiscounts.length === 0
                          ? "No discounts"
                          : `${startIndex}–${endIndex} of ${filteredDiscounts.length} discounts`}
                      </Text>
                      <Pagination
                        hasPrevious={currentPage > 1}
                        onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        hasNext={currentPage < totalPages}
                        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      />
                    </InlineStack>
                  </Box>
                </>
              )}
            </Card>
          </Layout.Section>
        </Layout>
        {/* <FooterHelp>
          Learn more about{" "}
          <Link url="https://help.shopify.com/manual/discounts" target="_blank">
            discounts
          </Link>
        </FooterHelp> */}
        <Modal
          open={!!deleteTargetIds && deleteTargetIds.length > 0}
          onClose={() => setDeleteTargetIds(null)}
          title={`Delete ${deleteTargetIds?.length === 1 ? 'discount code' : 'discount codes'}?`}
          primaryAction={{ content: "Delete", destructive: true, onAction: confirmDelete, loading: navigation.state === "submitting" && (navigation.formData?.get("intent") === "delete" || navigation.formData?.get("intent") === "bulkDelete") }}
          secondaryActions={[{ content: "Cancel", onAction: () => setDeleteTargetIds(null) }]}
        >
          <Modal.Section>
            <BlockStack gap="200">
              <Text as="p">This will permanently delete the selected discount(s) from both your app and Shopify.</Text>
              <Text as="p" tone="critical">This action cannot be undone.</Text>
            </BlockStack>
          </Modal.Section>
        </Modal>
        {toastActive && <Toast content={toastMessage} onDismiss={() => setToastActive(false)} />}
      </Page>
    </Frame>
  );
}

function CreateDiscountView({ onCancel, errors, isSubmitting, currencyCode, DateSelectionPicker }: Record<string, any>) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [percentage, setPercentage] = useState("");
  const [fixedValue, setFixedValue] = useState("");
  const [threshold, setThreshold] = useState("");
  const handleCodeChange = useCallback((v: string) => setCode(v.toUpperCase().replace(/[^A-Z0-9_-]/g, "")), []);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  });
  const [endDateChanged, setEndDateChanged] = useState(false);

  const handleStartDateChange = useCallback((v: string) => {
    setStartDate(v);
    if (!endDateChanged && v) {
      // Parse DD-MM-YYYY
      const parts = v.split('-');
      if (parts.length === 3) {
        const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
        if (!isNaN(d.getTime())) {
          d.setFullYear(d.getFullYear() + 1);
          const dd = String(d.getDate()).padStart(2, '0');
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const yyyy = d.getFullYear();
          setEndDate(`${dd}-${mm}-${yyyy}`);
        }
      }
    }
  }, [endDateChanged]);

  const handleEndDateChange = useCallback((v: string) => {
    setEndDate(v);
    setEndDateChanged(true);
  }, []);

  return (
    <Page title="Create Discount Code" backAction={{ content: "Discount Codes", onAction: onCancel }}>
      <Layout>
        {errors.general && <Layout.Section><Banner tone="critical" title="Error"><p>{errors.general}</p></Banner></Layout.Section>}
        <Layout.Section>
          <Form method="post">
            <input type="hidden" name="intent" value="create" />
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Discount Details</Text>
                  <FormLayout>
                    <TextField label="Name" name="title" value={title} onChange={setTitle} helpText="Internal name for this discount" error={errors.title} autoComplete="off" />
                    <TextField label="Coupon Code" name="code" value={code} onChange={handleCodeChange} helpText="Customers enter this code at checkout. Uppercase only." error={errors.code} autoComplete="off" />
                  </FormLayout>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Discount Configuration</Text>
                  <FormLayout>
                    <Select label="Discount Type" name="discountType" options={[{label: "Percentage", value: "percentage"}, {label: "Fixed Amount", value: "fixed"}]} value={discountType} onChange={setDiscountType} />
                    <FormLayout.Group>
                      {discountType === "percentage" ? (
                        <TextField label="Discount Percentage" name="percentage" value={percentage} onChange={setPercentage} suffix="%" type="number" helpText="Percentage off the order subtotal (1–100)" error={errors.percentage} autoComplete="off" />
                      ) : (() => {
                        const fixedNum = parseFloat(fixedValue);
                        const threshNum = parseFloat(threshold);
                        const fixedClientError = (!isNaN(fixedNum) && !isNaN(threshNum) && fixedNum > threshNum)
                          ? "Fixed discount amount cannot be greater than the total threshold budget"
                          : errors.fixedValue;
                        return <TextField label="Fixed Discount Amount" name="fixedValue" value={fixedValue} onChange={setFixedValue} prefix={getCurrencySymbol(currencyCode)} type="number" helpText="Flat deduction from subtotal" error={fixedClientError} autoComplete="off" />;
                      })()}
                      <TextField label="Threshold Budget" name="threshold" value={threshold} onChange={setThreshold} prefix={getCurrencySymbol(currencyCode)} type="number" helpText="Maximum total discount amount" error={errors.threshold} autoComplete="off" />
                    </FormLayout.Group>
                    <FormLayout.Group>
                      <DateSelectionPicker label="Start Date" dateStr={startDate} onChange={handleStartDateChange} error={errors.startDate} />
                      <DateSelectionPicker label="End Date" dateStr={endDate} onChange={handleEndDateChange} helpText="Defaults to 1 year after start date" error={errors.endDate} />
                    </FormLayout.Group>
                  </FormLayout>
                </BlockStack>
              </Card>
              <Divider />
              <InlineStack gap="300" align="end">
                <Button onClick={onCancel}>Cancel</Button>
                <Button variant="primary" submit loading={isSubmitting}>Create Discount</Button>
              </InlineStack>
            </BlockStack>
          </Form>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function EditDiscountView({ discount, onCancel, errors, isSubmitting, currencyCode, DateSelectionPicker }: Record<string, any>) {
  const [title, setTitle] = useState(discount.title);
  const [discountType, setDiscountType] = useState(discount.discountType || "percentage");
  const [percentage, setPercentage] = useState(discount.percentage ? String(discount.percentage) : "");
  const [fixedValue, setFixedValue] = useState(discount.fixedValue ? String(discount.fixedValue) : "");
  const [threshold, setThreshold] = useState(String(discount.totalThreshold));

  const [startDate, setStartDate] = useState(() => {
    if (discount.startDate) {
      const d = new Date(discount.startDate);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
    return "";
  });
  const [endDate, setEndDate] = useState(() => {
    if (discount.endDate) {
      const d = new Date(discount.endDate);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
    return "";
  });
  const [endDateChanged, setEndDateChanged] = useState(!!discount.endDate);

  const handleStartDateChange = useCallback((v: string) => {
    setStartDate(v);
    if (!endDateChanged && v) {
      // Parse DD-MM-YYYY
      const parts = v.split('-');
      if (parts.length === 3) {
        const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
        if (!isNaN(d.getTime())) {
          d.setFullYear(d.getFullYear() + 1);
          const dd = String(d.getDate()).padStart(2, '0');
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const yyyy = d.getFullYear();
          setEndDate(`${dd}-${mm}-${yyyy}`);
        }
      }
    }
  }, [endDateChanged]);

  const handleEndDateChange = useCallback((v: string) => {
    setEndDate(v);
    setEndDateChanged(true);
  }, []);

  return (
    <Page title="Edit Discount" backAction={{ content: "Discount Codes", onAction: onCancel }}>
      <Layout>
        {errors.general && <Layout.Section><Banner tone="critical" title="Error"><p>{errors.general}</p></Banner></Layout.Section>}
        <Layout.Section>
          <Form method="post">
            <input type="hidden" name="intent" value="edit" />
            <input type="hidden" name="id" value={discount.id} />
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">Discount Details</Text>
                    <Badge tone="info">{discount.discountCode}</Badge>
                  </InlineStack>
                  <FormLayout>
                    <TextField label="Name" name="title" value={title} onChange={setTitle} error={errors.title} autoComplete="off" />
                  </FormLayout>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Threshold Status</Text>
                  <InlineGrid columns={{ xs: 1, sm: 3 }} gap="400">
                    <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm" tone="subdued">Total Budget</Text>
                        <Text as="p" variant="headingLg">{formatCurrency(discount.totalThreshold, currencyCode)}</Text>
                      </BlockStack>
                    </Box>
                    <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm" tone="subdued">Used</Text>
                        <Text as="p" variant="headingLg">{formatCurrency(discount.usedAmount, currencyCode)}</Text>
                      </BlockStack>
                    </Box>
                    <Box padding="400" background={discount.remainingAmount > 0 ? "bg-surface-success" : "bg-surface-critical"} borderRadius="200">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm" tone="subdued">Remaining</Text>
                        <Text as="p" variant="headingLg" tone={discount.remainingAmount > 0 ? "success" : "critical"}>
                          {formatCurrency(discount.remainingAmount, currencyCode)}
                        </Text>
                      </BlockStack>
                    </Box>
                  </InlineGrid>
                  <Divider />
                  <FormLayout>
                     <Select label="Discount Type" name="discountType" options={[{label: "Percentage", value: "percentage"}, {label: "Fixed Amount", value: "fixed"}]} value={discountType} onChange={setDiscountType} />
                    <FormLayout.Group>
                      {discountType === "percentage" ? (
                        <TextField label="Discount Percentage" name="percentage" value={percentage} onChange={setPercentage} suffix="%" type="number" error={errors.percentage} autoComplete="off" />
                      ) : (() => {
                        const fixedNum = parseFloat(fixedValue);
                        const threshNum = parseFloat(threshold);
                        const fixedClientError = (!isNaN(fixedNum) && !isNaN(threshNum) && fixedNum > threshNum)
                          ? "Fixed discount amount cannot be greater than the total threshold budget"
                          : errors.fixedValue;
                        return <TextField label="Fixed Discount Amount" name="fixedValue" value={fixedValue} onChange={setFixedValue} prefix={getCurrencySymbol(currencyCode)} type="number" helpText="Flat deduction from subtotal" error={fixedClientError} autoComplete="off" />;
                      })()}
                      <TextField label="Total Threshold Budget" name="threshold" value={threshold} onChange={setThreshold} prefix={getCurrencySymbol(currencyCode)} type="number" helpText={`Must be at least ${formatCurrency(discount.usedAmount, currencyCode)} (already used)`} error={errors.threshold} autoComplete="off" />
                    </FormLayout.Group>
                    <FormLayout.Group>
                      <DateSelectionPicker label="Start Date" dateStr={startDate} onChange={handleStartDateChange} error={errors.startDate} />
                      <DateSelectionPicker label="End Date" dateStr={endDate} onChange={handleEndDateChange} helpText="Clear exactly to remove end date" error={errors.endDate} />
                    </FormLayout.Group>
                  </FormLayout>
                </BlockStack>
              </Card>
              <Divider />
              <InlineStack gap="300" align="end">
                <Button onClick={onCancel}>Cancel</Button>
                <Button variant="primary" submit loading={isSubmitting}>Save Changes</Button>
              </InlineStack>
            </BlockStack>
          </Form>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
