import { useCart } from "@/context/cart/cart-context"
import { useUI } from "@/context/ui-context"
import { Product } from "@/types/product"
import { ROUTES } from "@/utils/route"
import { Button } from "@heroui/button"
import { Spinner } from "@heroui/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { FaOpencart } from "react-icons/fa6"
import { ElementType } from "react"
import CustomHeaderTag from "../ui/CustomHeaderTag"
import CartAddedToast from "../toast/CartAddedToast"
import { buildCartLineId, getDefaultSelection, toCartVariation } from "@/lib/products/variation"

interface Props {
    product: Product
    className?: string
    headerTag?: ElementType
};

const ProductCard = ({ product, className = "w-full", headerTag = "h3" }: Props) => {
    const { openGetQuotation } = useUI();
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const { dispatch } = useCart()

    const { id, name, images, imagesAlt, slug, category, variation } = product


    const handleClick = ({ slug }: { slug: string }) => {
        router.push(`${ROUTES.PRODUCTS}/${slug}`);
    }

    const handleAddToCart = () => {
        setLoading(true)
        // No selectors on the card, so the product's first packing option is used.
        const defaultVariation = toCartVariation(getDefaultSelection(variation), variation)
        const cartItem = {
            id: buildCartLineId(id, defaultVariation),
            name,
            unit: String(id),
            quantity: 1,
            image: images?.[0] ?? "/images/placeholder-image.jpg",
            variation: defaultVariation,
        }
        setTimeout(() => {
            dispatch({ type: 'ADD_TO_CART', payload: cartItem })
            setLoading(false)
            toast.custom((t) => <CartAddedToast toastId={t.id} product={cartItem} />, { position: "top-right" })
        }, 500)
    }

    return (
        <div className={`${className} relative min-h-[500px] overflow-hidden rounded-[30px] lg:rounded-[50px] bg-white p-2 lg:p-4`}>
            <div className="relative rounded-[25px] lg:rounded-[40px] overflow-hidden w-full h-[250px]  2xl:h-[300px] 3xl:h-[40vh]">
                <Image
                    src={images?.[0] ?? "/images/placeholder-image.jpg"}
                    alt={imagesAlt?.[0] || name}
                    className={`${category === "chicken" ? "object-contain" : "object-cover"} select-none pointer-events-none`}
                    fill
                    loading="eager"
                    quality={100} />
                {category === "chicken" && <div className="absolute inset-0 bg-black/5" />}
            </div>
            <div className="px-3 lg:px-5">
                <CustomHeaderTag as={headerTag} className="text-2xl lg:text-2xl 2xl:text-3xl text-primary line-clamp-1 mt-5 text-balance">{name}</CustomHeaderTag>
                <div className="flex items-center mt-10 mb-5 gap-3">
                    <Button
                        onPress={handleAddToCart}
                        color="primary"
                        className="font-mono tracking-wider text-white"
                        startContent={loading ? <Spinner color="default" size="sm" /> : <FaOpencart size={20} />}>
                        {loading ? 'Adding...' : 'Add to Cart'}
                    </Button>
                    <Button onPress={() => handleClick({ slug: slug })} color="primary" variant="bordered" className="font-mono group  tracking-wider transition-all duration-500" >
                        Read More
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default ProductCard