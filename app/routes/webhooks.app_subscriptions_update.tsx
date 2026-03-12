// app/routes/webhooks.app_subscriptions_update.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "app/shopify.server";
import prisma from "../db.server";

export async function action({ request }: ActionFunctionArgs) {
  const { topic, shop, payload } = await authenticate.webhook(request);

  if (topic === "APP_SUBSCRIPTIONS_UPDATE") {
    const sub = payload.app_subscription;
    const status = sub.status;

    if (status === "CANCELLED") {
      await prisma.session.update({
        where: { shop },
        data: { planId: null },
      });
    }
    // you can extend for "PAUSED" etc
  }

  return new Response("OK");
}
