import { CartProduct } from "@/types/cart-types"


export const calculateUniqueItems = (items: CartProduct[]) => items.length

export const calculateTotalItems = (items: CartProduct[]) =>
  items.reduce((total, item) => total + item.quantity, 0)

export const calculateItemTotals = (items: CartProduct[]) =>
  items.map((item) => ({
    ...item,
    total: item.quantity, 
  }))
