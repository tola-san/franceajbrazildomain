import type { Metadata } from "next";
import Head from "next/head";
import QuotationsPageContent from "./quotations-page-content";
import { getTranslations } from "next-intl/server";

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.franceaj.com";
const SITE_X = process.env.SITE_X;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.quotations' });
  const lang = locale === "pt-br" ? "pt-BR" : "en";

  return {
    metadataBase: new URL(baseUrl),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${lang}/quotations`,
      siteName: "France AJ Alimentaire And Food LTDA",
      images: [
        {
          url: `${baseUrl}/images/Banners/france-aj-alimentaire-quote.jpg`,
          width: 1200,
          height: 630,
          alt: t('title'),
          type: "image/jpeg",
        },
      ],
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
      images: [`${baseUrl}/images/Banners/france-aj-alimentaire-quote.jpg`],
      site: SITE_X,
      creator: SITE_X,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/quotations`,
      languages: {
        en: `${baseUrl}/en/quotations`,
        "pt-BR": `${baseUrl}/pt-br/quotations`,
        "x-default": `${baseUrl}/en/quotations`,
      },
    },
    other: {
      sameAs: [
        "https://www.linkedin.com/company/france-aj-holding/",
        "https://x.com/FranceAjHolding",
        "https://www.facebook.com/france.aj.holding/",
        "https://www.instagram.com/france.aj.holding/",
        "https://wa.me/5531910143894",
      ],
    },
  };
}

const getBreadcrumbList = async (locale: string) => {
  const t = await getTranslations({ locale, namespace: 'metadata.quotations' });
  const th = await getTranslations({ locale, namespace: 'metadata.home' });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: th('title'),
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t('title'),
        item: `${baseUrl}/${locale}/quotations`,
      },
    ],
  };
};

export default async function Page({ params }: Props) {
  const { locale } = await params;

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          key="breadcrumb-json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(await getBreadcrumbList(locale)),
          }}
        />
      </Head>

      <section className="flex flex-col items-center min-h-screen gap-4 py-8">
        <QuotationsPageContent />
      </section>
    </>
  );
}
