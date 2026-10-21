import { CartVariation } from '@/types/cart-types'
import { ProductVariation } from '@/types/product'

/**
 * Shown for cart lines saved before variations existed, or for products whose
 * data has no `variation` block yet.
 */
export const FALLBACK_VARIATION_SUMMARY = '27 MT / container'

export type VariationSelection = {
  package?: string
  weight?: string
  containerType?: string
  /**
   * Bulk tonnage, e.g. "12,500 MT". Bulk goods only. Either one of the
   * catalog's preset options or a quantity the buyer typed in themselves.
   */
  quantity?: string
}

/**
 * Reads the tonnage out of a quantity string — "12,500 MT", "100,000 MT+" and
 * a bare "18000" all yield a number. Separators are dropped, so decimals are
 * not supported (tonnage is always whole here).
 */
export const parseTonnage = (value?: string): number | undefined => {
  const digits = value?.replace(/\D/g, '')
  if (!digits) return undefined

  const tonnage = Number(digits)
  return Number.isFinite(tonnage) ? tonnage : undefined
}

/**
 * Tidies a typed quantity for storage: a bare number gets thousands
 * separators and the unit appended ("18000" -> "18,000 MT"), while anything
 * that already carries a unit is kept exactly as the buyer wrote it.
 */
export const normalizeQuantity = (
  value?: string,
  unit = 'MT',
): string | undefined => {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  if (/[a-z]/i.test(trimmed)) return trimmed

  const tonnage = parseTonnage(trimmed)
  return tonnage === undefined
    ? trimmed
    : `${new Intl.NumberFormat('en-US').format(tonnage)} ${unit}`
}

/** First option of every field — what the selectors start on. */
export const getDefaultSelection = (
  variation?: ProductVariation,
): VariationSelection => ({
  package: variation?.packages?.[0],
  weight: variation?.weights?.[0],
  containerType: variation?.containerTypes?.[0],
  quantity: variation?.quantities?.[0],
})

/**
 * The unit the catalog states its weight options in, read off the first
 * option ("20 kg" -> "kg", "800 g" -> "g") so a weight the buyer types by
 * hand is completed in the same unit as the ones they could have picked.
 * Falls back to kilos, which is what carton weights use.
 */
export const getWeightUnit = (variation?: ProductVariation): string =>
  variation?.weights?.[0]?.match(/[a-z]+/i)?.[0] ?? 'kg'

/**
 * Tidies a typed weight the same way: a bare number gets the unit appended
 * ("12" -> "12 kg", "13,5" -> "13.5 kg"), while a value that already carries
 * a unit is kept as written.
 */
export const normalizeWeight = (value?: string, unit = 'kg'): string | undefined => {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  if (/[a-z]/i.test(trimmed)) return trimmed

  const weight = Number(trimmed.replace(',', '.'))
  return Number.isFinite(weight) ? `${weight} ${unit}` : trimmed
}

/**
 * Renders a selection as the single line shown in the cart, on the quotation
 * page and in the quotation emails, e.g. "Carton · 15 kg · 27 MT / container".
 */
export const buildVariationSummary = (
  selection: VariationSelection,
  variation?: ProductVariation,
): string => {
  const parts: string[] = []

  if (selection.package) parts.push(selection.package)
  const weight = normalizeWeight(selection.weight, getWeightUnit(variation))
  if (weight) parts.push(weight)

  // The raw option strings are already localized per catalog file, so the
  // summary is built from them verbatim — no English suffix is appended.
  if (selection.containerType) parts.push(selection.containerType)

  if (variation?.quantities?.length) {
    parts.push(normalizeQuantity(selection.quantity) ?? variation.quantities[0])
  }

  return parts.length > 0 ? parts.join(' · ') : FALLBACK_VARIATION_SUMMARY
}

/** Packs a selection into the shape stored on the cart line. */
export const toCartVariation = (
  selection: VariationSelection,
  variation?: ProductVariation,
): CartVariation => {
  const isBulk = Boolean(variation?.quantities?.length)

  return {
    package: selection.package,
    weight: normalizeWeight(selection.weight, getWeightUnit(variation)),
    containerType: variation?.containerTypes?.length
      ? selection.containerType
      : undefined,
    quantity: isBulk
      ? normalizeQuantity(selection.quantity) ?? variation?.quantities?.[0]
      : undefined,
    summary: buildVariationSummary(selection, variation),
  }
}

/**
 * Cart line key. Two different packings of the same product are separate
 * lines, so the variation is folded into the id the reducer merges on.
 */
export const buildCartLineId = (
  productId: number | string,
  variation?: CartVariation,
): string => {
  const key = [
    variation?.package,
    variation?.weight,
    variation?.containerType,
    variation?.quantity,
  ]
    .filter(Boolean)
    .join('|')

  return key ? `${productId}::${key}` : String(productId)
}

/** Recovers the product id from a cart line id built by `buildCartLineId`. */
export const productIdFromCartLineId = (lineId: string): string =>
  lineId.split('::')[0]

/**
 * Meat categories ship a minimum of five containers per order; every other
 * container-shipped good still starts at one.
 */
const MEAT_CATEGORIES = ['frozen-beef', 'frozen-chicken', 'frozen-lamb']

/** Smallest number of containers the buyer may request for a category. */
export const getMinContainers = (category?: string): number =>
  category && MEAT_CATEGORIES.includes(category) ? 5 : 1

/**
 * The minimum order shown on a product card, read from the catalog rather
 * than assumed — oil starts at 1,000 MT and the grain-type goods at 12,500 MT,
 * so a single hard-coded line cannot be right for all of them.
 *
 * The first bulk tonnage preset is the minimum. Container-shipped goods (meat,
 * feed) state no tonnage, so this returns undefined for them and the caller
 * renders a container count from `getMinContainers` instead.
 */
export const getMinimumOrder = (product: {
  variation?: ProductVariation
}): string | undefined => product.variation?.quantities?.[0]
