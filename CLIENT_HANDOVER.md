# Discount Threshold Manager — Client Handover Documentation

> **Purpose:** This document lists every credential, account, and configuration the client needs to take ownership of this project. Fill in each `[ YOUR VALUE HERE ]` with the real value before handing over.

---

## 1. Shopify Partners Account (App Configuration)

The app is registered under a **Shopify Partners** account. The client needs either:
- Access to the existing Partners account, **OR**
- A new Partners account and a fresh app registration

### 1.1 Shopify Partners Credentials

| Field | Value |
|---|---|
| Partners Portal | https://partners.shopify.com |
| Account Email | `[ YOUR SHOPIFY PARTNERS EMAIL ]` |
| Account Password | `[ YOUR SHOPIFY PARTNERS PASSWORD ]` |

### 1.2 App Settings (inside Partners Portal)

1. Log in → **Apps** → **Discount Threshold Manager**
2. Note down / hand over:

| Field | Current Value |
|---|---|
| App Name | `Discount Threshold Manager` |
| App Handle | `discount-threshold-manager` |
| Client ID (API Key) | `[ YOUR SHOPIFY APP CLIENT ID ]` |
| Client Secret | `[ YOUR SHOPIFY APP CLIENT SECRET ]` — found in App → API credentials |
| App URL | `https://shopify-discount-app-production.up.railway.app/` |
| Allowed Redirect URL | `https://shopify-discount-app-production.up.railway.app/api/auth` |
| API Version | `2025-07` |
| Scopes | `read_discounts, read_orders, write_discounts` |

> **⚠️ Important:** The Client Secret is not stored in `shopify.app.toml`. It lives as the `SHOPIFY_API_SECRET` environment variable on Railway (see Section 3).

---

## 2. Supabase (Database)

The database is **PostgreSQL** hosted on **Supabase**. The app uses Prisma ORM to connect.

### 2.1 Supabase Credentials

| Field | Value |
|---|---|
| Supabase Dashboard | https://supabase.com/dashboard |
| Account Email | `[ YOUR SUPABASE EMAIL ]` |
| Account Password | `[ YOUR SUPABASE PASSWORD ]` |
| Project Name | `[ YOUR SUPABASE PROJECT NAME ]` |
| Project Region | `[ e.g. ap-south-1 (Mumbai) ]` |

### 2.2 Database Connection Strings

Found in Supabase Dashboard → **Project Settings** → **Database** → **Connection string**

| Variable Name | Where to Find | Description |
|---|---|---|
| `DATABASE_URL` | Connection Pooling → **Transaction** mode URI | Used by Prisma at runtime (pooled) |
| `DIRECT_URL` | Connection → **Direct** connection URI | Used by Prisma for migrations |

**Format:**
```
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

> **Note:** Both URLs contain the same database password. Change it in Supabase under **Project Settings → Database → Reset password** if needed.

### 2.3 Database Tables

Three tables are managed by Prisma migrations:

| Table | Purpose |
|---|---|
| `Session` | Stores Shopify OAuth sessions per shop |
| `DiscountThreshold` | Stores each discount code with budget tracking |
| `ProcessedOrder` | Prevents double-deduction on order webhooks |

---

## 3. Railway (Hosting / Deployment)

The app is deployed on **Railway** at:
`https://shopify-discount-app-production.up.railway.app`

### 3.1 Railway Credentials

| Field | Value |
|---|---|
| Railway Dashboard | https://railway.app |
| Account Email | `[ YOUR RAILWAY EMAIL ]` |
| Account Password | `[ YOUR RAILWAY PASSWORD ]` |
| Project Name | `shopify-discount-app` (or check dashboard) |
| Service Name | `shopify-discount-app` |

### 3.2 Railway Environment Variables

These must be set in **Railway → Project → Service → Variables**. These are the exact variable names the app reads at runtime:

| Variable | Value / Where to Get |
|---|---|
| `SHOPIFY_API_KEY` | Shopify Partners → App → API credentials → **Client ID** = `c10d6b5feda86ab7df32b9440f1d2320` |
| `SHOPIFY_API_SECRET` | Shopify Partners → App → API credentials → **Client Secret** `[ SECRET VALUE ]` |
| `DATABASE_URL` | Supabase → Connection Pooling URI (Section 2.2) |
| `DIRECT_URL` | Supabase → Direct Connection URI (Section 2.2) |
| `SCOPES` | `read_discounts,read_orders,write_discounts` |
| `NODE_ENV` | `production` |

> **⚠️ Never** commit these values to the Git repository. They must only be set in Railway's dashboard.

### 3.3 Railway Deployment Settings

| Setting | Value |
|---|---|
| Start Command | `npm run start` |
| Build Command | `npm run build` |
| Setup Command | `npm run setup` (runs `prisma generate && prisma migrate deploy`) |
| Node Version | `>=18.20` |
| Connected Repo | `[ Your GitHub Repo URL ]` |
| Branch | `main` (or whichever is connected) |

---

## 4. Shopify Store (Client's Store)

The app is installed on the client's store.

| Field | Value |
|---|---|
| Store URL | `https://juice-99.myshopify.com` |
| Store Admin | `https://admin.shopify.com/store/juice-99` |
| App URL in Admin | `https://admin.shopify.com/store/juice-99/apps/discount-threshold-manager` |

To reinstall the app on a new store, visit:
```
https://shopify-discount-app-production.up.railway.app/api/auth?shop=YOUR_STORE.myshopify.com
```

---

## 5. Shopify CLI (For Developer Use Only)

If the client's developer needs to run the app locally or deploy config changes:

```bash
# Install Shopify CLI
npm install -g @shopify/cli

# Link the app config
npm run config:link

# Run locally (dev tunnel)
npm run dev

# Deploy config changes to Shopify Partners
npm run deploy
```

The developer will need to:
1. Be added as a **collaborator** in the Shopify Partners account
2. Have the above environment variables in a local `.env` file

**Local `.env` file template:**
```env
SHOPIFY_API_KEY=c10d6b5feda86ab7df32b9440f1d2320
SHOPIFY_API_SECRET=[ CLIENT SECRET ]
DATABASE_URL=[ SUPABASE POOLED URL ]
DIRECT_URL=[ SUPABASE DIRECT URL ]
SCOPES=read_discounts,read_orders,write_discounts
```

---

## 6. Webhook Configuration

These webhooks are auto-registered by the app on install. They call back to the production URL:

| Event | Endpoint | Purpose |
|---|---|---|
| `orders/create` | `/webhooks/orders/create` | Deducts from threshold budget when order placed with discount |
| `app/uninstalled` | `/webhooks/app/uninstalled` | Cleans up session on uninstall |
| `app/scopes_update` | `/webhooks/app/scopes_update` | Handles permission scope changes |

---

## 7. Checklist for Handover

- [ ] Share Shopify Partners account credentials (or add client as Partner account owner)
- [ ] Share the App Client Secret
- [ ] Transfer Railway project ownership (Railway Dashboard → Project Settings → Transfer)
- [ ] Share Supabase project credentials (or transfer project)
- [ ] Confirm all Railway environment variables are set correctly
- [ ] Test app install on client's store: visit the auth URL above
- [ ] Run `npm run deploy` once after any `shopify.app.toml` changes to sync to Shopify
- [ ] Change all passwords after handover if using shared accounts

---

*Last updated: March 2026 | App version: Remix + Shopify App Bridge + Polaris + Prisma + PostgreSQL (Supabase) + Railway*
