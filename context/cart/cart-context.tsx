"use client"

import { CartAction, CartState } from "@/types/cart-types";
import { createContext, ReactNode, useContext, useReducer, useState } from "react";
import { cartReducer, initialCartState } from "./cart-reducer";
import useLocalStorage from "react-use/lib/useLocalStorage";


const STORAGE_KEY = process.env.STORAGE_CART_KEY || 'cart_state'

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalUniqueItems: 0,
  total: 0,
  isEmpty: true,
}



const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  isOpen: boolean
  toggleDrawer: () => void
}>({
  state: initialState,
  dispatch: () => null,
  isOpen: false,
  toggleDrawer: () => null,
})


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [storedCart, setStoredCart] = useLocalStorage<CartState>(STORAGE_KEY, initialCartState)
  const [state, dispatchBase] = useReducer(cartReducer, storedCart || initialCartState)
  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = () => setIsOpen((prev) => !prev)

  const dispatch: typeof dispatchBase = (action) => {
    const newState = cartReducer(state, action)
    setStoredCart(newState)
    dispatchBase(action)
  }

  return (
    <CartContext.Provider value={{ state, dispatch, isOpen, toggleDrawer }}>
      {children}
    </CartContext.Provider>
  )

}

export const useCart = () => useContext(CartContext)