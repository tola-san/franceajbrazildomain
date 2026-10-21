import { BaseResponse } from "@/types/base-response";
import { Blog } from "@/types/blog";
import { readApiJson } from "@/lib/data/read-api-json";

/**
 * Publish time in ms, with unparseable dates treated as epoch so they sink to
 * the bottom of the list instead of scrambling the entries around them.
 */
const publishedTime = (blog: Blog) => {
    const time = new Date(blog.publishedAt).getTime();
    return Number.isNaN(time) ? 0 : time;
};

/**
 * Newest first. blogs.json / blogs-br.json are maintained oldest-first, so
 * every listing has to reverse them — done once here so the blogs index, the
 * homepage section and the related-articles sidebar can never disagree about
 * the order. Array.prototype.sort is stable, so same-day posts keep their
 * relative file order.
 */
const byNewestFirst = (a: Blog, b: Blog) => publishedTime(b) - publishedTime(a);

const fetchBlogsList = async (lang?: string): Promise<Blog[]> => {
    const fileName = lang === "pt-br" ? "blogs-br.json" : "blogs.json";
    return readApiJson<Blog[]>(fileName);
};

export const BlogService = {
    getBlogs: async (lang?: string): Promise<BaseResponse<Blog[]>> => {
        try {
            const raw = await fetchBlogsList(lang);
            const blogs: Blog[] = raw.sort(byNewestFirst);
            return {
                message: "Get blogs has been success",
                status: "success",
                data: blogs,
            };
        } catch (error) {
            console.error("Error fetching blogs:", error);
            throw new Error("Failed to fetch blogs");
        }
    },
    getBlogBySlug: async (slug: string, lang?: string): Promise<BaseResponse<{ blog: Blog | null, relatedBlogs: Blog[] }>> => {
        try {
            const raw = await fetchBlogsList(lang);
            const blogs: Blog[] = raw.sort(byNewestFirst);

            const blog = blogs.find((b) => b.slug === slug);

            if (!blog) {
                return {
                    message: "Blog not found",
                    status: "success",
                    data: {
                        blog: null,
                        relatedBlogs: [],
                    },
                };
            }

            // Already newest-first, so this is the three most recent other posts
            // rather than the three oldest the unsorted file used to hand back.
            const relatedBlogs = blogs.filter((b) => b.slug !== slug).slice(0, 3);

            return {
                message: "Get blog has been success",
                status: "success",
                data: {
                    blog,
                    relatedBlogs,
                },
            };
        } catch (error) {
            console.error("Error fetching blog:", error);
            throw new Error("Failed to fetch blog");
        }
    }
};
