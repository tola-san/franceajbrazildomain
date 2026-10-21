import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { Product, ProductQueryParams } from '@/types/product'
import { getAllProducts } from '@/lib/products/products'

export async function GET(req: Request): Promise<NextResponse> {
     try {
          const { searchParams } = new URL(req.url)

          const page = Number(searchParams.get('page') ?? '1')
          const limit = Number(searchParams.get('limit') ?? '12')
          const sort = (searchParams.get('sort') ?? 'default') as ProductQueryParams['sort']
          const lang = searchParams.get('lang') || undefined

          const categoriesParam = searchParams.get('categories')
          const category = categoriesParam ? categoriesParam.split(',').filter(Boolean) : undefined

          const tagsParam = searchParams.get('tags')
          const tags = tagsParam ? tagsParam.split(',').filter(Boolean) : undefined

          const type = searchParams.get('type') || undefined
          const search = searchParams.get('search') || undefined
          const random = searchParams.get('random') === 'true'

          const fileName = lang === 'pt-br' ? 'products-br.json' : 'products.json'
          const filePath = path.join(process.cwd(), 'public', 'api', fileName)

          const fileBuf = await fs.readFile(filePath, 'utf-8')
          const products: Product[] = JSON.parse(fileBuf)

          const options: ProductQueryParams = {
               page,
               limit,
               category,
               type: type ?? null,
               tags,
               search: search ?? null,
               lang: lang ?? null,
               sort,
               random,
          }

          const result = await getAllProducts(products, options)
          return NextResponse.json(result, { status: 200 })
     } catch (err) {
          console.error('API /api/products error:', err)
          return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 })
     }
}
