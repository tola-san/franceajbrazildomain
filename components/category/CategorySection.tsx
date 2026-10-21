import { useLocale, useTranslations } from "next-intl"
import CategoryCarousel from "../carousel/CategoryCarousel"
import CategoryMobileSection from "./CategoryMobileSection"
import { Category } from "@/types/category"
import CategoryLoader from "../ui/loaders/category-loader"

interface Props {
    data: Category[]
    isLoading?: boolean
}

const CategorySection: React.FC<Props> = ({ data, isLoading }) => {
    const locale: string = useLocale()
    const t = useTranslations('categories')
    return (
        <div className="relative w-full">
            <CategoryMobileSection />
            <section className="hidden xl:block">
                {isLoading ? (
                    <CategoryLoader />
                ) : (
                    <>
                        <div className="flex flex-col items-center justify-center gap-5 mt-32 mb-20">
                            <div className="max-w-5xl text-center space-y-5">
                                <h2 className="text-2xl lg:text-5xl 2xl:text-6xl text-primary tracking-wide capitalize font-bold">
                                    {t('our_categories')}
                                </h2>
                                <p className="text-md lg:text-xl font-normal">
                                    {t('our_categories_desc')}
                                </p>
                            </div>
                        </div>
                        <CategoryCarousel data={data || []} locale={locale} />
                    </>
                )}
            </section>
        </div>
    )
}

export default CategorySection