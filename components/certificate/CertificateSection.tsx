"use client"
import { useTranslations } from "next-intl";
import PartnerCarousel from "../carousel/PartnerCarousel";

export default function CertificateSection() {
    const t = useTranslations('our_certifications');
    return (
        <section
            className="w-full mt-10 mb-10 lg:mt-40 lg:mb-40 px-4"
            aria-labelledby="certification-heading">
            <div className="flex flex-col items-center justify-center gap-5 text-center">
                <header className="max-w-5xl space-y-3 lg:space-y-5">
                    <h2
                        id="certification-heading"
                        className="text-2xl lg:text-5xl 2xl:text-6xl text-primary font-bold tracking-wide whitespace-pre-line">
                        {t('title')}
                    </h2>
                    <p className="text-md lg:text-lg leading-5 lg:leading-tight font-medium">
                        {t('description')}
                    </p>
                </header>
            </div>

            <div className="my-10 lg:my-20">
                <PartnerCarousel />
            </div>
        </section>
    )
}