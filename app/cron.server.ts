import cron from "node-cron";
import { processFreeProductStockWarnings } from "./services/free-product-stock.server";
import { processDiscountReminders } from "./services/discount-reminder.server";
import { processThresholdWarnings } from "./services/threshold-warning.server";

declare global {
  var cronSchedulerStarted: boolean;
}

export function initCron() {
  if (global.cronSchedulerStarted) {
    console.log("[-] Cron scheduler already initialized, skipping duplicate startup.");
    return;
  }

  global.cronSchedulerStarted = true;
  console.log(`[+] [${new Date().toISOString()}] Initializing in-process cron scheduler in America/New_York timezone...`);

  // Hourly job: runs at minute 0 of every hour
  cron.schedule("0 * * * *", async () => {
    console.log(`[+] [${new Date().toISOString()}] Running hourly job: free product stock warnings...`);
    try {
      const stats = await processFreeProductStockWarnings();
      console.log(`[+] [${new Date().toISOString()}] Hourly job completed successfully:`, JSON.stringify(stats));
    } catch (error) {
      console.error(`[-] [${new Date().toISOString()}] Hourly job failed:`, error);
    }
  }, {
    timezone: "America/New_York"
  });

  // Daily jobs: runs at 9:00 AM every day
  cron.schedule("0 9 * * *", async () => {
    console.log(`[+] [${new Date().toISOString()}] Running daily jobs...`);

    // 1. Discount Reminders
    console.log(`[+] [${new Date().toISOString()}] Starting daily job: discount reminders...`);
    try {
      const remindersStats = await processDiscountReminders();
      console.log(`[+] [${new Date().toISOString()}] Daily job (discount reminders) completed successfully:`, JSON.stringify(remindersStats));
    } catch (error) {
      console.error(`[-] [${new Date().toISOString()}] Daily job (discount reminders) failed:`, error);
    }

    // 2. Threshold Warnings
    console.log(`[+] [${new Date().toISOString()}] Starting daily job: threshold warnings...`);
    try {
      const warningsStats = await processThresholdWarnings();
      console.log(`[+] [${new Date().toISOString()}] Daily job (threshold warnings) completed successfully:`, JSON.stringify(warningsStats));
    } catch (error) {
      console.error(`[-] [${new Date().toISOString()}] Daily job (threshold warnings) failed:`, error);
    }
  }, {
    timezone: "America/New_York"
  });
}
