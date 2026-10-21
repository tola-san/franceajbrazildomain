import AddToCartButton from "@/components/product/AddToCartButton";
import { Product } from "@/types/product";
import { ROUTES } from "@/utils/route";
import { useTranslations } from "next-intl";
import RippleWrapper from "../product/RippleWrapper";
import { host } from "@/config";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ElementType } from "react";
import CustomHeaderTag from "../ui/CustomHeaderTag";
import { getDefaultSelection, getMinContainers, getMinimumOrder, toCartVariation } from "@/lib/products/variation";

interface Props {
    product: Product;
    className?: string;
    locale: string;
    headerTag?: ElementType;
}

const ProductCardTwo = ({ product, className = "w-full", locale, headerTag = "h3" }: Props) => {
    const t = useTranslations("products");
    const { id, name, images, thumbnail, thumbnailAlt, slug, description, variation, category } = product;
    // Read off the product rather than assumed — meat, oil and the grain-type
    // goods all start at different minimums. Container-shipped goods carry no
    // tonnage preset, so their minimum is the category's container count.
    const minimumOrder =
        getMinimumOrder(product) ??
        t("minimum_order_value", { count: getMinContainers(category) });
    // The grid has no selectors, so a quick add uses the product's first
    // packing option — the buyer can refine it on the product page.
    const defaultVariation = toCartVariation(getDefaultSelection(variation), variation);

    return (
        <article className="group">
            <RippleWrapper
                className={`${className} bg-white cursor-pointer lg:min-h-[500px] lg:min-w-full rounded-[28px] sm:rounded-[30px] lg:rounded-[50px] p-2.5 2xl:p-3.5 transition-transform duration-500 active:scale-[0.96]`}>
                <figure className="relative rounded-[18px] sm:rounded-[20px] lg:rounded-[40px] overflow-hidden w-full h-[150px] sm:h-[200px] lg:h-[250px] 2xl:h-[320px]">
                    <Image
                        src={thumbnail ? `${thumbnail}` : "/images/placeholder-image.jpg"}
                        alt={thumbnailAlt || `Product image of ${name}`}
                        title={`View details of ${name}`}
                        loading="lazy"
                        width={800}
                        height={800}
                        quality={90}
                        sizes="(max-width: 640px) 95vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 800px"
                        className="object-cover select-none pointer-events-none w-full h-full z-0"
                    />
                    <div className="absolute z-10 inset-0 bg-black/5" />
                    <figcaption className="sr-only">
                        {name} {t("unit")}
                    </figcaption>
                </figure>

                <div className="sm:px-1 lg:px-2 mt-3 lg:mt-5">
                    <CustomHeaderTag as={headerTag} className="text-base xl:text-xl leading-none text-balance  xl:leading-tight tracking-wide text-primary line-clamp-2">
                        {/* The card's one link now lives on the heading, the way a
                            product card is supposed to name itself. `after:` stretches
                            its hit area over the whole card, so the card still
                            navigates end to end — but the cart button below is no
                            longer a child of the <a>, which is invalid HTML
                            (interactive content inside an anchor) and made the
                            button rely on preventDefault to not follow the link. */}
                        <Link
                            href={`${ROUTES.PRODUCTS}/${slug}`}
                            className="after:absolute after:inset-0 after:z-30 after:content-['']">
                            {name}
                        </Link>
                    </CustomHeaderTag>
                    <div className="hidden sm:block">
                        <div
                            className="prose prose-sm md:prose-base prose-p:text-black font-medium prose-p:leading-snug line-clamp-4"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </div>
                </div>

                {/* Price & Cart Actions */}
                <div className="flex items-center justify-between mt-3 sm:mb-1 lg:mb-2 sm:px-1 lg:px-2 gap-3">
                    {/* Label and its value are a name/value pair, not two loose
                        paragraphs. Preflight zeroes dl/dd margins, so it lays out
                        exactly as the <p> pair it replaces. */}
                    <dl className="leading-1">
                        <dt className="capitalize text-xs lg:text-sm font-medium">{t("minimum_order")}</dt>
                        <dd className="text-primary font-mono text-sm lg:text-lg tracking-wide">
                            {minimumOrder}
                        </dd>
                    </dl>
                    {/* Raised above the stretched link so the button keeps its own
                        click, instead of sitting under the card-wide hit area. */}
                    <div className="relative z-40 flex">
                        <AddToCartButton
                            productId={String(id)}
                            name={name}
                            unit={String(id)}
                            image={images?.[0] ?? thumbnail ?? "/images/placeholder-image.jpg"}
                            thumbnail={thumbnail ?? "/images/placeholder-image.jpg"}
                            variation={defaultVariation}
                        />
                    </div>
                </div>
            </RippleWrapper>
        </article>
    );
};

export default ProductCardTwo;
