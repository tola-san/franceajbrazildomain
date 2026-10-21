"use client"

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import Image from "next/image";
import { useState } from "react";
import { TbShoppingBag } from "react-icons/tb";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/cart/cart-context";
import { CartVariation } from "@/types/cart-types";
import { buildCartLineId } from "@/lib/products/variation";

const FALLBACK_IMAGE = "/images/placeholder-image.jpg";

interface Props {
    id: number | string;
    name: string;
    image?: string;
    imageAlt?: string;
    className?: string;
    /** Packing the buyer picked; kept per cart line so two packings stay separate. */
    variation?: CartVariation;
    /** How many units (containers) to add. Defaults to one. */
    quantity?: number;
}

/**
 * Primary "add to cart" action for a product, bundling the dispatch, the
 * pending state and the confirmation toast so callers only pass the product.
 */
const ProductAddToCartButton = ({
    id,
    name,
    image,
    imageAlt,
    variation,
    quantity = 1,
    className = "font-mono tracking-wider text-white w-full sm:w-1/2",
}: Props) => {
    const tq = useTranslations('product_quote');
    const { dispatch } = useCart();
    const [loading, setLoading] = useState(false);

    const thumbnail = image ?? FALLBACK_IMAGE;

    const handleAddToCart = () => {
        setLoading(true);
        setTimeout(() => {
            dispatch({
                type: 'ADD_TO_CART',
                payload: {
                    id: buildCartLineId(id, variation),
                    name: name,
                    unit: String(id),
                    quantity,
                    image: thumbnail,
                    variation,
                },
            });
            setLoading(false);
            addToast({
                title: name,
                description: variation?.summary
                    ? `${variation.summary} — ${tq('add_to_cart_success')}`
                    : tq('add_to_cart_success'),
                color: "success",
                severity: "success",
                icon: (
                    <Image
                        src={thumbnail}
                        alt={imageAlt || name}
                        title={name}
                        height={70}
                        width={70}
                        loading="lazy"
                        decoding="async"
                        className="object-cover" />
                ),
                classNames: {
                    base: "rounded-[20px] bg-[#D2C8C3] p-3 border border-primary  max-w-xl",
                    title: "text-base font-mono text-primary line-clamp-1",
                    description: "text-black line-clamp-2",
                    icon: "size-20 overflow-hidden rounded-xl",
                    closeIcon: "bg-[#D2C8C3]"
                },
            });
        }, 500);
    };

    return (
        <Button
            color="primary"
            size="lg"
            radius="lg"
            className={className}
            startContent={loading ? <Spinner color="secondary" size="sm" /> : <TbShoppingBag size={20} />}
            onPress={handleAddToCart}>
            {tq('btn_label')}
        </Button>
    );
};

export default ProductAddToCartButton;
