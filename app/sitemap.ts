import { MetadataRoute } from 'next';
import { Locale } from 'next-intl';
import { host } from '@/config';
import { routing } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { getSocialMediaSitemapVideos } from '@/lib/social-media-schema';
import fs from 'fs';
import path from 'path';

// Define the prioritization strategy
const priorities = {
  homepage: 1.0,
  mainSections: 0.9,
  subPages: 0.8,
  contentPages: 0.6,
  legalPages: 0.3,
};

// Define the change frequency strategy
const frequencies = {
  homepage: 'weekly' as const,
  mainSections: 'monthly' as const,
  subPages: 'monthly' as const,
  contentPages: 'weekly' as const,
  legalPages: 'yearly' as const,
};

export default function sitemap(): MetadataRoute.Sitemap {
  // Derive lastModified from the underlying data files so the sitemap reflects
  // real content changes (the product/category/blog data).
  const productsMtime = getFileMtime(path.join(process.cwd(), 'public', 'api', 'products.json'));
  const categoriesMtime = getFileMtime(path.join(process.cwd(), 'public', 'api', 'categories.json'));
  const blogsMtime = getFileMtime(path.join(process.cwd(), 'public', 'api', 'blogs.json'));

  // The homepage hosts the Instagram feed clips; declaring them here is what
  // gets them discovered for the Search Console Videos report.
  const homepageVideos = getSocialMediaSitemapVideos();

  const staticRoutes = [
    { href: '/', priority: priorities.homepage, changeFrequency: frequencies.homepage, lastModified: productsMtime, videos: homepageVideos },
    { href: '/about-us', priority: priorities.mainSections, changeFrequency: frequencies.mainSections, lastModified: SITE_LAST_MODIFIED },
    { href: '/contact-us', priority: priorities.mainSections, changeFrequency: frequencies.mainSections, lastModified: SITE_LAST_MODIFIED },
    { href: '/products', priority: priorities.mainSections, changeFrequency: frequencies.mainSections, lastModified: productsMtime },
    { href: '/blogs', priority: priorities.mainSections, changeFrequency: frequencies.contentPages, lastModified: blogsMtime },
    { href: '/resources', priority: priorities.contentPages, changeFrequency: frequencies.contentPages, lastModified: SITE_LAST_MODIFIED },
  ];

  const productRoutes = getProductRoutes();
  const categoryRoutes = getCategoryRoutes();
  const blogRoutes = getBlogRoutes(blogsMtime);

  return [
    ...staticRoutes.flatMap((route) => getEntries(route.href as Href, route.priority, route.changeFrequency, route.lastModified, route.videos)),
    ...productRoutes.flatMap((slug) => getEntries(`/products/${slug}` as Href, priorities.subPages, frequencies.subPages, productsMtime)),
    ...categoryRoutes.flatMap((slug) => getEntries(`/categories/${slug}` as Href, priorities.contentPages, frequencies.contentPages, categoriesMtime)),
    ...blogRoutes.flatMap((blog) => getEntries(`/blogs/${blog.slug}` as Href, priorities.contentPages, frequencies.contentPages, blog.lastModified)),
  ];
}

type Href = Parameters<typeof getPathname>[0]['href'];

const SITE_LAST_MODIFIED = new Date('2026-07-18')

// Map routing locales to BCP-47 hreflang codes (region subtag uppercased).
const HREFLANG_BY_LOCALE: Record<string, string> = { en: 'en', 'pt-br': 'pt-BR' };

function getFileMtime(filePath: string): Date {
  try {
    return fs.statSync(filePath).mtime;
  } catch {
    return SITE_LAST_MODIFIED;
  }
}

function getEntries(
  href: Href,
  priority: number,
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
  lastModified: Date,
  videos?: MetadataRoute.Sitemap[number]['videos']
) {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((cur) => [HREFLANG_BY_LOCALE[cur] ?? cur, getUrl(href, cur)])
  );
  languages['x-default'] = getUrl(href, routing.defaultLocale);

  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    lastModified: lastModified,
    changeFrequency: changeFrequency,
    priority: priority,
    alternates: {
      languages,
    },
    ...(videos?.length ? { videos } : {}),
  }));
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getPathname({ locale, href });
  return host + pathname;
}

function getProductRoutes(): string[] {
  const filePath = path.join(process.cwd(), 'public', 'api', 'products.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const products = JSON.parse(fileContent);

  // Exclude deactivated products so the sitemap never lists a URL that 404s.
  return products
    .filter((product: { status?: string }) => product.status !== 'inactive')
    .map((product: { slug: string }) => product.slug);
}

function getCategoryRoutes(): string[] {
  const filePath = path.join(process.cwd(), 'public', 'api', 'categories.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const categories = JSON.parse(fileContent);

  return categories.map((product: { slug: string }) => product.slug);
}

function getBlogRoutes(defaultMtime: Date): Array<{ slug: string; lastModified: Date }> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'api', 'blogs.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const blogs = JSON.parse(fileContent);

    return blogs
      .filter((blog: { status?: string }) => blog.status !== 'inactive')
      .map((blog: { slug: string; updatedAt?: string; publishedAt?: string }) => {
        const dateStr = blog.updatedAt || blog.publishedAt;
        const lastModified = dateStr ? new Date(dateStr) : defaultMtime;
        return {
          slug: blog.slug,
          lastModified: isNaN(lastModified.getTime()) ? defaultMtime : lastModified,
        };
      });
  } catch {
    return [];
  }
}