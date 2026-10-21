import Image from "next/image";
import { FC } from "react";

interface Props {
    className?: string;
    image?: string;
    title?: string;
    description?: string;
}

const ProductEmpty: FC<Props> = ({
     className, 
     image ="/images/error/product-empty-1.png",
     title = "No products found",
     description = "We couldn’t find any products that match your search or selected filters."
     }) => {

    return (
        <div className={`flex flex-col justify-center items-center  text-center ${className}`}>
            <div className="relative h-[300px] w-[300px] mb-5">
                <Image src={image} alt="No products found" fill quality={100} className="object-contain select-none pointer-events-none" />
            </div>
            <div className="text-center max-w-sm space-y-2">
                <h2 className="text-xl lg:text-2xl text-primary font-normal capitalize">{title}</h2>
                <p className="text-sm lg:text-base leading-tight">{description}</p>
            </div>

        </div>
    )
}

export default ProductEmpty;