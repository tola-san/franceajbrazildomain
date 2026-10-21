/**
 * IndexNow submission helper.
 *
 * IndexNow notifies participating search engines (Bing, Yandex, Naver, Seznam,
 * and via the shared protocol others) the moment content is added, updated, or
 * removed — faster than waiting for a crawl. Google does NOT use IndexNow.
 *
 * The key is public by design: it is verified via the file served at
 * `${WEBSITE_URL}/${INDEXNOW_KEY}.txt`. See public/<key>.txt.
 */

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// Public key — also present as public/<key>.txt for host verification.
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || '31bde9ad6edbd932031c19fdc87353aa';

function getHost(): string {
  const url = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.franceaj.com';
  return new URL(url).host;
}

/**
 * Submit one or more full URLs to IndexNow. URLs must all belong to the same
 * host as the configured site. Returns the HTTP status (200/202 = accepted).
 */
export async function submitToIndexNow(urls: string[]): Promise<number> {
  const urlList = urls.filter(Boolean);
  if (urlList.length === 0) return 0;

  const host = getHost();

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  return res.status;
}
