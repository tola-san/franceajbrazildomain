import { Product, ProductQueryParams } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

const getProductDetails = async (options: ProductQueryParams): Promise<Product | null> => {
  const { slug, lang} = options;
  
    try {
      const url = lang === 'pt-br' ? '/api/products-br.json' : '/api/products.json'
    const response = await fetch(url);
    const allData: Product[] = await response.json();

    const product = allData.find((p) => p.slug === slug);
    return product || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

const useProductDetailsQuery = (options: ProductQueryParams) => {
  return useQuery<Product | null, Error>({
    queryKey: ["product", options],
    queryFn: () => getProductDetails(options),
    retry: false,
  });
};

export { getProductDetails, useProductDetailsQuery };
