/** A row of public/api/countries.json. */
export type CountryOption = {
  name: string
  dial_code: string
  code: string
}

/**
 * One entry of the phone-prefix picker. Several countries share a dial code
 * (+1 is Canada and the United States), so they are folded into a single row
 * that still remembers every name, keeping the picker's keys unique and its
 * search able to find a country by name.
 */
export type PhonePrefix = {
  dial_code: string
  /** Country code of the first country using this dial code — used for the flag. */
  code: string
  names: string[]
}

/** Folds the country list into unique dial codes, preserving order. */
export const buildPhonePrefixes = (countries: CountryOption[]): PhonePrefix[] => {
  const byDialCode = new Map<string, PhonePrefix>()

  for (const country of countries) {
    const existing = byDialCode.get(country.dial_code)

    if (existing) existing.names.push(country.name)
    else
      byDialCode.set(country.dial_code, {
        dial_code: country.dial_code,
        code: country.code,
        names: [country.name],
      })
  }

  return Array.from(byDialCode.values())
}

/**
 * Matches a typed query against a prefix, by dial code ("+55", "55") or by any
 * country name using it ("brazil"). An empty query matches everything.
 */
export const matchesPhonePrefix = (prefix: PhonePrefix, query: string): boolean => {
  const needle = query.trim().toLowerCase()
  if (!needle) return true

  const digits = needle.replace(/\D/g, '')
  if (digits && prefix.dial_code.replace(/\D/g, '').startsWith(digits)) return true

  return prefix.names.some((name) => name.toLowerCase().includes(needle))
}

/** Label for a prefix row, e.g. "+1 — Canada, United States". */
export const phonePrefixLabel = (prefix: PhonePrefix): string =>
  `${prefix.dial_code} — ${prefix.names.join(', ')}`

/**
 * Builds the picker's filter.
 *
 * Rows carry only the dial code as their text value, so the combobox input
 * stays short once a prefix is chosen. Two things follow from that, and this
 * filter handles both:
 *
 *  - Opening the picker leaves the chosen code in the box. That is not a
 *    search, so the whole list stays browsable.
 *  - Typing without clearing first produces "+55cambo". The chosen code is
 *    stripped off the front, as long as something is left to match on.
 *
 * Looking the row back up by its code also lets a query match the country
 * names behind it, not just the digits.
 */
export const makePhonePrefixFilter = (prefixes: PhonePrefix[], selected?: string) => {
  const byDialCode = new Map(prefixes.map((prefix) => [prefix.dial_code, prefix]))

  return (textValue: string, inputValue: string): boolean => {
    const typed = inputValue.trim()
    if (!typed || typed === selected) return true

    const query =
      selected && typed.startsWith(selected) && typed.length > selected.length
        ? typed.slice(selected.length)
        : typed

    const prefix = byDialCode.get(textValue.trim())

    return prefix
      ? matchesPhonePrefix(prefix, query)
      : textValue.toLowerCase().includes(query.toLowerCase())
  }
}

/**
 * Puts the caret after the text already in the picker's input, so a country
 * name typed straight after opening appends to the dial code rather than
 * being inserted wherever the click happened to land.
 */
export const moveCaretToEnd = (input: HTMLInputElement | null): void => {
  if (!input) return

  requestAnimationFrame(() => {
    const end = input.value.length
    input.setSelectionRange?.(end, end)
  })
}
