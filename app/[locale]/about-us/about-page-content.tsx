"use client"
import CertificateSection from "@/components/certificate/CertificateSection";
import ChipText from "@/components/chip/ChipText";
import CountUp from "@/components/count/CountUp";
import { Button } from "@heroui/button";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { useLocale, useTranslations } from "next-intl";
import { HiOutlineArrowRight } from "react-icons/hi";
import {
    MdEmail,
    MdOutlineAcUnit,
    MdOutlineAccountBalance,
    MdOutlineBalance,
    MdOutlineDescription,
    MdOutlineEco,
    MdOutlineFactCheck,
    MdOutlineFactory,
    MdOutlineHandshake,
    MdOutlineInventory2,
    MdOutlineLocalShipping,
    MdOutlinePriceCheck,
    MdOutlineRestaurant,
    MdOutlineScience,
    MdOutlineStorefront,
    MdOutlineVerified,
} from "react-icons/md";
import { Divider } from "@heroui/divider";
import PageStatusBar from "@/components/navbar/PageStatusBar";
import MarketsWeShipTo from "@/components/market/MarketsWeShipTo";
import HowWeWorkSection from "@/components/process/HowWeWorkSection";
import { sectionCardClass, sectionCardDescClass, sectionCardTitleClass, sectionIconClass } from "@/components/ui/sectionCard";
import Link from "next/link";
import Image from "next/image";

const products = [
    {
        id: 1,
        title: "core_products.product_one",
        description: "core_products.product_one_desc",
        image: "/images/about-us/meat-banner.webp",
        href: "/products",
        alt: "core_products.alt_one"
    },
    {
        id: 2,
        title: "core_products.product_two",
        description: "core_products.product_two_desc",
        image: "/images/about-us/sugar-banner-001.webp",
        href: "/categories/icumsa-sugar",
        alt: "core_products.alt_two"
    },
    {
        id: 3,
        title: "core_products.product_three",
        description: "core_products.product_three_desc",
        image: "/images/about-us/franceaj-corn.webp",
        href: "/categories/corn",
        alt: "core_products.alt_three"
    },
    {
        id: 4,
        title: "core_products.product_four",
        description: "core_products.product_four_desc",
        image: "/images/about-us/franceaj-soybean.webp",
        href: "/categories/soy-beans",
        alt: "core_products.alt_four"
    },
    {
        id: 5,
        title: "core_products.product_five",
        description: "core_products.product_five_desc",
        image: "/images/about-us/franceaj-sunflower-oil.webp",
        href: "/categories/oils",
        alt: "core_products.alt_five"
    },
    {
        id: 6,
        title: "core_products.product_six",
        description: "core_products.product_six_desc",
        image: "/images/categories/category-rice.png",
        href: "/categories/rice",
        alt: "core_products.alt_six"
    },
];

const companyFacts = [
    { id: 1, end: 150, suffix: "+", titleKey: "employee", descKey: "employee_desc" },
    { id: 2, end: 50, suffix: "+", titleKey: "export_country", descKey: "export_country_desc" },
    { id: 3, end: 10, suffix: "+", titleKey: "global_offices", descKey: "global_offices_desc" },
];

const buyerSegments = [
    { id: 1, icon: MdOutlineLocalShipping, titleKey: "buyer_1_title", descKey: "buyer_1_desc" },
    { id: 2, icon: MdOutlinePriceCheck, titleKey: "buyer_2_title", descKey: "buyer_2_desc" },
    { id: 3, icon: MdOutlineFactory, titleKey: "buyer_3_title", descKey: "buyer_3_desc" },
    { id: 4, icon: MdOutlineStorefront, titleKey: "buyer_4_title", descKey: "buyer_4_desc" },
    { id: 5, icon: MdOutlineRestaurant, titleKey: "buyer_5_title", descKey: "buyer_5_desc" },
    { id: 6, icon: MdOutlineAccountBalance, titleKey: "buyer_6_title", descKey: "buyer_6_desc" },
];

const values = [
    { id: 1, icon: MdOutlineBalance, titleKey: "value_1_title", descKey: "value_1_desc" },
    { id: 2, icon: MdOutlineVerified, titleKey: "value_2_title", descKey: "value_2_desc" },
    { id: 3, icon: MdOutlineLocalShipping, titleKey: "value_3_title", descKey: "value_3_desc" },
    { id: 4, icon: MdOutlineEco, titleKey: "value_4_title", descKey: "value_4_desc" },
    { id: 5, icon: MdOutlineHandshake, titleKey: "value_5_title", descKey: "value_5_desc" },
    { id: 6, icon: MdOutlineFactCheck, titleKey: "value_6_title", descKey: "value_6_desc" },
];

