import { ROUTES } from '@/utils/route'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
     name: 'France AJ Alimentaire And Food LTDA | Premium B2B Wholesale Food Export',
     description:
          'France AJ Alimentaire And Food LTDA is a leading B2B wholesale export partner for premium Brazilian food products. We specialize in HALAL-certified frozen meats, sugar, grains, and vegetable oils for global markets.',
     navItems: [
          {
               label: 'home',
               href: ROUTES.HOME,
          },
          {
               label: 'products',
               href: ROUTES.PRODUCTS,
               bannerImage: '/images/france-aj-banner-sugar.jpg',
               subCategories: [
                    {
                         label: 'icumsa_sugar',
                         href: '/categories/icumsa-sugar',
                    },
                    {
                         label: 'frozen_chicken',
                         href: '/categories/frozen-chicken',
                    },
                    {
                         label: 'frozen_lamb',
                         href: '/categories/frozen-lamb',
                    },
                    {
                         label: 'frozen_beef',
                         href: '/categories/frozen-beef',
                    },

                    {
                         label: 'corn',
                         href: '/categories/corn',
                    },
                    {
                         label: 'soy_beans',
                         href: '/categories/soy-beans',
                    },
                    {
                         label: 'oils',
                         href: '/categories/oils',
                    },
                    {
                         label: 'animal_feed',
                         href: '/categories/animal-feed',
                    },
                    {
                         label: 'rice',
                         href: '/categories/rice',
                    },
                    {
                         label: 'fertilizers',
                         href: '/categories/fertilizers',
                    },
                    {
                         label: 'nuts_sweeteners',
                         href: '/categories/nuts-sweeteners',
                    },
               ],
          },
          {
               label: 'fertilizers',
               href: '/categories/fertilizers',
               bannerImage: '/images/products/fertilizer/fertilizer-banner.webp',
               subCategories: [
                    {
                         label: 'sulfur_granular',
                         href: '/products/granular-sulphur-rotterdam',
                    },
                    {
                         label: 'urea_granular_prilled',
                         href: '/products/urea-granular-prilled-46-rotterdam',
                    },
               ],
          },
          {
               label: 'about_us',
               href: ROUTES.ABOUT_US,
          },
          {
               label: 'blog',
               href: ROUTES.BLOGS,
          },
          {
               // Its dropdown is filled at runtime from the PDFs in public/pdf.
               label: 'resources',
               href: ROUTES.RESOURCES,
               bannerImage: '/images/france-aj-banner-sugar.jpg',
          },
          {
               label: 'contact_us',
               href: ROUTES.CONTACT_US,
          },
     ],
     navMenuItems: [],
     links: {
          linkedin: 'https://www.linkedin.com/company/france-aj-holding/',
          twitter: 'https://x.com/FranceAjHolding',
          facebook: 'https://www.facebook.com/france.aj.holding/',
          instagram: 'https://www.instagram.com/france_aj_alimentaire/',
          whatsapp: 'https://wa.me/5531910143894',
     },
}
