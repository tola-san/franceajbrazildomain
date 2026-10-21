/**
 * The order options the buyer picked on the product page, carried through the
 * cart into the quotation request so the sales team quotes the right packing.
 */
export interface CartVariation {
  /** Selected packaging, e.g. "20 L" or "Bag 50 kg". */
  package?: string
  /** Selected carton weight, e.g. "15 kg". Carton-packed goods only. */
  weight?: string
  /** Selected container loading, e.g. "40ft Container". Oil and meat only. */
  containerType?: string
  /** Requested bulk tonnage, e.g. "12,500 MT". Bulk goods only. */
  quantity?: string
  /** One-line rendering of the above, shown in the cart, quote page and emails. */
  summary: string
}

export interface CartProduct {
  id: string
  name: string
  unit: string
  quantity: number
  image?: string
  total?: number
  variation?: CartVariation
}

export interface CartState {
  items: CartProduct[]
  totalItems: number
  totalUniqueItems: number
  total: number
  isEmpty: boolean
}

export type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartProduct }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'RESET_CART' }
