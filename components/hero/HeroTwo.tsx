
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@heroui/button';
import { ROUTES } from '@/utils/route';
import { GoDotFill } from 'react-icons/go';
import Link from 'next/link';
import Image from 'next/image';

const HeroTwo = () => {
    const locale: string = useLocale()
    const t = useTranslations('banner');
    return (
        <section
            className="w-full mt-5"
            aria-labelledby="hero-heading"
            role="region">
            <figure className="relative overflow-hidden rounded-[25px] lg:rounded-[50px] h-[220px] sm:h-[300px] xl:min-h-[82vh] 4xl:min-h-[70vh]">
                <Image
                    src="/images/banners/france-aj-brazil-banner-food-002.jpeg"
                    alt={t('image_alt')}
                    fill
                    priority
                    sizes="(max-width: 768px) 250px, (max-width: 1200px) 40vw, 60vw"
                    className="object-cover w-full h-full z-0 object-left select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/20 to-transparent" />

                <figcaption className="absolute left-0 lg:left-10 inset-y-0 p-5 max-w-[280px] sm:max-w-sm lg:max-w-4xl 3xl:max-w-3xl lg:p-10 flex flex-col justify-center">
                    <header className="space-y-3 lg:space-y-5 mb-5 lg:mb-10 z-20 text-secondary">
                        <h1
                            id="hero-heading"
                            className="text-2xl lg:text-6xl 2xl:text-7xl xl:font-bold leading-none lg:leading-tight tracking-wide uppercase"
                        >
                            {t('title')}
                        </h1>
                        <p className="text-base lg:text-xl font-normal leading-normal max-w-2xl lg:leading-snug hidden xl:block">
                            {t('description')}
                        </p>
                    </header>

                    <div className="flex items-center gap-3 scale-y-75 xl:scale-100">
                        <Button
                            as={Link}
                            href={`/${locale}${ROUTES.PRODUCTS}`}
                            aria-label={t('explore_products_aria')}
                            radius="lg"
                            size='lg'
                            className="font-mono capitalize font-normal bg-secondary rounded-xl gap-1 text-primary"
                            startContent={<GoDotFill />}
                        >
                            {t('explore_products')}
                        </Button>
                        <Button
                            as={Link}
                            href={`/${locale}${ROUTES.CONTACT_US}`}
                            color="primary"
                            size='lg'
                            variant="bordered"
                            radius="lg"
                            className="font-mono font-normal border-secondary rounded-xl text-secondary group tracking-wider"
                        >
                            {t('contact_us')}
                        </Button>
                    </div>
                </figcaption>
                {/* <div className='absolute bottom-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none hidden lg:block'>
                    <ScrollShape className="bottom-0 w-[200px] z-0" fill="#faf4f0" />
                    <div className=' absolute z-10 -bottom-2 left-1/2 -translate-x-1/2'>
                        <div className="w-6 h-6 animate-bounce">
                            <MdOutlineArrowDownward size={20} className='animate-bounce text-primary' />
                        </div>

                    </div>

                </div> */}

            </figure>

        </section>
    );
};

export default HeroTwo;
