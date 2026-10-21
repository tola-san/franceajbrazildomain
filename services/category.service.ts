import { host } from "@/config";
import { BaseResponse } from "@/types/base-response";
import { Category, CategoryQueryParams } from "@/types/category";

export const CategoryService = {
    getCategories: async (
        options: CategoryQueryParams
    ): Promise<BaseResponse<Category[]>> => {
        const { lang } = options;

        try {
            const isServer = typeof window === 'undefined';
            const baseUrl = isServer ? host : '';

            const categoryUrl = `${baseUrl}${lang === "pt-br" ? "/api/categories-br.json" : "/api/categories.json"}`;
            const categoriesResponse = await fetch(categoryUrl, { next: { revalidate: 3600 } });
            const categories: Category[] = await categoriesResponse.json();

            return {
                message: "Get categories has been success",
                status: "success",
                data: categories,
            };
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw new Error("Failed to fetch categories");
        }
    },

};
