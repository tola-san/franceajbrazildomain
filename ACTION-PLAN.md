# SEO Action Plan — franceaj.com

Prioritized from the full audit (**2026-07-17, re-audit post-fix**, branch `seo/technical-fixes`).
Health score **≈90 / 100** (was 88). The three critical items are now resolved in source.

## ✅ Done this round (verify on live deploy)

| # | Fix | Where |
|---|-----|-------|
| C1 | **Orphan-category products resolved** — added `beef-by-products` + `canned-beef` (11 categories/locale) | `public/api/categories.json`, `categories-br.json` |
| C2 | **Category soft-404 killed** — `notFound()` on unknown slug → HTTP 404 | `app/[locale]/categories/[slug]/page.tsx` |
| C3 | **Fetch cacheability fixed** — `{ next: { revalidate: 3600 } }` on all 8 fetches; asset cache headers | `services/*.ts`, `next.config.js` |

Live verification:
```
curl -sI https://www.franceaj.com/en/categories/beef-by-products  | head -1        # 200
curl -sI https://www.franceaj.com/en/categories/canned-beef       | head -1        # 200
curl -sI https://www.franceaj.com/en/categories/does-not-exist    | head -1        # 404
curl -sI https://www.franceaj.com/en/products/<any-slug> | grep -i cache-control   # s-maxage, not no-store
```

## 🟠 High — within 1 week

| # | Action | Notes |
|---|--------|-------|
| H1 | **Decide: make the homepage cacheable?** | `app/[locale]/page.tsx` calls `headers()` for a UA-based `initialLimit` (4 mobile / 3 desktop), forcing `no-store`. Drop the sniff → fixed `initialLimit` to let the homepage be cached (client re-hydrates count anyway). Behavior change — your call. |
| H2 | Verify apex→www is a **permanent** redirect | Vercel → Domains: make apex `franceaj.com` a normal assigned domain so the `next.config.js` 308 rule applies (not a platform 307). |
| H3 | Run `npm run indexnow` after deploy | Already wired; faster Bing/Yandex/Naver indexing. Ping the 2 new category URLs. |
| H4 | Decide the **blog** strategy | Currently disabled + robots-blocked. Build out as topical-authority engine, or remove routes. |
| H5 | Confirm the **30 rice products** carry matching `imagesAlt` + populated `seo`/`structuredData` | Spot-check batch completeness. |

## 🟡 Medium — within 1 month

| # | Action | Notes |
|---|--------|-------|
| M1 | Add **FAQPage** schema to product/category pages | High-value B2B AI-citation + rich-result surface. |
| M2 | Add **ItemList** schema on category listing pages | Helps Google understand product collections. |
| M3 | Flesh out the 2 thin categories (`beef-by-products`, `canned-beef`) | Add products/intro copy as the range grows. |
| M4 | Translate the hard-coded `"Categories"` breadcrumb label | English in both locales (`categories/[slug]/page.tsx`). |
| M5 | Measure real CWV after deploy (PSI/CrUX) | Confirm caching + JS cut translate to field LCP/INP. |
| M6 | Audit homepage image payload | Responsive `sizes`/srcset; defer below-the-fold to protect LCP. |
| M7 | Add author/expertise bylines or "About the trade desk" | Strengthens E-E-A-T. |

## 🟢 Low — backlog

| # | Action |
|---|--------|
| L1 | `npx update-browserslist-db@latest` (stale caniuse data). |
| L2 | Fix missing `eslint-plugin-next` so `next lint` runs in CI. |
| L3 | Add security headers to the early redirect responses in `middleware.ts` (cosmetic). |
| L4 | Fix any remaining thin product descriptions (<100 words). |
| L5 | Rotate any API secrets committed in `.env.local.exmple` (unrelated to SEO). |

---

### One-line summary
**All three critical issues are fixed in source (score 88 → ≈90).** The next real lever is the homepage
caching decision (H1) + shipping and verifying headers on the live deploy; everything else is incremental.
