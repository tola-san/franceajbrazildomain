"use client"

import ChipText from "@/components/chip/ChipText";
import { sectionCardDescClass, sectionCardTitleClass, sectionCardClass } from "@/components/ui/sectionCard";
import { useTranslations } from "next-intl";
import { FC } from "react";

const processSteps = [
    { step: 1, titleKey: "step_1_title", descKey: "step_1_desc" },
    { step: 2, titleKey: "step_2_title", descKey: "step_2_desc" },
    { step: 3, titleKey: "step_3_title", descKey: "step_3_desc" },
    { step: 4, titleKey: "step_4_title", descKey: "step_4_desc" },
    { step: 5, titleKey: "step_5_title", descKey: "step_5_desc" },
    { step: 6, titleKey: "step_6_title", descKey: "step_6_desc" },
    { step: 7, titleKey: "step_7_title", descKey: "step_7_desc" },
    { step: 8, titleKey: "step_8_title", descKey: "step_8_desc" },
    { step: 9, titleKey: "step_9_title", descKey: "step_9_desc" },
];

interface Props {
    /** Must match the aria-labelledby of the <section> the caller wraps this in. */
    headingId?: string;
    className?: string;
}

const HowWeWorkSection: FC<Props> = ({ headingId, className }) => {
    // Copy lives in the about_page namespace, where this block originated and
    // still renders. Both pages read the same keys so the steps stay in sync.
    const t = useTranslations('about_page');

    return (
        <div className={className}>
            <div className="flex flex-col items-center justify-center gap-4 mb-12 px-3 lg:px-0">
                <ChipText text={t('how_we_work_chip')} />
                <h2 id={headingId} className="text-2xl lg:text-5xl 2xl:text-6xl text-primary text-center">{t('how_we_work_title')}</h2>
                <p className="max-w-3xl text-center text-base lg:text-lg font-medium leading-relaxed">{t('how_we_work_subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {processSteps.map(({ step, titleKey, descKey }) => (
                    <div key={step} className={sectionCardClass}>
                        <div className="flex items-center gap-4">
                            <span className="flex-shrink-0 w-11 h-11 rounded-full bg-primary group-hover:bg-white flex items-center justify-center text-white group-hover:text-primary text-lg font-bold font-mono transition-colors duration-300">
                                {String(step).padStart(2, '0')}
                            </span>
                            <h3 className={sectionCardTitleClass}>
                                {t(titleKey as any)}
                            </h3>
                        </div>
                        <p className={sectionCardDescClass}>
                            {t(descKey as any)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HowWeWorkSection;
