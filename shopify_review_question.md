# Shopify App Review — Scope Clarification Request

## Issue Reported by Shopify
**3.2.1 — Request `read_all_orders` access scope only if it provides necessary app functionality**

---

## Our Investigation

We have thoroughly reviewed our entire app configuration and codebase. After checking **all** `.toml` files including:

- `shopify.app.toml`
- `shopify.app.dev-discount.toml`
- `shopify.app.custom-threshold.toml`
- `shopify.app.discount-threshold-a...toml`
- `shopify.app.pragmatic-tax-app.toml`
- `shopify.app.threshold-discount-a...toml`

We **did not find `read_all_orders` in any of these files.**

We also attempted to remove the **"Read all orders scope"** from the Protected Customer Data section in the Partner Dashboard, but the permission still appears to be active.

---

## Scopes We Actually Use

| Scope | Why We Need It |
|-------|---------------|
| `read_orders` | Only used to **read the order amount** to determine if a customer has met the discount threshold. We do **NOT** store any customer data. |
| `write_discounts` | Used to **create and manage discount thresholds** across the store. |
| `read_discounts` | Used to **read existing discounts** to calculate how much a customer has spent and track threshold progress. |

> ⚠️ **Important:** We are **not** storing any customer personal data on our servers. Our app purely manages discount thresholds based on purchase amounts.

---

## Our Question to Shopify

Could you please **clarify exactly where `read_all_orders` is being detected** in our app?

We want to identify the exact source so we can remove it properly and comply with your requirements.

---

## Proof of Current Scope Configuration

**GitHub Reference:** `shopify.app.toml` — Line 27

```toml
scopes = "write_discounts,read_discounts,read_orders"
```

`read_all_orders` is **not present** anywhere in our configuration.
