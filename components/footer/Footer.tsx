'use client';

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaWhatsapp,
    FaYoutube,
    FaArrowRight,
    FaShieldAlt,
    FaGlobeAmericas,
    FaCertificate,
    FaCheckCircle
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { ROUTES } from "@/utils/route";
import { Link } from "@/i18n/routing";
import Image from "next/image";

const WHATSAPP_NUMBER = '5531910143894';
const PHONE_DISPLAY = '(+55) 31 91014-3894';
const PHONE_HREF = 'tel:+5531910143894';
const EMAIL = 'info@franceajalimentaireandfood.com.br';

const COMPANY_LINKS = [
    { key: 'company.list.home', href: ROUTES.HOME },
    { key: 'company.list.about_us', href: ROUTES.ABOUT_US },
    { key: 'company.list.products', href: ROUTES.PRODUCTS },
    { key: 'legal.list.privacy_policy', href: ROUTES.PRIVACY_POLICY },
    { key: 'legal.list.terms_conditions', href: ROUTES.TERMS_AND_CONDITIONS },
] as const;

const CATEGORY_LINKS = [
    { key: 'categories.list.icumsa_sugar', href: `${ROUTES.CATEGORIES}/icumsa-sugar` },
    { key: 'categories.list.frozen_beef', href: `${ROUTES.CATEGORIES}/frozen-beef` },
    { key: 'categories.list.frozen_chicken', href: `${ROUTES.CATEGORIES}/frozen-chicken` },
    { key: 'categories.list.frozen_lamb', href: `${ROUTES.CATEGORIES}/frozen-lamb` },
    { key: 'categories.list.rice', href: `${ROUTES.CATEGORIES}/rice` },
] as const;

const SOCIAL_LINKS = [
    {
        key: 'social.facebook',
        href: 'https://www.facebook.com/profile.php?id=61562321520411',
        icon: <FaFacebookF size={18} />,
        colorClass: 'text-[#1877F2]'
    },
    {
        key: 'social.x',
        href: 'https://x.com/FAlimentaire',
        icon: <FaXTwitter size={18} />,
        colorClass: 'text-[#000000]'
    },
    {
        key: 'social.whatsapp',
        href: `https://wa.me/${WHATSAPP_NUMBER}`,
        icon: <FaWhatsapp size={20} />,
        colorClass: 'text-[#25D366]'
    },
    {
        key: 'social.linkedin',
        href: 'https://www.linkedin.com/company/france-aj-alimentaire/',
        icon: <FaLinkedinIn size={18} />,
        colorClass: 'text-[#0A66C2]'
    },
    {
        key: 'social.youtube',
        href: 'https://www.youtube.com/@franceajalimentaire',
        icon: <FaYoutube size={18} />,
        colorClass: 'text-[#FF0000]'
    },
    {
        key: 'social.instagram',
        href: 'https://www.instagram.com/france_aj_alimentaire/',
        icon: <FaInstagram size={18} />,
        colorClass: 'text-[#E4405F]'
    },
] as const;

