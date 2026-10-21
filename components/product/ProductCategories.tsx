'use client'

import { useLocale, useTranslations } from "next-intl";
import ProductCardLoader from "../ui/loaders/product-card-loader";
import ProductCardTwo from "../card/ProductCardTwo";
import { Button } from "@heroui/button";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiOutlineArrowRight } from "react-icons/hi";
import BannerImageBlock from "../hero/BannerImageBlock";
import { useGetProducts } from "@/framework/rest/product/get-all-products";
import Image from "next/image";

const OurProductCategories = () => {
    const t = useTranslations('home_product')
    const locale: string = useLocale();


    const { data: meets } = useGetProducts({
        page: 1,
        limit: typeof window !== "undefined" && window.innerWidth < 1024 ? 6 : 3,
        lang: locale,
        type: 'frozen-meet',
        random: true
    })
    const { data: sugars } = useGetProducts({
        page: 1,
        limit: typeof window !== "undefined" && window.innerWidth < 1024 ? 2 : 3,
        lang: locale,
        type: 'sugar',
        random: true
    })
    const { data: grains } = useGetProducts({
        page: 1,
        limit: typeof window !== "undefined" && window.innerWidth < 1024 ? 4 : 3,
        lang: locale,
        type: 'grain',
        random: true
    })
    const { data: condiments } = useGetProducts({
        page: 1,
        limit: typeof window !== "undefined" && window.innerWidth < 1024 ? 4 : 3,
        lang: locale,
        type: 'condiment',
        random: true
    })

    return (
        <section className="relative w-full px-3 lg:px-0" aria-labelledby="product-section-heading">
            <div className="mt-5 lg:mt-40 w-full">
                <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-5 ">
                    <div className="lg:max-w-5xl lg:text-center space-y-1 xl:space-y-5">
                        <h2 id="product-section-heading" className="text-xl sm:text-4xl 2xl:text-6xl text-primary whitespace-pre-line capitalize leading-none xl:leading-tight xl:font-bold tracking-wide">{t('title_one')}</h2>
                        <p className="text-lg leading-normal sm:leading-tight font-medium hidden lg:block">{t('description_one')}</p>
                    </div>
                    <Button onPress={() => { }} aria-label={`${t('see_all')} — ${t('title_one')}`} size="sm" color="primary" className="lg:hidden font-semibold px-1 text-base gap-2" endContent={<MdOutlineKeyboardArrowRight className="text-primary bg-primary/10 rounded-full p-0.5" size={24} />} variant="light">
                        {t('see_all')}
                    </Button>
                </div>

                <section className="flex gap-5 3xl:gap-10 mt-5 lg:mt-32 w-full relative" aria-label="Sugar Products">
                    <BannerImageBlock
                        src="/images/france-aj-banner-sugar.jpg"
                        alt="High-Grade Sugar Global Standards"
                        title={t('banner_sugar')}
                    />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 w-full">
                        {!sugars?.data && (
                            <>
                                <ProductCardLoader />
                                <ProductCardLoader />
                                <ProductCardLoader />
                            </>
                        )}
                        {sugars?.data.map((product) => (
                            <ProductCardTwo key={product.id} product={product} locale={locale} />
                        ))}
                    </div>
                </section>
                <div className="flex gap-5 3xl:gap-10 mt-3 xl:mt-10 w-full relative" aria-label="Frozen Meat Products">
                    <BannerImageBlock
                        src="/images/france-aj-banner-frozen-meet.jpg"
                        alt="High-Quality Halal Frozen Meats"
                        title={t('banner_meet')}
                    />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 w-full">
                        {!meets?.data && (
                            <>
                                <ProductCardLoader />
                                <ProductCardLoader />
                                <ProductCardLoader />
                            </>
                        )}
                        {meets?.data.map((product) => (
                            <ProductCardTwo key={product.id} product={product} locale={locale} />
                        ))}
                    </div>
                </div>
                <section className="hidden lg:flex lg:flex-col items-center justify-center gap-5 my-10 lg:my-40">
                    <div className="max-w-5xl text-center space-y-5">
                        <h2 className="text-3xl sm:text-4xl 2xl:text-6xl capitalize tracking-wide font-bold text-primary whitespace-pre-line">{t('title_two')}</h2>
                        <p className="text-sm sm:text-base lg:text-lg leading-normal sm:leading-tight font-medium">{t('description_two')}</p>
                    </div>
                </section>
                <section className="lg:hidden my-8" aria-label="Mobile Promo Banner">
                    <figure className="relative overflow-hidden h-[200px] rounded-[25px]">
                        <Image
                            src="/images/france-aj-banner-sugar-one.jpg"
                            alt="Refined ICUMSA 45 & 150 sugar — France AJ Alimentaire And Food LTDA – Food Export & Import LTDA | B2B wholesale supplier"
                            loading="lazy"
                            height={200}
                            width={600}
                            quality={100}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                            className="object-cover select-none pointer-events-none w-full h-full z-0"
                        />
                        <figcaption className="sr-only">Fresh groceries every day for people</figcaption>
                        <div className="absolute z-10 inset-0 bg-black/30 " aria-hidden="true" />
                        <div className="absolute z-20 left-5 inset-0 flex flex-col justify-center max-w-[300px]">
                            <h2 className="text-secondary font-normal text-2xl leading-6">
                                Food Mart provides fresh groceries every day for the people
                            </h2>
                            <div className="mt-5">
                                <Button
                                    size="md"
                                    endContent={<HiOutlineArrowRight className="text-primary" size={18} />}
                                    className="font-mono text-primary bg-secondary"
                                    aria-label="View more products"
                                >
                                    View More
                                </Button>
                            </div>
                        </div>
                    </figure>
                </section>


                <section className="flex gap-5 2xl:gap-10 my-3 lg:my-10" aria-label="Grain Products">
                    <BannerImageBlock
                        src="/images/france-aj-banner-grains.jpg"
                        alt={t('banner_grains')}
                        title={t('banner_grains')}
                    />
                    <div className=" grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 w-full">
                        {!grains?.data && (
                            <>
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <ProductCardLoader key={idx} />
                                ))}
                            </>
                        )}
                        {grains?.data.map((product) => (
                            <ProductCardTwo key={product.id} product={product} locale={locale} />
                        ))}
                    </div>
                </section>
                <section className="flex gap-5 3xl:gap-10 mt-10 w-full" aria-label="Condiment and Oil Products">
                    <BannerImageBlock
                        src="/images/france-aj-banner-oils.jpg"
                        alt={t('banner_oils')}
                        title={t('banner_oils')}
                    />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 w-full">
                        {!condiments?.data && (
                            <>
                                <ProductCardLoader />
                                <ProductCardLoader />
                                <ProductCardLoader />
                            </>
                        )}
                        {condiments?.data.map((product) => (
                            <ProductCardTwo key={product.id} product={product} locale={locale} />
                        ))}
                    </div>
                </section>

            </div>
        </section>
    )
}
export default OurProductCategories