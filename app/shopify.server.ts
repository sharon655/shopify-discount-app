import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma, { withRetry } from "./db.server";

// Create base session storage
const baseSessionStorage = new PrismaSessionStorage(prisma);

// Wrap session storage methods with retry logic
const resilientSessionStorage = {
  ...baseSessionStorage,

  storeSession: (session: any) => withRetry(() => baseSessionStorage.storeSession(session), 3, 1000),
  loadSession: (id: string) => withRetry(() => baseSessionStorage.loadSession(id), 3, 1000),
  deleteSession: (id: string) => withRetry(() => baseSessionStorage.deleteSession(id), 3, 1000),
  findSessionsByShop: (shop: string) => withRetry(() => baseSessionStorage.findSessionsByShop(shop), 3, 1000),
  deleteSessions: (shops: string[]) => withRetry(() => baseSessionStorage.deleteSessions(shops), 3, 1000),
};

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: resilientSessionStorage as any,
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
