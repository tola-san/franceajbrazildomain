export const port = process.env.PORT || 3000;

// Origin used for server-side data fetches. In dev this must stay on localhost,
// otherwise the running server pulls products.json from the live site and local
// edits appear to have no effect.
export const host =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${port}`
    : process.env.NEXT_PUBLIC_WEBSITE_URL || `http://localhost:${port}`;