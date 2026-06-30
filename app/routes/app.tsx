import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import enTranslations from '@shopify/polaris/locales/en.json';

import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // Dynamically set shop metafield with the current app URL from process.env
  const appUrl = process.env.SHOPIFY_APP_URL;
  if (appUrl) {
    try {
      const response = await admin.graphql(`
        query {
          shop {
            id
          }
        }
      `);
      const responseJson = await response.json() as any;
      const shopId = responseJson?.data?.shop?.id;

      if (shopId) {
        const mfResponse = await admin.graphql(`
          mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
              userErrors { field message }
            }
          }
        `, {
          variables: {
            metafields: [{
              ownerId: shopId,
              namespace: "custom",
              key: "app_url",
              type: "single_line_text_field",
              value: appUrl
            }]
          }
        });
        const mfResponseJson = await mfResponse.json() as any;
        const errors = mfResponseJson?.data?.metafieldsSet?.userErrors || [];
        if (errors.length > 0) {
          console.error("Failed to set shop app_url metafield:", JSON.stringify(errors));
        } else {
          console.log("Successfully updated shop app_url metafield to:", appUrl);
        }
      }
    } catch (e) {
      console.error("Error setting shop app_url metafield:", e);
    }
  }

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey} i18n={enTranslations}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
