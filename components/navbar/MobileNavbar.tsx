"use client";

import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { GoHome } from "react-icons/go";
import { BiCategoryAlt } from "react-icons/bi";
import { RiSearch2Line } from "react-icons/ri";
import { IoMenu } from "react-icons/io5";
import { useUI } from "@/context/ui-context";
import { useLocale, useTranslations } from "next-intl";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const MobileNavbar = () => {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const locale: string = useLocale()
  const { toggleDrawer } = useUI();

  const navItems: NavItem[] = [
    { href: "/", label: t('home'), icon: <GoHome size={22} /> },
    { href: "/categories", label: t('categories'), icon: <BiCategoryAlt size={22} /> },
    { href: "/search", label: t('products'), icon: <RiSearch2Line size={22} /> },
  ];

  return (
    <nav
      className="
        fixed bottom-0 left-1/2 z-50 lg:hidden
        -translate-x-1/2
        flex gap-4 bg-white
        px-4 py-2 max-w-full w-full">
      {navItems.map(({ href, label, icon }) => {
        const isActive = pathname === href;

        return (
          <button
            key={`/${locale}/${href}`}
            type="button"
            onClick={() => router.push(href)}
            className={clsx(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-xs font-medium bg-transparent border-none outline-none",
              isActive
                ? "text-primary"
                : "text-primary hover:text-primary/80 transition-colors"
            )}>
            {icon}
            <span>{label}</span>
          </button>
        );
      })}
      <button
        key="menu"
        type="button"
        onClick={() => toggleDrawer()}
        className={clsx(
          "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-xs font-medium bg-transparent border-none outline-none",
          "text-primary hover:text-primary/80 transition-colors"
        )}>
        <IoMenu size={22} />
        <span>{t('menu')}</span>
      </button>
    </nav>
  );
};

export default MobileNavbar;
