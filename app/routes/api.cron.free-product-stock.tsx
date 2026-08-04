import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { processFreeProductStockWarnings } from "../services/free-product-stock.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json(
      { error: "Method Not Allowed" },
      {
        status: 405,
        headers: {
          Allow: "POST",
        },
      }
    );
  }

  const cronSecret = request.headers.get("x-cron-secret");
  if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
    console.warn(`[cron-free-product-stock] Unauthorized access attempt with secret: ${cronSecret}`);
    return json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const stats = await processFreeProductStockWarnings();
    return json(stats);
  } catch (error: any) {
    console.error("[cron-free-product-stock] Unhandled error during free product stock warning processing:", error);
    return json(
      {
        success: false,
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
};

export const loader = async () => {
  return json(
    { error: "Method Not Allowed" },
    {
      status: 405,
      headers: {
        Allow: "POST",
      },
    }
  );
};
