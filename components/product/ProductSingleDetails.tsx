import { Product } from "@/types/product";
import { Button } from "@heroui/button";
import SwiperGallery from "../carousel/SwiperGallery";
import { IoMdPricetags } from "react-icons/io";
import { useTranslations } from "next-intl";
import ProductFaq from "./ProductFaq";
import ProductPdfList from "./ProductPdfList";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";

// The order options panel pulls in the cart context, toast and WhatsApp wiring,
// so it is code-split out of the initial product bundle. SSR stays on so the
// fields and buttons are still in the server HTML, and the skeleton reserves
// their height while loading to avoid shifting the layout underneath.
const OrderOptionsSkeleton = () => (
    <div className="mt-10 space-y-6">
        <div className="h-56 w-full rounded-[20px] lg:rounded-[30px] bg-primary/10 animate-pulse" />
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="h-12 w-full sm:w-1/2 rounded-large bg-primary/10 animate-pulse" />
            <div className="h-12 w-full sm:w-1/2 rounded-large bg-primary/10 animate-pulse" />
        </div>
    </div>
);

const ProductOrderOptions = dynamic(() => import("./ProductOrderOptions"), {
    loading: OrderOptionsSkeleton,
});

interface Props {
    data: Product;
    isLoading: boolean;
}

const ProductSingleDetails: React.FC<Props> = ({
    data,
    isLoading,
}) => {
    const tp = useTranslations('product')
    const { name, images, imagesAlt, thumbnailAlt, description, category, tags, faqSchema, pdfs } = data
    const imageCaption = tp('image_caption', { product: name });
    return (
        <article
            aria-labelledby="product-title"
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5  lg:gap-10 px-5 lg:px-0 w-full">
            {/* Sticky Image */}
            <section aria-label={tp('images_label')} className="relative">
                {images && images.length > 1 ? (
                    <figure className="sticky top-32">
                        <SwiperGallery
                            alt={name}
                            imagesAlt={[thumbnailAlt || imagesAlt?.[0] || name, ...(imagesAlt?.slice(1) || [])]}
                            images={images} />
                        <figcaption className="sr-only">{imageCaption}</figcaption>
                    </figure>
                ) : (
                    <figure className="sticky top-32 rounded-[30px] lg:rounded-[50px] bg-white overflow-hidden h-[350px] sm:h-[400px] lg:h-[calc(100vh-12rem)] 4xl:h-[70vh]">
                        <Image
                            src={images?.[0] ?? "/images/placeholder-image.jpg"}
                            alt={thumbnailAlt || imagesAlt?.[0] || name}
                            height={1000}
                            width={1000}
                            priority
                            fetchPriority="high"
                            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 60vw, 50vw"
                            className={`object-cover select-none pointer-events-none w-full h-full`}
                        />
                        <figcaption className="sr-only">{imageCaption}</figcaption>
                    </figure>
                )}

            </section>

            <div className="relative bg-white rounded-[30px] lg:rounded-[50px] p-5 sm:p-8 md:p-10 lg:p-18 overflow-auto">
                <header>
                    <h1 id="product-title" className="text-2xl lg:text-5xl text-primary text-balance">{name}</h1>
                    <div className="text-sm lg:text-base font-medium mt-3 mb-5 capitalize">
                        {tp('category_label')}:{" "}
                        {/* Every product's category is a slug with its own listing
                            page, so the label doubles as the way back to it. */}
                        <Link
                            href={`/categories/${category}`}
                            className="text-success underline-offset-4 hover:underline">
                            {category}
                        </Link>
                    </div>
                </header>

                <section aria-labelledby="product-description-heading">
                    {/* The catalog copy brings its own headings, so this one only
                        names the region for assistive tech and outline tools. */}
                    <h2 id="product-description-heading" className="sr-only">
                        {tp('description_label')}
                    </h2>
                    <div
                        className="blog-prose prose prose-stone max-w-none text-primary
                        prose-headings:text-primary prose-headings:font-mono prose-headings:uppercase prose-headings:tracking-wide prose-headings:font-normal
                        prose-h2:text-xl prose-h2:lg:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:font-normal
                        prose-h3:text-lg prose-h3:lg:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-normal prose-h3:text-balance
                        prose-h4:font-normal
                        prose-p:text-sm prose-p:lg:text-base prose-p:leading-relaxed prose-p:mb-5
                        prose-li:text-sm prose-li:lg:text-base prose-li:leading-relaxed prose-li:marker:text-[#FFB936]
                        prose-a:text-success prose-a:font-semibold hover:prose-a:underline
                        prose-strong:text-primary prose-strong:font-semibold
                        prose-ol:marker:text-primary prose-ul:marker:text-primary"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </section>

                <ProductOrderOptions data={data} />

                <ProductPdfList data={pdfs} />
                {(tags?.length ?? 0) > 0 && (
                    <section
                        aria-labelledby="product-tags-heading"
                        className="my-8 md:my-10 space-y-3">
                        <h2
                            id="product-tags-heading"
                            className="flex items-center gap-2 text-base lg:text-lg text-primary">
                            <IoMdPricetags size={22} className="text-primary" />
                            {tp('tags_label')}
                        </h2>
                        <ul className="flex flex-wrap items-center gap-2">
                            {tags?.map((tag, index) => (
                                <li key={index} className="flex">
                                    <Button
                                        size="sm"
                                        radius="md"
                                        color="primary"
                                        variant="flat"
                                        className="flex items-center text-sm text-primary gap-2 capitalize px-3">
                                        {tag}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {(faqSchema?.mainEntity?.length ?? 0) > 0 && (
                    <section
                        aria-labelledby="product-faq-heading"
                        className="space-y-5 my-5 md:my-10">
                        <h2 id="product-faq-heading" className="text-2xl text-primary mb-5">
                            {tp('faq_label')}
                        </h2>
                        <ProductFaq data={faqSchema} />
                    </section>
                )}
            </div>
        </article>

    );
}

export default ProductSingleDetails
