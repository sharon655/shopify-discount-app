import dns from "node:dns";
import { BrevoClient } from "@getbrevo/brevo";
import { ReminderType } from "@prisma/client";
import prisma from "../db.server";

dns.setDefaultResultOrder("ipv4first");

export interface SendDiscountReminderArgs {
  discount: {
    id: string;
    title: string;
    discountCode: string;
    endDate: Date | null;
    shop: string;
  };
  reminderType: ReminderType;
}

export async function sendDiscountExpirationReminder({
  discount,
  reminderType,
}: SendDiscountReminderArgs): Promise<{ sentTo: string }> {
  // Determine recipient email address:
  // 1. Try process.env.REMINDER_EMAIL
  // 2. Fall back to the shop owner's email in Session table
  // 3. Fall back to merchant@shop
  let sentTo = process.env.REMINDER_EMAIL || "";

  if (!sentTo) {
    const session = await prisma.session.findUnique({
      where: { shop: discount.shop },
    });
    sentTo = session?.email || `merchant@${discount.shop}`;
  }

  const isOneDay = reminderType === ReminderType.ONE_DAY;
  const remainingDays = isOneDay ? 1 : 10;
  const subject = isOneDay
    ? "Discount expires tomorrow"
    : "Discount expires in 10 days";

  const formattedDate = discount.endDate
    ? (() => {
      const d = new Date(discount.endDate);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    })()
    : "N/A";

  const badgeColor = isOneDay ? "#e74c3c" : "#f39c12";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Discount Expiration Reminder</h2>
      <p>Hello,</p>
      <p>This is a reminder that your Shopify discount is expiring soon:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 150px; color: #34495e;">Store:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;">${discount.shop}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e;">Discount Title:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;">${discount.title}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e;">Discount Code:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;"><code>${discount.discountCode}</code></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e;">Expiration Date:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e;">Remaining Days:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">
            <span style="background-color: ${badgeColor}; padding: 4px 10px; border-radius: 4px; font-weight: bold; color: white; display: inline-block;">
              ${remainingDays} ${isOneDay ? "day" : "days"}
            </span>
          </td>
        </tr>
      </table>
      <p style="margin-top: 25px; font-size: 12px; color: #7f8c8d; border-top: 1px solid #e0e0e0; padding-top: 15px;">
        This is an automated notification from your Shopify Discount app.
      </p>
    </div>
  `;

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_FROM || "noreply@shopify-discount-app.com";
  const senderName = process.env.SENDER_NAME || "Shopify Discount App";

  if (apiKey) {
    const client = new BrevoClient({ apiKey });
    const toEmails = sentTo.split(",").map((email) => ({ email: email.trim() }));

    await client.transactionalEmails.sendTransacEmail({
      subject,
      sender: {
        email: senderEmail,
        name: senderName,
      },
      to: toEmails,
      htmlContent: html,
    });
  } else {
    // Log the simulated email details to console
    console.log("-----------------------------------------");
    console.log(`[SIMULATED EMAIL SENT]`);
    console.log(`To: ${sentTo}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html}`);
    console.log("-----------------------------------------");
  }

  return { sentTo };
}

export interface SendDiscountThresholdWarningArgs {
  discount: {
    id: string;
    title: string;
    discountCode: string;
    remainingAmount: number;
    totalThreshold: number;
    shop: string;
  };
  warningLimit: number;
}

export async function sendDiscountThresholdWarning({
  discount,
  warningLimit,
}: SendDiscountThresholdWarningArgs): Promise<{ sentTo: string }> {
  let sentTo = process.env.REMINDER_EMAIL || "";

  if (!sentTo) {
    const session = await prisma.session.findUnique({
      where: { shop: discount.shop },
    });
    sentTo = session?.email || `merchant@${discount.shop}`;
  }

  const subject = `Discount budget running low: ${discount.discountCode}`;
  
  const remainingPercentage = discount.totalThreshold > 0 
    ? ((discount.remainingAmount / discount.totalThreshold) * 100).toFixed(1) 
    : "0.0";

  const badgeColor = "#e74c3c"; // red badge for warning

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">Discount Threshold Warning</h2>
      <p>Hello,</p>
      <p>This is a warning that your Shopify discount budget has fallen below the configured limit of <strong>${warningLimit}</strong>:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 200px; color: #34495e;">Store:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;">${discount.shop}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e;">Discount Title:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;">${discount.title}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e;">Discount Code:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;"><code>${discount.discountCode}</code></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e;">Total Budget:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;">${discount.totalThreshold.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e;">Remaining Budget:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">
            <span style="background-color: ${badgeColor}; padding: 4px 10px; border-radius: 4px; font-weight: bold; color: white; display: inline-block;">
              ${discount.remainingAmount.toFixed(2)} (${remainingPercentage}% remaining)
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e;">Warning Threshold Limit:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;">${warningLimit}</td>
        </tr>
      </table>
      <p style="margin-top: 25px; font-size: 12px; color: #7f8c8d; border-top: 1px solid #e0e0e0; padding-top: 15px;">
        This is an automated notification from your Shopify Discount app.
      </p>
    </div>
  `;

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_FROM || "noreply@shopify-discount-app.com";
  const senderName = process.env.SENDER_NAME || "Shopify Discount App";

  if (apiKey) {
    const client = new BrevoClient({ apiKey });
    const toEmails = sentTo.split(",").map((email) => ({ email: email.trim() }));

    await client.transactionalEmails.sendTransacEmail({
      subject,
      sender: {
        email: senderEmail,
        name: senderName,
      },
      to: toEmails,
      htmlContent: html,
    });
  } else {
    // Log the simulated email details to console
    console.log("-----------------------------------------");
    console.log(`[SIMULATED EMAIL SENT]`);
    console.log(`To: ${sentTo}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html}`);
    console.log("-----------------------------------------");
  }

  return { sentTo };
}

