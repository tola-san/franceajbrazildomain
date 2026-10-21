import type { Metadata } from 'next';
import ProductsPageContent from './products-page-content';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ProductService } from '@/services/product.service';
import { CategoryService } from '@/services/category.service';
import { LIMIT } from '@/utils/limit';
import { getTranslations } from 'next-intl/server';

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.franceaj.com';
const SITE_X = process.env.SITE_X;

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.products' });

    return {
        metadataBase: new URL(baseUrl),
        title: t('title'),
        description: t('description'),
        keywords: t('keywords'),
        openGraph: {
            title: t('ogTitle'),
            description: t('ogDescription'),
            url: `${baseUrl}/${locale}/products`,
            siteName: 'France AJ Alimentaire And Food LTDA',
            images: [
                {
                    url: `${baseUrl}/images/banners/france-aj-brazil-banner-food.jpeg`,
                    width: 1200,
                    height: 630,
                    alt: t('title'),
                    type: 'image/jpeg',
                },
            ],
            locale,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('ogTitle'),
            description: t('ogDescription'),
            images: [`${baseUrl}/images/banners/france-aj-brazil-banner-food.jpeg`],
            site: SITE_X,
            creator: SITE_X,
        },
        alternates: {
            canonical: `${baseUrl}/${locale}/products`,
            languages: {
                en: `${baseUrl}/en/products`,
                "pt-BR": `${baseUrl}/pt-br/products`,
                "x-default": `${baseUrl}/en/products`,
            },
        },
        other: {
            sameAs: [
                'https://www.linkedin.com/company/france-aj-holding/',
                'https://x.com/FranceAjHolding',
                'https://www.facebook.com/france.aj.holding/',
                'https://www.instagram.com/france.aj.holding/',
                'https://wa.me/5531910143894',
            ],
        },
    };
}

const breadcrumbList = async (locale: string) => {
    const t = await getTranslations({ locale, namespace: 'metadata.products' });
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
                item: `${baseUrl}/${locale}/products`,
            },
        ],
    };
};

export default async function Page({ params, searchParams }: Props) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams;
    const queryClient = new QueryClient();

    const queryOptions = {
        page: Number(resolvedSearchParams.page) || 1,
        limit: Number(resolvedSearchParams.limit) || LIMIT.PRODUCTS_LIMIT,
        sort: (resolvedSearchParams.sort as string) || 'default',
        lang: locale,
        category: resolvedSearchParams.category_slugs
            ? (resolvedSearchParams.category_slugs as string).split(",").filter(Boolean)
            : [],
        tags: resolvedSearchParams.tags
            ? (resolvedSearchParams.tags as string).split(",").filter(Boolean)
            : [],
        search: (resolvedSearchParams.search as string) || "",
        type: (resolvedSearchParams.type as string) || "",
        slug: (resolvedSearchParams.slug as string) || "",
    };


    const [productsResponse] = await Promise.all([
        queryClient.fetchQuery({
            queryKey: ['products', queryOptions],
            queryFn: () => ProductService.getProducts(queryOptions),
        }),
        queryClient.prefetchQuery({
            queryKey: ['categories', locale],
            queryFn: () => CategoryService.getCategories({ lang: locale }),
        }),
    ]);

    const products = productsResponse?.data ?? [];
    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'B2B Wholesale Food Products — France AJ Alimentaire And Food LTDA',
        url: `${baseUrl}/${locale}/products`,
        numberOfItems: productsResponse?.total ?? products.length,
        itemListElement: products.slice(0, 20).map(
            (product: { name: string; slug: string; thumbnail?: string }, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: product.name,
                url: `${baseUrl}/${locale}/products/${product.slug}`,
                image: product.thumbnail ? `${baseUrl}${product.thumbnail}` : undefined,
            })
        ),
    };

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductsPageContent locale={locale} initialOptions={queryOptions} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(await breadcrumbList(locale)) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />
        </HydrationBoundary>
    );
}
