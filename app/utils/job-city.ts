import type { ISelectItem } from '~/types/select-item'
import {
  normalizeProvinceToken,
  provinceLabelToSlug,
  resolveProvinceIdsFromQueryValue,
} from '~/utils/province-filter-query'

export function normalizeJobCitySlug(
  value: string | number | null | undefined,
): string {
  if (value == null) return ''
  return provinceLabelToSlug(String(value))
}

export function jobCityPath(slug: string | number): string {
  return `/jobs/city/${normalizeJobCitySlug(slug)}`
}

export function findJobCityLabel(
  slug: string | number | null | undefined,
  provinces: ISelectItem[],
): string {
  const normalized = normalizeProvinceToken(String(slug ?? ''))
  if (!normalized) return ''

  const match = provinces.find(
    (item) => normalizeProvinceToken(item.label) === normalized,
  )
  if (match?.label?.trim()) return match.label.trim()

  const ids = resolveProvinceIdsFromQueryValue(String(slug ?? ''), provinces)
  if (ids.length === 1) {
    const byId = provinces.find((item) => Number(item.value) === ids[0])
    if (byId?.label?.trim()) return byId.label.trim()
  }

  return normalizeJobCitySlug(slug).replace(/-/g, ' ')
}

export function resolveJobCityProvinceIds(
  slug: string | number | null | undefined,
  provinces: ISelectItem[],
): number[] {
  return resolveProvinceIdsFromQueryValue(String(slug ?? ''), provinces)
}
