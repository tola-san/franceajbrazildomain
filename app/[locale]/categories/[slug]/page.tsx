import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import CategoriesPageContent from "./CategoriesPageContent";
import type { Metadata } from "next";
import { ProductService } from "@/services/product.service";
import { LIMIT } from "@/utils/limit";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Category } from "@/types/category";
import fs from "fs";
import path from "path";

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.franceaj.com";

interface Props {
    params: Promise<{ slug: string; locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function getCategoryBySlug(slug: string, locale: string): Category | undefined {
    const fileName = locale === "pt-br" ? "categories-br.json" : "categories.json";
    const filePath = path.join(process.cwd(), "public", "api", fileName);

    try {
        const categories: Category[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return categories.find((category) => category.slug === slug);
    } catch {
        return undefined;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.category' });
    const readableSlug = slug.replace(/-/g, " ");
    const SITE_X = process.env.SITE_X;
    const lang = locale === "pt-br" ? "pt-BR" : "en";

    const url = `${baseUrl}/${locale}/categories/${slug}`;

    const category = getCategoryBySlug(slug, locale);
    const seo = category?.seo;

    // Prefer per-category SEO from categories data, fall back to the translation template.
    const metaTitle = seo?.metaTitle ?? t('title', { category: readableSlug });
    const metaDescription = seo?.description ?? t('description', { category: readableSlug });
    const ogTitle = seo?.openGraph?.title ?? t('ogTitle', { category: readableSlug });
    const ogDescription = seo?.openGraph?.description ?? t('ogDescription', { category: readableSlug });
    const twitterTitle = seo?.twitter?.title ?? seo?.openGraph?.title ?? t('ogTitle', { category: readableSlug });
    const twitterDescription = seo?.openGraph?.description ?? t('twitterDescription', { category: readableSlug });

    const ogImage = seo?.openGraph?.image ?? "/images/Banners/france-aj-alimentaire-category.jpg";
    const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`;
    const twitterImage = seo?.twitter?.image ?? ogImage;
    const twitterImageUrl = twitterImage.startsWith("http") ? twitterImage : `${baseUrl}${twitterImage}`;

    return {
        metadataBase: new URL(baseUrl),
        title: metaTitle,
        description: metaDescription,
        keywords: seo?.keywords,
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            url,
            siteName: "France AJ Alimentaire And Food LTDA",
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: category?.title ?? "Product Category – France AJ Alimentaire And Food LTDA",
                    type: "image/jpeg",
                },
            ],
            locale: lang,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: twitterTitle,
            description: twitterDescription,
            images: [twitterImageUrl],
            site: SITE_X,
            creator: SITE_X,
        },
        alternates: {
            canonical: url,
            languages: {
                en: `${baseUrl}/en/categories/${slug}`,
                "pt-BR": `${baseUrl}/pt-br/categories/${slug}`,
                "x-default": `${baseUrl}/en/categories/${slug}`,
            },
        },
    };
}

const getBreadcrumbList = async (slug: string, locale: string) => {
    const t = await getTranslations({ locale, namespace: 'metadata.category' });
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
                name: "Categories", // Should probably be translated too, but keeping it for now or adding to home/common
                item: `${baseUrl}/${locale}/categories`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: slug.replace(/-/g, " "),
                item: `${baseUrl}/${locale}/categories/${slug}`,
            },
        ],
    };
}

export default async function Page({ params, searchParams }: Props) {
    const { slug, locale } = await params;

    // Return a real HTTP 404 for unknown category slugs instead of rendering an
    // empty listing with slug-derived metadata (prevents soft-404 / index bloat).
    const category = getCategoryBySlug(slug, locale);

    if (!category) {
        notFound();
    }

    const resolvedSearchParams = await searchParams;

    const queryClient = new QueryClient();

    const queryOptions = {
        page: Number(resolvedSearchParams.page) || 1,
        limit: Number(resolvedSearchParams.limit) || LIMIT.PRODUCTS_LIMIT,
        sort: (resolvedSearchParams.sort as string) || 'default',
        lang: locale,
        tags: resolvedSearchParams.tags ? (resolvedSearchParams.tags as string).split(",").filter(Boolean) : [],
    };

    await queryClient.prefetchQuery({
        queryKey: ['products-by-category', { ...queryOptions, category: [slug] }],
        queryFn: () => ProductService.getProductsByCategory(slug, queryOptions),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CategoriesPageContent
                slug={slug}
                initialOptions={queryOptions}
                locale={locale}
                title={category.title}
                description={category.description}
            />
            <script
                async
                type="application/ld+json"
                key="breadcrumb-json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(await getBreadcrumbList(slug, locale)),
                }}
            />
        </HydrationBoundary>
    );
}
