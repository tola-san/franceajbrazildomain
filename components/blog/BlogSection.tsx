"use client"

import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@heroui/button"
import { Link } from "@/i18n/routing"
import { ROUTES } from "@/utils/route"
import { BlogService } from "@/services/blog.service"
import BlogCard from "../card/BlogCard"
import BlogCardLoader from "../ui/loaders/blog-card-loader"

interface Props {
    limit?: number
}

const BlogSection: React.FC<Props> = ({ limit = 3 }) => {
    const t = useTranslations('blog_section')
    const locale = useLocale()

    const { data, isLoading } = useQuery({
        queryKey: ['home-blogs', locale],
        queryFn: () => BlogService.getBlogs(locale),
        staleTime: 60 * 1000,
    })

    // BlogService returns newest-first, so this is just the top N.
    const blogs = (data?.data ?? []).slice(0, limit)

    if (!isLoading && blogs.length === 0) return null

    return (
        <section
            className="relative w-full px-4 sm:px-6 lg:px-0 mt-12 sm:mt-20 lg:mt-40 mb-10"
            aria-labelledby="blog-section-heading"
        >
            {/* Header Block */}
            <div className="flex flex-col items-center text-center gap-5 sm:gap-6 mb-8 lg:mb-10">
                <div className="space-y-2 sm:space-y-3 max-w-3xl mx-auto">
                    <h2
                        id="blog-section-heading"
                        className="text-2xl lg:text-5xl 2xl:text-6xl font-mono text-primary uppercase font-bold tracking-wide leading-tight lg:leading-none"
                    >
                        {t('title')}
                    </h2>
                    <p className="text-md lg:text-lg leading-5 lg:leading-tight font-medium">
                        {t('description')}
                    </p>
                </div>

                <Button
                    as={Link}
                    href={ROUTES.BLOGS}
                    size="lg"
                    color="primary"
                    aria-label={t('see_all')}
                    className="shrink-0 font-mono group text-white  tracking-wider transition-all duration-500"
                >
                    {t('see_all')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 mt-5 lg:mt-20">
                {isLoading
                    ? Array.from({ length: limit }).map((_, idx) => (
                        <BlogCardLoader key={`blog-card-loader-${idx}`} />
                    ))
                    : blogs.map((blog) => (
                        <BlogCard
                            key={blog.id}
                            title={blog.title}
                            preview={blog.preview}
                            shortDescription={blog.shortDescription}
                            coverImage={blog.coverImage}
                            slug={blog.slug}
                            publishedAt={blog.publishedAt}
                            author={blog.author}
                        />
                    ))}
            </div>
        </section>
    )
}

export default BlogSection
