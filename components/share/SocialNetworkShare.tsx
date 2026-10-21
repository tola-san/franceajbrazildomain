'use client';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaShare, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { addToast } from "@heroui/toast";
import { Spinner } from "@heroui/spinner";
import { Product } from "@/types/product";

type ShareDropdownProps = {
    url: string;
    title?: string;
    className?: string
    data: Product
    locale: string
};

const ShareDropdown = ({ url, title = "Check this out!", className = "min-w-[180px]", data, locale }: ShareDropdownProps) => {
    const [copyText, setCopyText] = useState({
        value: url,
        copied: false,
    });
    useEffect(() => {
        if (copyText.copied) {
            setTimeout(() => {
                setCopyText({
                    ...copyText,
                    copied: false,
                });
            }, 1500);
        }
    }, [copyText]);


    const [pdfLoading, setPdfLoading] = useState(false);
    const handleDownloadPdf = async () => {
        setPdfLoading(true);
        try {
            // Lazy-load the heavy PDF stack (~500kB) only when the user actually
            // downloads, keeping it out of the initial product-page bundle.
            const [{ pdf }, { default: ProductPdfDocument }, { saveAs }] = await Promise.all([
                import("@react-pdf/renderer"),
                import("../pdf/ProductPdfDocument"),
                import("file-saver"),
            ]);
            const blob = await pdf(<ProductPdfDocument data={data} locale={locale} />).toBlob();
            const safe = (data.name || "product").replace(/[^\w\d-_ ]/g, "").replace(/\s+/g, "-");
            saveAs(blob, `${safe}.pdf`);
            addToast({
                title: "PDF generated",
                description: "Downloaded successfully.",
                color: "success",
                classNames: {
                    base: "rounded-[20px] bg-[#D2C8C3] p-3 border border-primary/50 max-w-xl",
                    title: "text-base font-mono text-primary line-clamp-1",
                    description: "text-black line-clamp-2",
                },
            });
        } catch (e: any) {
            addToast({
                title: "PDF error", description: e?.message || "Could not generate PDF.",
                color: "danger",
                classNames: {
                    base: "rounded-[20px] bg-danger/5 p-3 border border-danger/50 max-w-xl",
                    title: "text-base font-mono text-primary line-clamp-1",
                    description: "text-black line-clamp-2",
                },
            });
        } finally {
            setPdfLoading(false);
        }
    };

    return (
        <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
                <Button size="lg" radius="lg" color="primary" variant="bordered" className={`${className} font-mono group  w-full text-base tracking-wider transition-all duration-500`} startContent={<FaShare />} >
                    Share
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Share Options" className="rounded-[50px] w-[300px] xl:w-auto">
                <DropdownItem className="hover:!bg-transparent focus:!bg-transparent active:!bg-transparent" key="share">
                    <div className="relative xl:p-5">
                        <p className="text-base xl:text-lg text-primary font-bold capitalize">Share in social network</p>
                        <p className="text-xs font-medium mt-1 capitalize">To reach the highest traffic view share this product</p>
                        <div className="flex items-center gap-3 mt-5 mb-5">
                            <div
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')}
                                className="flex items-center justify-center bg-primary h-8 w-8 xl:h-10 xl:w-10 rounded-full">
                                <FaFacebookF size={16} className="text-white" />
                            </div>
                            <div
                                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')}
                                className="flex items-center justify-center bg-primary h-8 w-8 xl:h-10 xl:w-10 rounded-full">
                                <FaXTwitter size={16} className="text-white" />
                            </div>
                            <div
                                onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank')}
                                className="flex items-center justify-center bg-primary h-8 w-8 xl:h-10 xl:w-10 rounded-full">
                                <FaLinkedinIn size={16} className="text-white" />
                            </div>
                            <div
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank')}
                                className="flex items-center justify-center bg-primary h-8 w-8 xl:h-10 xl:w-10 rounded-full">
                                <FaWhatsapp size={18} className="text-white" />
                            </div>
                        </div>
                        <p className="text-sm font-medium mt-1 mb-5 capitalize">or download for product pdf</p>
                        <Button
                            onPress={handleDownloadPdf}
                            color="primary"
                            variant="solid"
                            startContent={
                                pdfLoading ? (
                                    <Spinner color="secondary" size="sm" />
                                ) : (
                                    < RiDownloadCloud2Line size={20} />
                                )
                            }
                            className="text-white font-medium">
                            Download Product
                        </Button>
                    </div>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown >
    );
};

export default ShareDropdown;
