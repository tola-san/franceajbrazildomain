import { ProductPdf } from "@/types/product";
import { useTranslations } from "next-intl";
import { FaRegFilePdf } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";

interface Props {
    data?: ProductPdf[];
}

/** Falls back to the file name in the URL when no display name is set. */
const fileNameFromUrl = (url: string) =>
    decodeURIComponent(url.split("?")[0].split("/").pop() ?? url);

/**
 * Downloadable spec sheets for a product. Each row opens the PDF in a new tab,
 * where the browser's built-in viewer renders it — no `download` attribute, so
 * the file is viewed rather than saved.
 */
export default function ProductPdfList({ data }: Props) {
    const tp = useTranslations('product');
    const pdfs = data ?? [];

    if (pdfs.length === 0) return null;

    return (
        <section aria-labelledby="product-documents-heading" className="my-8 md:my-10 space-y-3">
            <h2 id="product-documents-heading" className="text-base lg:text-lg text-primary">
                {tp('documents_label')}
            </h2>
            <ul className="space-y-2">
                {pdfs.map((pdf) => {
                    const label = pdf.name || fileNameFromUrl(pdf.url);
                    return (
                        <li key={pdf.url}>
                            <a
                                href={pdf.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${label} (PDF${pdf.size ? `, ${pdf.size}` : ''})`}
                                className="group flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/[0.03] px-4 py-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <FaRegFilePdf size={18} className="text-primary" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm lg:text-base font-medium text-primary">
                                        {label}
                                    </span>
                                    <span className="mt-0.5 block text-xs font-medium uppercase tracking-wide text-primary/50">
                                        PDF{pdf.size ? ` · ${pdf.size}` : ''}
                                    </span>
                                </span>
                                <FiExternalLink
                                    size={16}
                                    aria-hidden="true"
                                    className="shrink-0 text-primary/40 transition-colors group-hover:text-primary" />
                            </a>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
