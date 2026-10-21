"use client"
import { useQuery } from "@tanstack/react-query"
import CertificateSection from "../../../components/certificate/CertificateSection"
import WhyChooseUsContent from "../../../components/feature/WhyChooseUsSection"
import HeroTwo from "../../../components/hero/HeroTwo"
import MobileNavbar from "../../../components/navbar/MobileNavbar"
import TopMobileNavbar from "../../../components/navbar/TopMobileNavbar"
import NewsletterSection from "../../../components/newsletter/NewsletterSection"
import HowWeWorkSection from "@/components/process/HowWeWorkSection"
import InstagramFeedSection from "../../../components/instagram/InstagramFeedSection"
import BlogSection from "../../../components/blog/BlogSection"
import { HomeService } from "@/services/home.service"
import CollectionSection from "../../../components/product/CollectionSection"
import CategorySection from "../../../components/category/CategorySection"
import { Fragment } from "react/jsx-runtime"
import { useWindowDimensions } from "@/utils/useWindowDimensions"

interface Props {
    locale: string;
    initialLimit: number;
}

const HomePageContent: React.FC<Props> = ({ locale, initialLimit }) => {
    const { width } = useWindowDimensions();
    const limit = width === null ? initialLimit : (width < 1024 ? 4 : 3);

    const { data, isLoading } = useQuery({
        queryKey: ['home-page', locale, limit],
        queryFn: () => HomeService.getHomePage({ lang: locale, limit })
    });
    const collections = data?.data?.collections;
    const categories = data?.data?.categories;

    return (
        <Fragment>
            <TopMobileNavbar />
            <HeroTwo />
            <CategorySection data={categories || []} isLoading={isLoading} />
            {collections?.map((collection, idx) => (
                <CollectionSection key={`main-collection-${idx}`} data={collection} locale={locale} />
            ))}
            <WhyChooseUsContent />
            <NewsletterSection />
            {/* Same trading process as the about page, reused here so a first-time
                visitor sees how an order runs without leaving the homepage. */}
            <section
                aria-labelledby="home-how-we-work-heading"
                className="w-full px-4 sm:px-6 lg:px-0 mt-12 sm:mt-20 lg:mt-32 mb-10"
            >
                <HowWeWorkSection headingId="home-how-we-work-heading" />
            </section>
            <BlogSection />
            <CertificateSection />
            <InstagramFeedSection />
            <MobileNavbar />
        </Fragment>
    )
}

export default HomePageContent