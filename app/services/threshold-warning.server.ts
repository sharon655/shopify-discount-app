import { ReminderType } from "@prisma/client";
import prisma from "../db.server";
import { sendDiscountThresholdWarning } from "./email.server";

export interface ThresholdWarningStats {
  success: boolean;
  checked: number;
  sent: number;
  skipped: number;
  failed: number;
  durationMs: number;
  error?: string;
}

export async function processThresholdWarnings(): Promise<ThresholdWarningStats> {
  const startTime = Date.now();
  console.log(`[threshold-warning] Job started at ${new Date().toISOString()}`);

  let checked = 0;
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  try {
    const limit = parseFloat(process.env.THRESHOLD_WARNING_LIMIT || "50");
    console.log(`[threshold-warning] Configured warning threshold limit: ${limit}`);

    // Retrieve all active discounts
    const discounts = await prisma.discountThreshold.findMany({
      where: {
        isActive: true,
      },
    });

    console.log(`[threshold-warning] Retrieved ${discounts.length} active discounts to evaluate.`);

    for (const discount of discounts) {
      checked++;

      console.log(`[threshold-warning] Evaluating discount "${discount.title}" (code: ${discount.discountCode}, id: ${discount.id}, remaining: ${discount.remainingAmount})`);

      // Check if the remaining budget is below the limit
      const isBelowLimit = discount.remainingAmount < limit;

      if (!isBelowLimit) {
        skipped++;
        continue;
      }

      // Check whether a BELOW_THRESHOLD warning log already exists
      const existingLog = await prisma.discountReminderLog.findFirst({
        where: {
          discountId: discount.id,
          reminderType: ReminderType.BELOW_THRESHOLD,
          status: "SUCCESS", // Only skip if successfully sent
        },
      });

      if (existingLog) {
        console.log(`[threshold-warning] Skip: BELOW_THRESHOLD warning already sent to ${existingLog.sentTo} for discount ${discount.id}`);
        skipped++;
        continue;
      }

      // Determine recipient email address
      let sentTo = process.env.REMINDER_EMAIL || "";
      if (!sentTo) {
        const session = await prisma.session.findUnique({
          where: { shop: discount.shop },
        });
        sentTo = session?.email || `merchant@${discount.shop}`;
      }

      // Send email and record result
      try {
        await sendDiscountThresholdWarning({
          discount: {
            id: discount.id,
            title: discount.title,
            discountCode: discount.discountCode,
            remainingAmount: discount.remainingAmount,
            totalThreshold: discount.totalThreshold,
            shop: discount.shop,
          },
          warningLimit: limit,
        });

        // Record SUCCESS in log via upsert
        await prisma.discountReminderLog.upsert({
          where: {
            discountId_reminderType: {
              discountId: discount.id,
              reminderType: ReminderType.BELOW_THRESHOLD,
            },
          },
          update: {
            sentTo,
            status: "SUCCESS",
            errorMessage: null,
            sentAt: new Date(),
          },
          create: {
            discountId: discount.id,
            reminderType: ReminderType.BELOW_THRESHOLD,
            sentTo,
            status: "SUCCESS",
          },
        });

        console.log(`[threshold-warning] Success: Sent warning reminder to ${sentTo} for discount ${discount.id}`);
        sent++;
      } catch (err: any) {
        const errorMessage = err?.message || String(err);
        console.error(`[threshold-warning] Failed to send email for discount ${discount.id}:`, err);

        // Record FAILED in log via upsert
        try {
          await prisma.discountReminderLog.upsert({
            where: {
              discountId_reminderType: {
                discountId: discount.id,
                reminderType: ReminderType.BELOW_THRESHOLD,
              },
            },
            update: {
              sentTo,
              status: "FAILED",
              errorMessage: errorMessage.substring(0, 1000), // safe truncation
              sentAt: new Date(),
            },
            create: {
              discountId: discount.id,
              reminderType: ReminderType.BELOW_THRESHOLD,
              sentTo,
              status: "FAILED",
              errorMessage: errorMessage.substring(0, 1000),
            },
          });
        } catch (dbErr: any) {
          console.error(`[threshold-warning] Failed to update FAILED status in DB for discount ${discount.id}:`, dbErr);
        }

        failed++;
      }
    }

    const durationMs = Date.now() - startTime;
    console.log(
      `[threshold-warning] Job completed in ${durationMs}ms. Summary: Checked: ${checked}, Sent: ${sent}, Skipped: ${skipped}, Failed: ${failed}`
    );

    return {
      success: true,
      checked,
      sent,
      skipped,
      failed,
      durationMs,
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error(`[threshold-warning] Fatal error in threshold warning process:`, error);
    return {
      success: false,
      checked,
      sent,
      skipped,
      failed,
      durationMs,
      error: error?.message || String(error),
    };
  }
}
