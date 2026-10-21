"use client";

import { useCart } from "@/context/cart/cart-context";
import { Badge, Button } from "@heroui/react";
import Image from "next/image";
import { TbShoppingBag } from "react-icons/tb";

const TopMobileNavbar = () => {
    const { state, toggleDrawer } = useCart()
    const totalItems = state.totalItems || 0
    return (
        <div className="lg:hidden w-full px-3 py-1">
            <div className="flex items-center justify-between ">
                <div className="relative overflow-hidden h-[65px] w-[230px] rounded-full">
                    <Image
                        alt="France AJ Alimentaire And Food LTDA — Food Export & Import LTDA logo | B2B wholesale exporter of HALAL meats, rice, sugar & edible oils"
                        src="/images/logo/franceaj-logo.png"
                        className="object-contain w-full h-full"
                        width={230}
                        height={65}
                        loading="eager"
                        quality={100}
                        sizes="(max-width: 768px) 180px, 230px"
                    />
                </div>
                <Badge color="primary" classNames={{
                    badge: "text-white top-1 right-1.5 font-normal font-sans"
                }} content={totalItems}>
                    <Button isIconOnly aria-label="Cart"  radius="lg" color="primary" variant="flat" onPress={toggleDrawer}>
                        <TbShoppingBag size={22} className='text-primary' />
                    </Button>
                </Badge>

            </div>
        </div>
    );
}

export default TopMobileNavbar;