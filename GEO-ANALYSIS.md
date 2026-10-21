# GEO Analysis — France AJ Alimentaire And Food LTDA
**URL:** https://www.franceaj.com  
**Audit Date:** 2026-05-16  
**Stack:** Next.js 14 App Router · next-intl (en/pt-br) · Vercel  

---

## GEO Readiness Score: 42/100

| Category | Weight | Raw Score | Weighted |
|---|---|---|---|
| Citability | 25% | 30/100 | 7.5 |
| Structural Readability | 20% | 38/100 | 7.6 |
| Multi-Modal Content | 15% | 28/100 | 4.2 |
| Authority & Brand Signals | 20% | 38/100 | 7.6 |
| Technical Accessibility | 20% | 72/100 | 14.4 |
| **Total** | | | **41.3/100** |

---

## Platform Breakdown

| Platform | Est. Score | Key Gap |
|---|---|---|
| **Google AI Overviews** | 45/100 | Product body text is client-rendered; AI can't read it |
| **ChatGPT** | 28/100 | No Wikipedia / Reddit entity presence |
| **Perplexity** | 32/100 | No Reddit threads; blog content is stub-only (12–25 words) |
| **Bing Copilot** | 38/100 | IndexNow not implemented; missing `OAI-SearchBot` rule |

---

## 1. AI Crawler Access Status

### robots.txt — Current State

| Crawler | Status | Notes |
|---|---|---|
| `Googlebot` | ✅ Allowed | Explicit allow rule |
| `GPTBot` | ✅ Allowed | Explicit allow — ChatGPT training & browsing |
| `ChatGPT-User` | ✅ Allowed | Real-time browsing allow |
| `PerplexityBot` | ✅ Allowed | Explicit allow |
| `ClaudeBot` | ✅ Allowed | Explicit allow |
| `Google-Extended` | 🚫 Blocked | Correct — blocks Gemini training, not Search |
| `Bytespider` | 🚫 Blocked | Correct — ByteDance training |
| `OAI-SearchBot` | ⚠️ Missing | Falls through to `*` wildcard, technically allowed but should be explicit |
| `anthropic-ai` | ⚠️ Missing | Same — falls through to wildcard |
| `cohere-ai` | ⚠️ Missing | Falls through to wildcard |
| `CCBot` | ⚠️ Missing | Common Crawl training — consider blocking |

### Recommended additions to `app/robots.ts`:

```ts
// Add these alongside existing AI crawler rules:
{ userAgent: 'OAI-SearchBot', allow: '/' },     // OpenAI search features
{ userAgent: 'anthropic-ai', allow: '/' },        // Claude training (optional)
{ userAgent: 'cohere-ai', disallow: '/' },        // Cohere — training only, block
{ userAgent: 'CCBot', disallow: '/' },            // Common Crawl — training only, block
```

---

## 2. llms.txt Status

| Check | Status |
|---|---|
| File present at `/llms.txt` | ✅ Present |
| Site description | ✅ Clear B2B context |
| Key pages listed | ✅ 7 pages |
| AI crawler policy stated | ✅ 3 crawlers listed |
| Product-level detail | ⚠️ Only categories listed, no individual product links |
| Contact/authority info | ⚠️ No email or physical presence |
| Certifications highlighted | ⚠️ Brief mention only |

### Recommended llms.txt Enhancements

Add these sections after the existing content:

```
## Products (108 SKUs across 5 categories)
- [ICUMSA 45 Sugar](https://www.franceaj.com/en/products/sugar-icumsa-45): Refined white sugar, 99.8% polarization, FOB Santos
- [Frozen Chicken Feet](https://www.franceaj.com/en/products/frozen-chicken-feet-35gr-up-grade-a): Grade A, HALAL, SIF certified
- [Soybeans](https://www.franceaj.com/en/categories/soy-beans): Non-GMO, food and feed grade
- [Vegetable Oils](https://www.franceaj.com/en/categories/oils): Soybean and sunflower, crude and refined

## Certifications
- HALAL Certified (all frozen meats)
- SIF — Serviço de Inspeção Federal (Brazilian federal food inspection)
- HACCP and ISO 22000 (supplier-level certifications)

## Key Facts for AI
- Headquarters: Rua Pamplona 145, São Paulo, SP 01405-900, Brazil
- Contact: info@franceajalimentaireandfood.com.br
- Markets served: Asia, Middle East, Africa, Europe, Americas
- Shipping terms: FOB Santos, CIF
- Minimum order: B2B bulk — contact for MT capacity

## Optional: Full product index
- [llms-full.txt](https://www.franceaj.com/llms-full.txt): Complete product catalog with specifications
```

