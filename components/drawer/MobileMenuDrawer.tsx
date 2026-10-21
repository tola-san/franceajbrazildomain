'use client';

import { useUI } from "@/context/ui-context";
import { Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@heroui/react";
import { IoClose } from "react-icons/io5";
import LanguageSwitcher from "../ui/language-switcher";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const MobileMenuDrawer = () => {
    const { isDrawerOpen, toggleDrawer } = useUI();
    const t = useTranslations('nav');
    const pathname = usePathname();
    const isActive = useCallback(
        (path: string) => {
            const currentPath = pathname.split('/').slice(2).join('/');
            const targetPath = path.replace(/^\//, '');
            return currentPath === targetPath;
        },
        [pathname]
    );
    return (
        <Drawer
            isOpen={isDrawerOpen}
            hideCloseButton
            size="sm"
            classNames={{
                base: "data-[placement=left]:sm:m-2 data-[placement=right]:sm:m-2 rounded-none sm:rounded-3xl",
            }}
            placement="left"
            motionProps={{
                variants: {
                    enter: {
                        opacity: 1,
                        x: 0,
                        transition: {
                            duration: 0.3,
                        },
                    },
                    exit: {
                        x: -100,
                        opacity: 0,
                        transition: {
                            duration: 0.3,
                        },
                    },
                },
            }}
            onOpenChange={toggleDrawer}>
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            <div className="flex justify-between items-center gap-1 w-full mt-2">
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

                                <Button aria-label={t('close')} size="sm" className='bg-primary/20 hover:!bg-primary group transition-all duration-300' isIconOnly radius="full" variant="light"
                                    onPress={toggleDrawer}>
                                    <IoClose size={20} className="text-primary group-hover:text-white transition-all duration-300" />
                                </Button>
                            </div>
                            <Divider className="mt-3" />
                        </DrawerHeader>
                        <DrawerBody>
                            {siteConfig.navItems.map((item, idx) => (
                                <>
                                    <Link
                                        key={t(item.label)}
                                        type="button"
                                        href={`${item.href}`}
                                        onClick={() => {
                                            toggleDrawer();
                                        }}
                                        aria-label={t(item.label)}
                                        className={`transition-colors flex w-full items-center font-mono gap-3 text-base tracking-wider duration-300 px-3 text-left ${isActive(item.href) && 'bg-primary/5 text-primary rounded-xl px-3 py-2'}`}>
                                        <span className="w-full">{t(item.label)}</span>
                                    </Link>
                                    {item.subCategories != null && item.subCategories?.map((subItem, subIdx) => (
                                        <Link
                                            key={t(subItem.label)}
                                            href={`${subItem.href}`}
                                            onClick={() => {
                                                toggleDrawer();
                                            }}
                                            aria-label={t(subItem.label)}
                                            className={`transition-colors flex w-full items-center font-mono gap-3 text-base tracking-wider duration-300 px-3 text-left ${isActive(item.href) && 'bg-primary/5 text-primary rounded-xl px-3 py-2'}`}>
                                            <span className="w-full">{t(subItem.label)}</span>
                                        </Link>
                                    ))}
                                </>
                            ))}
                        </DrawerBody>
                        <DrawerFooter className="flex justify-between gap-3 w-full">
                            <div className="flex flex-col gap-3 w-full">
                                <Divider className="mb-3 w-full" />
                                <div>
                                    <LanguageSwitcher />
                                </div>
                            </div>

                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
export default MobileMenuDrawer;

