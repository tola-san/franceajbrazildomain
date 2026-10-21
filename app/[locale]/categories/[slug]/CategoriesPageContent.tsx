'use client'

import { FC, useMemo, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Pagination } from '@heroui/react'
import ProductEmpty from '@/components/ui/empty/product-empty'
import ProductCardLoader from '@/components/ui/loaders/product-card-loader'
import Breadcrumb from '@/components/ui/Breadcrumbs'
import PageStatusBar from '@/components/navbar/PageStatusBar'
import { useWindowInnerWidth } from '@/hooks/useWindowInnerWidth'
import ProductCardGrid from '@/components/product/ProductCardGrid'
import { useQuery } from '@tanstack/react-query'
import { ProductService } from '@/services/product.service'
import ProductsFiltersClient, { SortKey } from '@/components/product/ProductsFilters'
import { useProductParams } from '@/hooks/use-product-params'

interface Props {
    slug: string;
    locale: string;
    initialOptions: any;
    /** Category title from public/api/categories(-br).json */
    title?: string;
    /** Category description from public/api/categories(-br).json */
    description?: string;
}

const CategoriesPageContent: FC<Props> = ({ slug, locale, initialOptions, title, description }) => {
    const c = useTranslations('categories')
    const params = useProductParams();

    const page = Number(params.page || initialOptions.page)
    const selectedSort = params.sort || initialOptions.sort
    const selectedLimit = params.limit || String(initialOptions.limit)

    const tagsSelected = useMemo(() => {
        const t = params.tags
        return t ? t.split(',').filter(Boolean) : initialOptions.tags
    }, [params.tags, initialOptions.tags])

    const queryArgs = useMemo(() => ({
        page,
        limit: Number(selectedLimit),
        sort: selectedSort,
        lang: locale,
        category: [slug],
        tags: tagsSelected,
    }), [page, selectedLimit, selectedSort, locale, slug, tagsSelected])

    const { data, isLoading, isError } = useQuery({
        queryKey: ['products-by-category', queryArgs],
        queryFn: () => ProductService.getProductsByCategory(slug, queryArgs),
        staleTime: 60 * 1000,
    })

    const products = data?.data ?? [];

    const uniqueTags = useMemo(() => {
        const tagSet = new Set<string>();
        data?.data?.forEach((p) => {
            if (Array.isArray(p.tags)) {
                p.tags.forEach((tag) => tagSet.add(tag.toLowerCase().replace(/\s+/g, '-')));
            }
        });
        return Array.from(tagSet);
    }, [data?.data]);

    const width = useWindowInnerWidth();
    const isMobile = width !== null && width < 1280;

    const categoryTitle = title?.trim() || c(slug.replace(/-/g, '_'));
    const categoryDescription = description?.trim();

    const breadcrumbItems = [
        { label: c('home'), href: `/${locale}` },
        { label: c('categories') },
        { label: categoryTitle, isCurrent: true },
    ];

    return (
        <section className="relative flex flex-col items-center min-h-screen gap-4 py-8 w-full px-5 lg:px-0">
            {isMobile && <PageStatusBar title={categoryTitle.toUpperCase()} />}

            {isMobile && categoryDescription && (
                <p className="w-full text-sm text-primary/70 leading-relaxed">
                    {categoryDescription}
                </p>
            )}

            {!isMobile && (
                <div className="relative flex flex-col gap-5 items-center mb-10 xl:mb-20 xl:mt-5">
                    <h1 className="text-2xl lg:text-6xl text-primary">{categoryTitle}</h1>
                    {categoryDescription && (
                        <p className="max-w-4xl text-center text-sm lg:text-base text-primary">
                            {categoryDescription}
                        </p>
                    )}
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            )}
            <div className="flex gap-8 mt-8 xl:mt-0 mb-20 w-full">
                <aside className="max-w-[420px] hidden xl:block w-[400px]">
                    <ProductsFiltersClient
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

                <div className="flex flex-col gap-y-5 w-full relative">
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
    )
}

export default CategoriesPageContent