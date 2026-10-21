import { useTranslations } from "next-intl";
import { Divider } from "@heroui/react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ROUTES } from "@/utils/route";

export default function Footer() {
    const t = useTranslations('nav');
    return (
        <footer className="bg-white lg:rounded-t-[50px]">
            <div className="mx-auto px-5 lg:px-10 2xl:px-20 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-sm text-left py-10  lg:py-20">
                    {/* Company Info */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col items-center xl:items-start xl:text-start text-center">
                        <Logo />
                        <address className="not-italic max-w-md mt-5 text-sm lg:text-base font-medium">
                            <p>
                                <span className="font-bold">CNPJ:</span> 52.469.135/0001-02
                            </p>
                            <p>
                                <span className="font-bold">Address:</span> Eriberto Barros Cajazeiras, Nº 561, Bairro: Vila do Castelo, São Paulo /SP - Brasil - CEP: 04.438-090
                            </p>
                        </address>
                    </div>

                    {/* Contact Help */}
                    <nav className="col-span-6 lg:col-span-2" aria-label="Contact help">
                        <h3 className="text-primary mb-5 text-lg lg:text-2xl font-medium">Contact help</h3>
                        <ul className="space-y-3">
                            <li className="font-semibold group text-sm lg:text-base">
                                <Link href={ROUTES.CONTACT_US}>Contact us</Link>
                            </li>
                            <li className="font-semibold group text-sm lg:text-base">
                                <a href="tel:+5531910143894">(+55) 31 91014-3894</a>
                            </li>
                            <li className="font-semibold group text-sm lg:text-base">
                                <a href="mailto:info@franceajalimentaire.com">info@franceajalimentaire.com</a>
                            </li>
                        </ul>
                    </nav>

                    {/* Company */}
                    <nav className="col-span-6 lg:col-span-2 pl-5 lg:pl-10" aria-label="Company">
                        <h3 className="text-primary mb-5 text-lg lg:text-2xl font-medium">Company</h3>
                        <ul className="space-y-3">
                            <li className="font-semibold group text-sm lg:text-base">
                                <Link href={ROUTES.HOME}>Home</Link>
                            </li>
                            <li className="font-semibold group text-sm lg:text-base">
                                <Link href={ROUTES.BLOGS}>Blogs</Link>
                            </li>
                            <li className="font-semibold group text-sm lg:text-base">
                                <Link href={ROUTES.ABOUT_US}>About us</Link>
                            </li>
                            <li className="font-semibold group text-sm lg:text-base">
                                <Link href={ROUTES.PRODUCTS}>Products</Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Categories */}
                    <nav className="col-span-6 lg:col-span-2 lg:pl-5" aria-label="Categories">
                        <h3 className="text-primary mb-5 text-lg lg:text-2xl font-medium">Categories</h3>
                        <ul className="space-y-3">
                            <li className="font-semibold text-sm lg:text-base group">
                                <Link href="/products/sugar">Sugar</Link>
                            </li>
                            <li className="font-semibold text-sm lg:text-base group">
                                <Link href="/products/frozen-beef">Frozen Beef</Link>
                            </li>
                            <li className="font-semibold text-sm lg:text-base group">
                                <Link href="/products/frozen-chicken">Frozen Chicken</Link>
                            </li>
                            <li className="font-semibold text-sm lg:text-base group">
                                <Link href="/products/frozen-lamb">Frozen Lamb</Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Legal */}
                    <nav className="col-span-6 lg:col-span-2 pl-5 lg:pl-10" aria-label="Legal">
                        <h3 className="text-primary mb-5 text-lg lg:text-2xl font-medium">Legal</h3>
                        <ul className="space-y-3">
                            <li className="font-semibold text-sm lg:text-base group">
                                <Link href={ROUTES.ABOUT_US}>About us</Link>
                            </li>
                            <li className="font-semibold text-sm lg:text-base group">
                                <Link href={ROUTES.CONTACT_US}>Contact us</Link>
                            </li>
                            <li className="font-semibold text-sm lg:text-base group">
                                <Link href={ROUTES.PRIVACY_POLICY}>Privacy Policy</Link>
                            </li>
                            <li className="font-semibold text-sm lg:text-base group">
                                <Link href={ROUTES.TERMS_AND_CONDITIONS}>Terms & Condition</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <Divider />
                <div className="p-10 mb-10 lg:mb-0 text-sm text-center text-primary font-semibold">
                    <p>
                        Copyright © 2023 France AJ Alimentaire And Food LTDA.
                        All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

// Logo component
export const Logo = () => {
    return (
        <Link href="/" className="relative cursor-pointer" aria-label="France AJ Alimentaire And Food LTDA Home">
            <Image
                alt="France AJ Alimentaire And Food LTDA logo"
                src="/images/logo/franceaj-logo-1.png"
                className="object-contain"
                height={90}
                width={250}
                priority
            />
        </Link>
    );
};