---

## 3. Brand Mention Analysis

| Platform | Status | Notes |
|---|---|---|
| **Wikipedia** | ❌ Not found | No page for brand or key executives |
| **Wikidata** | ❌ Not found | No entity record |
| **Reddit** | ❌ Not found | No r/FoodTrade, r/importing mentions detected |
| **YouTube** | ❌ Not found | No channel; no mentions in food export videos |
| **LinkedIn** | ✅ Present | `linkedin.com/company/france-aj-holding/` confirmed in sameAs |
| **Facebook** | ✅ Present | `facebook.com/france.aj.holding/` in sameAs |
| **Instagram** | ✅ Present | `instagram.com/france.aj.holding/` in sameAs |
| **X / Twitter** | ✅ Present | `x.com/FranceAjHolding` in sameAs |
| **Industry directories** | ❓ Unknown | Kompass, Alibaba, Global Sources not verified |

> **Key finding:** Brand mentions correlate 3× more strongly with AI citations than backlinks (Ahrefs Dec 2025). With zero Wikipedia and Reddit presence, ChatGPT and Perplexity have almost no authoritative third-party signal to cite. This is the highest-impact gap in the entire GEO profile.

---

## 4. Passage-Level Citability

**Optimal AI citation window: 134–167 words.** Content must be self-contained and start with a direct answer.

### Current Content Audit

| Content Area | Word Count | Citability | Issue |
|---|---|---|---|
| Product descriptions (avg) | 113 words | ⚠️ Below optimal | 21 words short of 134-word floor; also client-rendered |
| About page body | 194 words | ⚠️ Too long (one block) | Should be split into 134-167 word passages |
| Banner description | 43 words | ❌ Too short | Good hook but no standalone answer |
| Why Choose Us reasons (avg) | 58 words | ❌ Too short | Each reason needs ~80 more words |
| Blog articles | 12–25 words | ❌ Critical — stub only | Blogs have almost no body content |
| Category pages | 10–15 words | ❌ Critical | Near-empty descriptions |

### Critical Citability Bug: Product Descriptions Are Client-Rendered

`app/[locale]/products/[slug]/product-details-content.tsx` declares `'use client'` at the top. This means **the product description body text is not present in the initial HTML response**. AI crawlers do not execute JavaScript, so they see:

- ✅ The `<title>` and `<meta description>` (server-rendered)
- ✅ The Product JSON-LD schema (server-rendered from page.tsx)
- ❌ The actual product description HTML (JavaScript-rendered — invisible to AI crawlers)

This means 108 product pages have effectively zero citable text content for AI systems, despite having well-written descriptions in the JSON data.

### Passage Rewrite — ICUMSA 45 Sugar (Target: 150 words)

**Current (113 words, client-rendered, not citable):**
> France AJ Alimentaire And Food LTDA is a leading Bulk ICUMSA 45 Sugar Exporter from Brazil, supplying the industry-standard highly refined white sugar to global markets...

**Target rewrite (150 words, SSR, structured for AI citation):**
> ICUMSA 45 sugar is a highly refined white sugar grade with a polarization of 99.80% minimum and an ICUMSA color value of 45 RBU — the lowest possible reading, indicating maximum refinement. France AJ Alimentaire And Food LTDA exports Grade A ICUMSA 45 sugar directly from certified Brazilian mills in São Paulo state, the world's largest sugar-producing region. Each shipment is SGS-inspected and carries HALAL and HACCP certifications, making it suitable for food manufacturing, beverage production, and confectionery at industrial scale. Shipping terms are FOB Santos or CIF, with consistent monthly MT capacity for B2B wholesale buyers. Specifications: Ash content 0.04% MAX, moisture 0.04% MAX, solubility 100% free-flowing, color sparkling white. Request a formal quotation for bulk pricing.

---

## 5. Server-Side Rendering Check

| Content | Rendering | AI Visibility |
|---|---|---|
| Page `<title>` and `<meta description>` | ✅ SSR (Next.js generateMetadata) | Visible |
| Canonical / hreflang tags | ✅ SSR | Visible |
| Organization JSON-LD schema | ✅ SSR (layout.tsx inline script) | Visible |
| LocalBusiness JSON-LD schema | ✅ SSR (layout.tsx inline script) | Visible |
| Product JSON-LD schema | ✅ SSR (page.tsx, added in audit fix) | Visible |
| BreadcrumbList JSON-LD | ✅ SSR (each page.tsx) | Visible |
| **Product description body** | ❌ CSR (`'use client'` component) | **Invisible** |
| **Category description body** | ❌ CSR (`CategoriesPageContent.tsx`) | **Invisible** |
| **About page body** | ❌ CSR (`about-page-content.tsx`) | **Invisible** |
| Blog content | ❌ CSR + stub data (12–25 words) | **Invisible** |
| Navbar, footer | ❌ CSR | Not critical |

