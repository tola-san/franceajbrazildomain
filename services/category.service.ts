import { BaseResponse } from "@/types/base-response";
import { Category, CategoryQueryParams } from "@/types/category";
import { readApiJson } from "@/lib/data/read-api-json";

export const CategoryService = {
    getCategories: async (
        options: CategoryQueryParams
    ): Promise<BaseResponse<Category[]>> => {
        const { lang } = options;

        try {
            const fileName = lang === "pt-br" ? "categories-br.json" : "categories.json";
            const categories = await readApiJson<Category[]>(fileName);

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
