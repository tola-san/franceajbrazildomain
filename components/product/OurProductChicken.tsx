"use client"

import { useLocale, useTranslations } from "next-intl"
import ProductCardLoader from "../ui/loaders/product-card-loader";
import ProductCardTwo from "../card/ProductCardTwo";
import Image from "next/image";
import { useGetProducts } from "@/framework/rest/product/get-all-products";


const OurProductChicken = () => {
    const t = useTranslations('products')
    const locale: string = useLocale();
    const { data } = useGetProducts({
        page: 1,
        limit: 3,
        lang: locale,
        type: 'chicken'
    })


    return (
        <div className="relative mt-20 w-full">
            <div className="flex flex-col items-center justify-center gap-5  ">
                <div className="max-w-5xl text-center space-y-5">
                    <h2 className="text-2xl lg:text-5xl 2xl:text-6xl text-primary whitespace-pre-line">{t('chicken_products')}</h2>
                    <p className="text-md lg:text-lg font-medium">{t('chicken_description')}</p>
                </div>
            </div>
           <div className="flex gap-10 mt-28">
                <div className="min-w-[400px] bg-white relative overflow-hidden rounded-[30px] lg:rounded-[50px]">
                    <Image src="/images/france-aj-banner-frozen-chicken.jpg" alt="" fill quality={100} className="object-cover object-top" />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                    <div className="absolute top-10 inset-x-0">
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-2xl lg:text-4xl text-background">high-quality <br /> frozen chicken</h3>
                        </div>
                    </div>
                </div>
                <div className=" grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {!data?.data && (
                        <>
                            <ProductCardLoader />
                            <ProductCardLoader />
                            <ProductCardLoader />
                        </>
                    )}
                    {data?.data.map((product) => (
                        <ProductCardTwo key={product.id} product={product} locale={locale} />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default OurProductChicken