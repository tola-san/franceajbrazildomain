import { ROUTES } from '@/utils/route';
import { Button } from '@heroui/button';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { IoIosMail } from 'react-icons/io';

const NewsletterSection = () => {
    const locale: string = useLocale();
    const t = useTranslations('newsletter');
    return (
        <section
            className="relative w-full h-[550px] overflow-hidden rounded-[30px] lg:rounded-[50px] mt-20 lg:mt-40 mb-10 hidden lg:block"
            aria-labelledby="newsletter-heading"
        >
            <Image
                src="/images/banners/banner-contact-us-home.jpg"
                alt={t('title')}
                fill
                priority={false}
                sizes='(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 70vw'
                className="object-cover object-bottom"
            />
            <div className="absolute inset-0 p-20 flex flex-col justify-center">
                <div className="max-w-3xl space-y-5 relative">
                    <h2
                        id="newsletter-heading"
                        className="text-2xl lg:text-6xl text-primary font-bold tracking-wide whitespace-pre-line"
                    >
                        {t('title')}
                    </h2>
                    <p className="text-lg leading-tight">
                        {t('description')}
                    </p>
                </div>
                <div className="relative mt-10 flex gap-5">
                    <Button
                        as={Link}
                        href={`/${locale}${ROUTES.CONTACT_US}`}
                        size="lg"
                        color="primary"
                        startContent={<IoIosMail size={20} />}
                        className="text-white font-mono font-normal tracking-wider"
                        aria-label={t('contact_us_now')}
                    >
                        {t('contact_us_now')}
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
