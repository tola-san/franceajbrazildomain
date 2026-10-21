
import { Category, CategoryQueryParams } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

const getCategories = async (options: CategoryQueryParams): Promise<Category[]> => {
    const { lang} = options;
    try {
      const url = lang === "pt-br" ? "/api/categories-br.json" : "/api/categories.json";
    const response = await fetch(url);
    const categories: Category[] = await response.json();

    return categories;
  } catch (error) {
    console.error("Error fetching related categories:", error);
    throw new Error("Failed to fetch related categories");
  }
};

const useGetCategories = (options: CategoryQueryParams) => {
  
  return useQuery<Category[], Error>({
    queryKey: ["categories", options],
    queryFn: () => getCategories(options),
    retry: false,
  });
};

export { getCategories, useGetCategories };