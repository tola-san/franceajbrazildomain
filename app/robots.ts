import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
     return {
          rules: [
               {
                    userAgent: '*',
                    // Blog pages, plus the JSON the listing fetches client-side:
                    // the data files stay crawlable even though /api/ is blocked.
                    allow: [
                         '/',
                         '/en/blogs',
                         '/pt-br/blogs'
                    ],
                    disallow: [
                         // '/_next/static/',
                         '/_next/data/',
                         '/api/',
                         // '/pt-br/private/',
                         // '/en/private/',
                         '/en/quotations',
                         '/pt-br/quotations',
                    ],
               },
          ],
          sitemap: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/sitemap.xml`,
     }
}
