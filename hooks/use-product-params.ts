"use client";

import { LIMIT } from "@/utils/limit";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export const useProductParams = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const page = Number(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort") || "default";
    const activeFilter = searchParams.get("filter") || "All Categories";
    const search = searchParams.get("search") || "";
    const categorySlugs = searchParams.get("category_slugs") || "";
    const tags = searchParams.get("tags") || "";
    const limit = searchParams.get("limit") || LIMIT.PRODUCTS_LIMIT;

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (!value) {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            if (name !== "page") {
                params.set("page", "1");
            }

            return params.toString();
        },
        [searchParams]
    );

    const scrollToTop = () => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const setPage = (newPage: number) => {
        router.push(`${pathname}?${createQueryString("page", newPage.toString())}`, { scroll: false });
        scrollToTop();
    };

    const setSort = (newSort: string) => {
        router.push(`${pathname}?${createQueryString("sort", newSort)}`, { scroll: false });
        scrollToTop();
    };

    const setFilter = (newFilter: string) => {
        router.push(`${pathname}?${createQueryString("filter", newFilter)}`, { scroll: false });
        scrollToTop();
    };

    const setSearch = (newSearch: string) => {
        router.push(`${pathname}?${createQueryString("search", newSearch)}`, { scroll: false });
        scrollToTop();
    };

    const setCategorySlugs = (slugs: string) => {
        router.push(`${pathname}?${createQueryString("category_slugs", slugs)}`, { scroll: false });
        scrollToTop();
    };

    const setTags = (newTags: string) => {
        router.push(`${pathname}?${createQueryString("tags", newTags)}`, { scroll: false });
        scrollToTop();
    };

    const setLimit = (newLimit: string) => {
        router.push(`${pathname}?${createQueryString("limit", newLimit)}`, { scroll: false });
        scrollToTop();
    };

    const setFilters = (filters: {
        categorySlugs?: string;
        tags?: string;
        sort?: string;
        limit?: string;
    }) => {
        const params = new URLSearchParams(searchParams.toString());

        // Update each provided filter
        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined) return;

            // Map the key to the URL parameter name
            const paramName = key === 'categorySlugs' ? 'category_slugs' : key;

            if (!value) {
                params.delete(paramName);
            } else {
                params.set(paramName, value);
            }
        });

        // Reset page to 1 when changing filters
        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        scrollToTop();
    };

    const clearFilters = () => {
        router.push(pathname, { scroll: false });
        scrollToTop();
    };

    return {
        page,
        sort,
        activeFilter,
        search,
        categorySlugs,
        tags,
        limit,
        setPage,
        setSort,
        setFilter,
        setSearch,
        setCategorySlugs,
        setTags,
        setLimit,
        setFilters,
        clearFilters
    };
};
