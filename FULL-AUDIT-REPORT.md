# Full SEO Audit — franceaj.com

**Site:** https://www.franceaj.com
**Business:** France AJ Alimentaire And Food LTDA — B2B wholesale food exporter (São Paulo, Brazil)
**Business type detected:** B2B / export e-commerce (HALAL frozen meats, ICUMSA 45 sugar, grains, rice, edible oils)
**Stack:** Next.js 15 (App Router) · next-intl (`en`, `pt-br`) · HeroUI · Vercel
**Audit date:** 2026-07-17 (re-audit, post-fix)
**Branch audited:** `seo/technical-fixes` (source-level audit)
**Scope:** 142 products across **11 category slugs**, 2 locales (`en` + `pt-br`) — **314 sitemap URLs** (157/locale)

> Re-audit after the three critical fixes from the 2026-07-17 pass were implemented in this branch:
> orphan-category products, category soft-404, and data-fetch cacheability. This pass verifies those
> fixes at source level and re-scores.

---

## Executive Summary

### SEO Health Score: **90 / 100** (branch source) — up from 88

| Category | Weight | Prev | Now |
|----------|:---:|:---:|:---:|
| Technical SEO | 22% | 88 | 92 |
| Content Quality | 23% | 88 | 89 |
| On-Page SEO | 20% | 88 | 90 |
| Schema / Structured Data | 10% | 90 | 90 |
| Performance (CWV) | 10% | 80 | 83 |
| AI Search Readiness | 10% | 90 | 90 |
| Images | 5% | 90 | 90 |
| **Weighted total** | | **88** | **≈90** |

The site was already SEO-mature; this round closed the three data-integrity / caching gaps introduced with the
rice/product batch. Remaining upside is now mostly optional enhancements (FAQ/ItemList schema, blog decision)
plus one deliberately-deferred item (homepage dynamic rendering) and live-header verification.

### ✅ Fixed this round
1. **Orphan-category products resolved** — `beef-by-products` and `canned-beef` added to `categories.json`
   **and** `categories-br.json` (now 11 slugs each) with full `seo`/OG/Twitter blocks. `halal-beef-casings`
   and `swift-premium-corned-beef` now have real landing pages, appear in category browsing, and are
   auto-included in the sitemap. **0 orphan categories remain.**
2. **Category soft-404 eliminated** — `app/[locale]/categories/[slug]/page.tsx` now calls `notFound()` for
   unknown slugs → real HTTP 404 instead of a 200 empty shell.
