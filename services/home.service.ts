import { BaseResponse } from "@/types/base-response";
import { Category } from "@/types/category";
import { HomePage } from "@/types/home";
import { Product } from "@/types/product";
import { QueryOptions } from "@/types/query-option";
import { host } from "@/config";
import { isProductActive } from "@/lib/products/products";
import { ROUTES } from "@/utils/route";

interface HomeQueryParams extends QueryOptions {
    random?: boolean;
    limit?: number;
}


export const HomeService = {
    getHomePage: async (options: HomeQueryParams = {}): Promise<BaseResponse<HomePage>> => {
        const { lang, random = true } = options;

        const shuffleArray = <T>(array: T[]): T[] => {
            if (!random) return array;
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        };

        try {
            const isServer = typeof window === 'undefined';
            const baseUrl = isServer ? host : '';

            // Get categories
            const categoryUrl = `${baseUrl}${lang === "pt-br" ? "/api/categories-br.json" : "/api/categories.json"}`;
            const categoriesResponse = await fetch(categoryUrl, { next: { revalidate: 3600 } });
            const categories: Category[] = await categoriesResponse.json();

            // Get Product Collection
            // product frozen-meat
            const frozenMeatUrl = `${baseUrl}${lang === 'pt-br' ? '/api/products-br.json' : '/api/products.json'}`
            const frozenMeatResponse = await fetch(frozenMeatUrl, { next: { revalidate: 3600 } })
            const frozenMeat: Product[] = await frozenMeatResponse.json()
            const limit = options.limit || 3;
            const frozenMeatFiltered = shuffleArray(frozenMeat.filter((p) => isProductActive(p) && p.type.includes('frozen-meat'))).slice(0, limit)

            // product sugar
            const sugarUrl = `${baseUrl}${lang === 'pt-br' ? '/api/products-br.json' : '/api/products.json'}`
            const sugarResponse = await fetch(sugarUrl, { next: { revalidate: 3600 } })
            const sugar: Product[] = await sugarResponse.json()
            const sugarFiltered = shuffleArray(sugar.filter((p) => isProductActive(p) && p.type.includes('sugar'))).slice(0, limit)

            // prodcut grain
            const grainUrl = `${baseUrl}${lang === 'pt-br' ? '/api/products-br.json' : '/api/products.json'}`
            const grainResponse = await fetch(grainUrl, { next: { revalidate: 3600 } })
            const grains: Product[] = await grainResponse.json()
            const grainFiltered = shuffleArray(grains.filter((p) => isProductActive(p) && p.type.includes('grain'))).slice(0, limit)

            // prodcut oils category
            const oilsUrl = `${baseUrl}${lang === 'pt-br' ? '/api/products-br.json' : '/api/products.json'}`
            const oilsResponse = await fetch(oilsUrl, { next: { revalidate: 3600 } })
            const oils: Product[] = await oilsResponse.json()
            const oilsFiltered = shuffleArray(oils.filter((p) => isProductActive(p) && p.category.includes('oils'))).slice(0, limit)

            return {
                message: "Get home page has been success",
                status: "success",
                data: {
                    categories: categories,
                    collections: [
                        {
                            id: 1,
                            slug: 'collection-frozen-meat',
                            name: 'collection_frozen_sugar_meat_name',
                            description: 'collection_frozen_sugar_meat_desc',
                            subCollections: [
                                {
                                    id: 1,
                                    slug: 'sub-collection-frozen-sugar',
                                    href: `${ROUTES.CATEGORIES}/icumsa-sugar`,
                                    cta: 'see_sugar_cta',
                                    name: 'sub_sugar_title',
                                    banner: {
                                        title: 'sub_sugar_title',
                                        description: 'sub_sugar_desc',
                                        image: '/images/france-aj-banner-sugar.jpg',
                                    },
                                    products: sugarFiltered,
                                },
                                {
                                    id: 1,
                                    slug: 'sub-collection-frozen-meat',
                                    href: `${ROUTES.PRODUCTS}?type=frozen-meat`,
                                    cta: 'see_meat_cta',
                                    name: 'sub_meat_title',
                                    banner: {
                                        title: 'sub_meat_title',
                                        description: 'sub_meat_desc',
                                        image: '/images/france-aj-banner-frozen-meet.jpg',
                                    },
                                    products: frozenMeatFiltered,
                                },
                            ],
                        },
                        {
                            id: 2,
                            slug: 'collection-sugar',
                            name: 'collection_grains_oils_name',
                            description: 'collection_grains_oils_desc',
                            subCollections: [
                                {
                                    id: 1,
                                    slug: 'sub-collection-grain',
                                    href: `${ROUTES.PRODUCTS}?type=grain`,
                                    cta: 'see_grain_cta',
                                    name: 'sub_grain_title',
                                    banner: {
                                        title: 'sub_grain_title',
                                        description: 'sub_grain_desc',
                                        image: '/images/france-aj-banner-grains.jpg',
                                    },
                                    products: grainFiltered,
                                },
                                {
                                    id: 2,
                                    slug: 'sub-collection-condiment',
                                    href: `${ROUTES.CATEGORIES}/oils`,
                                    cta: 'see_oil_cta',
                                    name: 'sub_oil_title',
                                    banner: {
                                        title: 'sub_oil_title',
                                        description: 'sub_oil_desc',
                                        image: '/images/france-aj-banner-oils.jpg',
                                    },
                                    products: oilsFiltered,
                                },
                            ],
                        },

                    ],
                },
            };
        } catch (error) {
            console.error("Error fetching home page:", error);
            throw new Error("Failed to fetch home page");
        }
    }
};
