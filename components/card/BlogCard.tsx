import { ROUTES } from "@/utils/route";
import { Button } from "@heroui/button"
import Image from "next/image"
import { FaUserLarge } from "react-icons/fa6";
import { IoCalendar } from "react-icons/io5";
import { Link } from "@/i18n/routing";
import CustomHeaderTag from "../ui/CustomHeaderTag";
import { ElementType } from "react";
import { useLocale, useTranslations } from "next-intl";

type BlogCardProps = {
    title: string;
    preview: string;
    shortDescription?: string;
    coverImage: string;
    slug: string;
    publishedAt: string;
    author: string;
    headerTag?: ElementType;
    priority?: boolean;
};

const BlogCard = ({ title, preview, shortDescription, coverImage, slug, publishedAt, author, headerTag = "h3", priority = false }: BlogCardProps) => {
    const href = `${ROUTES.BLOGS}/${slug}`;
    const t = useTranslations('blog_card');
    const locale = useLocale();

    return (
        <article className="group relative min-h-[500px] overflow-hidden rounded-[50px] bg-white p-4">
            {/* Full-card overlay link — clicking anywhere on the card opens the article */}
            <Link
                href={href}
                aria-label={title}
                className="absolute inset-0 z-10 rounded-[50px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />

            <div className="relative rounded-[40px] overflow-hidden w-full h-[220px] sm:h-[350px] 2xl:h-[300px] 3xl:h-[350px]">
                <Image
                    src={coverImage}
                    alt={title}
                    className="object-cover object-top select-none pointer-events-none transition-transform duration-500 ease-out group-hover:scale-105"
                    fill
                    priority={priority}
                    sizes="(max-width: 640px) 300px, (max-width: 1024px) 20vw, (max-width: 1536px) 20vw, 800px" />
            </div>
            <div className="px-5">
                <CustomHeaderTag as={headerTag} className="text-lg md:text-xl lg:text-2xl tracking-wide text-primary mt-5">
                    {title}
                </CustomHeaderTag>
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-primary/75 mt-4">
                    <div className="flex items-center gap-1.5">
                        <FaUserLarge size={14} className="text-primary" />
                        <span>{author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <IoCalendar size={15} className="text-primary" />
                        <span>
                            {new Date(publishedAt).toLocaleDateString(locale, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>
                <p className="text-sm lg:text-base xl:text-lg text-black font-medium mt-5 line-clamp-6">{shortDescription || preview}</p>

                <div className="relative z-20 flex items-center gap-3 mt-10 mb-5 w-fit">
                    <Button as={Link} href={href} aria-label={t('read_more_aria', { title })} size="lg" color="primary" className="font-mono group text-white  tracking-wider transition-all duration-500" >
                        {t('read_more')}
                    </Button>
                </div>

            </div>

        </article>
    )
}

export default BlogCard
