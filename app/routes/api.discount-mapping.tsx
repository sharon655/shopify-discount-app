import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code")?.toUpperCase();

  if (!shop || !code) {
    return json(
      { error: "Missing shop or code" },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    const now = new Date();
    const discount = await prisma.discountThreshold.findFirst({
      where: { 
        shop, 
        discountCode: code, 
        isActive: true,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } }
        ]
      },
      orderBy: { createdAt: "desc" }
    });

    let specialProducts = [];
    if (discount?.specialProducts) {
      try {
        specialProducts = JSON.parse(discount.specialProducts);
      } catch (e) {}
    }

    return json(
      { specialProducts },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
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

export const action = async () => {
  return json({});
};
