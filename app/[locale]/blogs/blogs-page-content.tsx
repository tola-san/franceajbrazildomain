'use client'

import BlogCard from "@/components/card/BlogCard";
import BlogCardLoader from "@/components/ui/loaders/blog-card-loader";
import { BlogService } from "@/services/blog.service";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface Props {
    locale: string;
}

export default function BlogsPageContent({ locale }: Props) {
    const t = useTranslations('blogs_page');
    const { data, isLoading } = useQuery({
        queryKey: ['blogs', locale],
        queryFn: () => BlogService.getBlogs(locale),
        staleTime: 60 * 1000,
    });

    const blogs = data?.data ?? [];

    return (
        <div className="relative w-full overflow-hidden">
            <div className="relative flex flex-col items-center justify-center mb-10 xl:mb-20 xl:mt-5">
                <h1 className="text-2xl lg:text-6xl text-primary font-bold tracking-wide mb-5 capitalize">{t('title')}</h1>
                <Breadcrumbs color="foreground">
                    <BreadcrumbItem className="font-medium">{t('breadcrumb_home')}</BreadcrumbItem>
                    <BreadcrumbItem className="font-medium">{t('breadcrumb_blogs')}</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-16 mb-10">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, idx) => (
                        <BlogCardLoader key={`blog-card-loader-${idx}`} />
                    ))
                    : blogs.map((blog, idx) => (
                        <BlogCard
                            key={blog.id}
                            title={blog.title}
                            preview={blog.preview}
                            shortDescription={blog.shortDescription}
                            coverImage={blog.coverImage}
                            slug={blog.slug}
                            publishedAt={blog.publishedAt}
                            author={blog.author}
                            headerTag={"h2"}
                            priority={idx < 3}
                        />
                    ))}
            </div>
        </div>
    )
}
