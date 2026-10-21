import { useQuery } from "@tanstack/react-query";
import { Product, ProductQueryParams } from "@/types/product";
import { BaseResponse } from "@/types/base-response";

const buildQueryString = (opts: ProductQueryParams): string => {
  const params = new URLSearchParams();

  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  if (typeof opts.limit === "number") params.set("limit", String(opts.limit));
  if (opts.sort && opts.sort !== "default") params.set("sort", opts.sort);
  if (opts.lang) params.set("lang", opts.lang);
  if (opts.type) params.set("type", opts.type);
  if (opts.search) params.set("search", opts.search);
  if (opts.random) params.set("random", "true");
  if (opts.category?.length) params.set("categories", opts.category.join(","));
  if (opts.tags?.length) params.set("tags", opts.tags.join(","));

  return params.toString() ? `?${params.toString()}` : "";
};

export async function getProductsFromServer(
  options: ProductQueryParams
): Promise<BaseResponse<Product[]>> {
  const qs = buildQueryString(options);
  const res = await fetch(`/api/products${qs}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }

  return await res.json();
}

export function useProductsQuery(
  options: ProductQueryParams,
  initialData?: BaseResponse<Product[]>
) {
  return useQuery<BaseResponse<Product[]>, Error>({
    queryKey: ['products', options],
    queryFn: () => getProductsFromServer(options),
    placeholderData: (prev) => prev ?? initialData,
    initialData,
    retry: true,
  })
}
