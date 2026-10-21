import path from 'path'
import fs from 'fs/promises'
import { Product } from '@/types/product'

/** A downloadable document served from public/pdf. */
export type ResourceFile = {
  /** URL-safe id, from the file name — also the anchor/query key on the page. */
  slug: string
  /** File name on disk, e.g. "FRANCE-AJ-ICPO-FORM.pdf". */
  fileName: string
  /** Public path, e.g. "/pdf/FRANCE-AJ-ICPO-FORM.pdf". */
  url: string
  /** Display title: the catalog's name for the file, else derived from the file name. */
  title: string
  /** Title without its trailing descriptor, for tight spots like the navbar. */
  shortTitle: string
  /** Human readable size, e.g. "430 KB". */
  size: string
  /** Last modified time, ISO 8601. */
  updatedAt: string
}

const PDF_DIR = path.join(process.cwd(), 'public', 'pdf')

const formatSize = (bytes: number): string =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`

/**
 * Editorial titles for files the product catalog says nothing about. Anything
 * not listed here still gets a readable title derived from its file name.
 */
const RESOURCE_TITLES: Record<string, string> = {
  'FRANCE-AJ-ICPO-FORM.pdf': 'ICPO Form — Irrevocable Corporate Purchase Order',
}

/** "urea-granular-prilled-46-rotterdam-pdf.pdf" -> "Urea Granular Prilled 46 Rotterdam". */
const titleFromFileName = (fileName: string): string =>
  fileName
    .replace(/\.pdf$/i, '')
    .replace(/[-_]+pdf$/i, '')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) =>
      // Acronyms and codes stay as written; ordinary words get title case.
      word.length <= 4 && word === word.toUpperCase()
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(' ')

/**
 * Drops the descriptor a full title carries after a dash — "Urea 46% Granular &
 * Prilled – Specification Sheet" reads as "Urea 46% Granular & Prilled" in the
 * navbar, where every entry is a document anyway.
 */
const shortenTitle = (title: string): string => {
  const [head] = title.split(/\s+[–—]\s+|\s+-\s+/)
  return head?.trim() || title
}

/**
 * Titles the catalog already gives these files, keyed by public URL — a product
 * spec sheet reads better as "Urea 46% Granular & Prilled – Specification
 * Sheet" than as its file name.
 */
const catalogTitles = async (locale: string): Promise<Map<string, string>> => {
  const fileName = locale === 'pt-br' ? 'products-br.json' : 'products.json'
  const titles = new Map<string, string>()

  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'public', 'api', fileName), 'utf-8')
    const products: Product[] = JSON.parse(raw)

    for (const product of products)
      for (const pdf of product.pdfs ?? []) if (pdf.name) titles.set(pdf.url, pdf.name)
  } catch (error) {
    console.error('[resources] Could not read product catalog titles:', error)
  }

  return titles
}

/**
 * Lists every PDF in public/pdf, newest first. Reading the directory means a
 * file dropped in there shows up on the resources page and in the navbar with
 * no code change; sizes come from disk, so they never go stale.
 */
export async function getResources(locale = 'en'): Promise<ResourceFile[]> {
  let fileNames: string[]

  try {
    fileNames = await fs.readdir(PDF_DIR)
  } catch (error) {
    console.error('[resources] Could not read public/pdf:', error)
    return []
  }

  const titles = await catalogTitles(locale)

  const resources = await Promise.all(
    fileNames
      .filter((fileName) => fileName.toLowerCase().endsWith('.pdf'))
      .map(async (fileName) => {
        const url = `/pdf/${fileName}`
        const stats = await fs.stat(path.join(PDF_DIR, fileName))

        const title = titles.get(url) ?? RESOURCE_TITLES[fileName] ?? titleFromFileName(fileName)

        return {
          slug: fileName.replace(/\.pdf$/i, '').toLowerCase(),
          fileName,
          url,
          title,
          shortTitle: shortenTitle(title),
          size: formatSize(stats.size),
          updatedAt: stats.mtime.toISOString(),
        }
      }),
  )

  return resources.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}
