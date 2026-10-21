import "../../styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { fontBricolageGrotesque } from "@/config/fonts";
import NavigateBar from "@/components/navbar/NavigationBar";
import { getResources } from "@/lib/resources";
import { UIProvider } from "@/context/ui-context";
import { hasLocale, NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, getTranslations } from "next-intl/server";
import { Providers } from "../providers";
import Footer from "@/components/footer/Footer";
import SocialMedialCarousel from "@/components/carousel/SocialMedialCarousel";
import GlobalOverlays from "@/components/overlay/GlobalOverlays";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/cart/cart-context";
import FloatingWhatsApp from "@/components/button/FloatingWhatsApp";
import { GoogleAnalytics } from '@next/third-parties/google'
import React from "react";
const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  return {
    title: {
      default: t('title'),
      template: `%s`,
    },
    description: t('description'),
    keywords: t('keywords'),
    icons: {
      icon: "/favicon.ico",
    },
  };
}

const RootLayout: React.FC<Props> = async ({ children, params }) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const message: AbstractIntlMessages = await getMessages();
  // Feeds the navbar's Resources dropdown straight from public/pdf.
  const resources = await getResources(locale);
  const t = await getTranslations({ locale, namespace: 'structuredData' });

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'France AJ Alimentaire And Food Export And Import LTDA',
    alternateName: t('alternateName'),
    url: `${baseUrl}/${locale}`,
    logo: `${baseUrl}/images/logo/logo.png`,
    description: t('description'),
    foundingCountry: 'BR',
    areaServed: t('areaServed'),
    // Verified Brazilian company registration number — a genuine trust signal
    // for AI engines and knowledge graphs.
    taxID: '52.469.135/0001-02',
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'CNPJ',
      value: '52.469.135/0001-02',
    },
    // Full, verifiable certification list (HALAL, SIF, HACCP, ISO 22000, SGS)
    // rather than a single credential — a concrete trust signal AI engines cite.
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: t('hasCertificationName'),
        url: 'https://en.wikipedia.org/wiki/Halal',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'SIF (Serviço de Inspeção Federal) — Brazilian Federal Inspection Service',
        url: 'https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos/animal',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'HACCP — Hazard Analysis and Critical Control Points',
        url: 'https://en.wikipedia.org/wiki/Hazard_Analysis_and_Critical_Control_Points',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'ISO 22000 — Food Safety Management Systems',
        url: 'https://www.iso.org/iso-22000-food-safety.html',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'SGS Inspection',
        url: 'https://www.sgs.com/',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'info@franceajalimentaireandfood.com.br',
      telephone: '+5531910143894',
      availableLanguage: t.raw('contactAvailableLanguages'),
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Eriberto Barros Cajazeiras, Nº 561, Vila do Castelo',
      addressLocality: t('addressLocality'),
      addressRegion: t('addressRegion'),
      postalCode: '04438-090',
      addressCountry: t('addressCountry'),
    },
    sameAs: [
      'https://www.linkedin.com/company/france-aj-holding/',
      'https://x.com/FranceAjHolding',
      'https://www.facebook.com/france.aj.holding/',
      'https://www.instagram.com/france.aj.holding/',
    ],
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/${locale}/#localbusiness`,
    name: 'France AJ Alimentaire And Food Export And Import LTDA',
    description: t('localBusinessDescription'),
    image: `${baseUrl}/images/logo/logo.png`,
    url: `${baseUrl}/${locale}`,
    telephone: '+5531910143894',
    email: 'info@franceajalimentaireandfood.com.br',
    taxID: '52.469.135/0001-02',
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'CNPJ',
      value: '52.469.135/0001-02',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Eriberto Barros Cajazeiras, Nº 561, Vila do Castelo',
      addressLocality: t('addressLocality'),
      addressRegion: t('addressRegion'),
      postalCode: '04438-090',
      addressCountry: t('addressCountry'),
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '12:00',
      },
    ],
    // schema.org openingHours requires the machine format (2-letter day codes,
    // 24h times) — not a human sentence. Day codes are language-independent, so
    // this stays constant across locales. Structured hours live in
    // openingHoursSpecification above; this mirrors them in short form.
    openingHours: ['Mo-Fr 08:00-20:00', 'Sa 08:00-12:00'],
    currenciesAccepted: 'USD',
    paymentAccepted: 'Bank Transfer, Letter of Credit',
    priceRange: '$$$$',
  };

  return (
    <html lang={locale === 'pt-br' ? 'pt-BR' : locale} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={clsx(
          "relative flex flex-col min-h-screen bg-background font-sans antialiased",
          fontBricolageGrotesque.variable
        )}
      >
        <GoogleAnalytics gaId={process.env.GOOGLE_TAG_MANAGER ?? ""} />
        <NextIntlClientProvider messages={message}>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light", forcedTheme: "light" }}>
            <CartProvider>
              <UIProvider>
                <SocialMedialCarousel />
                <NavigateBar resources={resources} />
                <main
                  id="main-content"
                  role="main"
                  className="w-full max-w-[1980px] mx-auto px-0 lg:px-10 xl:px-12 2xl:px-16 4xl:px-0 flex-grow"
                >
                  {children}
                </main>
                <Footer />
                <FloatingWhatsApp />
                <GlobalOverlays />
                <Toaster position="top-right" />
              </UIProvider>
            </CartProvider>
          </Providers>
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </body>
    </html>
  );
}

export default RootLayout
