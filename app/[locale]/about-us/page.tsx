import AboutPageContent from "./about-page-content";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.franceaj.com";

type Props = {
  params: Promise<{ locale: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.about' });
  const lang = locale === "pt-br" ? "pt-BR" : "en";
  const SITE_X = process.env.SITE_X;

  return {
    metadataBase: new URL(baseUrl),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${lang}/about-us`,
      siteName: "France AJ Alimentaire And Food LTDA",
      images: [
        {
          url: `${baseUrl}/images/Banners/france-aj-alimentaire-about.jpg`,
          width: 1200,
          height: 630,
          alt: t('title'),
          type: "image/jpeg",
        },
      ],
      locale: lang,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
      images: [`${baseUrl}/images/Banners/france-aj-alimentaire-about.jpg`],
      site: SITE_X,
      creator: SITE_X,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/about-us`,
      languages: {
        en: `${baseUrl}/en/about-us`,
        "pt-BR": `${baseUrl}/pt-br/about-us`,
        "x-default": `${baseUrl}/en/about-us`,
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

const breadcrumbList = async (locale: string) => {
  const t = await getTranslations({ locale, namespace: 'metadata.about' });
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
        item: `${baseUrl}/${locale}/about-us`,
      },
    ],
  };
};

export default async function Page({ params }: Props) {
  const { locale } = await params;

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8">
        <AboutPageContent />
      </section>
      <script
        type="application/ld+json"
        key="breadcrumb-json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(await breadcrumbList(locale)) }}
      />
    </>
  );
}
