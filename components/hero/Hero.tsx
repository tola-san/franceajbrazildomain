
'use client'

import { ROUTES } from "@/utils/route";
import { Button } from "@heroui/button"
import { useTranslations } from "next-intl";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { GoDotFill } from "react-icons/go";


const Hero = () => {
    const t = useTranslations('banner');
    const router = useRouter();
    const handleClick = ({ path }: { path: string }) => {
        router.push(path);
    };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
            <div className="relative overflow-hidden rounded-[30px] lg:rounded-[50px] bg-white order-2 md:order-1 min-h-[300px]  lg:min-h-[70vh]  p-7 lg:p-14 flex flex-col justify-center">
                <div className="absolute -left-10 lg:-left-24 top-10 lg:top-16 xxl:-left-32 xxl:top-8 h-[200px] w-[200px] lg:h-[350px] lg:w-[350px] xxl:h-[500px] xxl:w-[500px] z-10">
                    <Image
                        src="/images/sugar-cane-001.png"
                        alt="france aj sugar ICUMSA IC 45, ICUMSA IC 150 , ICUMSA IC 600-1200"
                        fill
                        quality={100}
                        className="opacity-10 scale-x-[-1]" />
                </div>
                <div className="absolute xxl:-right-10 lg:-right-5 -right-2 -bottom-14 lg:-bottom-20 xxl:-bottom-24 h-[200px] w-[200px] lg:h-[300px] lg:w-[300px]  xxl:h-[350px] xxl:w-[350px] z-10">
                    <Image
                        src="/images/sugar-icon.png"
                        alt="france aj sugar ICUMSA IC 45, ICUMSA IC 150 , ICUMSA IC 600-1200"
                        fill
                        quality={100}
                        className="opacity-15 object-contain" />
                </div>
                <div className="space-y-5 mb-16 z-20">
                    <h1 className="text-primary text-3xl lg:text-5xl 2xl:text-7xl tracking-normal lg:tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-primary text-md lg:text-lg font-medium leading-normal lg:leading-tight">
                        {t('description')}
                    </p>
                </div>

                <div className="flex items-center gap-3 z-50">
                    <Button onClick={() => handleClick({ path: ROUTES.ABOUT_US })} aria-label={t('learn_more_aria')} color="primary" className="font-mono tracking-wider text-white" startContent={<GoDotFill />}>{t('learn_more')}</Button>
                    <Button onClick={() => handleClick({ path: ROUTES.CONTACT_US })} color="primary" variant="bordered" className="font-mono group  tracking-wider transition-all duration-500" >
                        {t('contact_us')}
                    </Button>
                </div>
            </div>
            <div className="relative overflow-hidden rounded-[30px] lg:rounded-[50px] h-[250px] lg:min-h-[70vh] order-1 md:order-2">
                <Suspense fallback={<p>Loading weather...</p>}>
                    <Image
                        src="/images/france-aj-banner-sugar-meet-chicken.webp"
                        alt="france aj sugar ICUMSA IC 45, ICUMSA IC 150 , ICUMSA IC 600-1200"
                        fill
                        quality={100}
                        loading="eager"
                        className="object-cover" />
                </Suspense>
            </div>
        </div>
    )
}

export default Hero