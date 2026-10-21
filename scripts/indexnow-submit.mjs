#!/usr/bin/env node
/**
 * Submit the site's URLs to IndexNow (Bing, Yandex, Naver, Seznam, …).
 *
 * Reads the live sitemap.xml, extracts every <loc>, and posts the batch to the
 * IndexNow API. Run after a deploy that changed content, e.g. in CI or manually:
 *
 *   node scripts/indexnow-submit.mjs
 *   node scripts/indexnow-submit.mjs https://www.franceaj.com/en/products/sugar-icumsa-45
 *
 * Env:
 *   NEXT_PUBLIC_WEBSITE_URL  site origin (default https://www.franceaj.com)
 *   INDEXNOW_KEY             public key (default matches public/<key>.txt)
 */

const SITE = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.franceaj.com';
const KEY = process.env.INDEXNOW_KEY || '31bde9ad6edbd932031c19fdc87353aa';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function getUrlsFromSitemap() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const explicit = process.argv.slice(2);
  const urlList = explicit.length > 0 ? explicit : await getUrlsFromSitemap();

  if (urlList.length === 0) {
    console.error('No URLs to submit.');
    process.exit(1);
  }

  const host = new URL(SITE).host;
  console.log(`Submitting ${urlList.length} URL(s) to IndexNow for ${host}…`);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key: KEY,
      keyLocation: `https://${host}/${KEY}.txt`,
      urlList,
    }),
  });

  const body = await res.text();
  console.log(`IndexNow responded: HTTP ${res.status} ${body || '(no body)'}`);
  // 200 = OK, 202 = accepted (key validation pending). Both are success.
  if (res.status !== 200 && res.status !== 202) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
