# Schema Markup Report — Product structuredData

**Scope:** `public/api/products.json` (151 products) + renderer `app/[locale]/products/[slug]/page.tsx`
**Date:** 2026-07-20 (re-run 4)
**Format:** JSON-LD (Google-preferred) ✅ — server-rendered in initial HTML ✅

> **Re-run 4 notes:**
> - **NEW:** `offers.price: "1.00"` added at Offer level on all 151. The renderer's `hasRealPrice` check now passes, so it emits a flat **`price: "1.00"` and DROPS `priceSpecification`** — the RFQ description no longer renders (issue #1).
> - MOQ rendering **FIXED** — renderer now reads `eligibleQuantity`; renders on all 151 (issue #4 resolved).
> - `shippingDestination` = `addressCountry: "ZZ"` (reserved "worldwide/unknown") — valid but not a real market Google acts on (issue #2).

---

## Critical finding: the rendered schema ≠ products.json

The Product JSON-LD that actually reaches the page is **rebuilt in the component** (`page.tsx` → `productSchema` / `buildOffer`). It consumes only a **subset** of `structuredData`. Several fields recently added to `products.json` are currently **dormant** — present in the data file but never emitted to the page.

| Field in products.json | Rendered on page? | Notes |
|---|---|---|
| name, sku, description, image | ✅ | image URLs absolutized at render (`${baseUrl}${img}`) |
| hasCertification | ✅ | Product Certification markup (active since Apr 2025) |
| offers.price | ✅ | `"1.00"` — now rendered (renders as $1.00) |
| offers.priceSpecification | ⚠️→❌ | present in data, but **dropped by renderer** now that `price` is set — see issue #1 |
| offers.eligibleTransactionVolume | ⚠️→❌ | renderer reads this, but it was **removed** from all data → MOQ renders nowhere (issue #4) |
| brand | ⚠️ hardcoded | component hardcodes `Brand`, ignores the file's brand |
| additionalProperty | ⚠️ from specifications | built from `product.specifications`, not `structuredData.additionalProperty` |
| **mpn** | ❌ | not read by component |
| **material** | ❌ | not read |
| **category** | ❌ | not read |
| **manufacturer** (logo, url, contactPoint) | ❌ | not read — the whole block is dormant |
| **award** | ❌ | not read |
| **offers.shippingDetails** | ❌ | not read — dormant (now `addressCountry:"ZZ"`) |
| **offers.eligibleQuantity** | ✅ | **now rendered** on all 151 (renderer updated) |

**Implication:** the last few edits (mpn, brand→Brand, manufacturer, shippingDetails) are correct in the data but will **not appear in search/AI results** until `page.tsx` is updated to consume them.

---

## Validation Results

| Check | Status | Affected | Detail |
|---|---|---|---|
| Valid JSON, @context, @type | ✅ | 151/151 | parses cleanly |
| Server-side rendered | ✅ | — | JSON-LD in initial HTML (good for Product/Offer) |
| Product.image absolute | ✅ | 151 | relative in file, absolutized at render |
| No fabricated review/rating | ✅ | — | correctly omitted |
| No fake `price: "0"` | ✅ | — | RFQ via priceSpecification |
| priceSpecification.price="1.00" | ⚠️ | 151 | renders as a definite **$1.00** (issue #1) |
| shippingDestination completeness | ⚠️ | 151 | now `addressCountry:"ZZ"` — valid reserved code, but not a real market Google acts on (issue #2) |
| MOQ renders on page | ✅ | 151 | **FIXED** — renderer now reads `eligibleQuantity` ([page.tsx:160](app/[locale]/products/[slug]/page.tsx)); type added to `types/product.ts`; `tsc` clean |
| shippingDetails missing shippingRate | ⚠️ | 151 | acceptable for RFQ, but Google may ignore the block |
| FAQPage rich-result eligibility | ⚠️ | 79 | restricted to gov/health since Aug 2023 (issue #3) |
| eligibleQuantity vs eligibleTransactionVolume | ⚠️ | 70 | MOQ signal dropped by renderer (issue #4) |

---

## Issues & Recommendations

### 1. `offers.price: "1.00"` (LIVE — renders; drops priceSpecification)
`offers.price: "1.00"` is now set on all 151 products. Because `buildOffer` treats any `price > 0` as real, the rendered Offer emits a flat **`price: "1.00"`** and **omits `priceSpecification`** — so the "RFQ / contact for quote" description no longer appears in the page JSON-LD; only $1.00 does. Google/Merchant validators read this as a genuine $1.00 offer on bulk listings.
**Options:** (a) drop the numeric price, keep currency + `priceSpecification` description (cleanest for RFQ); (b) use a realistic per-unit floor; (c) keep $1.00 but adjust the renderer to emit **both** `price` and `priceSpecification`. **Applied as requested** — flagged for your decision.

### 2. `shippingDestination` now `addressCountry: "ZZ"` (dormant)
`ZZ` is the ISO 3166-1 reserved "unknown/worldwide" code — structurally valid and better than the old name-only region, but Google's shipping/Merchant validators expect **real** deliverable country codes and won't act on `ZZ`. Fine for an RFQ B2B catalog; if you want shipping validation for specific export markets, replace with real codes (e.g. `AE`, `SA`, `CN`, `EG`).

### 3. FAQPage (79 products)
FAQ **rich results** are restricted to government/health authorities since Aug 2023 — they won't show for this site. Keeping the markup is still useful for AI/LLM answer extraction (already SSR'd), so **no removal needed**; just don't expect FAQ rich results.

### 4. MOQ rendering — ✅ FIXED
Data was standardized to `offers.eligibleQuantity` (real per-product values: 12500 for bulk, 24-27 for containers) and `eligibleTransactionVolume` was removed. `buildOffer` in [page.tsx](app/[locale]/products/[slug]/page.tsx) now reads `eligibleQuantity` (with a fallback to legacy `eligibleTransactionVolume`), and `types/product.ts` gained the `QuantitativeValue` type. `tsc --noEmit` passes with 0 errors. **MOQ now renders on all 151 products.**

> Note: 7 frozen-beef offal products had no stored MOQ and were set to the frozen-beef category default (24-27 MT): Beef Heel Muscle, Honeycomb, Kidneys, Omasum, Shin and Shank, Rumps, Ribs. Verify if any differ.

### 5. Wire dormant fields into the renderer (biggest win)
To make `manufacturer` (logo + contactPoint), `mpn`, `material`, `category`, `award`, and `shippingDetails` appear, extend `productSchema`/`buildOffer` in `app/[locale]/products/[slug]/page.tsx` to spread them from `product.structuredData`. See `generated-schema.json` for the target output.

---

## Next actions (suggested order)
1. ~~Update `page.tsx` to read `eligibleQuantity`~~ — ✅ DONE (MOQ now renders on all 151).
2. Extend `page.tsx` to also emit manufacturer / mpn / material / category / award / shippingDetails (all still dormant).
3. Reconsider `price: "1.00"` — drop it or use a realistic floor (live impact).
4. `shippingDestination` — replace `ZZ` with real market codes if shipping validation is wanted.
5. Re-test in Google Rich Results Test after deploy.
