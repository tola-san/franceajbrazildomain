'use client';

import { useCart } from "@/context/cart/cart-context";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { useRouter } from "next/navigation";
import { createElement, FC } from "react";
import { MdArrowBack } from "react-icons/md";
import { TbShoppingBag } from "react-icons/tb";
import clsx from "clsx";


interface Props {
  title: string;
  subtitle?: string;
  disableCartButton?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'p' | 'div';
}

const PageStatusBar: FC<Props> = ({ title, subtitle, disableCartButton = true, className, as = 'h2', }) => {
  const router = useRouter()
  const { state, toggleDrawer } = useCart()
  const totalItems = state.totalItems || 0
  return (
    <div className={clsx("flex items-center justify-between w-full lg:hidden", className)}>
      <Button onPress={() => router.back()} isIconOnly color="primary" variant="flat" radius="lg">
        <MdArrowBack size={22} className="text-primary" />
      </Button>
      {createElement(as, { className: "text-2xl capitalize text-primary" }, title)}

      {disableCartButton ? (
        <Badge color="primary" classNames={{
          badge: "text-white top-1 right-1.5 font-normal font-sans"
        }} content={totalItems}>
          <Button isIconOnly aria-label="Cart" radius="lg" color="primary" variant="flat" onPress={toggleDrawer}>
            <TbShoppingBag size={22} className='text-primary' />
          </Button>
        </Badge>) : (<div></div>)}

    </div>
  )
}

export default PageStatusBar;