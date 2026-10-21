'use client';

import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@heroui/button';
import Image from 'next/image';

const LANGUAGES = {
  en: {
    label: 'English',
    flag: '/images/country/us.png',
    alt: 'United States flag representing English language',
  },
  'pt-br': {
    label: 'Brazil (PT)',
    flag: '/images/country/br.png',
    alt: 'Brazil flag representing Portuguese language',
  },
} as const;

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.split('/')[1] as keyof typeof LANGUAGES;
  const currentLang = LANGUAGES[currentLocale] || LANGUAGES['en'];

  const handleChange = (keys: string | Set<string>) => {
    const lang = typeof keys === 'string' ? keys : Array.from(keys)[0];

    const segments = pathname.split('/');
    segments[1] = lang;
    const newPath = segments.join('/');

    router.replace(newPath);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          as="div"
          variant="flat"
          color="primary"
          className="capitalize font-medium !min-w-[20px] py-2 px-3 flex text-sm md:text-base items-center gap-2 tracking-wider text-primary"
        >
          <Image
            src={currentLang.flag}
            alt={currentLang.alt}
            width={20}
            height={20}
            quality={80}
            loading='lazy' />
          <span>{currentLang.label}</span>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Language Selector"
        disallowEmptySelection
        selectedKeys={new Set([currentLocale])}
        selectionMode="single"
        onSelectionChange={(keys) =>
          handleChange(typeof keys === 'string' ? keys : new Set(Array.from(keys).map(String)))
        }
      >
        {Object.entries(LANGUAGES).map(([key, { label, flag, alt }]) => (
          <DropdownItem key={key}>
            <div className="flex items-center gap-2 font-mono text-sm md:text-base font-medium tracking-wide text-primary">
              <Image
                src={flag}
                alt={alt}
                width={20}
                height={20}
                loading='lazy'
                quality={80}
                className='object-cover' />
              <span>{label}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
