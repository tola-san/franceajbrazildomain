import type { Metadata } from "next";
import TermsAndConditionsPageContent from "./terms-and-conditions-page-content";
import { ROUTES } from "@/utils/route";
import { getTranslations } from "next-intl/server";

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.franceaj.com";

type Props = {
  params: Promise<{ locale: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.terms' });
  const lang = locale === "pt-br" ? "pt-BR" : "en";
  const SITE_X = process.env.SITE_X;

  return {
    metadataBase: new URL(baseUrl),
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${lang}${ROUTES.TERMS_AND_CONDITIONS}`,
      siteName: "France AJ Alimentaire And Food LTDA",
      images: [
        {
          url: `${baseUrl}/images/Banners/france-aj-alimentaire-terms.jpg`,
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
      images: [`${baseUrl}/images/Banners/france-aj-alimentaire-terms.jpg`],
      site: SITE_X,
      creator: SITE_X,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}${ROUTES.TERMS_AND_CONDITIONS}`,
      languages: {
        en: `${baseUrl}/en${ROUTES.TERMS_AND_CONDITIONS}`,
        "pt-BR": `${baseUrl}/pt-br${ROUTES.TERMS_AND_CONDITIONS}`,
        "x-default": `${baseUrl}/en${ROUTES.TERMS_AND_CONDITIONS}`,
      },
    },
  };
}

const getBreadcrumbList = async (locale: string) => {
  const t = await getTranslations({ locale, namespace: 'metadata.terms' });
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
        item: `${baseUrl}/${locale}${ROUTES.TERMS_AND_CONDITIONS}`,
      },
    ],
  };
};

export default async function Page({ params }: Props) {
  const { locale } = await params;

  return (
    <>
      <section className="flex flex-col items-center min-h-screen gap-4 py-8">
        <TermsAndConditionsPageContent />
      </section>
      <script
        async
        type="application/ld+json"
        key="breadcrumb-json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(await getBreadcrumbList(locale)),
        }}
      />
    </>
  );
}
