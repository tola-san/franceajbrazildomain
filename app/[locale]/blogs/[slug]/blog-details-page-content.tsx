'use client'

import { useQuery } from "@tanstack/react-query";
import { BlogService } from "@/services/blog.service";
import { Spinner, Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { IoCalendar } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { HiOutlineArrowRight } from "react-icons/hi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import BlogFilePreview from "@/components/file/BlogFilePreview";

interface Props {
  slug: string
}

export default function BlogDetailsPageContent({ slug }: Props) {
  const locale = useLocale();
  const t = useTranslations('blog_details');
  const tb = useTranslations('blogs_page');
  // Dates were pinned to en-US, so pt-BR readers saw "Aug 21, 2026". Map the
  // route locale onto its BCP 47 tag and let Intl do the month names.
  const dateLocale = locale === 'pt-br' ? 'pt-BR' : 'en-US';
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(dateLocale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const { data, isLoading, error } = useQuery({
    queryKey: ['blog', slug, locale],
    queryFn: () => BlogService.getBlogBySlug(slug, locale),
    staleTime: 60 * 1000,
  });

  const { blog, relatedBlogs } = data?.data || {};

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold text-primary">{t('not_found_title')}</h1>
        <Button as={Link} href={`/${locale}/blogs`} color="primary">
          {t('back_to_blogs')}
        </Button>
      </div>
    );
  }

  return (
    // The post itself is the <article>; the layout's <main> is the page
    // landmark, so none is added here. The header, the body and the sidebar all
    // belong to this one post.
    <article className="w-full mt-10 mb-10 lg:mt-20 lg:mb-20 px-4 3xl:px-0">

      {/* ── Full-width article header (Centered Editorial Hero) ── */}
      <header className="mb-10 lg:mb-14 text-center">
        {/* Category Tag Badge - Centered */}
        <div className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary font-mono text-xs uppercase tracking-widest font-semibold rounded-full">
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            {blog.tags?.[0] || t('tag_fallback')}
          </span>
        </div>

        {/* Title - Centered */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-mono text-primary  mb-6 max-w-6xl mx-auto text-balance">
          {blog.title}
        </h1>

        {/* Preview / lead paragraph - Centered */}
        {blog.preview && (
          <p className="text-base lg:text-xl text-primary/75 font-medium leading-relaxed max-w-6xl mx-auto mb-8">
            {blog.preview}
          </p>
        )}

        {/* Floating Centered Author & Date Capsule Chip */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-white/80 backdrop-blur-sm border border-primary/15 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium text-primary/75 mb-6 shadow-xs">
          <div className="flex items-center gap-2">
            <div aria-hidden="true" className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs">
              <FaUserLarge size={10} />
            </div>
            <span className="text-primary font-semibold">{blog.author}</span>
          </div>

          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-primary/30" />

          <div className="flex items-center gap-1.5">
            <IoCalendar size={14} aria-hidden="true" className="text-primary" />
            {/* Machine-readable publish date — `publishedAt` is already ISO
                (YYYY-MM-DD), so it goes straight into dateTime. */}
            <time dateTime={blog.publishedAt}>{formatDate(blog.publishedAt)}</time>
          </div>
        </div>

        {/* Breadcrumb - Centered Below Header Content */}
        {/* Each separator sits inside the item it precedes, so the rendered gap
            sequence is identical to the flat flex row this replaces. */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-center text-xs sm:text-sm text-primary/50 font-medium mb-8">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href={`/${locale}`} className="hover:text-primary transition-colors">{tb('breadcrumb_home')}</Link>
            </li>
            <li className="flex items-center gap-1.5">
              <MdOutlineKeyboardArrowRight size={16} aria-hidden="true" />
              <Link href={`/${locale}/blogs`} className="hover:text-primary transition-colors">{tb('breadcrumb_blogs')}</Link>
            </li>
            <li className="flex items-center gap-1.5">
              <MdOutlineKeyboardArrowRight size={16} aria-hidden="true" />
              <span aria-current="page" className="text-primary font-semibold truncate max-w-[200px] lg:max-w-none">{blog.tags?.[0] || t('tag_fallback')}</span>
            </li>
          </ol>
        </nav>

        {/* Cover Image Banner */}
        <figure className="relative overflow-hidden w-full aspect-[16/9] lg:h-168 rounded-[24px] sm:rounded-[36px] lg:rounded-[48px] shadow-sm">
          <Image
            src={blog.detailImage || blog.coverImage}
            alt={blog.title}
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/5" />
          <figcaption className="sr-only">{blog.title}</figcaption>
        </figure>
      </header>

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8">

        {/* ══════ RIGHT: Article Body ══════ */}
        <div className="lg:col-span-8 lg:order-2 bg-white rounded-[20px] lg:rounded-[30px] p-6 sm:p-8 lg:p-10 h-fit">

          {/* Article Body */}
          <div>
            <div
              className="blog-prose prose prose-stone text-balance max-w-none text-[#311911]
                  prose-headings:text-[#311911] prose-headings:font-mono prose-headings:uppercase prose-headings:tracking-wide prose-headings:font-normal
                  prose-h1:font-normal prose-h2:text-2xl prose-h2:lg:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:font-normal
                  prose-h3:text-xl prose-h3:lg:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-normal
                  prose-h4:font-normal
                  prose-p:text-base prose-p:lg:text-lg prose-p:leading-relaxed prose-p:mb-6
                  prose-li:text-base prose-li:lg:text-lg prose-li:leading-relaxed
                  prose-a:text-success prose-a:font-semibold hover:prose-a:underline
                  prose-strong:text-[#311911] prose-strong:font-semibold
                "
              dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
            />

            {/* Attached files / downloads */}
            <BlogFilePreview files={blog.files} />
          </div>
        </div>

        {/* ══════ LEFT: Sidebar (Optimized Modern Widget-Card Stack) ══════ */}
        <aside className="lg:col-span-4 lg:order-1">
          <div className="lg:sticky lg:top-28 space-y-6">

            {/* Widget 1: Article Tags */}
            <section aria-labelledby="blog-tags-heading" className="bg-white rounded-[24px] lg:rounded-[28px] p-6 border border-primary/10 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-primary/10">
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <h2 id="blog-tags-heading" className="text-lg font-mono uppercase text-primary tracking-wide">{t('tags_title')}</h2>
                </div>
                <span className="text-sm font-mono text-primary/40">({blog.tags.length})</span>
              </div>
              {/* Each item keeps `flex` so the chip stays a flex item, exactly as
                  it was when it sat directly in the row — an inline span in a
                  block list item would not take its vertical padding into the
                  line box. */}
              <ul className="flex flex-wrap gap-2.5">
                {blog.tags.map((tag) => (
                  <li key={tag} className="flex">
                    <span
                      className="px-4 py-2 bg-primary/5 hover:bg-primary hover:text-white border border-primary/10 text-primary text-sm font-mono uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Widget 2: Related Articles */}
            {relatedBlogs && relatedBlogs.length > 0 && (
              <section aria-labelledby="related-articles-heading" className="bg-white rounded-[24px] lg:rounded-[28px] p-6 border border-primary/10 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-primary/10">
                  <div className="flex items-center gap-2.5">
                    <span aria-hidden="true" className="w-2 h-2 rounded-full bg-primary" />
                    <h2 id="related-articles-heading" className="text-base font-mono uppercase text-primary tracking-wide">{t('related_title')}</h2>
                  </div>
                  <span className="text-xs font-mono text-primary/40">{t('related_badge')}</span>
                </div>
                <ul className="space-y-4">
                  {relatedBlogs.slice(0, 3).map((item) => (
                    <li key={item.id}>
                    <Link
                      href={`/${locale}/blogs/${item.slug}`}
                      className="flex items-center gap-4 group p-2.5 -mx-2.5 rounded-2xl hover:bg-primary/5 transition-colors"
                    >
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-primary/10">
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          quality={75}
                          sizes="100px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-xs text-primary/50 mb-0.5 font-medium">
                          <IoCalendar size={12} aria-hidden="true" className="text-primary/70" />
                          <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-primary leading-snug line-clamp-2 group-hover:text-primary/80 transition-colors">
                          {item.title}
                        </p>
                      </div>
                      <div aria-hidden="true" className="w-7 h-7 rounded-lg bg-primary/5 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center shrink-0 transition-all duration-200">
                        <HiOutlineArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Widget 3: Quotation CTA Banner Card */}
            <section aria-labelledby="blog-cta-heading" className="bg-primary rounded-[24px] lg:rounded-[28px] p-6 lg:p-7 text-white relative overflow-hidden shadow-xs">
              {/* Ambient background glow circle */}
              <div aria-hidden="true" className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white font-mono text-xs uppercase tracking-widest rounded-full inline-block mb-3">
                  {t('cta_badge')}
                </span>
                <h2 id="blog-cta-heading" className="text-xl font-mono uppercase tracking-wide mb-2">{t('cta_title')}</h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
                  {t('cta_description')}
                </p>
                <Button
                  as={Link}
                  href={`/${locale}/contact-us`}
                  size="lg"
                  className="w-full font-mono tracking-wider bg-white text-primary rounded-xl gap-2 font-semibold hover:bg-white/95 transition-colors"
                  endContent={<HiOutlineArrowRight size={18} aria-hidden="true" />}
                >
                  {t('cta_button')}
                </Button>
              </div>
            </section>

          </div>
        </aside>
      </div>

    </article>
  );
}