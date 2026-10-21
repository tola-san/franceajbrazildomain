import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import PageStatusBar from "@/components/navbar/PageStatusBar";
import ResourcesGrid from "@/components/resources/ResourcesGrid";
import { getResources } from "@/lib/resources";
import { ROUTES } from "@/utils/route";

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.franceaj.com";

type Props = {
  params: Promise<{ locale: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resources_page' });
  const lang = locale === "pt-br" ? "pt-BR" : "en";
  const SITE_X = process.env.SITE_X;

  return {
    metadataBase: new URL(baseUrl),
    title: t('meta_title'),
    description: t('meta_description'),
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `${baseUrl}/${lang}${ROUTES.RESOURCES}`,
      siteName: "France AJ Alimentaire And Food LTDA",
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t('meta_title'),
      description: t('meta_description'),
      site: SITE_X,
      creator: SITE_X,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}${ROUTES.RESOURCES}`,
      languages: {
        en: `${baseUrl}/en${ROUTES.RESOURCES}`,
        "pt-BR": `${baseUrl}/pt-br${ROUTES.RESOURCES}`,
        "x-default": `${baseUrl}/en${ROUTES.RESOURCES}`,
      },
    },
  };
}

const getBreadcrumbList = async (locale: string) => {
  const t = await getTranslations({ locale, namespace: 'resources_page' });
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
        item: `${baseUrl}/${locale}${ROUTES.RESOURCES}`,
      },
    ],
  };
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resources_page' });
  const resources = await getResources(locale);

  const breadcrumbItems = [
    { label: t('home'), href: "/" },
    { label: t('title'), isCurrent: true },
  ];

  return (
    <>
      <section className="container mx-auto min-h-screen px-5 py-8 lg:px-0">
        <PageStatusBar title={t('title')} />

        <div className="hidden lg:block">
          <div className="relative mb-10 flex flex-col items-center xl:mb-16 xl:mt-5">
            <h1 className="mb-5 text-2xl text-primary lg:text-6xl">{t('title')}</h1>
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <p className="mx-auto mb-10 max-w-3xl text-center text-sm leading-relaxed text-primary/70 lg:text-base">
          {t('description')}
        </p>

        {/* useSearchParams needs a Suspense boundary during prerender. */}
        <Suspense fallback={null}>
          <ResourcesGrid resources={resources} />
        </Suspense>
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
