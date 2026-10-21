
import { CartAction, CartProduct, CartState } from '@/types/cart-types'
import {
  calculateUniqueItems,
  calculateTotalItems,
  calculateItemTotals,
} from './cart-utils'

export const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalUniqueItems: 0,
  isEmpty: true,
  total: 0
}

export const generateFinalState = (state: CartState, items: CartProduct[]): CartState => {
  const totalUniqueItems = calculateUniqueItems(items)
  return {
    ...state,
    items: calculateItemTotals(items),
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    isEmpty: totalUniqueItems === 0,
  }
}

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find((item) => item.id === action.payload.id)
      let updatedItems: CartProduct[]
      if (existing) {
        updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        updatedItems = [...state.items, action.payload]
      }
      return generateFinalState(state, updatedItems)
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      return generateFinalState(state, updatedItems)
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      )
      return generateFinalState(state, updatedItems)
    }

    case 'RESET_CART': {
      return initialCartState
    }

    default:
      return state
  }
}
