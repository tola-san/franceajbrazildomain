"use client"

import { Button } from "@heroui/button";
import { FaWhatsapp } from "react-icons/fa6";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/utils/route";

interface Props {
    name: string;
    slug: string;
    category?: string;
    /** Selected packing, appended to the WhatsApp message when present. */
    variationSummary?: string;
    className?: string;
}

/**
 * Opens WhatsApp with the product details already typed in, so the buyer only
 * has to hit send to start a quote conversation.
 */
const ProductContactQuoteButton = ({
    name,
    slug,
    category,
    variationSummary,
    className = "font-mono tracking-wider w-full sm:w-1/2",
}: Props) => {
    const locale = useLocale();
    const tq = useTranslations('product_quote');

    const handleContactQuote = () => {
        const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
        const productUrl = `${baseUrl}/${locale}${ROUTES.PRODUCTS}/${slug}`;
        const message = tq('whatsapp_message', {
            product: name,
            category: category || '-',
            url: productUrl,
        });
        const fullMessage = variationSummary
            ? `${message}\n\n${tq('whatsapp_packing_line', { packing: variationSummary })}`
            : message;
        const phoneNumber = siteConfig.links.whatsapp.replace(/\D/g, '');
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <Button
            color="primary"
            size="lg"
            radius="lg"
            variant="bordered"
            className={className}
            startContent={<FaWhatsapp size={20} />}
            onPress={handleContactQuote}>
            {tq('whatsapp_btn_label')}
        </Button>
    );
};

export default ProductContactQuoteButton;