export interface OutOfStockItem {
  productTitle: string;
  variantTitle?: string;
  productId: string;
  variantId?: string;
}

export interface SendFreeProductOutOfStockEmailArgs {
  discount: {
    id: string;
    title: string;
    discountCode: string;
    shop: string;
  };
  outOfStockItems: OutOfStockItem[];
}

export async function sendFreeProductOutOfStockEmail({
  discount,
  outOfStockItems,
}: SendFreeProductOutOfStockEmailArgs): Promise<{ sentTo: string }> {
  let sentTo = process.env.REMINDER_EMAIL || "";

  if (!sentTo) {
    const session = await prisma.session.findUnique({
      where: { shop: discount.shop },
    });
    sentTo = session?.email || `merchant@${discount.shop}`;
  }

  const subject = `Free product out of stock: ${discount.discountCode}`;

  const outOfStockListHtml = outOfStockItems
    .map((item) => {
      if (item.variantTitle) {
        return `<li style="margin-bottom: 5px;"><strong>${item.productTitle}</strong> - Variant: <code>${item.variantTitle}</code></li>`;
      }
      return `<li style="margin-bottom: 5px;"><strong>${item.productTitle}</strong></li>`;
    })
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">Free Product Out of Stock</h2>
      <p>Hello,</p>
      <p>This is a notification that one or more free products configured for your discount are out of stock:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 200px; color: #34495e;">Store:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;">${discount.shop}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e;">Discount Title:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;">${discount.title}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e;">Discount Code:</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #2c3e50;"><code>${discount.discountCode}</code></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #34495e; vertical-align: top;">Out of Stock Free Product(s):</td>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">
            <ul style="margin: 0; padding-left: 20px; color: #c0392b;">
              ${outOfStockListHtml}
            </ul>
          </td>
        </tr>
      </table>
      <p style="margin-top: 25px; font-size: 12px; color: #7f8c8d; border-top: 1px solid #e0e0e0; padding-top: 15px;">
        This is an automated notification from your Shopify Discount app.
      </p>
    </div>
  `;

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_FROM || "noreply@shopify-discount-app.com";
  const senderName = process.env.SENDER_NAME || "Shopify Discount App";

  if (apiKey) {
    const client = new BrevoClient({ apiKey });
    const toEmails = sentTo.split(",").map((email) => ({ email: email.trim() }));

    await client.transactionalEmails.sendTransacEmail({
      subject,
      sender: {
        email: senderEmail,
        name: senderName,
      },
      to: toEmails,
      htmlContent: html,
    });
  } else {
    // Log the simulated email details to console
    console.log("-----------------------------------------");
    console.log(`[SIMULATED EMAIL SENT]`);
    console.log(`To: ${sentTo}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html}`);
    console.log("-----------------------------------------");
  }

  return { sentTo };
}


