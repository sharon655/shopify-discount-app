import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { processDiscountReminders } from "../services/discount-reminder.server";

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
    console.warn(`[cron-discount-reminders] Unauthorized access attempt with secret: ${cronSecret}`);
    return json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const stats = await processDiscountReminders();
    return json(stats);
  } catch (error: any) {
    console.error("[cron-discount-reminders] Unhandled error during discount reminder processing:", error);
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
