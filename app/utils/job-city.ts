import type { ISelectItem } from '~/types/select-item'
import {
  findProvinceBySlugOrLabel,
  getProvinceSlug,
  isFeaturedProvince,
  normalizeProvinceToken,
  provinceLabelToSlug,
  resolveProvinceIdsFromQueryValue,
} from '~/utils/province-filter-query'

export function normalizeJobCitySlug(
  value: string | number | null | undefined,
): string {
  if (value == null) return ''
  const raw = String(value).trim()
  if (!raw) return ''

  try {
    return provinceLabelToSlug(decodeURIComponent(raw))
  } catch {
    return provinceLabelToSlug(raw)
  }
}

export function jobCityPath(slug: string | number): string {
  return `/jobs/city/${normalizeJobCitySlug(slug)}`
}

export function findJobCityProvince(
  slug: string | number | null | undefined,
  provinces: ISelectItem[],
): ISelectItem | undefined {
  return findProvinceBySlugOrLabel(slug, provinces)
}

export function isFeaturedJobCity(
  slug: string | number | null | undefined,
  provinces: ISelectItem[],
): boolean {
  const match = findJobCityProvince(slug, provinces)
  return match != null && isFeaturedProvince(match)
}

export function findJobCityLabel(
  slug: string | number | null | undefined,
  provinces: ISelectItem[],
): string {
  const match = findJobCityProvince(slug, provinces)
  if (match?.label?.trim()) return match.label.trim()

  const normalized = normalizeProvinceToken(String(slug ?? ''))
  if (!normalized) return ''

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
  const match = findJobCityProvince(slug, provinces)
  if (match) return [Number(match.value)]
  return resolveProvinceIdsFromQueryValue(String(slug ?? ''), provinces)
}

export function jobCitySlugForProvince(
  province: ISelectItem | undefined,
): string {
  if (!province) return ''
  return normalizeJobCitySlug(getProvinceSlug(province))
}