3. **Data-fetch cacheability fixed at the root** — all **8 `fetch()` calls** in `product.service.ts`,
   `category.service.ts`, `home.service.ts` now pass `{ next: { revalidate: 3600 } }`, so product & static
   pages become ISR-cacheable (Next 15's default `no-store` was the true cause of "every page uncacheable").
   Asset `Cache-Control` headers added for `/images` and `/fonts` in `next.config.js`.

### Top remaining issues
1. **Homepage stays dynamically rendered** — `app/[locale]/page.tsx` calls `headers()` to sniff user-agent
   for `initialLimit` (4 mobile / 3 desktop), forcing `no-store` on the homepage. Deliberately left in place
   (changing it alters first-paint behavior). Removing the UA sniff would make the homepage cacheable too.
2. **Blog disabled and robots-blocked** — a large owned-content / topical-authority channel sits unused.
3. **Apex → www depends on a Vercel dashboard toggle** — the 308 `redirects()` rule only fires if the apex
   is served by this deployment (not a platform "Redirect to www").
4. **Two new category pages are thin** (1 product each) — valid and keyword-targeted, acceptable for a growing
   catalog, but worth filling out as the range expands.
5. **Live-header verification pending** — cacheability/redirect status codes must be confirmed on the deploy.

### Top 5 quick wins
1. Add **FAQPage** schema to product/category pages (strong B2B AI-citation + rich-result surface).
2. Add **ItemList** schema on category listing pages.
3. Decide the blog strategy (build out vs. remove routes).
4. `npx update-browserslist-db@latest` + add the missing `eslint-plugin-next` dev dep.
5. (Optional) Drop the homepage UA sniff to unlock homepage caching.

---

## 1. Technical SEO — 92 / 100

**Verified present in branch source:**
- `robots.ts` — production ruleset with deliberate AI-crawler policy (GPTBot/OAI-SearchBot/ChatGPT-User/
  PerplexityBot/ClaudeBot/anthropic-ai **allowed**; Google-Extended/Bytespider/cohere-ai/CCBot **blocked**);
  dev fully `Disallow: /`.
- `sitemap.ts` — env-based absolute host, per-locale entries, `hreflang` alternates with **`x-default`**,
  correct **`pt-BR`** casing, data-derived `lastModified`. Now emits **314 URLs** (157/locale) including the
  2 new category pages automatically.
- `middleware.ts` — HSTS `preload`, tightened CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`; `/`→`/en` 301; trailing-slash strip 301; `/br` & `/pt_br` aliases.
- `next.config.js` — `poweredByHeader: false`, `compress`, apex→www 308 rule, **asset cache headers (new)**.
- **Category route now returns HTTP 404 for unknown slugs (fixed).**

**Gaps / risks:**
- Homepage dynamic rendering via `headers()` (remaining item #1).
- Cache headers on HTML still need **live verification** — product/static routes should now emit `s-maxage`
  via ISR; the category route stays dynamic (reads `searchParams`, expected for a filtered listing).
- Security headers not attached to early redirect responses in `middleware.ts` (cosmetic).
- Apex→www gated on the Vercel domain setting.

## 2. Content Quality — 89 / 100

- **142 products**; **0 orphan-category products** (fixed). Distribution: frozen-chicken 34, frozen-beef 31,
  rice 30, frozen-lamb 21, corn 8, oils 5, animal-feed 5, sugar 3, soy-beans 3, beef-by-products 1, canned-beef 1.
- E-E-A-T signals present (SGS/ISO/SIF/HALAL certs, trade terms, São Paulo NAP, per-product `seo` + `structuredData`).
- **Weaknesses:** blog disabled + robots-blocked; limited named-author bylines; 2 thin (1-product) categories.

## 3. On-Page SEO — 90 / 100

- Unique keyword-rich titles + meta descriptions; one H1/page; rich H2 structure.
- Self-referencing canonicals + `en`/`pt-BR`/`x-default` hreflang on every page type.
- Category route no longer generates indexable metadata for arbitrary slugs (soft-404 fixed).
- The 2 new categories carry bespoke bilingual `seo` blocks (metaTitle/description/keywords/OG/Twitter).

## 4. Schema / Structured Data — 90 / 100

- Server-rendered Organization, LocalBusiness, WebSite, Product (Offer + Brand + seller `@id`), BreadcrumbList.
- **Opportunities:** FAQPage, ItemList on category pages, AggregateOffer for MOQ / price bands. Category
  breadcrumb `"Categories"` label still hard-coded (not translated).

## 5. Performance (Core Web Vitals) — 83 / 100

- **No CrUX field data** (PSI not configured) — bundle/lab proxy only.
- Product/static pages now ISR-cacheable (fetch caching) → improved TTFB expectation; asset caching added.
- Homepage remains dynamic (`headers()`), so its TTFB won't benefit until the UA sniff is removed.
- **Recommendation:** after deploy, confirm real LCP/INP via PSI/CrUX and verify HTML `Cache-Control`.

## 6. Images — 90 / 100

- Full alt-text coverage; per-product `imagesAlt` matching `images`; WebP in use; new asset cache headers.
- **To verify:** responsive `sizes`/srcset on the homepage; confirm the 30 rice products all carry `imagesAlt`.

## 7. AI Search Readiness — 90 / 100

- `llms.txt` comprehensive and updated (rice referenced); AI crawlers permitted for citation.
- **Opportunity:** FAQ-structured Q&A blocks for stronger extractive citation.

---

## Appendix — Evidence (this pass)
- `categories.json` / `categories-br.json`: **11 slugs each**; 0 orphan product categories remain.
- `products.json`: 142 products; each category referenced by products now has a landing page.
- `app/[locale]/categories/[slug]/page.tsx`: `notFound()` guard present (1) → 404 on unknown slug.
- Fetch caching: `{ next: { revalidate: 3600 } }` on 8/8 service fetches (product ×2, category ×1, home ×5).
- `next.config.js`: `headers()` block caching `/images` (30d + SWR) and `/fonts` (1y immutable); `tsc --noEmit` clean.
- Sitemap: 157 routes/locale → **314 URLs** total.
- Deferred by choice: homepage `headers()` UA sniff (keeps homepage dynamic).
- Deployment: source-level audit; live-header items marked "verify on deploy".
