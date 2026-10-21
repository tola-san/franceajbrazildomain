"use client";

import { useCart } from "@/context/cart/cart-context";
import { Badge, Button, Input } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RiMenu4Fill, RiSearch2Line } from "react-icons/ri";
import { TbShoppingBag } from "react-icons/tb";
import { useLocale } from "next-intl";
import { useGetCategories } from "@/framework/rest/category/useGetCategories";
import BannerMobile from "../carousel/BannerMobile";
import { BiMenuAltRight } from "react-icons/bi";

const HeroMobile = () => {
    const { state, toggleDrawer } = useCart()
    const totalItems = state.totalItems || 0

    const locale: string = useLocale()
    const { data, isLoading } = useGetCategories({ lang: locale })

    return (
        <div className="w-full min-h-screen relative lg:hidden">
            <div className="flex justify-between items-center py-1 px-5">
                <MobileLogo />
                <Button size="lg" isIconOnly aria-label="Search" color="primary" variant="flat">
                    <BiMenuAltRight className='text-primary h-6 w-6' />
                </Button>
            </div>
            <div className="mt-5 px-5">
                <div className="relative flex items-center justify-between bg-primary/15 rounded-xl py-3 px-3">
                    <p className="text-default-600">Search...</p>
                    <RiSearch2Line size={24} className="text-default-600" />
                </div>
            </div>
        </div>
    )
}
export default HeroMobile;

export const MobileLogo = () => {
    const router = useRouter();
    return (
        <div
            className="relative h-[60px] w-[215px] cursor-pointer"
            onClick={() => router.push('/')}>
            <Image
                alt="France AJ Alimentaire And Food LTDA — Food Export & Import LTDA logo | B2B wholesale exporter of HALAL meats, rice, sugar & edible oils"
                src="/images/logo/franceaj-logo-1.png"
                className="object-contain w-full h-full"
                width={230}
                height={65}
                loading="eager"
                quality={100}
                sizes="(max-width: 768px) 180px, 230px"
            />

        </div>

    );
};