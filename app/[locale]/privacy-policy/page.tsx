import { ROUTES } from "@/utils/route";
import PrivacyPolicyPageContent from "./privacy-policy-page-content";
import type { Metadata } from "next";
import Script from "next/script";
import { getTranslations } from "next-intl/server";

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.franceaj.com";
const SITE_X = process.env.SITE_X;

type Props = {
  params: Promise<{ locale: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.privacy' });
  const lang = locale === "pt-br" ? "pt-BR" : "en";

  return {
    metadataBase: new URL(baseUrl),
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${lang}${ROUTES.PRIVACY_POLICY}`,
      siteName: "France AJ Alimentaire And Food LTDA",
      images: [
        {
          url: `${baseUrl}/images/Banners/france-aj-alimentaire-privacy.jpg`,
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
      images: [`${baseUrl}/images/Banners/france-aj-alimentaire-privacy.jpg`],
      site: SITE_X,
      creator: SITE_X,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}${ROUTES.PRIVACY_POLICY}`,
      languages: {
        en: `${baseUrl}/en${ROUTES.PRIVACY_POLICY}`,
        "pt-BR": `${baseUrl}/pt-br${ROUTES.PRIVACY_POLICY}`,
        "x-default": `${baseUrl}/en${ROUTES.PRIVACY_POLICY}`,
      },
    },
  };
}

const getBreadcrumbList = async (locale: string) => {
  const t = await getTranslations({ locale, namespace: 'metadata.privacy' });
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
        item: `${baseUrl}/${locale}${ROUTES.PRIVACY_POLICY}`,
      },
    ],
  };
};

export default async function Page({ params }: Props) {
  const { locale } = await params;

  return (
    <>
      <section className="flex flex-col items-center min-h-screen gap-4 py-8">
        <PrivacyPolicyPageContent />
      </section>
      <Script
        type="application/ld+json"
        key="breadcrumb-json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(await getBreadcrumbList(locale)),
        }}
      />
    </>
  );
}
