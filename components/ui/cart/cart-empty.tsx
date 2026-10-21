import { Image } from "@heroui/image"
import { FC } from "react"

interface Props {
    title?: string;
    subTitle?: string
    size?: number
}

const CartEmpty: FC<Props> = ({
    size = 250,
    title = "Your cart is empty",
    subTitle = "Find great products and add them to your cart to get started."
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Image
                src="/images/cart-empty-006.png"
                alt='france aj cart empty'
                height={size}
                width={size}
                className='object-contain select-none pointer-events-none' />
            <div className='m-5 text-center max-w-xs space-y-3 select-none'>
                <p className="text-2xl font-mono font-normal text-primary">{title}</p>
                <p className='text-base font-medium leading-tight'>{subTitle}</p>
            </div>

        </div>
    )
}

export default CartEmpty