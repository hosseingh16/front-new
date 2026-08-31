import type { ISelectItem } from '~/types/select-item'

function normalizePersianText(value: string): string {
  return value.replace(/ي/g, 'ی').replace(/ك/g, 'ک')
}

export function normalizeProvinceToken(value: string): string {
  return normalizePersianText(decodeURIComponent(value).trim()).replace(
    /[\s\u200c-]+/g,
    '',
  )
}

export function provinceLabelToSlug(label: string): string {
  return normalizePersianText(label.trim()).replace(/[\s\u200c]+/g, '-')
}

function splitQueryTokens(value: string | string[] | undefined): string[] {
  if (!value) return []
  const raw = Array.isArray(value) ? value.join(',') : value
  return raw
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
}

export function resolveProvinceIdsFromQueryValue(
  value: string | string[] | undefined,
  provinces: ISelectItem[] = [],
): number[] {
  const tokens = splitQueryTokens(value)
  if (!tokens.length) return []

  const result: number[] = []

  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      const id = Number(token)
      if (!provinces.length || provinces.some((item) => Number(item.value) === id)) {
        result.push(id)
      }
      continue
    }

    if (!provinces.length) continue

    const normalized = normalizeProvinceToken(token)
    const match = provinces.find(
      (item) => normalizeProvinceToken(item.label) === normalized,
    )

    if (match) result.push(Number(match.value))
  }

  return result
}

export function provinceIdsToQueryValue(
  ids: number[],
  provinces: ISelectItem[] = [],
): string | undefined {
  if (!ids.length) return undefined

  return ids
    .map((id) => {
      const match = provinces.find((item) => Number(item.value) === id)
      return match ? provinceLabelToSlug(match.label) : String(id)
    })
    .join(',')
}
