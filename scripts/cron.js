#!/usr/bin/env node

const BASE_URL = process.env.SHOPIFY_APP_URL || 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET;

async function call(url) {
  // Ensure safe URL resolution without duplicate slashes
  const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  try {
    const response = await fetch(`${cleanBaseUrl}${cleanUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cron-secret": CRON_SECRET || "",
        "Authorization": `Bearer ${CRON_SECRET || ""}`,
      },
    });

    const responseText = await response.text();
    console.log(`[${new Date().toISOString()}] POST ${cleanUrl} -> Status: ${response.status}. Response: ${responseText}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] POST ${cleanUrl} -> Error:`, error.message);
  }
}

(async () => {
  const now = new Date();

  // Determine the current time in America/New_York (EST/EDT)
  const estTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const hour = Number(estTime.find(x => x.type === "hour").value);
  const minute = Number(estTime.find(x => x.type === "minute").value);

  console.log(`[${now.toISOString()}] Executing cron script. Current time in New York: ${hour}:${minute.toString().padStart(2, '0')}`);

  // Every hour
  await call("/api/cron/free-product-stock");

  // Daily at 9:00 AM EST/EDT
  // (We check if hour is 9. This is safe and ensures that even if the hourly scheduler runs slightly late (e.g. 9:01 AM), the daily jobs will still execute).
  if (hour === 9) {
    await call("/api/cron/discount-reminders");
    await call("/api/cron/threshold-warnings");
  }
})();
