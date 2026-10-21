
import { Metadata } from "next";
import BlogDetailsPageContent from "./blog-details-page-content";
import { BlogService } from "@/services/blog.service";
import { cache } from "react";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import Script from "next/script";
import { Blog } from "@/types/blog";

type Props = {
    params: Promise<{ slug: string; locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.franceaj.com';

const getCachedBlogData = cache(async (slug: string, locale: string) => {
    return await BlogService.getBlogBySlug(slug, locale);
});

// Freshness signal for search and AI engines. A post keeps `updatedAt` only
// once it has actually been revised, so fall back to the publish date; an
// unparseable value is dropped rather than emitted as a bogus date.
const getModifiedDate = (blog: Blog): string | null => {
    const raw = blog.updatedAt || blog.publishedAt;
    return raw && !Number.isNaN(Date.parse(raw)) ? raw : null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;

    const response = await getCachedBlogData(slug, locale);
    const blog = response.data.blog;

    if (!blog) {
        return notFound();
    }

    const isBR = locale === "pt-br";
    const currentUrl = `${baseUrl}/${locale}/blogs/${slug}`;
    const enUrl = `${baseUrl}/en/blogs/${slug}`;
    const brUrl = `${baseUrl}/pt-br/blogs/${slug}`;

    const title = blog.metaTitle || blog.title;
    const description = blog.metaDescription || blog.preview;
    const rawImage = blog.detailImage || blog.coverImage;
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${baseUrl}${rawImage}`;
    const modifiedDate = getModifiedDate(blog);

    return {
        title: title,
        description: description,
        keywords: blog.keywords || blog.tags.join(', '),
        metadataBase: new URL(baseUrl),
        openGraph: {
            title: title,
            description: description,
            url: currentUrl,
            siteName: "France AJ Alimentaire And Food LTDA",
            locale: isBR ? "pt-BR" : "en",
            type: "article",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                    type: "image/webp",
                },
            ],
            publishedTime: blog.publishedAt,
            ...(modifiedDate ? { modifiedTime: modifiedDate } : {}),
            authors: [blog.author],
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [imageUrl],
            site: process.env.SITE_X,
            creator: process.env.SITE_X,
        },
        alternates: {
            canonical: currentUrl,
            languages: {
                en: enUrl,
                "pt-BR": brUrl,
                "x-default": enUrl,
            },
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug, locale } = await params;
    const queryClient = new QueryClient();

    const [, response, tNav] = await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["blog", slug, locale],
            queryFn: () => getCachedBlogData(slug, locale),
        }),
        getCachedBlogData(slug, locale),
        getTranslations({ locale, namespace: 'nav' }),
    ]);

    const blog = response?.data?.blog;

    if (!blog) {
        return notFound();
    }

    const currentUrl = `${baseUrl}/${locale}/blogs/${slug}`;
    const modifiedDate = getModifiedDate(blog);

    const blogSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${currentUrl}#blogposting`,
        headline: blog.title,
        description: blog.preview,
        image: blog.coverImage.startsWith('http') ? blog.coverImage : `${baseUrl}${blog.coverImage}`,
        datePublished: blog.publishedAt,
        ...(modifiedDate ? { dateModified: modifiedDate } : {}),
        author: {
            '@type': 'Person',
            name: blog.author,
        },
        publisher: {
            '@type': 'Organization',
            '@id': `${baseUrl}/#organization`,
            name: 'France AJ Alimentaire And Food Export And Import LTDA',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/images/logo/logo.png`,
            }
        },
        mainEntityOfPage: currentUrl,
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: tNav('home'),
                item: `${baseUrl}/${locale}`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: tNav('blog') || 'Blogs',
                item: `${baseUrl}/${locale}/blogs`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: blog.title,
                item: currentUrl,
            },
        ],
    };

    const faqSchema = blog.faqSchema || null;

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <BlogDetailsPageContent slug={slug} />
            <Script
                id="blog-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema).replace(/</g, '\\u003c') }}
            />
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {faqSchema && (
                <Script
                    id="faq-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
                />
            )}
        </HydrationBoundary>
    );
}