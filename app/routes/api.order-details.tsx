import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId") || url.searchParams.get("order_id");
  const shop = url.searchParams.get("shop");

  if (!orderId) {
    return json(
      { error: "Missing orderId parameter" },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    // If shop is provided, query by both shop and orderId. Otherwise, query by orderId.
    const queryClause: any = { orderId };
    if (shop) {
      queryClause.shop = shop;
    }

    const orderRecord = await prisma.processedOrder.findFirst({
      where: queryClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!orderRecord) {
      return json(
        { error: `No discount records found for Order ID: ${orderId}` },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Map DB fields to the exact requested response format
    const responseData = {
      OrderID: orderRecord.orderId,
      "Discount Type": orderRecord.discountType,
      "Discount Category": orderRecord.discountCategory,
      "Discount Payment Method": orderRecord.paymentType,
      "Discount Value": orderRecord.discountValue,
      "Discount Product Category": orderRecord.discountProductCategory,
    };

    return json(responseData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    return json(
      { error: error.message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};
