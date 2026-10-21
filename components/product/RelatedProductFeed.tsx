import { Product } from "@/types/product";
import { LIMIT } from "@/utils/limit";
import ProductCardTwo from "../card/ProductCardTwo";
import { FC } from "react";
import { useTranslations } from "next-intl";

interface Props {
    data?: Product[];
    isLoading: boolean;
    locale: string;
}

const RelatedProductFeed: FC<Props> = ({ data, isLoading, locale }) => {
    const t = useTranslations('product');
    const related = data?.slice(0, LIMIT.RELATED_PRODUCT_LIMIT) ?? [];

    // Nothing to show: skip the whole block rather than leaving an orphan
    // heading above an empty grid while the query runs or comes back empty.
    if (isLoading || related.length === 0) return null;

    return (
        // Tangential to the product this page is about, so it sits outside the
        // product <article> as an <aside> rather than inside it as a section.
        <aside
            className="relative pt-10 lg:mt-20 px-5 lg:px-0"
            aria-labelledby="related-products-heading"
        >
            <div className="space-y-3 mb-5 lg:mb-20 text-center">
                <h2
                    id="related-products-heading"
                    className="text-primary text-2xl lg:text-5xl"
                >
                    {t('related_title')}
                </h2>
                <p className="max-w-3xl text-center text-base lg:text-lg font-medium mx-auto">
                    {t('related_description')}
                </p>
            </div>

            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((product) => (
                    // `grid` so the card still stretches to the row height the
                    // way it did when it was the grid item itself.
                    <li key={product.id} className="grid">
                        <ProductCardTwo product={product} locale={locale} headerTag="h3" />
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default RelatedProductFeed;
