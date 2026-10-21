"use client"

import PageStatusBar from "@/components/navbar/PageStatusBar";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { useTranslations } from "next-intl";
import { useWindowInnerWidth } from "@/hooks/useWindowInnerWidth";

const ProductsHeader = () => {
    const t = useTranslations('products');
    const n = useTranslations('nav');
    const width = useWindowInnerWidth();
    const isMobile = width !== null && width < 1280;

    return (
        <>
            {isMobile ? (
                <PageStatusBar title={t('products')} />
            ) : (
                <div className="relative flex flex-col items-center mb-10 xl:mb-20 xl:mt-5">
                    <h1 className="text-2xl lg:text-6xl text-primary mb-5">{t('products')}</h1>
                    <Breadcrumbs color="foreground">
                        <BreadcrumbItem className="font-medium">{n('home')}</BreadcrumbItem>
                        <BreadcrumbItem className="font-medium">{n('products')}</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
            )}
        </>
    );
}

export default ProductsHeader;
