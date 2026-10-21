
import { ROUTES } from "@/utils/route";
import { Button } from "@heroui/button";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { IoIosMail } from "react-icons/io";

export default function Newsletter() {
    const locale: string = useLocale();
    const t = useTranslations('newsletter');

    return (
        <div className="relative p-10 overflow-hidden mb-5 lg:mb-20 w-full bg-white rounded-[30px] lg:rounded-[50px] flex flex-col items-center justify-center h-[400px]">
            <div className="absolute -left-32 top-8 xxl:h-[500px] xxl:w-[500px] z-10">
                <Image
                    src="/images/sugar-cane-001.png"
                    alt="France AJ Sugar ICUMSA IC 45, IC 150, IC 600-1200"
                    fill
                    quality={100}
                    className="opacity-10 scale-x-[-1]"
                />
            </div>
            <div className="absolute -right-10 -bottom-24 h-[350px] w-[350px] z-10">
                <Image
                    src="/images/sugar-icon.png"
                    alt="France AJ Sugar ICUMSA IC 45, IC 150, IC 600-1200"
                    fill
                    quality={100}
                    className="opacity-15 object-contain"
                />
            </div>
            <div className="text-center max-w-3xl space-y-5 mb-10">
                <h3 className="text-3xl lg:text-5xl 2xl:text-6xl text-primary">{t('title')}</h3>
                <p className="text-base xl:text-lg font-medium">
                    {t('description')}
                </p>
            </div>
            <Button
                as={Link}
                href={`/${locale}${ROUTES.CONTACT_US}`}
                color="primary"
                startContent={<IoIosMail size={20} />}
                className="text-white font-mono tracking-wider"
            >
                Contact Us Now
            </Button>
        </div>
    );
}
