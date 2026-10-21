import { FaqSchema } from "@/types/product";

interface Props {
    data?: FaqSchema;
}

/**
 * Renders the product's `faqSchema` as visible on-page content. The same data is
 * emitted as FAQPage JSON-LD by the product route, and Google requires that
 * markup to mirror text the visitor can actually see.
 */
export default function ProductFaq({ data }: Props) {
    const questions = data?.mainEntity ?? [];

    if (questions.length === 0) return null;

    return (
        <ol className="list-decimal space-y-5 pl-5 marker:text-primary">
            {questions.map((item, idx) => (
                <li key={idx} className="pl-1">
                    <h3 className="text-base lg:text-xl font-normal text-primary">
                        {item.name}
                    </h3>
                    <p className="mt-1 text-sm lg:text-base text-black">
                        {item.acceptedAnswer.text}
                    </p>
                </li>
            ))}
        </ol>
    );
}