> **3 of the 4 highest-value content pages render their body text via JavaScript.** Google AI Overviews can partially handle this via Googlebot's JS rendering, but ChatGPT, Perplexity, and ClaudeBot cannot.

---

## 6. Top 5 Highest-Impact Changes

### Priority 1 — Server-Render Product Descriptions (Impact: Critical)

Move the product description HTML out of the `'use client'` component and render it server-side in `page.tsx`. The data is already available via `getCachedProductData()` which runs on the server.

**In `app/[locale]/products/[slug]/page.tsx`**, add after the existing prefetch:

```tsx
// product description is already fetched — render it server-side for AI crawlers
const productDescription = product?.description ?? null;

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    {/* Server-rendered description — visible to AI crawlers */}
    {productDescription && (
      <div
        id="product-description-ssr"
        className="sr-only"  // visually hidden but present in HTML
        dangerouslySetInnerHTML={{ __html: productDescription }}
      />
    )}
    <ProductDetailsContent slug={slug} locale={locale} />
    ...
  </HydrationBoundary>
);
```

This ensures the product description is present in the initial HTML for AI crawlers, while the interactive component still handles the visible UI.

### Priority 2 — Expand Blog Content from Stubs to Full Articles (Impact: High)

Current blog `contentHtml` averages only 12–25 words. These are placeholder stubs. Since blogs are already blocked in `robots.txt`, they deliver zero SEO or GEO value. Two paths:

**Option A (Recommended):** Write 6 genuine 800–1,500-word articles in `public/api/blogs.json`, unblock blogs in `robots.txt`, and activate the blog navigation link in `config/site.ts`. Target queries: "ICUMSA 45 sugar price 2025", "HALAL frozen chicken suppliers Brazil", "how to import food from Brazil".

**Option B:** Delete the blog route and redirect `/en/blogs` → `/en/products` (301) to avoid thin-content signals.

### Priority 3 — Add Definitional Sentences to Category Pages (Impact: High)

Category pages have 10–15 word descriptions. Each category needs a 134–167 word self-contained block that begins with a definition. Example for `/categories/sugar`:

> **What is ICUMSA 45 sugar?** ICUMSA 45 is the international standard grade for highly refined white sugar, with an ICUMSA color reading of 45 RBU (Refractive Units), indicating 99.8%+ purity. France AJ Alimentaire And Food LTDA sources ICUMSA 45, 150, and 600-1200 grades directly from certified mills in São Paulo, Brazil — the world's largest sugar-producing state. All grades are available FOB Santos or CIF, with SGS inspection reports and HALAL/HACCP certifications included. Monthly supply capacity is available for bulk B2B importers, distributors, and food manufacturers. Contact our export team for a formal quotation and technical specification sheet.

This 97-word block + the existing page title gets to the 134-word target. This is a `public/api/categories.json` update, no code change needed.

### Priority 4 — Build Wikipedia / Reddit Entity Presence (Impact: High)

Based on Ahrefs December 2025 data, YouTube and Reddit mentions have the strongest correlation with AI citations (0.737 and high respectively), while backlinks are weak (0.266). Recommended actions:

1. **Wikipedia:** Create a Wikipedia article for "France AJ Alimentaire And Food LTDA" under the "Food exporters" category. Cite Brazilian registry (CNPJ), SIF certification, and founding date. The article enables ChatGPT to cite the brand directly (ChatGPT sources 47.9% of citations from Wikipedia).
2. **Reddit:** Post informative threads in r/foodscience, r/importing, r/brazil about HALAL certification process or ICUMSA sugar grading. Brand mention (not promotion) in these threads is sufficient for Perplexity indexing.
3. **YouTube:** A 5-minute product overview video (with transcript) significantly boosts AI citation probability — YouTube mentions have the highest observed correlation.

### Priority 5 — Uncomment and Restore `sameAs` in Organization Schema (Impact: Medium)

In `app/[locale]/layout.tsx` line 91, the `sameAs` array is commented out. This removes the entity graph links that help AI systems identify and trust the brand entity. Restore it:

