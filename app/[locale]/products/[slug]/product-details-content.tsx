'use client'

import PageStatusBar from "@/components/navbar/PageStatusBar";
import ProductSingleDetails from "@/components/product/ProductSingleDetails";
import RelatedProductFeed from "@/components/product/RelatedProductFeed";
import MarketsWeShipTo from "@/components/market/MarketsWeShipTo";
import { useWindowInnerWidth } from "@/hooks/useWindowInnerWidth";
import { ProductService } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { getDefaultSelection, toCartVariation } from "@/lib/products/variation";

// Code-split out of the initial bundle: this sticky bar is mobile-only and the
// button pulls in the cart context and toast wiring. SSR stays on, and the
// placeholder reserves the button's height so the bar does not shift.
const ProductAddToCartButton = dynamic(
  () => import("@/components/product/ProductAddToCartButton"),
  { loading: () => <div className="h-12 w-full mb-5 rounded-large bg-primary/10 animate-pulse" /> },
);

interface Props {
  slug: string;
  locale: string
}

const ProductDetailsContent = ({ slug, locale }: Props) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug, locale],
    queryFn: () => ProductService.getProductBySlug(slug, locale),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const { product, relatedProducts } = data?.data || {};

  const width = useWindowInnerWidth();
  const isMobile = width !== null && width < 1280;

  // NOTE: Product / BreadcrumbList / FAQPage JSON-LD are rendered server-side in
  // page.tsx so AI crawlers that don't execute JS can read them. Do not
  // re-emit them here (it would duplicate the structured data).

  return (
    <div className="flex flex-col items-center min-h-screen gap-4 py-8">
      {isMobile && (
        <PageStatusBar title="Product Details" className="px-5 lg:px-0" />
      )}
      {product && <ProductSingleDetails isLoading={isLoading} data={product} />}
      <RelatedProductFeed
        data={relatedProducts}
        isLoading={isLoading}
        locale={locale}
      />
      {/* Same markets block as the about page, reused here so a buyer landing
          on a product page sees where we ship before leaving. */}
      <section
        aria-labelledby="markets-heading"
        className="w-full my-10 lg:my-20 px-5 lg:px-0"
      >
        <MarketsWeShipTo
          headingTag="h2"
          headingId="markets-heading"
          headingClassName="text-primary text-2xl lg:text-5xl text-center"
        />
      </section>
      {product && (
        <div className="fixed z-30 flex flex-col justify-end bg-gradient-to-t from-white via-white to-transparent w-full h-36 bottom-0 px-5 lg:hidden ">
          <div className="flex items-center justify-between gap-3">
            <ProductAddToCartButton
              id={product.id}
              name={product.name}
              image={product.images?.[0]}
              imageAlt={product.imagesAlt?.[0]}
              variation={toCartVariation(
                getDefaultSelection(product.variation),
                product.variation,
              )}
              className="font-mono tracking-wider text-white w-full mb-5"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailsContent;
