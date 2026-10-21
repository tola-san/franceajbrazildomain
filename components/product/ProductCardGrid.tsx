import ProductCardTwo from "@/components/card/ProductCardTwo";
import { Product } from "@/types/product";
import { FC } from "react";

interface Props {
    products: Product[];
    locale: string;
}

const ProductCardGrid: FC<Props> = ({ products, locale }) => {
    return (
        <div className="relative columns-2 3xl:columns-3 gap-3 lg:gap-5 space-y-3 lg:space-y-5">
            {products.map(product => (
                <ProductCardTwo key={product.id} product={product} locale={locale} headerTag={"h2"} />
            ))}
        </div>
    );
}

export default ProductCardGrid