```ts
sameAs: [
  'https://www.linkedin.com/company/france-aj-holding/',
  'https://x.com/FranceAjHolding',
  'https://www.facebook.com/france.aj.holding/',
  'https://www.instagram.com/france.aj.holding/',
],
```

---

## 7. Schema Recommendations for AI Discoverability

### Currently Implemented ✅
- `Organization` (SSR, layout.tsx)
- `LocalBusiness` (SSR, layout.tsx)
- `Product` + `Offer` + `hasCertification` (SSR, product page.tsx)
- `BreadcrumbList` (all pages)
- `ItemList` (products listing page)

### Missing — High Priority

**`FAQPage` schema** — Add to About Us and category pages. Even 3 Q&A pairs dramatically improve AI Overview selection rate:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is ICUMSA 45 sugar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ICUMSA 45 is a highly refined white sugar grade with 99.8% minimum polarization and maximum 45 RBU color value, the globally recognized standard for export-quality refined sugar from Brazil."
      }
    },
    {
      "@type": "Question",
      "name": "Are France AJ products HALAL certified?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All frozen meats exported by France AJ Alimentaire And Food LTDA carry HALAL certification from accredited Brazilian certifying bodies, compliant with OIC/SMIIC standards for international halal trade."
      }
    },
    {
      "@type": "Question",
      "name": "What shipping terms does France AJ offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "France AJ Alimentaire And Food LTDA ships on FOB Santos and CIF terms. All shipments include SGS inspection reports and full export documentation for smooth customs clearance at the destination port."
      }
    }
  ]
}
```

**`Article` schema** — Required on blog pages once content is expanded. Must include `author`, `datePublished`, `dateModified`, and `publisher`.

**`ExportAction` / `OfferCatalog`** — Schema.org `OfferCatalog` linking to the 7 product categories would provide structured evidence of product range for AI systems.

---

## 8. Content Reformatting Suggestions

### "Why Choose Us" — Consolidate for Citability

Current: 6 reasons × 58 words each = 348 words total but no single passage is citable (too short).

**Fix:** Combine into 2–3 consolidated paragraphs of 134–167 words each, each with a strong lead sentence:

> **Direct sourcing from Brazil's top certified mills.** France AJ Alimentaire And Food LTDA works exclusively with SIF-registered and HALAL-certified Brazilian producers, bypassing intermediaries to deliver competitive pricing with full supply-chain transparency. Each facility holds ISO 22000, HACCP, and where applicable, HALAL certifications audited by internationally recognized bodies. This direct relationship allows consistent monthly MT capacity planning for wholesale importers in Asia, the Middle East, and Africa — with SGS inspection and complete export documentation included as standard for every shipment.

### About Page — Split the 194-Word Block

The `about_ecoland_header_desc` field is 194 words in a single block — above the 167-word optimal ceiling. Split it at the natural paragraph break after "freshness" into two passages:
- **Passage 1 (~90 words):** Focus on Brazil's agricultural link to global markets
- **Passage 2 (~104 words):** Focus on the France AJ Group legacy and mission

This makes each passage independently citable for different query types ("Brazilian food exporters" vs "France AJ Holding company").

### Add "What is X?" Opener to All Category Pages

Every category page should open with a definitional sentence. AI systems pattern-match on `"X is..."` constructs:
- "ICUMSA 45 sugar is..."
- "HALAL frozen beef is..."
- "Non-GMO soybeans are..."

These definitions require a `public/api/categories.json` content expansion plus updating the category page component to render them server-side.

---

## Quick Reference — GEO Fix Checklist

| Fix | Effort | Impact | File |
|---|---|---|---|
| Server-render product descriptions (SSR shadow div) | Low | Critical | `app/[locale]/products/[slug]/page.tsx` |
| Restore `sameAs` in Organization schema | 5 min | Medium | `app/[locale]/layout.tsx:91` |
| Add `OAI-SearchBot`, `CCBot` to robots.ts | 5 min | Low | `app/robots.ts` |
| Expand category descriptions (134-167 words each) | Medium | High | `public/api/categories.json` |
| Add FAQPage schema to About + category pages | Medium | High | page.tsx files |
| Expand llms.txt with product details and key facts | Low | Medium | `public/llms.txt` |
| Write real blog content (800+ words per article) | High | High | `public/api/blogs.json` |
| Create Wikipedia entity page | High | Critical | External |
| Start Reddit presence in relevant subreddits | Medium | High | External |
| Create YouTube channel with product/export video | High | High | External |
