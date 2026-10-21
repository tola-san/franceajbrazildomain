import { Metadata } from "next";
import ProductDetailsContent from "./product-details-content";
import { ProductService } from "@/services/product.service";
import { cache } from "react";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";


type Props = {
    params: Promise<{ slug: string; locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.franceaj.com';

const getCachedProductData = cache(async (slug: string, locale: string) => {
    return await ProductService.getProductBySlug(slug, locale);
});

const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
};

// Fallback freshness signal for products that carry no `dateModified` of their
// own: the catalog file's last commit date.
//
// This is resolved at BUILD time in next.config.js and inlined here. It cannot
// be read at request time: this route renders on demand, and inside the
// serverless bundle Next normalizes file mtimes to a fixed epoch, so
// fs.statSync() would date every product to 2018-10-20.
//
// If the build could not resolve a date we return null and the caller omits
// `dateModified` entirely - better no freshness signal than a false one.
const getCatalogModifiedDate = (locale: string): string | null => {
    const raw =
        locale === "pt-br"
            ? process.env.CATALOG_MODIFIED_BR
            : process.env.CATALOG_MODIFIED_EN;

    return raw && !Number.isNaN(Date.parse(raw)) ? raw : null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;

    const response = await getCachedProductData(slug, locale);
    const product = response.data.product;

    if (!product) {
        return notFound();
    }

    const isBR = locale === "pt-br";
    const currentUrl = `${baseUrl}/${locale}/products/${slug}`;
    const enUrl = `${baseUrl}/en/products/${slug}`;
    const brUrl = `${baseUrl}/pt-br/products/${slug}`;


    const name = product.name ?? "France AJ Alimentaire And Food LTDA and Food Export & Import LTDA";
    const fallbackDescription = "Explore this HALAL product from France AJ Alimentaire And Food LTDA and Food Export & Import LTDA.";
    const metaDescription = stripHtml(product.seo?.description ?? product.description ?? fallbackDescription);
    const imageUrl = product.seo?.openGraph?.image ?? product.images?.[0] ?? `${baseUrl}/images/default-og.jpg`;

    const metaTitle = stripHtml(product.seo?.metaTitle ?? (isBR ? `Produto – ${name}` : `${name} | France AJ Alimentaire And Food LTDA and Food Export & Import LTDA`));

    const ogTitle = stripHtml(product.seo?.openGraph?.title ?? metaTitle);
    const ogDescription = stripHtml(product.seo?.openGraph?.description ?? metaDescription);
    const twitterTitle = stripHtml(product.seo?.twitter?.title ?? metaTitle);
    const twitterDescription = stripHtml(product.seo?.twitter?.description ?? metaDescription);
    const twitterImage = product.seo?.twitter?.image ?? imageUrl;

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: product.seo?.keywords,
        metadataBase: new URL(baseUrl),
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            url: currentUrl,
            siteName: "France AJ Alimentaire And Food LTDA",
            locale: isBR ? "pt-BR" : "en",
            type: "article",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: name,
                    type: "image/webp",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: twitterTitle,
            description: twitterDescription,
            images: [twitterImage],
            site: process.env.SITE_X,
            creator: process.env.SITE_X,
        },
        alternates: {
            canonical: currentUrl,
            languages: {
                en: enUrl,
                "pt-BR": brUrl,
                "x-default": enUrl,
            },
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug, locale } = await params;
    const queryClient = new QueryClient();

    const [, response, tNav] = await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["product", slug, locale],
            queryFn: () => getCachedProductData(slug, locale),
        }),
        getCachedProductData(slug, locale),
        getTranslations({ locale, namespace: 'nav' }),
    ]);

    const product = response?.data?.product;

    // NO `offers` node is emitted, deliberately.
    //
    // Google grants merchant-listing experiences only to "pages where a shopper
    // can purchase a product", and every such listing requires a price greater
    // than zero. This is an RFQ catalog: nothing is purchasable here and no price
    // is published, so an Offer can never validate - it reported
    // `Either "price" or "priceSpecification.price" should be specified` on every
    // product. Publishing a token price to silence that would contradict the
    // page, which shows only "Request a Quote", and is what Google's
    // spammy-structured-markup policy targets.
    //
    // The trade terms that used to sit on the Offer are preserved below as
    // PropertyValue entries: still machine-readable for AI engines, without
    // claiming a purchasable offer.
    const buildTradeTerms = (): Array<{ name: string; value: string }> => {
        const shipping = product?.structuredData?.offers?.shippingDetails;
        const window = (q?: { minValue?: string; maxValue?: string; unitCode?: string }) => {
            if (!q?.minValue) return undefined;
            const unit = q.unitCode === 'DAY' ? 'days' : (q.unitCode ?? '');

            return q.maxValue ? `${q.minValue}-${q.maxValue} ${unit}` : `${q.minValue} ${unit}`;
        };

        const handling = window(shipping?.deliveryTime?.handlingTime);
        const transit = window(shipping?.deliveryTime?.transitTime);

        return [
            ...(shipping?.shippingLabel
                ? [{ name: 'Shipping Terms', value: shipping.shippingLabel }]
                : []),
            ...(handling ? [{ name: 'Handling Time', value: handling }] : []),
            ...(transit ? [{ name: 'Transit Time', value: transit }] : []),
        ];
    };

    const currentUrl = `${baseUrl}/${locale}/products/${slug}`;

    // Per-product freshness, so editing one item does not re-date the catalog.
    // Falls back to the catalog-wide build constant for anything not yet
    // stamped; if neither is usable the field is dropped below.
    const modifiedDate =
        product?.dateModified && !Number.isNaN(Date.parse(product.dateModified))
            ? product.dateModified
            : getCatalogModifiedDate(locale);

    const productSchema = product
        ? {
              '@context': 'https://schema.org',
              '@type': 'Product',
              '@id': `${currentUrl}#product`,
              name: product.name,
              // All image URLs made absolute
              image: (product.images ?? []).map((img: string) =>
                  img.startsWith('http') ? img : `${baseUrl}${img}`
              ),
              description: product.structuredData?.description ?? stripHtml(product.description ?? product.name),
              sku: product.structuredData?.sku,
              ...(product.structuredData?.mpn ? { mpn: product.structuredData.mpn } : {}),
              // Freshness signal for AI engines. Omitted when no trustworthy
              // date exists.
              ...(modifiedDate ? { dateModified: modifiedDate } : {}),
              brand: {
                  '@type': 'Brand',
                  name: 'France AJ Alimentaire And Food Export And Import LTDA',
              },
              audience: {
                  '@type': 'BusinessAudience',
                  audienceType: 'B2B – wholesale, import & export',
              },
              // Catalog fields that were being dropped on the floor. All four are
              // standard schema.org Product properties.
              ...(product.structuredData?.category
                  ? { category: product.structuredData.category }
                  : {}),
              ...(product.structuredData?.material
                  ? { material: product.structuredData.material }
                  : {}),
              // Passed through verbatim: for most goods this is a third-party
              // SIF-certified plant, NOT France AJ, so it must not be rewritten
              // into a reference to the site's own Organization.
              ...(product.structuredData?.manufacturer
                  ? { manufacturer: product.structuredData.manufacturer }
                  : {}),
              ...(() => {
                  // Catalog properties first, then any trade term they do not
                  // already state (they overlap on MOQ, origin and packing).
                  const specs = (product.structuredData?.additionalProperty ?? []).map(
                      (spec) => ({
                          '@type': 'PropertyValue',
                          name: spec.name,
                          value: spec.value,
                      })
                  );
                  const named = new Set(specs.map((entry) => entry.name));
                  const extra = buildTradeTerms()
                      .filter((term) => !named.has(term.name))
                      .map((term) => ({ '@type': 'PropertyValue', ...term }));
                  const all = [...specs, ...extra];

                  return all.length ? { additionalProperty: all } : {};
              })(),
              ...(product.structuredData?.hasCertification?.length
                  ? { hasCertification: product.structuredData.hasCertification }
                  : {}),
          }
        : null;

    const breadcrumbSchema = product
        ? {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                  {
                      '@type': 'ListItem',
                      position: 1,
                      name: tNav('home'),
                      item: `${baseUrl}/${locale}`,
                  },
                  {
                      '@type': 'ListItem',
                      position: 2,
                      name: tNav('products'),
                      item: `${baseUrl}/${locale}/products`,
                  },
                  {
                      '@type': 'ListItem',
                      position: 3,
                      name: product.name,
                      item: `${baseUrl}/${locale}/products/${slug}`,
                  },
              ],
          }
        : null;

    // Server-render the FAQPage (when the catalog provides one) so AI engines
    // that don't execute JS can still parse the Q&A block for citation.
    const faqSchema =
        product?.faqSchema && product.faqSchema.mainEntity?.length > 0
            ? product.faqSchema
            : null;

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductDetailsContent slug={slug} locale={locale} />
            {productSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replace(/</g, '\\u003c') }}
                />
            )}
            {breadcrumbSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                />
            )}
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
                />
            )}
        </HydrationBoundary>
    );
}
