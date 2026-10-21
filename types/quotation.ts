import { CartProduct } from "./cart-types"
import { EmailForm } from "./contact"

export type SendQuotationBody ={
    products: CartProduct[]
    contact: EmailForm
}