const qualityPillars = [
    { id: 1, icon: MdOutlineVerified, titleKey: "qa_1_title", descKey: "qa_1_desc" },
    { id: 2, icon: MdOutlineFactCheck, titleKey: "qa_2_title", descKey: "qa_2_desc" },
    { id: 3, icon: MdOutlineScience, titleKey: "qa_3_title", descKey: "qa_3_desc" },
    { id: 4, icon: MdOutlineAcUnit, titleKey: "qa_4_title", descKey: "qa_4_desc" },
    { id: 5, icon: MdOutlineDescription, titleKey: "qa_5_title", descKey: "qa_5_desc" },
    { id: 6, icon: MdOutlineInventory2, titleKey: "qa_6_title", descKey: "qa_6_desc" },
];

const tradeTerms = [
    { labelKey: "term_fob_label", descKey: "term_fob_desc", badge: "Incoterm" },
    { labelKey: "term_cif_label", descKey: "term_cif_desc", badge: "Incoterm" },
    { labelKey: "term_cnf_label", descKey: "term_cnf_desc", badge: "Incoterm" },
    { labelKey: "term_dlc_label", descKey: "term_dlc_desc", badge: "Payment" },
    { labelKey: "term_sblc_label", descKey: "term_sblc_desc", badge: "Payment" },
    { labelKey: "term_final_label", descKey: "term_final_desc", badge: "Contract" },
];

const whyPartnerItems = [
    { key: "1", titleKey: "header_one", descKey: "header_one_desc" },
    { key: "2", titleKey: "header_two", descKey: "header_two_desc" },
    { key: "3", titleKey: "header_three", descKey: "header_three_desc" },
    { key: "4", titleKey: "header_four", descKey: "header_four_desc" },
];


