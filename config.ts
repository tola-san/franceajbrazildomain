export const port = process.env.PORT || 3000;

// Origin used for server-side data fetches.
export const host = (() => {
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:${port}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_WEBSITE_URL) {
    return process.env.NEXT_PUBLIC_WEBSITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return `http://localhost:${port}`;
})();