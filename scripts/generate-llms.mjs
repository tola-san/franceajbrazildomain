#!/usr/bin/env node
/**
 * Generate the AI-discovery files from the live catalog data so they can never
 * drift out of sync with the products/categories the site actually serves.
 *
 * Outputs (written to public/):
 *   - llms.txt       concise index: company facts + one line per product
 *   - llms-full.txt  expanded: full description + key specs per product
 *   - rsl.xml        Really Simple Licensing manifest (https://rslstandard.org)
 *
 * Usage:
 *   npm run generate:ai      # all three files       (--only=all, the default)
 *   npm run generate:llms    # llms.txt + llms-full.txt only
 *   npm run generate:rsl     # rsl.xml only
 *   npm run check:ai         # fail (exit 1) if any file is stale
 *   npm run check:llms / check:rsl   # same, scoped
 *
 * Raw equivalents:
 *   node scripts/generate-llms.mjs [--only=all|llms|rsl] [--check]
 *
 * Wired into the build via the "prebuild" npm script (which regenerates
 * everything), and safe to run manually after editing public/api/products.json,
 * categories.json or blogs.json.
 *
 * Env:
 *   NEXT_PUBLIC_WEBSITE_URL  site origin (default https://www.franceaj.com)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const API = path.join(PUBLIC, 'api');

const SITE = (process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.franceaj.com').replace(/\/$/, '');
const CHECK = process.argv.includes('--check');

// Which outputs to touch. `llms` and `rsl` are independent: the RSL manifest is
// pure licensing boilerplate and needs no catalog data, so --only=rsl skips
// loading and validating products/categories entirely.
const ONLY = (process.argv.find((a) => a.startsWith('--only='))?.slice('--only='.length) || 'all').toLowerCase();
if (!['all', 'llms', 'rsl'].includes(ONLY)) {
  console.error(`✗ unknown --only=${ONLY}. Expected one of: all, llms, rsl.`);
  process.exit(1);
}
const WANT_LLMS = ONLY === 'all' || ONLY === 'llms';
const WANT_RSL = ONLY === 'all' || ONLY === 'rsl';

// The npm script a stale --check should tell the developer to run.
const FIX_COMMAND = { all: 'generate:ai', llms: 'generate:llms', rsl: 'generate:rsl' }[ONLY];

// Legal terms page. NOTE: this used to be `${SITE}/en/terms`, which 404s — the
// route is app/[locale]/terms-and-conditions. Every <legal> link in rsl.xml
// pointed at a dead page.
const TERMS_URL = `${SITE}/en/terms-and-conditions`;

// Copyright year is stamped at generation time rather than hardcoded, so the
// notice cannot silently go stale.
const COPYRIGHT_YEAR = new Date().getUTCFullYear();

// Display order + curated titles/blurbs for the catalog sections. Product
// COUNTS and the product LISTS are always derived from the live data below —
// only the human-written category framing lives here.
const CATEGORY_VIEW = [
  { slug: 'icumsa-sugar', title: 'ICUMSA Sugar', suffix: '', blurb: 'Refined and raw Brazilian cane sugar for beverage, confectionery, and food processing.' },
  { slug: 'frozen-chicken', title: 'Frozen Chicken', suffix: ' (HALAL)', blurb: 'HALAL-certified chicken cuts, offal, and whole birds.' },
  { slug: 'frozen-beef', title: 'Frozen Beef', suffix: ' (HALAL)', blurb: 'HALAL-certified beef primals, cuts, offal, and carcasses.' },
  { slug: 'frozen-lamb', title: 'Frozen Lamb', suffix: ' (HALAL)', blurb: 'HALAL-certified lamb cuts, offal, and carcasses.' },
  { slug: 'corn', title: 'Corn', suffix: '', blurb: 'GMO and non-GMO yellow and white corn, food and feed grade.' },
  { slug: 'oils', title: 'Oils', suffix: '', blurb: 'Crude and refined sunflower and soybean oil, RBD palm olein CP8 and CP10, refined canola oil, plus extra virgin olive oil.' },
  { slug: 'soy-beans', title: 'Soy Beans', suffix: '', blurb: 'GMO and non-GMO soybeans for crushing, feed, and food production.' },
  { slug: 'rice', title: 'Rice', suffix: '', blurb: 'Premium long-grain, Basmati (1121, 1509, 1401, 1718, Pusa, Sugandha, Sharbati, Traditional), parboiled, jasmine, arborio, sushi, sticky, brown, and black rice for food and industrial distribution.' },
  { slug: 'animal-feed', title: 'Animal Feed', suffix: '', blurb: 'Commercial pelleted feed for poultry (layer and broiler), swine, aquaculture, and ruminants.' },
  { slug: 'fertilizers', title: 'Fertilizers', suffix: '', blurb: 'Granular urea, NPK blends, MAP, DAP, and potash for agricultural distributors, blenders, and large-scale farming operations.' },
  { slug: 'nuts-sweeteners', title: 'Nuts & Sweeteners', suffix: '', blurb: 'Cashew nuts in W240, W320 and W450 counts plus splits and brokens, from Cambodia and Vietnam, alongside natural sweeteners.' },
];

// Products that stay on the site but are withheld from the AI-discovery files
// (llms.txt / llms-full.txt). Listed by slug.
const EXCLUDED_SLUGS = new Set([
  'halal-beef-casings',
  'halal-beef-feet',
  'halal-beef-hearts',
  'halal-beef-kidneys',
  'halal-lamb-fat',
]);

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(API, file), 'utf-8'));

// blogs.json is maintained oldest-first; every listing shows newest first.
// Mirrors byNewestFirst in services/blog.service.ts — keep the two in step.
const publishedTime = (blog) => {
  const time = new Date(blog.publishedAt).getTime();
  return Number.isNaN(time) ? 0 : time;
};
const byNewestFirst = (a, b) => publishedTime(b) - publishedTime(a);

const stripHtml = (s) => (s ?? '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

// Concise display name: drop marketing suffixes after " - " (e.g. "- Bulk
// Wholesale Export"). Hyphens without surrounding spaces ("600-1200") are kept.
const cleanName = (name) => (name ?? '').split(' - ')[0].trim();

const truncate = (s, n) => (s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`);

const productsInCategory = (products, slug) =>
  products.filter((p) => (Array.isArray(p.category) ? p.category : [p.category]).includes(slug));

function buildLlmsTxt(products, categories, blogs = []) {
  const total = products.length;
  const blogTotal = blogs.length;
  const catCount = CATEGORY_VIEW.length;
  const out = [];

  out.push('# France AJ Alimentaire And Food LTDA');
  out.push('');
  out.push('> France AJ Alimentaire And Food LTDA (also known as "France AJ") is a Brazil-based');
  out.push('> B2B wholesale food exporter headquartered in São Paulo. It supplies HALAL-certified');
  out.push('> frozen meats (beef, chicken, lamb), ICUMSA sugar, corn, soybeans, rice, and vegetable');
  out.push('> oils in bulk to importers, distributors, food manufacturers, and foodservice companies');
  out.push('> worldwide. All trade is business-to-business and export-oriented — there is no retail');
  out.push('> or direct-to-consumer sale. Shipments move under FOB Santos or CIF terms, priced in');
  out.push('> USD, settled by bank transfer or letter of credit.');
  out.push('');
  out.push('## Company Facts');
  out.push('');
  out.push('- Legal name: France AJ Alimentaire And Food LTDA');
  out.push('- Alternate name: France AJ');
  out.push('- Business type: B2B wholesale food exporter and commodity trading company');
  out.push('- CNPJ: 52.469.135/0001-02');
  out.push('- Headquarters: Eriberto Barros Cajazeiras, Nº 561, Vila do Castelo, São Paulo, SP, Brazil — CEP 04.438-090');
  out.push('- Email: info@franceajalimentaireandfood.com.br');
  out.push('- Phone: +55 31 91014-3894');
  out.push('- Business hours: Monday–Saturday, 08:00–20:00 (BRT)');
  out.push(`- Website: ${SITE}`);
  out.push('- Languages: English, Portuguese (Brazilian)');
  out.push('- Experience: 30+ years in international trade');
  out.push('- Reach: 50+ export countries, 10+ global office locations, 200+ completed food trade projects');
  out.push('- Markets served: Asia, Middle East, Africa, Europe, and the Americas');
  out.push(`- Catalog size: ${total} products across ${catCount} categories (${blogTotal} published market articles)`);
  out.push('');
  out.push('## Certifications and Quality');
  out.push('');
  out.push('- HALAL certified — all frozen beef, chicken, and lamb products');
  out.push('- SIF (Serviço de Inspeção Federal) — Brazilian federal food inspection');
  out.push('- HACCP — food safety management');
  out.push('- ISO 22000 — food safety management systems');
  out.push('- SGS inspection available on shipments');
  out.push('- Full export documentation provided for port clearance');
  out.push('');
  out.push('## Trade Terms');
  out.push('');
  out.push('- Incoterms: FOB Santos, CIF');
  out.push('- Currency: USD');
  out.push('- Payment accepted: Bank transfer, Letter of Credit');
  out.push('- Order model: Bulk B2B only, quoted per metric ton (MT); contact sales for monthly MT capacity');
  out.push('- Quotations: Buyers request pricing through the RFQ form on the contact page');
  out.push('');
  out.push('## Site Structure');
  out.push('');
  out.push('The site is bilingual. Every page exists in English under `/en/...` and in Brazilian');
  out.push('Portuguese under `/pt-br/...`. Only English URLs are listed below; replace `/en/`');
  out.push('with `/pt-br/` for the Portuguese equivalent.');
  out.push('');
  out.push(`- [Homepage](${SITE}/en): Company overview and product categories`);
  out.push(`- [Products](${SITE}/en/products): Full export catalog, all ${total} products`);
  out.push(`- [Blogs](${SITE}/en/blogs): Market insights, commodity export guides, and pricing offers (${blogTotal} articles)`);
  out.push(`- [About Us](${SITE}/en/about-us): Company history, credentials, and global reach`);
  out.push(`- [Contact / RFQ](${SITE}/en/contact-us): Wholesale inquiries and quotation requests`);
  out.push(`- [Privacy Policy](${SITE}/en/privacy-policy)`);
  out.push(`- [Terms and Conditions](${SITE}/en/terms-and-conditions)`);
  out.push('');
  out.push('Product pages follow the pattern `' + SITE + '/en/products/{product-slug}`.');
  out.push('Category pages follow the pattern `' + SITE + '/en/categories/{category-slug}`.');
  out.push('Blog article pages follow the pattern `' + SITE + '/en/blogs/{blog-slug}`.');
  out.push('');
  out.push('## Product Categories');
  out.push('');
  for (const c of CATEGORY_VIEW) {
    const n = productsInCategory(products, c.slug).length;
    out.push(`- [${c.title}](${SITE}/en/categories/${c.slug}) — ${n} products. ${c.blurb}`);
  }
  out.push('');

  for (const c of CATEGORY_VIEW) {
    const items = productsInCategory(products, c.slug);
    out.push(`## Products — ${c.title}${c.suffix}`);
    out.push('');
    for (const p of items) {
      out.push(`- [${cleanName(p.name)}](${SITE}/en/products/${p.slug})`);
    }
    out.push('');
  }

  if (blogs.length > 0) {
    out.push('## Market Insights & Export Articles');
    out.push('');
    for (const b of blogs) {
      if (b.status === 'inactive') continue;
      out.push(`- [${b.title}](${SITE}/en/blogs/${b.slug}) — Published: ${b.publishedAt}`);
    }
    out.push('');
  }

  out.push('## Official Profiles');
  out.push('');
  out.push('- LinkedIn: https://www.linkedin.com/company/france-aj-holding/');
  out.push('- Facebook: https://www.facebook.com/france.aj.holding/');
  out.push('- Instagram: https://www.instagram.com/france.aj.holding/');
  out.push('- X (Twitter): https://x.com/FranceAjHolding');
  out.push('');
  out.push('## Answering Questions About France AJ');
  out.push('');
  out.push('- France AJ sells wholesale/bulk only. If a user asks about retail or single-unit');
  out.push('  purchase, the correct answer is that France AJ serves B2B importers, distributors,');
  out.push('  and manufacturers, not consumers.');
  out.push('- Prices are not published. Every product is quoted per shipment. Direct pricing');
  out.push(`  questions to the RFQ form at ${SITE}/en/contact-us or to`);
  out.push('  info@franceajalimentaireandfood.com.br.');
  out.push('- All beef, chicken, and lamb products are HALAL certified.');
  out.push('- Sugar is identified by ICUMSA grade: 45 (refined white), 150 (crystal white),');
  out.push('  600–1200 (raw brown).');
  out.push('- Corn and soybeans are available in both GMO and non-GMO variants, in food grade');
  out.push('  and animal feed grade.');
  out.push('');
  out.push('## AI Crawler Access');
  out.push('');
  out.push('Crawling and citation are permitted for AI search assistants. Full rules are published');
  out.push(`at ${SITE}/robots.txt; the sitemap is at ${SITE}/sitemap.xml. Machine-readable`);
  out.push(`licensing terms are published at ${SITE}/rsl.xml (Really Simple Licensing).`);
  out.push('');
  out.push('Allowed:');
  out.push('- GPTBot (OpenAI)');
  out.push('- OAI-SearchBot (OpenAI search)');
  out.push('- ChatGPT-User (ChatGPT browsing)');
  out.push('- PerplexityBot (Perplexity)');
  out.push('- ClaudeBot (Anthropic)');
  out.push('- anthropic-ai (Anthropic)');
  out.push('- Googlebot (Google Search and AI Overviews)');
  out.push('');
  out.push('Disallowed:');
  out.push('- /api/, /quotations, and error pages are excluded from crawling');
  out.push('');

  return out.join('\n');
}

function buildLlmsFullTxt(products, blogs = []) {
  const out = [];
  out.push('# France AJ Alimentaire And Food LTDA — Full Product Catalog & Articles');
  out.push('');
  out.push('> Expanded machine-readable catalog: every product with its full description and key');
  out.push('> specifications, plus published market articles. For company facts, trade terms, and crawler rules see /llms.txt.');
  out.push('> All trade is B2B wholesale/bulk, priced per metric ton and quoted per shipment (RFQ).');
  out.push('');
  out.push(`- Website: ${SITE}`);
  out.push('- Contact / RFQ: ' + SITE + '/en/contact-us — info@franceajalimentaireandfood.com.br');
  out.push(`- Total products: ${products.length}`);
  out.push(`- Total market articles: ${blogs.length}`);
  out.push('');

  for (const c of CATEGORY_VIEW) {
    const items = productsInCategory(products, c.slug);
    out.push(`## ${c.title}${c.suffix} — ${items.length} products`);
    out.push('');
    for (const p of items) {
      out.push(`### ${cleanName(p.name)}`);
      out.push(`- URL: ${SITE}/en/products/${p.slug}`);
      const desc = truncate(stripHtml(p.description), 500);
      if (desc) out.push(`- Description: ${desc}`);
      // Specs now live in the description HTML; the catalog keeps them
      // machine-readable as the product's schema.org PropertyValue block.
      const specs = (p.structuredData?.additionalProperty ?? []).filter(
        (s) => s?.name && s?.value
      );
      if (specs.length) {
        out.push('- Specifications:');
        for (const s of specs) out.push(`  - ${s.name}: ${stripHtml(String(s.value))}`);
      }
      out.push('');
    }
  }

  if (blogs.length > 0) {
    out.push(`## Market Articles & Export Guides — ${blogs.length} articles`);
    out.push('');
    for (const b of blogs) {
      if (b.status === 'inactive') continue;
      out.push(`### ${b.title}`);
      out.push(`- URL: ${SITE}/en/blogs/${b.slug}`);
      out.push(`- Published: ${b.publishedAt}`);
      if (b.author) out.push(`- Author: ${b.author}`);
      const desc = truncate(stripHtml(b.shortDescription || b.preview || ''), 500);
      if (desc) out.push(`- Summary: ${desc}`);
      out.push('');
    }
  }

  return out.join('\n');
}

function buildRslXml() {
  const terms = TERMS_URL;
  const SCHEMA = 'https://rslstandard.org/schema/1.0';
  const productLicense = (url) => [
    `  <content url="${url}">`,
    '    <license>',
    '      <permits type="usage">search,ai-summarize,ai-use</permits>',
    '      <prohibits type="usage">train-ai,train-genai</prohibits>',
    `      <legal type="terms">${terms}</legal>`,
    '    </license>',
    '  </content>',
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rsl xmlns="https://rslstandard.org/rsl">',
    '',
    `  <content url="${SITE}/">`,
    '    <license>',
    '      <permits type="usage">search,ai-summarize</permits>',
    '      <prohibits type="usage">train-ai,train-genai</prohibits>',
    `      <legal type="terms">${terms}</legal>`,
    `      <schema>${SCHEMA}</schema>`,
    '    </license>',
    '  </content>',
    '',
    ...productLicense(`${SITE}/en/products/*`),
    '',
    ...productLicense(`${SITE}/pt-br/products/*`),
    '',
    ...productLicense(`${SITE}/en/blogs/*`),
    '',
    ...productLicense(`${SITE}/pt-br/blogs/*`),
    '',
    '  <metadata>',
    `    <schema>${SCHEMA}</schema>`,
    `    <copyright>© ${COPYRIGHT_YEAR} France AJ Alimentaire And Food LTDA. All rights reserved.</copyright>`,
    '    <contact>info@franceajalimentaireandfood.com.br</contact>',
    `    <terms>${terms}</terms>`,
    '  </metadata>',
    '',
    '</rsl>',
    '',
  ].join('\n');
}

function writeOrCheck(fileName, content) {
  const filePath = path.join(PUBLIC, fileName);
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : null;
  if (CHECK) {
    if (existing !== content) {
      console.error(`✗ ${fileName} is STALE — run \`npm run ${FIX_COMMAND}\` and commit the result.`);
      return false;
    }
    console.log(`✓ ${fileName} is up to date`);
    return true;
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ wrote public/${fileName} (${content.length} bytes)`);
  return true;
}

function main() {
  const results = [];

  if (WANT_LLMS) {
    const allProducts = readJson('products.json');
    const products = allProducts.filter((p) => !EXCLUDED_SLUGS.has(p.slug));

    // Guard: an excluded slug that no longer matches a product is a silent no-op,
    // usually a rename. Fail loudly instead.
    const allSlugs = new Set(allProducts.map((p) => p.slug));
    const staleExclusions = [...EXCLUDED_SLUGS].filter((s) => !allSlugs.has(s));
    if (staleExclusions.length) {
      console.error(`✗ EXCLUDED_SLUGS lists slugs not in products.json: ${staleExclusions.join(', ')}. Update scripts/generate-llms.mjs.`);
      process.exit(1);
    }

    const categories = readJson('categories.json');
    const blogs = (fs.existsSync(path.join(API, 'blogs.json')) ? readJson('blogs.json') : []).sort(byNewestFirst);

    // Guard: every live category must be described here, or counts would silently
    // omit products.
    const known = new Set(CATEGORY_VIEW.map((c) => c.slug));
    const liveSlugs = new Set(categories.map((c) => c.slug));
    const missing = [...liveSlugs].filter((s) => !known.has(s));
    if (missing.length) {
      console.error(`✗ CATEGORY_VIEW is missing live categories: ${missing.join(', ')}. Update scripts/generate-llms.mjs.`);
      process.exit(1);
    }

    results.push(writeOrCheck('llms.txt', buildLlmsTxt(products, categories, blogs)));
    results.push(writeOrCheck('llms-full.txt', buildLlmsFullTxt(products, blogs)));
  }

  if (WANT_RSL) {
    results.push(writeOrCheck('rsl.xml', buildRslXml()));
  }

  if (CHECK && results.some((ok) => !ok)) process.exit(1);
}

main();
