
import ContactForm from "@/components/contact/ContactForm";
import ContactHeader from "@/components/contact/ContactHeader";
import Breadcrumb from "@/components/ui/Breadcrumbs";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";



export default function ContactPageContent() {
    const t = useTranslations('contact_page')
    const locale = useLocale()

    const breadcrumbItems = [
        { label: t('home'), href: `/${locale}` },
        { label: t("contact_us"), isCurrent: true },
    ];


    return (
        <div className="container mx-auto">
            <ContactHeader />
            <div className="hidden lg:block">
                <div className="relative flex flex-col items-center justify-center mb-10 xl:mb-20 xl:mt-5">
                    <h1 className="text-3xl lg:text-6xl text-primary lg:font-bold tracking-wide mb-5">{t('contact_us')}</h1>
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-5 mt-10 mb-20">
                <div className="col-span-12 lg:col-span-7 min-h-[300px] relative overflow-hidden bg-white rounded-[30px] xl:rounded-[50px] p-8 xl:p-16">
                    <div className="space-y-5 max-w-xl mb-20">
                        <h2 className="text-2xl 2xl:text-5xl">{t('get_in_touch')}</h2>
                        <p className="text-base lg:text-lg font-medium">{t('get_in_touch_desc')}</p>
                    </div>
                    <ContactForm />
                </div>
                <div className="col-span-12 lg:col-span-5 ">
                    <div className="bg-primary sticky top-32 rounded-[30px] xl:rounded-[50px] overflow-hidden flex flex-col justify-center gap-y-10 text-white p-8 xl:p-16">
                        <div className="space-y-5">
                            <h2 className="text-2xl lg:text-4xl">{t('address')}</h2>
                            <p className="text-md lg:text-lg font-medium">Eriberto Barros Cajazeiras, Nº 561, Bairro: Vila do Castelo, São Paulo /SP - Brasil - CEP: 04.438-090</p>
                        </div>
                        <div className="space-y-5">
                            <h2 className="text-2xl lg:text-4xl">CNPJ</h2>
                            <p className="text-md lg:text-lg font-medium">52.469.135/0001-02</p>
                        </div>
                        <div className="space-y-5">
                            <h2 className="text-2xl lg:text-4xl">{t('phone_number')}</h2>
                            <div>
                                <a href="tel:+5531910143894" className="text-md lg:text-lg font-medium">(+55) 31 91014-3894</a>
                            </div>

                        </div>
                        <div className="space-y-5">
                            <h2 className="text-2xl lg:text-4xl">{t('email_address')}</h2>
                            <div>
                                <a href="mailto:info@franceajalimentaireandfood.com.br" className="text-md lg:text-lg font-medium">info@franceajalimentaireandfood.com.br</a>
                            </div>
                        </div>
                        <div className="absolute -left-20 top-10  h-[400px] w-[400px] z-10">
                            <Image
                                src="/images/sugar-cane.png"
                                alt="Sugarcane illustration — ICUMSA sugar supply | France AJ Alimentaire And Food LTDA – Food Export & Import LTDA"
                                width={800}
                                height={800}
                                quality={100}
                                loading="eager"
                                decoding="async"
                                className="opacity-5 scale-x-[-1] grayscale-0 w-full h-full"
                            />
                        </div>

                        <div className="absolute -right-10 -bottom-24  h-[350px] w-[350px] z-10">
                            <Image
                                src="/images/sugar-icon-001.png"
                                alt="Sugar crystals icon — ICUMSA 45/150 supplier | France AJ Alimentaire And Food LTDA (B2B wholesale)"
                                width={800}
                                height={800}
                                quality={100}
                                loading="eager"
                                decoding="async"
                                className="opacity-10 grayscale-0 object-contain"
                            />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}