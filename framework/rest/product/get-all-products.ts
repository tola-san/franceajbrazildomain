import { BaseResponse } from '@/types/base-response'
import { Product, ProductQueryParams } from '@/types/product'
import { useQuery } from '@tanstack/react-query'

const getProducts = async (options: ProductQueryParams): Promise<BaseResponse<Product[]>> => {
     const { page = 1, limit = 10, category, type, tags, search, lang } = options

     try {
          const url = lang === 'pt-br' ? '/api/products-br.json' : '/api/products.json'
          const response = await fetch(url)
          const products: Product[] = await response.json()

          let baseFiltered = products

          // Apply filters
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

          if (options.sort) {
               switch (options.sort) {
                    case 'a-z':
                         baseFiltered = baseFiltered.sort((a, b) => a.name.localeCompare(b.name))
                         break
                    case 'z-a':
                         baseFiltered = baseFiltered.sort((a, b) => b.name.localeCompare(a.name))
                         break
               }
          }

          // ✅ STEP 2: Extract unique tags BEFORE filtering by tags
          const tagSet = new Set<string>()
          baseFiltered.forEach((p) => {
               if (Array.isArray(p.tags)) {
                    p.tags.forEach((tag) => tagSet.add(tag.toLowerCase().replace(/\s+/g, '-')))
               }
          })
          const uniqueTags = Array.from(tagSet)

          // ✅ STEP 3: Now apply tag filters (optional)
          let finalFiltered = baseFiltered

          if (tags?.length) {
               finalFiltered = finalFiltered.filter(
                    (p) =>
                         Array.isArray(p.tags) &&
                         p.tags.some((tag) => {
                              const tagSlug = tag.toLowerCase().replace(/\s+/g, '-')
                              return tags.includes(tagSlug)
                         }),
               )
          }

          if (options.random) {
               finalFiltered = finalFiltered
                    .map((item) => ({ item, rand: Math.random() }))
                    .sort((a, b) => a.rand - b.rand)
                    .map(({ item }) => item)
          }

          const total = finalFiltered.length
          const lastPage = Math.ceil(total / limit)
          const start = (page - 1) * limit
          const paginatedData = finalFiltered.slice(start, start + limit)

          return {
               message: 'Get Products successfully',
               data: paginatedData,
               total,
               result: paginatedData.length,
               uniqueTags: uniqueTags,
               paginatorInfo: {
                    currentPage: page,
                    lastPage,
                    total,
                    perPage: limit,
                    nextPageUrl:
                         page < lastPage ? `/api/products?page=${page + 1}&limit=${limit}` : null,
                    prevPageUrl: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
               },
          }
     } catch (error) {
          console.error('Error fetching products:', error)
          throw new Error('Failed to fetch products')
     }
}

const useGetProducts = (options: ProductQueryParams) => {
     return useQuery<BaseResponse<Product[]>, Error>({
          queryKey: ['products', options],
          queryFn: () => getProducts(options),
          placeholderData: (prevData) => prevData,
          retry: true,
     })
}

export { useGetProducts }
