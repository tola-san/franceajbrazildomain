"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useTranslations } from "next-intl";

/** Appended to every certification alt text so image search ties each badge to the company. */
const COMPANY_NAME = 'France AJ Alimentaire And Food LTDA';

/** Each key maps to `our_certifications.logos.<key>` in the message catalogs. */
const logos = [
  { key: 'iso_22000', src: '/images/certificate/22000.png' },
  { key: 'bonsucro', src: '/images/certificate/bon-sucro.png' },
  { key: 'control_union', src: '/images/certificate/control.png' },
  { key: 'enplus', src: '/images/certificate/en-plus.png' },
  { key: 'fda', src: '/images/certificate/fda.png' },
  { key: 'fssc_22000', src: '/images/certificate/fssc.png' },
  { key: 'gacc', src: '/images/certificate/gacc-association.png' },
  { key: 'halal_brazil', src: '/images/certificate/halal-brazil.png' },
  { key: 'icc', src: '/images/certificate/international-chamber.png' },
  { key: 'iso_9001_2015', src: '/images/certificate/iso-9001-2015.png' },
  { key: 'iso_9001', src: '/images/certificate/iso-9001.png' },
  { key: 'kosher', src: '/images/certificate/k.png' },
  { key: 'accredited_body', src: '/images/certificate/logo.png' },
  { key: 'nsf', src: '/images/certificate/nsf.png' },
  { key: 'sedex', src: '/images/certificate/sedex.png' },
];

export default function PartnerCarousel() {
  const t = useTranslations('our_certifications');

  /** Localized alt/title per logo, with the company name appended to alt for image SEO. */
  const items = logos.map((logo) => ({
    src: logo.src,
    alt: `${t(`logos.${logo.key}.alt`)} - ${COMPANY_NAME}`,
    title: t(`logos.${logo.key}.title`),
  }));

  return (
    <section
      className="relative w-full bg-transparent py-8"
      aria-label={t('carousel_label')}
    >
      <Marquee pauseOnHover gradient speed={80} gradientWidth={50} gradientColor="#FAF4F0">
        {items.map((logo, index) => (
          <figure key={`logo-marquee-1-${index}`} className="relative size-32 md:size-48 mx-2 lg:mx-3">
            <Image
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              fill
              priority={false}
              sizes="(max-width: 768px) 150px, (max-width: 1200px) 200px, 250px"
              className="object-contain hidden lg:block bg-white p-4 lg:p-8 rounded-[25px] xl:rounded-[40px] select-none pointer-events-none"
            />
            <Image
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              fill
              priority={false}
              sizes="(max-width: 768px) 150px, (max-width: 1200px) 200px, 250px"
              className="object-contain bg-white p-4 lg:p-8 rounded-[25px] xl:rounded-[40px] lg:hidden select-none pointer-events-none"
            />
            <figcaption className="sr-only">{logo.title}</figcaption>
          </figure>
        ))}
      </Marquee>

      <Marquee
        pauseOnHover
        direction="right"
        className="mt-5 lg:mt-10"
        speed={80}
        gradientWidth={50}
        gradient
        gradientColor="#FAF4F0"
      >
        {items.map((logo, index) => (
          <figure key={`logo-marquee-2-${index}`} className="relative size-32 md:size-48 mx-2 lg:mx-3 ">
            <Image
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              fill
              priority={false}
              sizes="(max-width: 768px) 150px, (max-width: 1200px) 200px, 250px"
              className="object-contain hidden lg:block bg-white p-4 lg:p-8 rounded-[25px] xl:rounded-[40px] select-none pointer-events-none"
            />
            <Image
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              fill
              priority={false}
              sizes="(max-width: 768px) 150px, (max-width: 1200px) 200px, 250px"
              className="object-contain bg-white p-4 lg:p-8 rounded-[25px] xl:rounded-[40px] lg:hidden select-none pointer-events-none"
            />
            <figcaption className="sr-only">{logo.title}</figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}
