import HomePageContent from "@/app/[locale]/(home)/home-page-content";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { HomeService } from "@/services/home.service";
import { headers } from "next/headers";
import { getSocialMediaSchema } from "@/lib/social-media-schema";

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.franceaj.com";

type Props = {
  params: Promise<{ locale: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });
  const lang = locale === 'pt-br' ? 'pt-BR' : 'en';
  const SITE_X = process.env.SITE_X;

  return {
    metadataBase: new URL(baseUrl),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${lang}`,
      siteName: 'France AJ Alimentaire And Food LTDA',
      images: [
        {
          url: `/images/banners/home-og-banner.webp`,
          width: 1200,
          height: 630,
          alt: t('ogImageAlt'),
          type: 'image/jpeg',
        },
      ],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/banners/home-og-banner.webp'],
      site: SITE_X,
      creator: SITE_X,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        en: `${baseUrl}/en`,
        'pt-BR': `${baseUrl}/pt-br`,
        'x-default': `${baseUrl}/en`,
      },
    },
  };
}

const getWebSiteSchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  name: 'France AJ Alimentaire And Food LTDA',
  url: `${baseUrl}/${locale}`,
  inLanguage: locale === 'pt-br' ? 'pt-BR' : 'en',
  publisher: {
    '@id': `${baseUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/${locale}/products?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const userAgent = (await headers()).get("user-agent") || "";
  const isMobileOrTablet = /mobile|iphone|ipad|android|tablet/i.test(userAgent);
  const initialLimit = isMobileOrTablet ? 4 : 3;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['home-page', locale, initialLimit],
    queryFn: () => HomeService.getHomePage({ lang: locale, limit: initialLimit }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <link
        rel="preload"
        href={`/images/banners/home-og-banner.webp`}
        as="image"
        fetchPriority="high"
      />
      <HomePageContent locale={locale} initialLimit={initialLimit} />
      {/* No BreadcrumbList on the homepage: it is the site root and has no
          breadcrumb trail. A single-item ("Home") list is invalid for a rich
          result. Homepage structured data is covered by WebSite + Organization. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getWebSiteSchema(locale))
        }}
      />
      {/* VideoObject / ImageObject for the Instagram feed section. Self-hosted
          media, so Google can crawl contentUrl directly — this is what makes the
          clips eligible for the Search Console Videos report, the Video tab and
          video rich results. Mirrored as video entries in app/sitemap.ts. */}
      {getSocialMediaSchema(locale).map((mediaSchema) => (
        <script
          key={mediaSchema['@id']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaSchema) }}
        />
      ))}
    </HydrationBoundary>
  );
}
