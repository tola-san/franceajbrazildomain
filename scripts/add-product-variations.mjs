/**
 * Adds the `variation` block (buyer-selectable packaging / container loading /
 * bulk tonnage) to every product in public/api/products*.json.
 *
 * Packing rules, by product `type`:
 *   refined oil        1/2/5/20 L                 + 20ft/40ft container
 *   crude oil          flexi tank/bag, tank ship  + 20ft/40ft container
 *   meat & casings     carton + 10/15/20 kg       + 20ft/40ft container
 *   animal feed        bag 25/50 kg
 *   grain, sugar       bag 25/50 kg               + bulk 12,500 / 25,000 /
 *                                                     50,000 / 100,000 MT+
 *   fertilizer         bag 25/50 kg               + bulk 50,000 / 100,000 /
 *                                                     200,000 / 400,000 MT+
 *
 * Idempotent: re-running overwrites the block with the same values.
 * Usage: node scripts/add-product-variations.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Container loading, offered for oil and meat only — those load either a 20ft
 * or a 40ft box depending on palletized vs. flexitank/floor loading.
 */
const CONTAINER_TYPES = {
  en: ['20ft Container', '40ft Container'],
  'pt-br': ['Contêiner 20ft', 'Contêiner 40ft'],
}
/**
 * Bulk tonnage ladders. The first entry of each is the minimum order.
 * Fertilizer trades in larger lots than the food commodities, so it starts at
 * 50,000 MT rather than 12,500 MT.
 */
const BULK_QUANTITIES = {
  standard: ['12,500 MT', '25,000 MT', '50,000 MT', '100,000 MT+'],
  fertilizer: ['50,000 MT', '100,000 MT', '200,000 MT', '400,000 MT+'],
}

/** Packaging labels per locale, keyed by an internal packing profile. */
const PACKAGES = {
  refinedOil: {
    en: ['1 L', '2 L', '5 L', '20 L'],
    'pt-br': ['1 L', '2 L', '5 L', '20 L'],
  },
  crudeOil: {
    en: ['Flexi Tank', 'Flexi Bag', 'Tank Ship'],
    'pt-br': ['Flexitanque', 'Flexibag', 'Navio-Tanque'],
  },
  carton: {
    en: ['Carton'],
    'pt-br': ['Caixa'],
  },
  bag: {
    en: ['Bag 25 kg', 'Bag 50 kg'],
    'pt-br': ['Saco 25 kg', 'Saco 50 kg'],
  },
}

const CARTON_WEIGHTS = {
  en: ['10 kg', '15 kg', '20 kg'],
  'pt-br': ['10 kg', '15 kg', '20 kg'],
}

/**
 * type -> { packing profile, shipping mode, loading }
 * `loading: true` adds the 20ft/40ft container loading choice (oil and meat).
 */
const PROFILE_BY_TYPE = {
  'edible-oil': { packing: 'refinedOil', shipping: 'container', loading: true },
  'premium-edible-oil': { packing: 'refinedOil', shipping: 'container', loading: true },
  'industrial-oil': { packing: 'crudeOil', shipping: 'container', loading: true },
  'frozen-meat': { packing: 'carton', shipping: 'container', loading: true },
  // Typo present in the product data for a single beef item.
  'frozen-meet': { packing: 'carton', shipping: 'container', loading: true },
  'canned-meat': { packing: 'carton', shipping: 'container', loading: true },
  'beef-casings': { packing: 'carton', shipping: 'container', loading: true },
  'animal-feed': { packing: 'bag', shipping: 'container' },
  grain: { packing: 'bag', shipping: 'bulk', bulkTier: 'standard' },
  sugar: { packing: 'bag', shipping: 'bulk', bulkTier: 'standard' },
  fertilizer: { packing: 'bag', shipping: 'bulk', bulkTier: 'fertilizer' },
}

const buildVariation = (type, locale) => {
  const profile = PROFILE_BY_TYPE[type]
  if (!profile) return null

  const variation = { packages: PACKAGES[profile.packing][locale] }

  if (profile.packing === 'carton') variation.weights = CARTON_WEIGHTS[locale]

  if (profile.shipping === 'bulk') {
    variation.quantities = [...BULK_QUANTITIES[profile.bulkTier]]
  } else if (profile.loading) {
    variation.containerTypes = [...CONTAINER_TYPES[locale]]
  }

  return variation
}

/** Rebuilds the product with `variation` sitting right after `slug`. */
const withVariation = (product, variation) => {
  const next = {}
  for (const [key, value] of Object.entries(product)) {
    if (key === 'variation') continue
    next[key] = value
    if (key === 'slug') next.variation = variation
  }
  if (!next.variation) next.variation = variation
  return next
}

const FILES = [
  { file: 'products.json', locale: 'en' },
  { file: 'products-br.json', locale: 'pt-br' },
]

const run = async () => {
  for (const { file, locale } of FILES) {
    const filePath = path.join(process.cwd(), 'public', 'api', file)
    const products = JSON.parse(await readFile(filePath, 'utf-8'))

    const missing = new Set()
    const updated = products.map((product) => {
      const variation = buildVariation(product.type, locale)
      if (!variation) {
        missing.add(product.type)
        return product
      }
      return withVariation(product, variation)
    })

    await writeFile(filePath, `${JSON.stringify(updated, null, 2)}\n`, 'utf-8')

    const done = updated.filter((p) => p.variation).length
    console.log(`${file}: ${done}/${updated.length} products have a variation`)
    if (missing.size) console.warn(`  unmapped types: ${[...missing].join(', ')}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
