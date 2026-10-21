'use client';

import { PrivacyPolicy } from '@/types/privacy-policy';
import { ROUTES } from '@/utils/route';
import { Button } from '@heroui/button';
import { useEffect, useRef, useState } from 'react';
import { IoIosMail } from 'react-icons/io';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PageStatusBar from '@/components/navbar/PageStatusBar';
import { useLocale, useTranslations } from 'next-intl';
import { useWindowInnerWidth } from '@/hooks/useWindowInnerWidth';
import Image from 'next/image';

export default function TermsAndConditionsPageContent() {
    const [sections, setSections] = useState<PrivacyPolicy[]>([]);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const locale: string = useLocale()
    const t = useTranslations("termsAndConditions")
    useEffect(() => {
        const fetchData = async () => {

            const fileName =
                locale === "pt-br"
                    ? '/api/terms-and-conditions-br.json'
                    : '/api/terms-and-conditions.json';

            try {
                const res = await fetch(fileName);
                const data: PrivacyPolicy[] = await res.json();
                setSections(data);
            } catch (error) {
                console.error('Error loading terms and conditions:', error);
            }
        };

        fetchData();
    }, []);



    useEffect(() => {
        const handleScroll = () => {
            if (!sections || sections.length === 0) return;

            let current: string | null = sections[0]?.id || null;

            for (const section of sections) {
                const el = sectionRefs.current[section.id];
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 160) {
                        current = section.id;
                    }
                }
            }

            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    const scrollToSection = (id: string) => {
        const el = sectionRefs.current[id];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const width = useWindowInnerWidth();
    const isMobile = width !== null && width < 1280;

    return (
        <div className="w-full relative ">
            {isMobile && (
                <PageStatusBar title={t('hero.label')} as='h2' className='px-5 mb-8' />
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:gap-10 mx-5 bg-primary/20 rounded-[30px] xl:rounded-[50px] text-primary px-5 lg:px-20 py-8 lg:py-10 2xl:py-20 2xl:px-32'>
                <div className="col-span-1 flex flex-col order-2 lg:order-1 gap-10 text-center lg:text-start items-center lg:items-start justify-center">

                    <h1 className="text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-wide">{t("hero.title")}</h1>
                    <p className="text-sm lg:text-lg font-medium">
                        {t("hero.description")}
                    </p>
                    <div className="flex items-center gap-3">
                        <Button as={Link} href={`/${locale}${ROUTES.CONTACT_US}`} color="primary" className="font-mono tracking-wider font-normal text-white" startContent={<IoIosMail size={20} />}> {t("hero.buttonTitle")}</Button>
                    </div>
                </div>
                <div className="col-span-1 flex items-center justify-center lg:justify-end relative order-1 lg:order-2 w-full h-[300px] lg:h-[500px] ">
                    <Image
                        src="/images/terms-and-conditions.png"
                        alt="France AJ Alimentaire And Food LTDA — Terms & Conditions (B2B Food Export & Import LTDA)"
                        height={400}
                        width={400}
                        quality={80}
                        loading='lazy'
                        sizes="(max-width: 1024px) 0px, 400px"
                        className="object-contain w-full h-full lg:scale-100 select-none pointer-events-auto hidden lg:block"
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row max-w-7xl mx-auto mt-20 lg:mt-32 lg:mb-56 px-5 lg:px-0">
                {/* Sidebar TOC */}
                <aside className="md:w-1/3 pr-20 relative hidden lg:block">
                    <nav className="sticky top-24 space-y-3 ">

                        <div className="relative flex flex-col space-y-2 bg-primary text-secondary py-10 px-5 rounded-[30px] xl:rounded-[40px]">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`relative text-left text-sm md:text-xl text-secondary font-mono font-normal pl-4 transition-all duration-300 ${activeSection === section.id
                                        ? 'text-warning font-normal'
                                        : 'text-black hover:text-warning'
                                        }`}>
                                    {activeSection === section.id && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-0 h-full w-1 bg-warning rounded"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {section.title}
                                </button>
                            ))}
                        </div>
                    </nav>
                </aside>

                {/* Content */}
                <main className="md:w-3/4 px-1 space-y-10 mb-20">
                    {sections.map((section, index) => (
                        <motion.section
                            key={section.id}
                            ref={(el) => { sectionRefs.current[section.id] = el; }}
                            id={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="scroll-mt-28"
                        >
                            <h2 className="text-2xl tracking-wide mb-4 text-primary">{section.title}</h2>
                            <p className="text-base lg:text-lg font-medium mb-4">{section.description}</p>
                            <ul className="list-disc px-4">
                                {section.lists?.map((item, idx) => (
                                    <li key={idx} className='text-base lg:text-lg py-1'>
                                       {item.title && (<span className='font-semibold '>{item.title} :</span>)} 
                                        <span className='ml-2 whitespace-pre-line'>{item.description}</span>
                                    </li>

                                ))}
                            </ul>
                        </motion.section>
                    ))}
                </main>
            </div>
            {/* <Newsletter/> */}
        </div>
    );
}
