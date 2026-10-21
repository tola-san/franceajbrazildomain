"use client"

import { Divider } from "@heroui/divider";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { sectionCardClass, sectionCardDescClass, sectionCardTitleClass } from "@/components/ui/sectionCard";

const markets = [
    { id: 1, titleKey: "market_1_title", descKey: "market_1_desc" },
    { id: 2, titleKey: "market_2_title", descKey: "market_2_desc" },
    { id: 3, titleKey: "market_3_title", descKey: "market_3_desc" },
    { id: 4, titleKey: "market_4_title", descKey: "market_4_desc" },
];


interface Props {
    /** h3 where it sits under another heading (about page); h2 where it stands
     *  on its own as a top-level section (product details). */
    headingTag?: 'h2' | 'h3';
    headingId?: string;
    headingClassName?: string;
    className?: string;
}

const MarketsWeShipTo: FC<Props> = ({
    headingTag: Heading = 'h3',
    headingId,
    headingClassName = "text-xl lg:text-3xl text-primary text-center",
    className,
}) => {
    // Copy lives in the about_page namespace, where this block originated and
    // still renders. Both pages read the same keys so the markets stay in sync.
    const t = useTranslations('about_page');
    // Card titles sit one level below the section heading, whatever it is.
    const CardHeading = Heading === 'h2' ? 'h3' : 'h4';

    return (
        <div className={className}>
            <div className="flex flex-col items-center justify-center gap-4 mb-8 lg:mb-12 px-3 lg:px-0">
                <Heading id={headingId} className={headingClassName}>{t('markets_title')}</Heading>
                <p className="max-w-3xl text-center text-base lg:text-lg font-medium">{t('markets_subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {markets.map(({ id, titleKey, descKey }) => (
                    <div key={id} className={sectionCardClass}>
                        <CardHeading className={`${sectionCardTitleClass} font-mono`}>{t(titleKey as any)}</CardHeading>
                        <Divider className="group-hover:opacity-20 transition-opacity duration-300" />
                        <p className={sectionCardDescClass}>{t(descKey as any)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketsWeShipTo;
