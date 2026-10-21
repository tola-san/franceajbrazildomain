import { Category } from "./category";
import { Product } from "./product";


export interface HomePage {
    categories: Category[]
    collections: Collection[]
}

export interface Collection {
    id: number
    slug: string
    name: string
    description?: string
    subCollections: SubCollection[]
}

export interface SubCollection {
    id: number
    slug: string
    name: string
    description?: string
    /** Where the banner's "see all" button sends the visitor. */
    href?: string
    /** Message key under `home_product` for that button's label. */
    cta?: string
    banner?: {
        title: string
        description: string
        image: string
    }
    products: Product[]
}