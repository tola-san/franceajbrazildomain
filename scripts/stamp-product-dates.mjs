#!/usr/bin/env node
/**
 * Maintain a real per-product `dateModified` inside the product catalogs.
 *
 * WHY THIS EXISTS
 * The catalogs carry no per-product timestamps, so product pages used to date
 * every product from the catalog FILE. That gives all ~153 products the same
 * `dateModified`: edit one product, and the other 152 claim they changed too.
 *
 * Deriving each product's date from git history at build time would be exact,
 * but it needs the full history in the build checkout — and Vercel clones
 * shallow. So the date is stored in the catalog itself, where it survives any
 * clone depth and needs no git at build time.
 *
 * Usage:
 *   node scripts/stamp-product-dates.mjs           # stamp products changed vs HEAD
 *   node scripts/stamp-product-dates.mjs --check   # exit 1 if a change is unstamped
 *   node scripts/stamp-product-dates.mjs --seed    # one-off backfill from git history
 *
 * Run the default mode before committing catalog edits (npm run stamp:dates).
 * `--seed` walks every commit that touched the catalog and is only needed once.
 */

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CATALOGS = ['public/api/products.json', 'public/api/products-br.json'];

const CHECK = process.argv.includes('--check');
const SEED = process.argv.includes('--seed');

const git = (args) =>
  execFileSync('git', args, { cwd: ROOT, maxBuffer: 1e9, encoding: 'utf-8' });

// The catalogs are written by JSON.stringify(obj, null, 2) with no trailing
// newline. Reproduce that exactly so stamping never reformats 2MB of JSON.
const readCatalog = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf-8'));
const serialize = (products) => JSON.stringify(products, null, 2);

/**
 * Identity of a product's CONTENT, with `dateModified` removed. Comparing on
 * this is what stops the stamp from treating its own previous run as a change.
 */
const contentKey = (product) => {
  const { dateModified, ...content } = product;
  return JSON.stringify(content);
};

const readCatalogAt = (rev, rel) => {
  try {
    return JSON.parse(git(['show', `${rev}:${rel}`]));
  } catch {
    return null; // file absent at that revision, or not a git checkout
  }
};

/** Per-product last-change dates, replayed from every commit touching `rel`. */
const datesFromHistory = (rel) => {
  const log = git(['log', '--format=%H %cI', '--reverse', '--', rel]).trim();
  if (!log) return {};

  const dates = {};
  let previous = null;

  for (const line of log.split('\n')) {
    const [sha, iso] = line.split(' ');
    const products = readCatalogAt(sha, rel);
    if (!products) continue;

    const current = {};
    for (const product of products) current[product.slug] = contentKey(product);
    for (const slug in current) {
      if (previous === null || current[slug] !== previous[slug]) dates[slug] = iso;
    }
    previous = current;
  }

  return dates;
};

const processCatalog = (rel, now) => {
  const products = readCatalog(rel);

  if (SEED) {
    const historical = datesFromHistory(rel);
    // A product with no history entry was added in the working tree and has
    // genuinely just changed, so `now` is the honest answer for it.
    const missing = [];
    for (const product of products) {
      product.dateModified = historical[product.slug] ?? now;
      if (!historical[product.slug]) missing.push(product.slug);
    }
    const distinct = new Set(products.map((p) => p.dateModified)).size;
    console.log(
      `  seeded ${products.length} products, ${distinct} distinct dates` +
        (missing.length ? `, ${missing.length} not in history (stamped now)` : '')
    );
    return { products, changed: products.map((p) => p.slug) };
  }

  // Default / --check: stamp only what actually differs from the committed
  // catalog. Products untouched since HEAD keep the date they already carry.
  const head = readCatalogAt('HEAD', rel);
  if (!head) {
    console.error(`  ✗ cannot read ${rel} at HEAD — run with --seed first`);
    process.exit(1);
  }

  const headByslug = {};
  for (const product of head) headByslug[product.slug] = contentKey(product);

  const headDates = {};
  for (const product of head) headDates[product.slug] = product.dateModified;

  const changed = [];
  const unstamped = [];

  for (const product of products) {
    if (headByslug[product.slug] === contentKey(product)) continue;
    changed.push(product.slug);

    // --check asks a different question than stamping does: "has this edit
    // already been given a fresh date?". An edit is stamped once its date has
    // moved off the committed one (or it is a brand-new product carrying a
    // date). Stamping itself is unconditional, so a second edit in the same
    // working tree always advances the date rather than keeping the first run's.
    const bumped = product.dateModified && product.dateModified !== headDates[product.slug];
    if (!bumped) unstamped.push(product.slug);

    if (!CHECK) product.dateModified = now;
  }

  return { products, changed, unstamped };
};

const main = () => {
  const now = new Date().toISOString();
  let stale = false;

  for (const rel of CATALOGS) {
    console.log(rel);
    const { products, changed, unstamped } = processCatalog(rel, now);

    if (CHECK) {
      if (unstamped?.length) {
        stale = true;
        console.error(
          `  ✗ ${unstamped.length} changed product(s) have a stale dateModified: ` +
            `${unstamped.slice(0, 5).join(', ')}${unstamped.length > 5 ? ', …' : ''}\n` +
            `    run \`npm run stamp:dates\` and commit the result.`
        );
      } else {
        console.log(`  ✓ up to date (${changed.length} changed since HEAD)`);
      }
      continue;
    }

    if (!SEED && !changed.length) {
      console.log('  ✓ nothing to stamp (no product changed since HEAD)');
      continue;
    }

    fs.writeFileSync(path.join(ROOT, rel), serialize(products), 'utf-8');
    if (!SEED) console.log(`  ✓ stamped ${changed.length}: ${changed.join(', ')}`);
  }

  if (stale) process.exit(1);
};

main();