export default function Footer() {
    const t = useTranslations('footer');
    const whatsappMessage = t('export_bar.whatsapp_message');
    const whatsappUrl = useMemo(
        () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`,
        [whatsappMessage]
    );

    return (
        <footer className="w-full  bg-[#1C0E08] text-white shadow-2xl border-t border-white/10 overflow-hidden relative">

            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#009B3A]/10 via-transparent to-[#FFB936]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#311911] rounded-full blur-3xl pointer-events-none opacity-50" />

            {/* Top B2B Export Bar */}
            <div className="border-b border-white/10 bg-white/[0.03] backdrop-blur-md px-6 lg:px-12 3xl:px-16 5xl:px-0 py-8 relative z-10">
                <div className="w-full max-w-[1980px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center lg:text-left">
                        <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#009B3A] to-[#006A28] flex items-center justify-center text-white shadow-lg ">
                            <FaGlobeAmericas size={28} aria-hidden="true" />
                        </div>
                        <div>
                            <div className="flex items-center justify-center lg:justify-start gap-2">
                                <span className="text-[#FFB936] text-xs font-semibold tracking-widest uppercase font-mono">
                                    {t('export_bar.eyebrow')}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#009B3A]" />
                                <span className="text-white/60 text-xs font-mono">{t('export_bar.tagline')}</span>
                            </div>
                            <h2 className="font-mono text-2xl lg:text-3xl font-bold tracking-wide text-white uppercase mt-0.5">
                                {t('export_bar.heading')}
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link href={ROUTES.CONTACT_US}>
                            <Button
                                color="success"
                                size="lg"
                                radius="lg"
                                className="font-mono uppercase font-semibold text-white shadow-lg "
                                endContent={<FaArrowRight className="text-xs" />}
                            >
                                {t('export_bar.quote_cta')}
                            </Button>
                        </Link>

                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                            <Button
                                variant="bordered"
                                size="lg"
                                radius="lg"
                                className="font-mono uppercase font-semibold border-white/20 text-white hover:bg-white/10"
                                startContent={<FaWhatsapp size={18} className="text-[#25D366]" />}
                            >
                                {t('export_bar.whatsapp_cta')}
                            </Button>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content Columns */}
            <div className="w-full max-w-[1980px] mx-auto px-6 lg:px-12 xl:px-20 4xl:px-0  py-14 lg:py-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 text-left">

                    {/* Brand Profile Column - Expanded Space */}
                    <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-10 xl:pr-16">
                        <Logo />

                        <p className="text-sm md:text-base text-white/70 leading-relaxed mt-6 max-w-md font-normal">
                            {t('intro')}
                        </p>

                        {/* Certification Badges */}
                        <ul className="mt-6 flex flex-wrap items-center gap-2.5" aria-label={t('credentials.aria_label')}>
                            <li className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/90">
                                <FaShieldAlt className="text-[#009B3A]" aria-hidden="true" />
                                <span>{t('credentials.cnpj')}</span>
                            </li>
                            <li className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/90">
                                <FaCertificate className="text-[#FFB936]" aria-hidden="true" />
                                <span>{t('credentials.halal')}</span>
                            </li>
                            <li className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/90">
                                <FaCheckCircle className="text-[#009B3A]" aria-hidden="true" />
                                <span>{t('credentials.sif')}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Navigation & Contact Grouped Together */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-8 lg:gap-6">
                        {/* Quick Navigation Links */}
                        <nav className="sm:col-span-4 lg:col-span-3" aria-label={t('company_aria_label')}>
                            <h3 className="font-mono text-white text-lg lg:text-xl font-bold tracking-wider mb-6 uppercase flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#009B3A]" />
                                {t('company.title')}
                            </h3>
                            <ul className="space-y-3">
                                {COMPANY_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm lg:text-base text-white/70 hover:text-[#009B3A] font-medium transition-all duration-200 hover:translate-x-1.5 flex items-center gap-2 group"
                                        >
                                            <GoDotFill size={12} aria-hidden="true" className="text-white/40 group-hover:text-[#009B3A] transition-colors shrink-0" />
                                            {t(link.key)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Export Product Categories */}
                        <nav className="sm:col-span-4 lg:col-span-4" aria-label={t('categories_aria_label')}>
                            <h3 className="font-mono text-white text-lg lg:text-xl font-bold tracking-wider mb-6 uppercase flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#FFB936]" />
                                {t('categories.title')}
                            </h3>
                            <ul className="space-y-3">
                                {CATEGORY_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm lg:text-base text-white/70 hover:text-[#FFB936] font-medium transition-all duration-200 hover:translate-x-1.5 flex items-center gap-2 group"
                                        >
                                            <GoDotFill size={12} aria-hidden="true" className="text-white/40 group-hover:text-[#FFB936] transition-colors shrink-0" />
                                            {t(link.key)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Direct Contact & Location */}
                        <address className="sm:col-span-4 lg:col-span-5 not-italic" aria-label={t('contact.aria_label')}>
                            <h3 className="font-mono text-white text-lg lg:text-xl font-bold tracking-wider mb-6 uppercase flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#009B3A]" />
                                {t('contact.title')}
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-sm lg:text-base text-white/80 font-normal group">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#FFB936] group-hover:bg-[#FFB936] group-hover:text-black transition-all duration-300">
                                        <MdLocationOn size={18} aria-hidden="true" />
                                    </div>
                                    <span className="leading-snug pt-0.5">
                                        {t('contact.address')}
                                    </span>
                                </li>

                                <li className="flex items-center gap-3 text-sm lg:text-base text-white/80 font-medium group">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#009B3A] group-hover:bg-[#009B3A] group-hover:text-white transition-all duration-300">
                                        <MdPhone size={18} aria-hidden="true" />
                                    </div>
                                    <a
                                        href={PHONE_HREF}
                                        aria-label={t('contact.phone_label')}
                                        className="hover:text-[#009B3A] transition-colors"
                                    >
                                        {PHONE_DISPLAY}
                                    </a>
                                </li>

                                <li className="flex items-center gap-3 text-sm lg:text-base text-white/80 font-medium group">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/70 group-hover:bg-white group-hover:text-black transition-all duration-300">
                                        <MdEmail size={18} aria-hidden="true" />
                                    </div>
                                    <a
                                        href={`mailto:${EMAIL}`}
                                        aria-label={t('contact.email_label')}
                                        className="hover:text-white transition-colors break-all"
                                    >
                                        {EMAIL}
                                    </a>
                                </li>
                            </ul>
                        </address>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 bg-black/40 px-6 lg:px-12 xl:px-20 4xl:px-0 py-7 relative z-10">
                <div className="w-full max-w-[1980px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="font-mono text-xs sm:text-sm text-white/60 text-center md:text-left tracking-wide">
                        {t('copyright')}
                    </p>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center" role="list" aria-label={t('follow_us_aria_label')}>
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.href}
                                role="listitem"
                                aria-label={t(social.key)}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    size="md"
                                    radius="lg"
                                    variant="solid"
                                    isIconOnly
                                    aria-hidden="true"
                                    tabIndex={-1}
                                    className={`font-mono uppercase bg-white transition-all duration-300 hover:scale-110 ${social.colorClass}`}
                                >
                                    {social.icon}
                                </Button>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Logo component
export const Logo = () => {
    const t = useTranslations('footer');

    return (
        <Link href={ROUTES.HOME} className="relative w-[350px] h-[95px] inline-block cursor-pointer group" aria-label={t('logo_aria_label')}>
            <Image
                alt={t('logo_alt')}
                src="/images/logo/france-aj-logo-white.png"
                fill
                priority={false}
                className="object-contain select-none"
                sizes="(max-width: 768px) 190px, 300px"
            />
        </Link>
    );
};
