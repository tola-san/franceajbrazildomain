import { CartProduct } from "@/types/cart-types"
import { FALLBACK_VARIATION_SUMMARY } from "@/lib/products/variation"
import Image from "next/image"
import { FC } from "react"
import toast from "react-hot-toast"
import { IoClose } from "react-icons/io5"

interface CartAddedToastProps {
    product: CartProduct
    toastId: string
}

const CartAddedToast: FC<CartAddedToastProps> = ({ product, toastId }) => {
    return (
        <div
            className={`animate-enter max-w-md w-full bg-white rounded-[30px] shadow-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1  w-0 p-3">
                <div className="flex items-center  relative">
                    <div className="flex-shrink-0 h-20 w-20 overflow-hidden relative  rounded-2xl">
                        <Image
                            className="object-cover"
                            src={product.image || ''}
                            alt={product.name}
                            fill
                            quality={50}
                        />
                        <div className="absolute inset-0 bg-black/5" />
                    </div>
                    <div className="ml-3 flex-1 mr-10">
                        <h2 className="text-lg !font-normal tracking-wide text-gray-900">{product.name}</h2>
                        <p className="mt-1 font-semibold text-sm text-gray-500">Unit: {product.variation?.summary || FALLBACK_VARIATION_SUMMARY}</p>
                    </div>
                    <div className="absolute top-2 right-2 z-50">
                        <button className="bg-transparent hover:bg-default-100 group rounded-full transition-colors duration-300 p-1" onClick={() => toast.dismiss(toastId)}>
                            <IoClose size={16} className="group-hover:text-danger transition-colors duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CartAddedToast