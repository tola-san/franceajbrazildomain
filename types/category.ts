export type CategorySeo = {
     metaTitle: string
     description: string
     keywords: string[]
     openGraph: {
          title: string
          description: string
          image: string
          url: string
          type: string
     }
     twitter: {
          title: string
          image: string
     }
}

export type Category = {
     id: number
     title: string
     slug: string
     description: string
     image: string
     className?: string
     totalProducts?: number
     seo?: CategorySeo
}

export interface CategoryQueryParams {
     page?: number
     limit?: number
     type?: string
     search?: string
     lang: string
     slug?: string

}
