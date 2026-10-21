'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import React, { useCallback, useMemo, useState } from 'react';
import LanguageSwitcher from '../ui/language-switcher';
import { siteConfig } from '@/config/site';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { GoDotFill } from 'react-icons/go';
import { RiSearch2Line } from "react-icons/ri";
import { Button } from '@heroui/button';
import { useUI } from '@/context/ui-context';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@heroui/tooltip';
import { useCart } from '@/context/cart/cart-context';
import { TbShoppingBag } from 'react-icons/tb';
import Image from 'next/image';
import { IoIosArrowDown } from 'react-icons/io';
import { Badge } from '@heroui/badge';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/utils/route';
import { ResourceFile } from '@/lib/resources';


export const AcmeLogo = () => {
  const router = useRouter();
  return (
    <div
      className="relative h-[80px] w-[200px] xl:w-[250px] cursor-pointer"
      onClick={() => router.push('/')}>
      <Image
        alt="France AJ Alimentaire And Food LTDA And Food Export & Import LTDA logo | B2B wholesale exporter of HALAL frozen beef & chicken, soybean, corns, sugar & edible oils"
        src="/images/logo/franceaj-logo-1.png"
        className="object-contain w-full h-full"
        sizes='300px'
        height={100}
        width={200}
        quality={100}
        loading='eager'
      />
    </div>
  );
};

type SearchIconProps = {
  size?: number;
  strokeWidth?: number;
  width?: number;
  height?: number;
  [key: string]: any;
};

export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}: SearchIconProps) => {

  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

interface NavigateBarProps {
  /** PDFs in public/pdf, read on the server and used to fill the Resources dropdown. */
  resources?: ResourceFile[];
}

export default function NavigateBar({ resources = [] }: NavigateBarProps) {
  const locale: string = useLocale()
  const t = useTranslations('nav');
  const { state, toggleDrawer } = useCart()
  const totalItems = state.totalItems || 0
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openSearchModal } = useUI();
  // Tracks which dropdown is open by nav label — a single shared boolean would
  // open every dropdown at once now that more than one item has subCategories.
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Most dropdowns are static config with translation keys; the Resources one
  // is built from the PDF folder, so its labels are already-final text — the
  // short form, since the full title wraps to three lines in the dropdown.
  const navItems = useMemo(
    () =>
      siteConfig.navItems.map((item) =>
        item.href === ROUTES.RESOURCES && resources.length > 0
          ? {
            ...item,
            subCategories: resources.map((resource) => ({
              label: resource.shortTitle,
              href: `${ROUTES.RESOURCES}?doc=${resource.slug}`,
              isLiteralLabel: true,
            })),
          }
          : item,
      ),
    [resources],
  );

  const isActive = useCallback(
    (path: string) => {
      const currentPath = pathname.split('/').slice(2).join('/');
      const targetPath = path.replace(/^\//, '');
      return currentPath === targetPath;
    },
    [pathname]
  );
  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
      maxWidth="full"
      height={100}
      className="bg-background max-w-[1980px] mx-auto text-primary font-mono tracking-wider font-normal capitalize px-0 lg:px-10 xl:px-16 4xl:px-0  hidden lg:block "
      classNames={{
        wrapper: "!px-0"
      }}>

      <NavbarBrand >
        <AcmeLogo />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex xl:gap-5 2xl:gap-8" justify="start">
        {navItems.map((item) =>
          item.subCategories ? (
            <NavbarItem key={t(item.label)} as="li">
              <Tooltip
                showArrow
                size='lg'
                shadow='none'
                isOpen={openMenu === item.label}
                onOpenChange={(open) => setOpenMenu(open ? item.label : null)}
                classNames={{
                  content: "rounded-[30px] font-medium overflow-hidden p-0 text-primary tracking-wider"
                }}
                content={
                  <div className="relative w-[400px]">
                    <div className='p-5 z-10 relative bg-white'>
                      {item.subCategories.map((sub) => {
                        const subLabel = 'isLiteralLabel' in sub ? sub.label : t(sub.label);
                        return (
                          <div key={sub.href} className='transition-colors hover:bg-default-200 w-full rounded-xl py-2 px-5 flex items-center gap-3 text-lg capitalize font-medium font-mono duration-300'>
                            {isActive(sub.href) && <GoDotFill className="text-primary mt-1" />}
                            <Link className='w-full' aria-label={subLabel} onClick={() => setOpenMenu(null)} href={`${sub.href}`}>{subLabel}</Link>
                          </div>
                        );
                      })}
                    </div>
                    <div className='relative h-[200px] w-full'>
                      <Image
                        src={item.bannerImage ?? '/images/france-aj-banner-sugar.jpg'}
                        alt={t(item.label)}
                        width={400}
                        height={400}
                        loading="lazy"
                        quality={100}
                        sizes="(max-width: 1024px) 100vw, 400px"
                        className='object-cover w-full h-full'
                      />
                      <div className='absolute inset-0 bg-gradient-to-b from-white via-white/50 to-transparent' aria-hidden="true" />
                    </div>
                  </div>
                }>
                <div key={t(item.label)} className='transition-colors group flex items-center gap-3 text-lg duration-300'>
                  {isActive(item.href) && <GoDotFill className="text-primary" />}
                  <Link href={`${item.href}`} aria-label={t(item.label)}>{t(item.label)}</Link>
                  <IoIosArrowDown size={17} className={`transition-transform duration-300 ${openMenu === item.label ? 'rotate-180' : ''}`} />
                </div>
              </Tooltip>
            </NavbarItem>
          ) : (
            <NavbarItem
              key={t(item.label)}
              className="transition-colors flex items-center gap-3 text-lg duration-300">
              {isActive(item.href) && <GoDotFill className="text-primary" />}
              <Link href={`${item.href}`}>{t(item.label)}</Link>
            </NavbarItem>
          )
        )}
      </NavbarContent>
      <NavbarContent className="gap-2" justify="end">
        <NavbarItem>
          <LanguageSwitcher />
        </NavbarItem>
        <NavbarItem>
          <Button isIconOnly aria-label={t('open_search')} color="primary" variant="flat" onPress={openSearchModal}>
            <RiSearch2Line className='text-primary h-5 w-5' />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Tooltip
            content={t('items_for_quotation')}>
            <div className='flex items-center'>
              <Badge as="div" color="primary" classNames={{
                badge: "text-white font-normal font-sans"
              }} content={totalItems}>
                <Button as="div" isIconOnly aria-label={t('open_cart_items_for_quotation')} color="primary" variant="flat" onPress={toggleDrawer}>
                  <TbShoppingBag size={22} className='text-primary' />
                </Button>
              </Badge>
            </div>
          </Tooltip>
        </NavbarItem>
      </NavbarContent>
    </Navbar >
  );
}
