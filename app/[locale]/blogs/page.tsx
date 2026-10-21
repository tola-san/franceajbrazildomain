import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import BlogsPageContent from './blogs-page-content';
import { BlogService } from '@/services/blog.service';
import { getTranslations } from 'next-intl/server';
import Script from 'next/script';

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.franceaj.com';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.blogs' });
    const SITE_X = process.env.SITE_X;
    const lang = locale === "pt-br" ? "pt-BR" : "en";

    return {
        metadataBase: new URL(baseUrl),
        title: t('title'),
        description: t('description'),
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${lang}/blogs`,
            siteName: 'France AJ Alimentaire And Food LTDA',
            images: [
                {
                    url: `${baseUrl}/images/Banners/france-aj-alimentaire-hero.jpg`,
                    width: 1200,
                    height: 630,
                    alt: t('title'),
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
            images: [`${baseUrl}/images/Banners/france-aj-alimentaire-hero.jpg`],
            site: SITE_X,
            creator: SITE_X,
        },
        alternates: {
            canonical: `${baseUrl}/${lang}/blogs`,
            languages: {
                en: `${baseUrl}/en/blogs`,
                'pt-BR': `${baseUrl}/pt-br/blogs`,
                'x-default': `${baseUrl}/en/blogs`,
            },
        },
    };
}

const getBreadcrumbList = async (locale: string) => {
    const t = await getTranslations({ locale, namespace: 'metadata.blogs' });
    const th = await getTranslations({ locale, namespace: 'metadata.home' });

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: th('title'),
                item: `${baseUrl}/${locale}`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: t('title'),
                item: `${baseUrl}/${locale}/blogs`,
            },
        ],
    };
};

export default async function Page({ params }: Props) {
    const { locale } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['blogs', locale],
        queryFn: () => BlogService.getBlogs(locale),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <section className="flex flex-col items-center justify-center gap-4 py-8">
                <BlogsPageContent locale={locale} />
            </section>
            <Script
                type="application/ld+json"
                key="breadcrumb-json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(await getBreadcrumbList(locale)),
                }}
            />
        </HydrationBoundary>
    );
}