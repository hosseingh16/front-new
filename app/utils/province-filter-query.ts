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

export function getProvinceSlug(item: ISelectItem): string {
  const fromApi = item.slug?.trim()
  if (fromApi) return fromApi
  return provinceLabelToSlug(item.label)
}

export function isFeaturedProvince(item: ISelectItem): boolean {
  const value = item.is_featured as unknown
  return value === true || value === 1 || value === '1' || value === 'true'
}

function splitQueryTokens(value: string | string[] | undefined): string[] {
  if (!value) return []
  const raw = Array.isArray(value) ? value.join(',') : value
  return raw
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
}

function provinceMatchesToken(item: ISelectItem, token: string): boolean {
  const normalized = normalizeProvinceToken(token)
  const slugForm = provinceLabelToSlug(
    normalizePersianText(decodeURIComponent(token).trim()),
  )
  const itemSlug = getProvinceSlug(item)

  return (
    normalizeProvinceToken(item.label) === normalized ||
    normalizeProvinceToken(itemSlug) === normalized ||
    itemSlug === slugForm ||
    provinceLabelToSlug(item.label) === slugForm ||
    provinceLabelToSlug(item.label) === provinceLabelToSlug(token)
  )
}

export function findProvinceBySlugOrLabel(
  slugOrLabel: string | number | null | undefined,
  provinces: ISelectItem[],
): ISelectItem | undefined {
  if (slugOrLabel == null) return undefined
  const token = String(slugOrLabel).trim()
  if (!token) return undefined
  return provinces.find((item) => provinceMatchesToken(item, token))
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

    const match = provinces.find((item) => provinceMatchesToken(item, token))
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
      const numericId = Number(id)
      const match = provinces.find(
        (item) => Number(item.value) === numericId,
      )
      return match ? getProvinceSlug(match) : String(id)
    })
    .join(',')
}
