import { BaseResponse } from '@/types/base-response'
import { Product, ProductQueryParams } from '@/types/product'

/**
 * A product is displayed unless it is explicitly marked `inactive`.
 * Products with `status: 'active'` or no status field at all remain visible,
 * so this stays backward-compatible with catalogs that predate the field
 * (e.g. products-br.json). Set `status: 'inactive'` to hide a product.
 */
export const isProductActive = (product: Product): boolean => product.status !== 'inactive'

export async function getAllProducts(
     products: Product[],
     options: ProductQueryParams,
): Promise<BaseResponse<Product[]>> {
     const { page = 1, limit = 12, category, type, tags, search, sort, random } = options

     let baseFiltered = products.filter(isProductActive)

     if (category?.length) {
          baseFiltered = baseFiltered.filter((p) => category.includes(p.category))
     }

     if (type) {
          baseFiltered = baseFiltered.filter((p) => p.type === type)
     }

     if (search) {
          const keyword = search.toLowerCase()
          baseFiltered = baseFiltered.filter((p) => p.name.toLowerCase().includes(keyword))
     }

     if (sort) {
          switch (sort) {
               case 'a-z':
                    baseFiltered = [...baseFiltered].sort((a, b) => a.name.localeCompare(b.name))
                    break
               case 'z-a':
                    baseFiltered = [...baseFiltered].sort((a, b) => b.name.localeCompare(a.name))
                    break
          }
     }

     const tagSet = new Set<string>()
     baseFiltered.forEach((p) => {
          if (Array.isArray(p.tags)) {
               p.tags.forEach((tag) => tagSet.add(tag.toLowerCase().replace(/\s+/g, '-')))
          }
     })
     const uniqueTags = Array.from(tagSet)

     let finalFiltered = baseFiltered
     if (tags?.length) {
          finalFiltered = finalFiltered.filter(
               (p) =>
                    Array.isArray(p.tags) &&
                    p.tags.some((tag) => tags.includes(tag.toLowerCase().replace(/\s+/g, '-'))),
          )
     }

     if (random) {
          finalFiltered = finalFiltered
               .map((item) => ({ item, rand: Math.random() }))
               .sort((a, b) => a.rand - b.rand)
               .map(({ item }) => item)
     }

     const total = finalFiltered.length
     const lastPage = Math.max(1, Math.ceil(total / limit))
     const currentPage = Math.max(1, Math.min(page, lastPage))
     const start = (currentPage - 1) * limit
     const paginatedData = finalFiltered.slice(start, start + limit)

     return {
          message: 'Get Products successfully',
          data: paginatedData,
          total,
          result: paginatedData.length,
          uniqueTags,
          paginatorInfo: {
               currentPage,
               lastPage,
               total,
               perPage: limit,
               nextPageUrl:
                    currentPage < lastPage
                         ? `/api/products?page=${currentPage + 1}&limit=${limit}`
                         : null,
               prevPageUrl:
                    currentPage > 1 ? `/api/products?page=${currentPage - 1}&limit=${limit}` : null,
          },
     }
}
