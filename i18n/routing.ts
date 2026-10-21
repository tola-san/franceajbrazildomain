import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
     locales: ['en', 'pt-br'],

     defaultLocale: 'en',

     // Suppress next-intl's auto Link-header alternates (which emit lowercase
     // hreflang="pt-br"). Each page's metadata already renders the canonical
     // <link rel="alternate" hreflang="pt-BR"> + x-default tags in the HTML head.
     alternateLinks: false,
})

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);