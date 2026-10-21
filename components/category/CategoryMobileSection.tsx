import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";


export default function CategoryMobileSection() {
    const t = useTranslations('categories');
    const th = useTranslations('home_product');

    return (
        <section className="mt-5 sm:mt-8 lg:hidden px-3 sm:px-5 lg:px-0" aria-labelledby="categories-heading">
            <header className="mb-5 flex items-center justify-between gap-5">
                <div>
                    <h2 id="categories-heading" className="text-xl sm:text-2xl text-primary">
                        {t('categories')}
                    </h2>
                    <p className="text-sm font-medium">{t('quality_doorstep')}</p>
                </div>
                <Button
                    onPress={() => { }}
                    aria-label={`${th('see_all')} — ${t('categories')}`}
                    size="sm"
                    color="primary"
                    className="font-semibold px-1 text-base gap-2"
                    endContent={
                        <MdOutlineKeyboardArrowRight
                            className="text-primary bg-primary/10 rounded-full p-0.5"
                            size={24}
                        />
                    }
                    variant="light"
                >
                    {th('see_all')}
                </Button>
            </header>

            <div className="columns-2 space-y-3">
                <figure className="relative overflow-hidden h-[180px] sm:h-[250px] rounded-[30px]">
                    <Image
                        src="/images/france-aj-banner-sugar.jpg"
                        alt="ICUMSA sugar products — France AJ Alimentaire And Food LTDA (Food Export & Import LTDA) for B2B wholesale"
                        height={250}
                        width={500}
                        quality={100}
                        loading="lazy"
                        className="object-cover w-full h-full object-left select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
                    <figcaption className="absolute font-mono left-5 top-5 sm:left-5 sm:top-5 text-secondary text-xl lg:text-3xl uppercase">
                        {t('sugar')}
                    </figcaption>
                </figure>

                <figure className="relative overflow-hidden h-[230px] sm:h-[300px] rounded-[30px]">
                    <Image
                        src="/images/france-aj-banner-meet.jpg"
                        alt="HALAL frozen beef & chicken — France AJ Alimentaire And Food LTDA | B2B food export & import"
                        height={300}
                        width={500}
                        quality={100}
                        loading="lazy"
                        className="object-cover w-full h-full object-left select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
                    <figcaption className="absolute font-mono left-5 top-5 sm:left-5 sm:top-5 text-secondary text-xl lg:text-3xl uppercase">
                        {t('meats')}
                    </figcaption>
                </figure>

                <figure className="relative overflow-hidden h-[230px] sm:h-[300px] rounded-[30px]">
                    <Image
                        src="/images/france-aj-banner-grains-001.jpg"
                        alt="Bulk grains — rice, corn & wheat from France AJ Alimentaire And Food LTDA | B2B wholesale export & import"
                        height={300}
                        width={500}
                        quality={100}
                        loading="lazy"
                        className="object-cover w-full h-full object-left select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
                    <figcaption className="absolute font-mono left-5 top-5 sm:left-5 sm:top-5 text-secondary text-xl lg:text-3xl uppercase">
                        {t('grains')}
                    </figcaption>
                </figure>

                <figure className="relative font-mono overflow-hidden h-[180px] sm:h-[250px] rounded-[30px]">
                    <Image
                        src="/images/france-aj-banner-oils.jpg"
                        alt="Edible vegetable oils — sunflower, soybean & palm by France AJ Alimentaire And Food LTDA | B2B food export & import"
                        height={250}
                        width={500}
                        quality={100}
                        loading="lazy"
                        className="object-cover w-full h-full object-left select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
                    <figcaption className="absolute left-5 top-5 sm:left-5 sm:top-5 text-secondary text-xl lg:text-3xl uppercase">
                        {t('oils')}
                    </figcaption>
                </figure>
            </div>
        </section>
    );
}
