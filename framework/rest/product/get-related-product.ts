
import { Product, ProductQueryParams } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

const getRelatedProducts = async (options: ProductQueryParams): Promise<Product[]> => {
  const { category, slug, lang, limit } = options;

  try {
    const url = lang === 'pt-br' ? '/api/products-br.json' : '/api/products.json'
    const response = await fetch(url);
    const allData: Product[] = await response.json();

    const filtered = allData.filter((p) => {
      if (!p.category || !category) return false;
      if (Array.isArray(p.category) && Array.isArray(category)) {
        return p.category.some((cat) => category.includes(cat)) && p.slug !== slug;
      }
      if (Array.isArray(p.category)) {
        return typeof category === "string" && p.category.includes(category) && p.slug !== slug;
      }
      if (Array.isArray(category)) {
        return category.includes(p.category as string) && p.slug !== slug;
      }
      return p.category === category && p.slug !== slug;
    });

    // ✅ Shuffle the filtered results randomly
    const shuffled = filtered.sort(() => 0.5 - Math.random());

    // ✅ Return up to the specified limit
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw new Error("Failed to fetch related products");
  }
};


const useRelatedProductsQuery = (options: ProductQueryParams) => {
  return useQuery<Product[], Error>({
    queryKey: ["relatedProducts", options],
    queryFn: () => getRelatedProducts(options),
    retry: false,
  });
};

export { getRelatedProducts, useRelatedProductsQuery };
