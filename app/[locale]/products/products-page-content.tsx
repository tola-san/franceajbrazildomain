"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCardGrid from "@/components/product/ProductCardGrid";
import ProductsFiltersClient, { SortKey } from "@/components/product/ProductsFilters";
import ProductsHeader from "@/components/product/ProductsHeader";
import ProductEmpty from "@/components/ui/empty/product-empty";
import ProductCardLoader from "@/components/ui/loaders/product-card-loader";
import { useProductParams } from "@/hooks/use-product-params";
import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { Pagination } from "@heroui/react";

interface Props {
    locale: string;
    initialOptions: any;
}

const ProductsPageContent: React.FC<Props> = ({ locale, initialOptions }) => {
    const params = useProductParams();
    const queryArgs = useMemo(() => {
        const getArray = (val: string | null) => (val ? val.split(",").filter(Boolean) : []);
        return {
            page: Number(params.page || initialOptions.page),
            limit: Number(params.limit || initialOptions.limit),
            sort: (params.sort as string) || initialOptions.sort,
            lang: locale,
            category: params.categorySlugs ? getArray(params.categorySlugs) : initialOptions.category,
            tags: params.tags ? getArray(params.tags) : initialOptions.tags,
            search: params.search || initialOptions.search || "",
            type: initialOptions.type || "",
            slug: initialOptions.slug || "",
        };
    }, [params, initialOptions, locale]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', queryArgs],
        queryFn: () => ProductService.getProducts(queryArgs),
        staleTime: 60 * 1000,
        placeholderData: (prev) => prev,
    });

    const products = data?.data || [];

    const { data: categoriesData } = useQuery({
        queryKey: ['categories', locale],
        queryFn: () => CategoryService.getCategories({ lang: locale }),
        staleTime: 60 * 1000,
    });

    const categories = useMemo(
        () => categoriesData?.data?.map((c) => ({ key: c.slug, label: c.title.toLowerCase().replace(/\s+/g, '_') })) || [],
        [categoriesData?.data]
    );

    const uniqueTags = useMemo(() => {
        const tagSet = new Set<string>();
        data?.data?.forEach((p) => {
            if (Array.isArray(p.tags)) {
                p.tags.forEach((tag) => tagSet.add(tag.toLowerCase().replace(/\s+/g, '-')));
            }
        });
        return Array.from(tagSet);
    }, [data?.data]);

    return (
        <section className="relative flex flex-col items-center min-h-screen gap-4 py-8 px-5 lg:px-0">
            <ProductsHeader />
            <div className="flex gap-8 mt-8 lg:mt-0 mb-20 w-full">
                <aside className="max-w-[420px] hidden lg:block">
                    <ProductsFiltersClient
                        categories={categories}
                        uniqueTags={uniqueTags}
                        selectedSort={queryArgs.sort as SortKey}
                        setSelectedSort={(val) => params.setSort(val)}
                        selectedLimit={String(queryArgs.limit)}
                        setSelectedLimit={(val) => params.setLimit(val)}
                        categoriesSelected={queryArgs.category}
                        setCategoriesSelected={(vals) => params.setCategorySlugs(vals.join(","))}
                        tagsSelected={queryArgs.tags}
                        setTagsSelected={(vals) => params.setTags(vals.join(","))}
                        onRequestFirstPage={() => { }}
                    />
                </aside>

                <div className="relative flex flex-col gap-y-5 w-full">
                    {products.length > 0 ? (
                        <>
                            <ProductCardGrid products={products} locale={locale} />
                            {(data?.total ?? 0) > queryArgs.limit && (
                                <div className="mt-10 flex justify-center lg:justify-between items-center">
                                    <p className="hidden lg:block text-gray-500 text-sm">
                                        Total: {data?.total} Items Found
                                    </p>
                                    <Pagination
                                        showControls
                                        page={queryArgs.page}
                                        total={data?.paginatorInfo?.lastPage ?? 1}
                                        onChange={(p) => params.setPage(p)}
                                        color="primary"
                                        className="text-white"
                                        classNames={{
                                            item: "bg-primary/5 ",
                                            prev: "bg-primary/5 hover:!bg-primary hover:text-background transition-all duration-300",
                                            next: "bg-primary/5 hover:!bg-primary hover:text-background transition-all duration-300",

                                        }}
                                    />
                                </div>
                            )}
                        </>
                    ) : isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <ProductCardLoader key={i} />
                            ))}
                        </div>
                    ) : (
                        <ProductEmpty className="min-h-[60vh]" />
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductsPageContent;