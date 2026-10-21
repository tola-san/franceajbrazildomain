'use client'

import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react"
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react"
import { FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { siteConfig } from "@/config/site";

// Official WhatsApp brand palette, so the launcher reads as the real thing
// instead of the site's primary colour.
const WHATSAPP_GREEN = '#28B03F';      // brand green (launcher + CTA)
const WHATSAPP_GREEN_DARK = '#209033'; // pressed/hover shade
const WHATSAPP_TEAL = '#075E54';       // classic chat header
const WHATSAPP_BUBBLE = '#FFFFFF';     // incoming message bubble
const WHATSAPP_TEXT = '#111B21';       // message text

export default function WhatsAppButton() {
    const t = useTranslations('whatsapp_float')
    const [isOpen, setIsOpen] = useState(false)
    // Start empty so server and client render the same markup; the live clock
    // is a client-only concern. Seeding this from new Date() caused a
    // hydration mismatch (React error #418: text content did not match).
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const update = () => setTime(new Date().toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }));

        update();
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, []);

    // Single source of truth for the number, same as the product quote button.
    const phoneNumber = siteConfig.links.whatsapp.replace(/\D/g, '');
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(t('default_message'))}`;

    const handleClick = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Popover backdrop="blur" isOpen={isOpen} placement="top-end" onOpenChange={(open) => setIsOpen(open)}>
            <PopoverTrigger>
                <button
                    aria-label={t('aria_label')}
                    className="h-14 w-14 shadow-lg flex items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: WHATSAPP_GREEN }}
                    type="button"
                >
                    <FaWhatsapp className="text-white" size={32} />
                </button>
            </PopoverTrigger>
            <PopoverContent className="relative overflow-hidden rounded-[30px] xl:rounded-[40px] w-[90vw] max-w-[400px] min-h-[350px] p-0 m-0">
                <div className="flex items-center justify-between h-[80px] w-full px-3 py-10" style={{ backgroundColor: WHATSAPP_TEAL }}>
                    <div className="flex gap-3 items-center">
                        <Avatar className="select-none pointer-events-none p-1" size="lg" src="/images/logo/logo-black.png" />
                        <div className="text-white">
                            <p className="text-lg font-bold">{t('support_title')}</p>
                            <p className="text-sm">{t('support_subtitle')}</p>
                        </div>
                    </div>
                    <Button isIconOnly aria-label={t('close_label')} radius="full" size="sm" variant="light" onPress={() => setIsOpen(false)}>
                        <IoClose className="text-white" size={24} />
                    </Button>
                </div>
                <div
                    className="bg-white h-[280px] w-full relative overflow-hidden p-5"
                    style={{
                        backgroundImage: "url('/images/background-whatsapp.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}>
                    <p className="text-center text-xs font-medium">{time}</p>

                    <div
                        className="rounded-xl rounded-tl-none mt-10 inline-block py-2 pl-3 pr-10 shadow-sm"
                        style={{ backgroundColor: WHATSAPP_BUBBLE, color: WHATSAPP_TEXT }}
                    >
                        <p className="text-sm">{t('greeting')}</p>
                        <p className="text-sm">{t('greeting_question')}</p>
                    </div>
                    <div className="absolute bottom-5 left-0 w-full flex justify-center items-center">
                        <Button
                            className="text-white shadow-md data-[hover=true]:opacity-100"
                            size="lg"
                            startContent={<FaWhatsapp className="text-white" size={28} />}
                            style={{ backgroundColor: WHATSAPP_GREEN }}
                            onPress={handleClick}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = WHATSAPP_GREEN_DARK }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = WHATSAPP_GREEN }}
                        >
                            <span className="text-white font-bold text-lg">{t('start_chat')}</span>
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
