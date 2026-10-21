
const createNextIntlPlugin = require('next-intl/plugin');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const withNextIntl = createNextIntlPlugin();

// FALLBACK freshness date for products that carry no `dateModified` of their own
// (the per-product date lives in the catalog and is maintained by
// scripts/stamp-product-dates.mjs).
//
// This MUST be resolved here, at build time, and inlined via `env` below: the
// product route renders on demand, and inside the serverless bundle Next
// normalizes every file's mtime to a fixed epoch (1540000000 -> 2018-10-20). A
// runtime fs.statSync() therefore dates every product to 2018. (app/sitemap.ts
// gets away with it only because it is generated on the build machine, where
// mtimes are real.)
const catalogModified = (fileName) => {
    const filePath = path.join(__dirname, 'public', 'api', fileName);

    // Prefer the git commit date: it tracks when the catalog CONTENT last
    // changed. A checkout mtime only records when the deploy cloned the repo,
    // which would claim every product was updated on every unrelated deploy.
    try {
        const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
            cwd: __dirname,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();

        if (iso && !Number.isNaN(Date.parse(iso))) return new Date(iso).toISOString();
    } catch {
        // git missing or no history for this path (shallow clone, tarball
        // deploy) - fall back to the build machine's mtime.
    }

    try {
        return fs.statSync(filePath).mtime.toISOString();
    } catch {
        // Nothing trustworthy to report; the page omits dateModified entirely
        // rather than fabricating one.
        return '';
    }
};


const nextConfig = {
    outputFileTracingIncludes: {
        '/**': ['./public/api/**/*'],
    },
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    compress: true,
    poweredByHeader: false,
    trailingSlash: false,
    // Build-time constants (see catalogModified above). Inlined into the bundle,
    // so the serverless runtime never touches the filesystem for these.
    env: {
        CATALOG_MODIFIED_EN: catalogModified('products.json'),
        CATALOG_MODIFIED_BR: catalogModified('products-br.json'),
    },
    compiler: {
        // Strip all console.* calls from production builds (kept in dev).
        removeConsole: process.env.NODE_ENV === 'production',
    },
    images: {
        domains: ['www.franceaj.com', 'localhost'],
    },
    async headers() {
        return [
            // Long-lived caching for static public assets (images/fonts have
            // stable filenames). Improves TTFB/LCP and crawl efficiency.
            {
                source: '/images/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
                ],
            },
            {
                source: '/fonts/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
        ]
    },
    async redirects() {
        return [
            // Product slug rename: golden-white-long-rice-5-percent-broken ->
            // long-grain-white-rice-5-percent-broken (aligned with the product
            // name). Keeps the previously indexed URLs alive with a 308.
            {
                source: '/:locale(en|pt-br)/products/golden-white-long-rice-5-percent-broken',
                destination: '/:locale/products/long-grain-white-rice-5-percent-broken',
                permanent: true,
            },
            {
                source: '/products/golden-white-long-rice-5-percent-broken',
                destination: '/en/products/long-grain-white-rice-5-percent-broken',
                permanent: true,
            },
            // Product slug rename: 1121-basmati-rice-golden-sella ->
            // 1121-golden-sella-basmati-rice (aligned with the product name).
            {
                source: '/:locale(en|pt-br)/products/1121-basmati-rice-golden-sella',
                destination: '/:locale/products/1121-golden-sella-basmati-rice',
                permanent: true,
            },
            {
                source: '/products/1121-basmati-rice-golden-sella',
                destination: '/en/products/1121-golden-sella-basmati-rice',
                permanent: true,
            },
            // Canonicalize apex -> www with a permanent (308) redirect for a
            // clean canonical signal. NOTE: this only fires if the apex domain
            // is served by this deployment. If Vercel is configured with a
            // domain-level "Redirect to www.franceaj.com", that platform 307
            // takes precedence — switch the apex to a normal assigned domain
            // (no redirect) in the Vercel dashboard for this rule to apply.
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'franceaj.com' }],
                destination: 'https://www.franceaj.com/:path*',
                permanent: true,
            },
        ]
    }
};

module.exports = withNextIntl(nextConfig);
