
'use client'

import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { MdArrowOutward } from "react-icons/md";


const HeroThreeColumn = () => {
    const t = useTranslations('banner');
    const router = useRouter();
    const handleClick = ({ path }: { path: string }) => {
        router.push(path);
    };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full ">
            <div className="col-span-12 lg:col-span-3 relative overflow-hidden rounded-[30px] lg:rounded-[50px] h-[250px] lg:min-h-[70vh]">

                <Suspense fallback={<p>Loading weather...</p>}>
                    <Image
                        src="/images/france-aj-banner-sugar.jpg"
                        alt="france aj sugar ICUMSA IC 45, ICUMSA IC 150 , ICUMSA IC 600-1200"
                        fill
                        quality={100}
                        loading="eager"
                        className="object-cover object-top" />
                </Suspense>
                <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent" />
                <div className="absolute top-10 inset-x-0">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl lg:text-4xl text-background">high-quality <br /> ICUMSA sugar</h1>
                    </div>
                </div>
                <div className="absolute bottom-5 left-5">
                    <Button isIconOnly aria-label="Take a photo" radius="full" size="lg" className="border-2 border-white" variant="bordered">
                       <MdArrowOutward size={28} className="text-white" />
                    </Button>
                </div>
            </div>
            <div className="col-span-12 lg:col-span-6 relative overflow-hidden rounded-[30px] lg:rounded-[50px] h-[250px] lg:min-h-[70vh]">
                <Suspense fallback={<p>Loading weather...</p>}>
                    <Image
                        src="/images/france-aj-banner-chicken.jpg"
                        alt="france aj sugar ICUMSA IC 45, ICUMSA IC 150 , ICUMSA IC 600-1200"
                        fill
                        quality={100}
                        loading="eager"
                        className="object-cover" />
                </Suspense>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center ">
                    <div className="text-center text-background">
                        <h1 className="text-2xl lg:text-5xl max-w-2xl">Discover our <br /> premium  frozen chicken products</h1>
                    </div>
                </div>
            </div>
            <div className="col-span-12 lg:col-span-3 relative overflow-hidden rounded-[30px] lg:rounded-[50px] h-[250px] lg:min-h-[70vh]">
                <Suspense fallback={<p>Loading weather...</p>}>
                    <Image
                        src="/images/france-aj-banner-oils.jpg"
                        alt="france aj sugar ICUMSA IC 45, ICUMSA IC 150 , ICUMSA IC 600-1200"
                        fill
                        quality={100}
                        loading="eager"
                        className="object-cover" />
                </Suspense>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                <div className="absolute top-10 inset-x-0">
                    <div className="flex flex-col items-center justify-center text-center">
                        <h1 className="text-2xl lg:text-4xl text-background">catalog <br />of edible oils</h1>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default HeroThreeColumn