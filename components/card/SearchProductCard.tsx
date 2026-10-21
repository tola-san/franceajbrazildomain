
import { useUI } from "@/context/ui-context";
import { Product } from "@/types/product";
import { ROUTES } from "@/utils/route";
import { Card, CardBody } from "@heroui/react"
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface Props {
    data: Product
    locale: string;
}



const SearchProductCard: FC<Props> = ({ data, locale }) => {
    const { closeSearchModal } = useUI();
    const { images, imagesAlt, name, description, slug } = data;

    return (
        <Link
            href={`/${locale}${ROUTES.PRODUCTS}/${slug}`}
            onClick={() => {
                closeSearchModal()
            }}
            className="w-full cursor-pointer  relative">
            <Card shadow="none"
                className="border-none w-full hover:bg-gray-100 rounded-2xl transition-all duration-300">
                <CardBody>
                    <div className="flex items-center gap-5">
                        <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                            <Image
                                alt={imagesAlt?.[0] || name}
                                className="object-cover"
                                src={images?.[0] ?? "/images/placeholder-image.jpg"}
                                fill
                                quality={100}
                                sizes="200px"
                            />
                            <div className="absolute inset-0 bg-black/5" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-base md:text-lg font-normal text-primary text-foreground/90">{name}</h3>
                            <p className="text-black font-medium">27 Tons / Container</p>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <span className="sr-only">{name}</span>
        </Link>
    )
}

export default SearchProductCard;