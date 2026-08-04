import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  
  const productId = url.searchParams.get("productId");
  const productIdsParam = url.searchParams.get("productIds");

  let ids: string[] = [];
  if (productIdsParam) {
    try {
      if (productIdsParam.startsWith("[")) {
        ids = JSON.parse(productIdsParam);
      } else {
        ids = productIdsParam.split(",").map(id => id.trim()).filter(Boolean);
      }
    } catch (e) {
      ids = [];
    }
  } else if (productId) {
    ids = [productId];
  }

  if (ids.length === 0) {
    return json({ error: "Missing productId or productIds" }, { status: 400 });
  }

  try {
    const response = await admin.graphql(
      `query getProductsVariants($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on Product {
            id
            variants(first: 250) {
              nodes {
                id
                inventoryQuantity
              }
            }
          }
        }
      }`,
      { variables: { ids } }
    );

    const data = await response.json() as any;
    const nodes = data?.data?.nodes || [];

    const inStockMap: Record<string, string[]> = {};
    for (const node of nodes) {
      if (node && node.id) {
        const variants = node.variants?.nodes || [];
        inStockMap[node.id] = variants
          .filter((v: any) => v.inventoryQuantity !== 0)
          .map((v: any) => v.id);
      }
    }

    if (productId && !productIdsParam) {
      return json({ inStockVariants: inStockMap[productId] || [] });
    }

    return json({ inStockMap });
  } catch (error: any) {
    console.error("Error in api.variants-inventory loader:", error);
    return json({ error: error.message }, { status: 500 });
  }
};
