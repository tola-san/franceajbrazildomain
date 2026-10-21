import { Collection } from "@/types/home"
import { Button } from "@heroui/button"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { MdOutlineKeyboardArrowRight } from "react-icons/md"
import ProductCardTwo from "../card/ProductCardTwo"
import { Link } from "@/i18n/routing"
import { ROUTES } from "@/utils/route"

interface Props {
    data: Collection
    locale: string
}

const CollectionSection: React.FC<Props> = ({ data, locale }) => {
    const { name, description, subCollections } = data
    const t = useTranslations('home_product')

    return (
        <section className="relative w-full px-3 lg:px-0 mt-5 lg:mt-40" aria-labelledby="product-section-heading">
            <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-5">
                <div className="lg:max-w-5xl lg:text-center space-y-1 xl:space-y-5">
                    <h2 id="product-section-heading"
                        className="lg:max-w-4xl mx-auto text-xl sm:text-4xl 2xl:text-6xl text-primary text-balance whitespace-pre-line capitalize leading-none xl:leading-tight xl:font-bold tracking-wide">
                        {t(name)}
                    </h2>
                    <p className="text-lg leading-normal sm:leading-tight font-medium hidden lg:block">{t(description ?? '')}</p>
                </div>
                <Button onPress={() => { }} aria-label={`${t('see_all')} — ${t(name)}`} size="sm" color="primary" className="lg:hidden font-semibold px-1 text-base gap-2" endContent={<MdOutlineKeyboardArrowRight className="text-primary bg-primary/10 rounded-full p-0.5" size={24} />} variant="light">
                    {t('see_all')}
                </Button>
            </div>
            <div className="flex flex-1 flex-col gap-3 mt-5 lg:mt-28">
                {subCollections.map((subCollection, idx) => (
                    <div key={`sub-collection-${idx}`} className="relative  flex items-center gap-5 lg:gap-10 mt-10" aria-label={t(subCollection.name)}>
                        <figure className="w-[200px] xl:w-[380px] 3xl:w-[520px] h-[490px]  2xl:h-[540px] hidden lg:block bg-white relative overflow-hidden rounded-[30px] lg:rounded-[50px]">
                            <Image
                                src={subCollection.banner?.image ?? ''}
                                alt={t(subCollection.name)}
                                fill
                                quality={75}
                                priority={false}
                                sizes="(max-width: 768px) 150px, (max-width: 1200px) 33vw, 50vw"
                                className="object-cover object-top z-0 "
                            />
                            <div className={`absolute inset-0 bg-gradient-to-b from-black via-black/20 to-transparent`} />
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                            <figcaption className="absolute top-10 inset-x-0 z-10">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <h3 className="max-w-72 text-2xl 2xl:text-3xl 3xl:text-4xl uppercase text-background leading-none text-balance">
                                        {t(subCollection.banner?.title ?? '')}
                                    </h3>
                                </div>
                            </figcaption>

                            {/* Bottom CTA into the matching category / filtered product listing */}
                            <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center px-6">
                                <Button
                                    as={Link}
                                    href={subCollection.href ?? ROUTES.PRODUCTS}
                                    className="font-mono capitalize font-normal bg-primary  rounded-xl gap-1 text-secondary tracking-wider">
                                    {t(subCollection.cta ?? 'see_all')}
                                </Button>
                            </div>
                        </figure>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 w-full">
                            {subCollection.products.map((product) => (
                                <ProductCardTwo key={product.id} product={product} locale={locale} headerTag={"h3"} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default CollectionSection