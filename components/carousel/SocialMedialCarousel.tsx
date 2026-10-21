'use client'

import Link from "next/link";
import { IoIosMail } from "react-icons/io";
import { BiSolidPhoneCall } from "react-icons/bi";
import { usePathname } from 'next/navigation';
import Marquee from "react-fast-marquee";
const items = [
    {
        title: 'info@franceajalimentaireandfood.com.br',
        to: 'mailto:info@franceajalimentaireandfood.com.br',
        icon: <IoIosMail size={16} />
    },
    {
        title: '(+55) 319 101 438 94',
        to: 'tel:+5531910143894',
        icon: <BiSolidPhoneCall size={16} />
    },
    {
        title: 'info@franceajalimentaireandfood.com.br',
        to: 'mailto:info@franceajalimentaireandfood.com.br',
        icon: <IoIosMail size={16} />
    },
    {
        title: '(+55) 319 101 438 94',
        to: 'tel:+5531910143894',
        icon: <BiSolidPhoneCall size={16} />
    },
    {
        title: 'info@franceajalimentaireandfood.com.br',
        to: 'mailto:info@franceajalimentaireandfood.com.br',
        icon: <IoIosMail size={16} />
    },
    {
        title: '(+55) 319 101 438 94',
        to: 'tel:+5531910143894',
        icon: <BiSolidPhoneCall size={16} />
    },


];


export default function SocialMedialCarousel() {
    const pathname = usePathname();
    const isHomePage = pathname === '/' || /^\/[a-z]{2}(?:-[A-Z]{2})?$/.test(pathname)
    if (!isHomePage) return null;
    return (
        <div className="relative w-full overflow-hidden flex items-center whitespace-nowrap bg-primary text-white py-2">
            <Marquee speed={100} pauseOnHover gradientColor="#311911" className="max-w-[1980px] mx-auto">
                {items.map((item, index) => (
                    <Link
                        key={index}
                        href={item.to}
                        className="flex items-center gap-2 px-12 text-sm text-white hover:text-gray-300 transition-colors">
                        {item.icon}
                        <span>{item.title}</span>
                    </Link>
                ))}
            </Marquee>
        </div>
    )
}