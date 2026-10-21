import { BaseResponse } from "@/types/base-response";
import { Product, ProductQueryParams } from "@/types/product";
import { isProductActive } from "@/lib/products/products";
import { readApiJson } from "@/lib/data/read-api-json";

export const ProductService = {
    getProducts: async (
        options: ProductQueryParams = {}
    ): Promise<BaseResponse<Product[]>> => {
        const { lang, category, type, limit, random, slug, search, tags } = options;

        try {
            const fileName = lang === "pt-br" ? "products-br.json" : "products.json";
            const products = await readApiJson<Product[]>(fileName);

            // Only display active products (hides any marked `status: 'inactive'`).
            let filteredProducts = products.filter(isProductActive);

            if (category && category.length > 0) {
                filteredProducts = filteredProducts.filter((p) =>
                    category.some((c) => p.category.includes(c))
                );
            }

            if (type) {
                filteredProducts = filteredProducts.filter((p) =>
                    p.type.includes(type)
                );
            }

            if (slug) {
                filteredProducts = filteredProducts.filter((p) => p.slug === slug);
            }

            if (search) {
                filteredProducts = filteredProducts.filter((p) =>
                    p.name.toLowerCase().includes(search.toLowerCase())
                );
            }

            if (tags && tags.length > 0) {
                filteredProducts = filteredProducts.filter((p) =>
                    p.tags?.some((t) => tags.includes(t.toLowerCase().replace(/\s+/g, '-')))
                );
            }

            if (options.sort) {
                if (options.sort === 'a-z') {
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                } else if (options.sort === 'z-a') {
                    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                }
                // Add other sort options if needed, e.g., 'newest' based on createdAt if available
            }

            if (random) {
                filteredProducts = shuffleArray(filteredProducts);
            }

            const total = filteredProducts.length;
            const page = options.page || 1;
            const perPage = options.limit || total; // If no limit, show all (or default)

            const lastPage = Math.ceil(total / perPage);

            if (options.limit) {
                const start = (page - 1) * perPage;
                filteredProducts = filteredProducts.slice(start, start + perPage);
            }

            return {
                message: "Get products has been success",
                status: "success",
                data: filteredProducts,
                total: total,
                paginatorInfo: {
                    currentPage: page,
                    lastPage: lastPage,
                    total: total,
                    perPage: perPage,
                    nextPageUrl: page < lastPage ? `/api/products?page=${page + 1}&limit=${perPage}` : null,
                    prevPageUrl: page > 1 ? `/api/products?page=${page - 1}&limit=${perPage}` : null
                }
            };
        } catch (error) {
            console.error("Error fetching products:", error);
            throw new Error("Failed to fetch products");
        }
    },
    getProductBySlug: async (slug: string, lang?: string): Promise<BaseResponse<{ product: Product | null, relatedProducts: Product[] }>> => {
        try {
            const fileName = lang === "pt-br" ? "products-br.json" : "products.json";
            const products = await readApiJson<Product[]>(fileName);

            const product = products.find((p) => p.slug === slug);

            // Not found — or deactivated — is not an error: return an empty
            // payload so callers can trigger notFound() (HTTP 404). An inactive
            // product must not be reachable by direct URL.
            if (!product || !isProductActive(product)) {
                return {
                    message: "Product not found",
                    status: "success",
                    data: {
                        product: null,
                        relatedProducts: [],
                    },
                };
            }

            // Get related products (same category, excluding current product
            // and any inactive products)
            const related = products.filter(
                (p) => p.category === product.category && p.slug !== slug && isProductActive(p)
            );

            // Shuffle and limit to 4
            const relatedProducts = shuffleArray(related).slice(0, 8);

            return {
                message: "Get product has been success",
                status: "success",
                data: {
                    product,
                    relatedProducts
                },
            };
        } catch (error) {
            console.error("Error fetching product:", error);
            throw new Error("Failed to fetch product");
        }
    },

    getProductsByCategory: async (
        category: string,
        options: ProductQueryParams = {}
    ): Promise<BaseResponse<Product[]>> => {
        options.category = [category];
        return ProductService.getProducts(options);
    }
};

const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