export default function AboutPageContent() {
    const t = useTranslations('about_page');
    const locale = useLocale();
    return (
        <div className="w-full mb-20 px-5 lg:px-0">
            <div className="xl:hidden">
                <PageStatusBar title={t('header_title')} />
            </div>

            {/* ── 1. Hero ───────────────────────────────────────────────── */}
            <section aria-labelledby="about-hero-heading" className="relative w-full h-[30vh] lg:h-[70vh] overflow-hidden rounded-[30px] lg:rounded-[50px] mt-8 lg:mt-0">
                <Image
                    src="/images/about-us/france-aj-about-us-banner.webp"
                    alt="About France AJ Alimentaire And Food LTDA — Food Export & Import LTDA | B2B wholesale supplier of HALAL meats, rice, sugar & edible oils"
                    height={800}
                    width={1400}
                    priority
                    className="object-cover object-top w-full h-full" />
                <div className="absolute inset-0 bg-black/30 lg:bg-black/20" aria-hidden="true" />
                <div className="absolute z-20  inset-0 px-10 lg:px-0 flex flex-col justify-center items-center text-center">
                    <h1 id="about-hero-heading" className="text-2xl lg:text-7xl text-white lg:font-bold tracking-wide mb-3 hidden lg:block lg:mb-5 uppercase">{t('header_title')}</h1>
                    <p className="text-white text-base lg:text-xl leading-tight lg:leading-normal lg:whitespace-pre-line">{t('header_desc')}</p>
                </div>
            </section>

            <div className="lg:container mx-auto">

                {/* ── 2. Company Overview ───────────────────────────────── */}
                <section aria-labelledby="company-overview-heading" className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-12 mt-10 lg:mt-32">
                    <div className="space-y-3 relative">
                        <ChipText text={t('about_ecoland_top')} />
                        <h2 id="company-overview-heading" className="text-primary text-2xl lg:text-6xl lg:font-bold tracking-wide">{t('about_ecoland_header')}</h2>
                    </div>
                    <div className="lg:mt-1">
                        <p className="text-base 2xl:text-lg font-medium whitespace-pre-line">
                            {t('about_ecoland_header_desc')}
                        </p>
                    </div>
                </section>

                {/* ── 3. Company Facts ──────────────────────────────────── */}
                <section aria-labelledby="company-facts-heading" className="my-20 lg:my-32">
                    <div className="flex flex-col items-center justify-center gap-4 mb-12 px-3 lg:px-0">
                        <ChipText text={t('company_facts_chip')} />
                        <h2 id="company-facts-heading" className="text-2xl lg:text-5xl 2xl:text-6xl text-primary text-center">{t('company_facts_title')}</h2>
                        <p className="max-w-3xl text-center text-base lg:text-lg font-medium leading-relaxed">{t('company_facts_subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {companyFacts.map(({ id, end, suffix, titleKey, descKey }) => (
                            <div key={id} className="relative bg-primary/5 rounded-[30px] lg:rounded-[50px] p-10">
                                <CountUp end={end} suffix={suffix} className="!text-6xl lg:text-7xl text-primary font-mono font-bold" />
                                <div className="mt-10">
                                    <h3 className="text-2xl text-primary font-normal mb-3">{t(titleKey as any)}</h3>
                                    <p className="text-base font-medium text-primary">{t(descKey as any)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 4. Product Categories ─────────────────────────────── */}
                <section aria-labelledby="product-categories-heading" className="my-20 lg:my-32">
                    <div className="flex flex-col items-center justify-center gap-4 px-3 lg:px-0">
                        <ChipText text={t('product_categories_chip')} />
                        <div className="max-w-5xl text-center space-y-3 lg:space-y-5 ">
                            <h2 id="product-categories-heading" className="text-2xl lg:text-5xl 2xl:text-6xl text-primary">{t('our_cor_offerings')}</h2>
                            <p className="text-md lg:text-lg leading-5 lg:leading-tight font-medium">
                                {t('our_cor_offerings_desc')}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-start justify-center gap-5 mt-14 lg:mt-20 place-items-center relative">
                        {products.map((product) => (
                            <Card key={product.id} classNames={{
                                "base": "rounded-[30px] lg:rounded-[50px] w-full lg:w-[32%] min-h-[600px] 2xl:min-h-[700px] shadow-none bg-primary/5 p-0",
                            }}>
                                <CardBody>
                                    <div className="relative h-[30vh] rounded-[25px] lg:rounded-[40px] overflow-hidden m-1">
                                        <Image
                                            src={product.image}
                                            alt={t(product.alt as any)}
                                            loading="lazy"
                                            height={900}
                                            width={900}
                                            quality={100}
                                            className="object-cover w-full h-full select-none pointer-events-none" />
                                    </div>
                                    <div className="py-3 px-3 mt-3">
                                        <h3 className="text-2xl 2xl:text-3xl text-primary capitalize">
                                            {t(product.title as any)}
                                        </h3>
                                        <Divider className="my-5" />
                                        <p className="text-base xl:text-base font-medium text-black">
                                            {t(product.description as any)}
                                        </p>
                                    </div>
                                </CardBody>
                                <CardFooter className="pb-7 px-7">
                                    <Button as={Link} href={`/${locale}${product.href}`} aria-label={`${t('explore_more')} — ${t(product.title as any)}`} endContent={<HiOutlineArrowRight size={20} />} size="lg" variant="solid" color="primary" className="font-mono text-secondary font-normal text-base tracking-wide">
                                        {t('explore_more')}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* ── 5. Who We Serve ───────────────────────────────────── */}
                <section aria-labelledby="who-we-serve-heading" className="my-20 lg:my-32">
                    <div className="flex flex-col items-center justify-center gap-4 mb-12 px-3 lg:px-0">
                        <ChipText text={t('who_we_serve_chip')} />
                        <h2 id="who-we-serve-heading" className="text-2xl lg:text-5xl 2xl:text-6xl text-primary text-center">{t('who_we_serve_title')}</h2>
                        <p className="max-w-3xl text-center text-base lg:text-lg font-medium leading-relaxed">{t('who_we_serve_subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {buyerSegments.map(({ id, icon: Icon, titleKey, descKey }) => (
                            <div key={id} className={sectionCardClass}>
                                <div className="flex items-center gap-4">
                                    <span className={sectionIconClass} aria-hidden="true">
                                        <Icon size={24} />
                                    </span>
                                    <h3 className={sectionCardTitleClass}>{t(titleKey as any)}</h3>
                                </div>
                                <p className={sectionCardDescClass}>{t(descKey as any)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 6. Global Sourcing ────────────────────────────────── */}
                <section aria-labelledby="global-sourcing-heading" className="my-20 lg:my-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="relative overflow-hidden rounded-[30px] lg:rounded-[50px] h-[300px] lg:h-[70vh] order-2 lg:order-1">
                            <Image
                                src="/images/france-aj-banner-grains-001.jpg"
                                alt={t('sourcing_image_alt')}
                                width={900}
                                height={900}
                                quality={100}
                                loading="lazy"
                                className="object-cover w-full h-full" />
                        </div>
                        <div className="space-y-5 order-1 lg:order-2">
                            <ChipText text={t('sourcing_chip')} />
                            <h2 id="global-sourcing-heading" className="text-2xl lg:text-5xl 2xl:text-6xl text-primary tracking-wide">{t('sourcing_title')}</h2>
                            <p className="text-base 2xl:text-lg font-medium whitespace-pre-line">{t('sourcing_desc')}</p>
                        </div>
                    </div>
                    <MarketsWeShipTo className="mt-14 lg:mt-20" />
                </section>

                {/* ── 7. Mission & Values ───────────────────────────────── */}
                <section aria-labelledby="mission-values-heading" className="my-20 lg:my-32">
                    <div className="flex flex-col items-center justify-center gap-4 mb-12 px-3 lg:px-0">
                        <ChipText text={t('mission_chip')} />
                        <h2 id="mission-values-heading" className="text-2xl lg:text-5xl 2xl:text-6xl text-primary text-center">{t('mission_title')}</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                        <div className="bg-primary rounded-[25px] lg:rounded-[35px] p-8 lg:p-10 text-white">
                            <h3 className="font-mono text-xl lg:text-2xl mb-4">{t('mission_label')}</h3>
                            <p className="text-base lg:text-lg font-medium leading-relaxed text-white/90">{t('mission_statement')}</p>
                        </div>
                        <div className="bg-primary/5 rounded-[25px] lg:rounded-[35px] p-8 lg:p-10">
                            <h3 className="font-mono text-xl lg:text-2xl text-primary mb-4">{t('vision_label')}</h3>
                            <p className="text-base lg:text-lg font-medium leading-relaxed text-gray-600">{t('vision_statement')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {values.map(({ id, icon: Icon, titleKey, descKey }) => (
                            <div key={id} className={sectionCardClass}>
                                <div className="flex items-center gap-4">
                                    <span className={sectionIconClass} aria-hidden="true">
                                        <Icon size={24} />
                                    </span>
                                    <h3 className={sectionCardTitleClass}>{t(titleKey as any)}</h3>
                                </div>
                                <p className={sectionCardDescClass}>{t(descKey as any)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 8. Quality Assurance ──────────────────────────────── */}
                <section aria-labelledby="quality-assurance-heading" className="my-20 lg:my-32">
                    <div className="flex flex-col items-center justify-center gap-4 mb-12 px-3 lg:px-0">
                        <ChipText text={t('qa_chip')} />
                        <h2 id="quality-assurance-heading" className="text-2xl lg:text-5xl 2xl:text-6xl text-primary text-center">{t('qa_title')}</h2>
                        <p className="max-w-3xl text-center text-base lg:text-lg font-medium leading-relaxed">{t('qa_subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {qualityPillars.map(({ id, icon: Icon, titleKey, descKey }) => (
                            <div key={id} className={sectionCardClass}>
                                <div className="flex items-center gap-4">
                                    <span className={sectionIconClass} aria-hidden="true">
                                        <Icon size={24} />
                                    </span>
                                    <h3 className={sectionCardTitleClass}>{t(titleKey as any)}</h3>
                                </div>
                                <p className={sectionCardDescClass}>{t(descKey as any)}</p>
                            </div>
                        ))}
                    </div>
                    <CertificateSection />
                </section>

                {/* ── 9. How We Work ────────────────────────────────────── */}
                <section aria-labelledby="how-we-work-heading" className="my-20 lg:my-32">
                    <HowWeWorkSection headingId="how-we-work-heading" />

                    {/* Payment & Trade Terms — the commercial half of the process */}
                    <div className="mt-20 lg:mt-32">
                        <div className="flex flex-col items-center justify-center gap-4 mb-12 px-3 lg:px-0">
                            <ChipText text="Trade Terms" />
                            <h3 className="text-2xl lg:text-4xl 2xl:text-5xl text-primary text-center">{t('payment_terms_title')}</h3>
                            <p className="max-w-3xl text-center text-base lg:text-lg font-medium leading-relaxed">{t('payment_terms_subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {tradeTerms.map(({ labelKey, descKey, badge }) => (
                                <div key={labelKey} className={sectionCardClass}>
                                    <div className="flex items-start justify-between gap-3">
                                        <h4 className={`${sectionCardTitleClass} font-mono`}>
                                            {t(labelKey as any)}
                                        </h4>
                                        <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                                            {badge}
                                        </span>
                                    </div>
                                    <Divider className="group-hover:opacity-20 transition-opacity duration-300" />
                                    <p className={sectionCardDescClass}>
                                        {t(descKey as any)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 10. Why Partner With Us ───────────────────────────── */}
                <section aria-labelledby="why-partner-heading" className="grid grid-cols-1 lg:grid-cols-2 gap-10 my-20 lg:my-32">
                    <div className="relative overflow-hidden rounded-[30px] h-[350px] lg:h-auto lg:self-stretch lg:rounded-[50px]">
                        <Image
                            src="/images/container-sugar.webp"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            quality={100}
                            alt="ICUMSA 45 & 150 sugar export container — France AJ Alimentaire And Food LTDA (Food Export & Import LTDA) | B2B wholesale logistics"
                            loading="lazy"
                            className="object-cover"
                        />
                    </div>
                    <div className="relative flex flex-col justify-center items-start space-y-5">
                        <ChipText text={t('why_partner_chip')} />
                        <h2 id="why-partner-heading" className="text-2xl sm:text-4xl 2xl:text-6xl px-2 lg:px-0 font-bold tracking-wide text-primary mb-3 lg:mb-10">{t('why_partner_title')}</h2>
                        <Accordion variant="splitted" defaultSelectedKeys={["1"]}>
                            {whyPartnerItems.map(({ key, titleKey, descKey }) => (
                                <AccordionItem
                                    key={key}
                                    classNames={{
                                        "base": "shadow-none rounded-[25px] lg:rounded-[30px] px-5 py-5 lg:px-8 lg:py-5",
                                        "title": "text-lg xl:text-2xl font-normal tracking-wide text-primary",
                                        "subtitle": "text-sm xl:text-base font-medium text-black",
                                        "content": "text-base xl:text-lg"
                                    }}
                                    aria-label={t(titleKey as any)}
                                    title={t(titleKey as any)}>
                                    {t(descKey as any)}
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* ── 11. Final CTA ─────────────────────────────────────── */}
                <section aria-labelledby="final-cta-heading" className="relative h-[420px] lg:h-[600px] overflow-hidden rounded-[30px] lg:rounded-[50px] mt-20 lg:mt-32">
                    <Image src="/images/france-aj-export-container-brown.png"
                        alt="Export shipping container — France AJ Alimentaire And Food LTDA (Food Export & Import LTDA) | B2B global logistics for HALAL meats, rice, sugar & edible oils"
                        loading="lazy"
                        width={1400}
                        height={800}
                        quality={100}
                        className="object-cover object-top w-full h-full" />
                    <div className="absolute right-5 lg:right-10 bottom-5 lg:bottom-10 w-[calc(100%-2.5rem)] sm:w-[350px] lg:w-[500px] bg-primary rounded-3xl p-8 lg:p-10 text-white">
                        <ChipText text={t('final_cta_chip')} className="bg-white/15 text-white mb-4" />
                        <h2 id="final-cta-heading" className="font-mono font-normal text-xl lg:text-4xl">{t('contact_us_title')}</h2>
                        <p className="hidden lg:block text-sm lg:text-base font-medium text-white/85 leading-relaxed mt-5">{t('final_cta_desc')}</p>
                        <div className="flex flex-wrap gap-3 mt-6 lg:mt-10">
                            <Button as={Link} href={`/${locale}/contact-us`} className="font-mono font-normal text-base tracking-wide" startContent={<MdEmail size={18} />}>{t('contact_us')}</Button>
                            <Button as={Link} href={`/${locale}/products`} variant="bordered" className="font-mono font-normal text-base tracking-wide text-white border-white/40" endContent={<HiOutlineArrowRight size={18} />}>{t('view_products')}</Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
