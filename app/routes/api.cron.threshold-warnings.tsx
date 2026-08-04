import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { processThresholdWarnings } from "../services/threshold-warning.server";

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
    console.warn(`[cron-threshold-warnings] Unauthorized access attempt with secret: ${cronSecret}`);
    return json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const stats = await processThresholdWarnings();
    return json(stats);
  } catch (error: any) {
    console.error("[cron-threshold-warnings] Unhandled error during threshold warning processing:", error);
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
