/**
 * Buyer-selectable order options for a product.
 *
 * `containerTypes` offers the container loading (meat, oil); `quantities`
 * offers a bulk tonnage (grain, sugar, fertilizer, oil) — from 12,500 MT up
 * for grain-type goods, 1,000 MT up for oil. Oil carries both. `weights` is
 * only used by carton-packed goods (meat).
 */
export type ProductVariation = {
  /** Packaging choices, e.g. ["1 L", "2 L"] or ["Bag 25 kg", "Bag 50 kg"]. */
  packages: string[];
  /** Carton/unit weight choices. Carton-packed products only. */
  weights?: string[];
  /**
   * What the `weights` options measure, which decides the selector's label.
   * Defaults to the carton weight; `"chicken"` is used where the buyer picks
   * the weight of the bird itself (whole chicken) rather than of the carton.
   */
  weightLabel?: 'carton' | 'chicken';
  /** Container loading choices, e.g. ["20ft Container", "40ft Container"]. Meat and oil. */
  containerTypes?: string[];
  /**
   * Bulk tonnage choices, used instead of `containerTypes` for grain-type
   * goods, e.g. ["12,500 MT", "25,000 MT", "50,000 MT", "100,000 MT+"].
   * The first entry is the minimum order.
   */
  quantities?: string[];
};

export type ProductPdf = {
  /** Display name shown on the download link, e.g. "Specification Sheet" */
  name?: string;
  /** Public path or absolute URL of the file, e.g. "/pdf/spec-sheet.pdf" */
  url: string;
  /** Human readable size, e.g. "90 KB" */
  size?: string;
};

export type Product = {
  id: number
  name: string
  type: string
  category: string
  status?: 'active' | 'inactive'
  tags?: string[]
  slug: string
  images: string[]
  imagesAlt?: string[]
  thumbnail: string
  thumbnailAlt?: string
  description: string
  createdAt?: string
  /**
   * ISO 8601 date this product last changed, maintained in the catalog by
   * scripts/stamp-product-dates.mjs. Stored per product so editing one item
   * does not mark the whole catalog as freshly updated.
   */
  dateModified?: string
  unit?: number
  rating?: number
  popularity?: number
  seo?: Seo
  structuredData?: StructuredProductData;
  faqSchema?: FaqSchema;
  /** Optional downloadable spec sheets / brochures for this product. */
  pdfs?: ProductPdf[];
  /** Buyer-selectable packaging / container / tonnage options. */
  variation?: ProductVariation;
}

export type FaqQuestion = {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
};

export type FaqSchema = {
  "@context": "https://schema.org/";
  "@type": "FAQPage";
  mainEntity: FaqQuestion[];
};

export interface ProductQueryParams {
  page?: number
  limit?: number
  lang?: string | null
  category?: string[]
  type?: string | null
  tags?: string[]
  search?: string | null
  slug?: string | null
  sort?: string
  random?: boolean
}


export type Seo = {
  metaTitle: string
  description: string
  keywords: string[]
  openGraph: OpenGraph
  twitter: Twitter
}

export type OpenGraph = {
  title: string
  description: string
  image: string
  url: string
}

export type Twitter = {
  title: string
  description: string
  image: string
}

type ShippingQuantitativeValue = {
  "@type": "QuantitativeValue";
  minValue?: string;
  maxValue?: string;
  value?: string;
  unitCode?: string;
};

export type StructuredProductData = {
  "@context": "https://schema.org/";
  "@type": "Product";
  name: string;
  image: string[];
  description: string;
  sku: string;
  /** Manufacturer Part Number — a valid Product identifier for search engines. */
  mpn?: string;
  /** e.g. "100% Refined Sucrose (Saccharum officinarum)". */
  material?: string;
  /** Breadcrumb-style taxonomy, e.g. "Agricultural Commodities > Sweeteners > Refined Sugar". */
  category?: string;
  /**
   * Certifications the goods ship under (SIF, HALAL, HACCP, ISO 22000, SGS).
   *
   * Present in the catalog but deliberately NOT emitted into the Product
   * JSON-LD: these are certifications, not awards, and they duplicate
   * `hasCertification`, which already carries them with the correct semantics.
   * Do not add it to the schema in page.tsx.
   */
  award?: string[];
  /**
   * The producing plant. Often a third-party SIF-certified facility rather than
   * France AJ itself, so this is passed through to the page unchanged.
   */
  manufacturer?: {
    "@type": "Organization";
    name: string;
    url?: string;
    logo?: string;
    contactPoint?: {
      "@type": "ContactPoint";
      telephone?: string;
      contactType?: string;
      email?: string;
      areaServed?: string;
      availableLanguage?: string[];
    };
  };
  brand: {
    "@type": "Organization";
    name: string;
  };
  offers: {
    "@type": "Offer";
    url: string;
    priceCurrency: string;
    // B2B wholesale catalog: many products are quoted per order, so price may be absent.
    price?: string;
    availability: string;
    itemCondition: string;
    priceValidUntil?: string;
    businessFunction?: string;
    seller?: {
      "@type": "Organization";
      name: string;
    };
    priceSpecification?: {
      "@type": "PriceSpecification";
      price?: string;
      priceCurrency?: string;
      valueAddedTaxIncluded?: boolean;
      description?: string;
    };
    eligibleTransactionVolume?: {
      "@type": "PriceSpecification";
      price?: string;
      priceCurrency?: string;
      description?: string;
    };
    // Canonical Minimum Order Quantity. QuantitativeValue with either a single
    // `value` (bulk, e.g. 12500) or a `minValue`/`maxValue` range (containers, e.g. 24-27).
    eligibleQuantity?: {
      "@type": "QuantitativeValue";
      value?: string;
      minValue?: string;
      maxValue?: string;
      unitCode?: string;
      unitText?: string;
    };
    // Ocean-freight terms (FOB/CIF plus handling and transit windows). Maps
    // straight onto schema.org Offer, so it is passed through unchanged.
    shippingDetails?: {
      "@type": "OfferShippingDetails";
      shippingLabel?: string;
      shippingDestination?: {
        "@type": "DefinedRegion";
        addressCountry?: string;
        name?: string;
      };
      deliveryTime?: {
        "@type": "ShippingDeliveryTime";
        handlingTime?: ShippingQuantitativeValue;
        transitTime?: ShippingQuantitativeValue;
      };
    };
  };
  hasCertification?: {
    "@type": "Certification";
    name: string;
    url: string;
  }[];
  additionalProperty?: {
    "@type": "PropertyValue";
    name: string;
    value: string;
  }[];
};


