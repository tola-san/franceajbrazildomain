
"use client"
import { useCart } from "@/context/cart/cart-context";
import { CartVariation } from "@/types/cart-types";
import { buildCartLineId } from "@/lib/products/variation";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { useState } from "react";
import { TbShoppingBag } from "react-icons/tb";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  unit?: string;
  image: string;
  thumbnail: string;
  /** Default packing for the product — the grid has no selectors of its own. */
  variation?: CartVariation;
}

const AddToCartButton = ({
  productId,
  name,
  unit,
  image,
  thumbnail,
  variation,
}: AddToCartButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }

    setTimeout(() => {
      dispatch({
        type: "ADD_TO_CART",
        payload: {
          id: buildCartLineId(productId, variation),
          name,
          unit: unit || "",
          quantity: 1,
          image,
          variation,
        },
      });
      setLoading(false);

      addToast({
        title: name,
        description: "You’ve successfully added this item to your cart.",
        color: "success",
        severity: "success",
        icon: (
          <Image
            src={thumbnail}
            alt={name}
            title={name}
            height={70}
            width={70}
            loading="lazy"
            className="object-cover"
          />
        ),
        classNames: {
          base: "rounded-[20px] bg-[#D2C8C3] p-3 border border-primary/50 max-w-xl",
          title: "text-base font-mono text-primary line-clamp-1",
          description: "text-black line-clamp-2",
          icon: "size-20 overflow-hidden rounded-xl",
          closeIcon: "bg-[#D2C8C3]",
        },
      });
    }, 500);
  };

  return (
    <Button
      size={typeof window !== "undefined" && window.innerWidth < 1024 ? "sm" : "md"}
      onClick={handleAddToCart}
      color="primary"
      variant="bordered"
      className="font-mono tracking-wide border-1.5 xl:border-2 text-md rounded-br-2xl lg:rounded-br-3xl hover:rounded-br-xl !transition-all !duration-400"
      isIconOnly
      aria-label={`Add ${name} to cart`}
      startContent={
        loading ? (
          <Spinner className="text-white" size="sm" />
        ) : (
          <TbShoppingBag
            size={
              typeof window !== "undefined" && window.innerWidth < 1024 ? 18 : 20
            }
          />
        )
      }
    />
  );
};

export default AddToCartButton;
