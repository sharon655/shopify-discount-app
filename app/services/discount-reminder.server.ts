import { ReminderType } from "@prisma/client";
import prisma from "../db.server";
import { sendDiscountExpirationReminder } from "./email.server";

export interface DiscountReminderStats {
  success: boolean;
  checked: number;
  sent10Day: number;
  sent1Day: number;
  skipped: number;
  failed: number;
  durationMs: number;
  error?: string;
}

// Calculate days difference between two dates based on local calendar dates
export function getDaysDifference(endDate: Date, today: Date): number {
  const d1 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const d2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const diffMs = d1 - d2;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  
  console.log(`[discount-reminder] [getDaysDifference]`);
  console.log(`  - endDate: ${endDate.toISOString()} -> local components: y=${endDate.getFullYear()}, m=${endDate.getMonth()+1}, d=${endDate.getDate()}`);
  console.log(`  - today:   ${today.toISOString()} -> local components: y=${today.getFullYear()}, m=${today.getMonth()+1}, d=${today.getDate()}`);
  console.log(`  - diffDays computed: ${diffDays} (diffMs: ${diffMs})`);
  
  return diffDays;
}

export async function processDiscountReminders(): Promise<DiscountReminderStats> {
  const startTime = Date.now();
  console.log(`[discount-reminder] Job started at ${new Date().toISOString()}`);

  let checked = 0;
  let sent10Day = 0;
  let sent1Day = 0;
  let skipped = 0;
  let failed = 0;

  try {
    // 1. Retrieve all active discounts with an expiration date
    const discounts = await prisma.discountThreshold.findMany({
      where: {
        isActive: true,
        endDate: {
          not: null,
        },
      },
    });

    const today = new Date();
    console.log(`[discount-reminder] Retrieved ${discounts.length} active discounts with expiration dates to evaluate.`);

    for (const discount of discounts) {
      checked++;

      if (!discount.endDate) {
        skipped++;
        continue;
      }

      console.log(`[discount-reminder] Evaluating discount "${discount.title}" (code: ${discount.discountCode}, id: ${discount.id})`);

      // 2. Determine remaining days
      const remainingDays = getDaysDifference(discount.endDate, today);

      let reminderType: ReminderType | null = null;
      if (remainingDays === 10) {
        reminderType = ReminderType.TEN_DAYS;
      } else if (remainingDays === 1) {
        reminderType = ReminderType.ONE_DAY;
      }

      // If it's not exactly 10 days or 1 day before expiration, skip it
      if (!reminderType) {
        skipped++;
        continue;
      }

      // 3. Check whether a reminder log already exists
      const existingLog = await prisma.discountReminderLog.findFirst({
        where: {
          discountId: discount.id,
          reminderType,
          status: "SUCCESS", // Only skip if successfully sent
        },
      });

      if (existingLog) {
        console.log(`[discount-reminder] Skip: ${reminderType} reminder already sent to ${existingLog.sentTo} for discount ${discount.id}`);
        skipped++;
        continue;
      }

      // Fetch recipient email address first
      let sentTo = process.env.REMINDER_EMAIL || "";
      if (!sentTo) {
        const session = await prisma.session.findUnique({
          where: { shop: discount.shop },
        });
        sentTo = session?.email || `merchant@${discount.shop}`;
      }

      // 4. Send the email and record result
      try {
        await sendDiscountExpirationReminder({
          discount,
          reminderType,
        });

        // 5. Record SUCCESS in log via upsert
        await prisma.discountReminderLog.upsert({
          where: {
            discountId_reminderType: {
              discountId: discount.id,
              reminderType,
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
            reminderType,
            sentTo,
            status: "SUCCESS",
          },
        });

        console.log(`[discount-reminder] Success: Sent ${reminderType} reminder to ${sentTo} for discount ${discount.id}`);

        if (reminderType === ReminderType.TEN_DAYS) {
          sent10Day++;
        } else {
          sent1Day++;
        }
      } catch (err: any) {
        const errorMessage = err?.message || String(err);
        console.error(`[discount-reminder] Failed to send email for discount ${discount.id}:`, err);

        // 5. Record FAILED in log via upsert
        try {
          await prisma.discountReminderLog.upsert({
            where: {
              discountId_reminderType: {
                discountId: discount.id,
                reminderType,
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
              reminderType,
              sentTo,
              status: "FAILED",
              errorMessage: errorMessage.substring(0, 1000), // safe truncation
            },
          });
        } catch (dbErr: any) {
          console.error(`[discount-reminder] Failed to update FAILED status in DB for discount ${discount.id}:`, dbErr);
        }

        failed++;
      }
    }

    const durationMs = Date.now() - startTime;
    console.log(
      `[discount-reminder] Job completed in ${durationMs}ms. Summary: Checked: ${checked}, Sent10Day: ${sent10Day}, Sent1Day: ${sent1Day}, Skipped: ${skipped}, Failed: ${failed}`
    );

    return {
      success: true,
      checked,
      sent10Day,
      sent1Day,
      skipped,
      failed,
      durationMs,
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error(`[discount-reminder] Fatal error in discount reminders process:`, error);
    return {
      success: false,
      checked,
      sent10Day,
      sent1Day,
      skipped,
      failed,
      durationMs,
      error: error?.message || String(error),
    };
  }
}
