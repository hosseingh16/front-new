import type { LocationQuery } from 'vue-router'
import type { JobFiltersModel } from '~/types/job-filters'
import { createEmptyJobFilters } from '~/types/job-filters'
import { areRouteQueriesEqual, normalizeFilterId } from '~/utils/job-filters-query'

export type AdsSort = 'newest' | 'salary'

type RouteQuery = LocationQuery | Record<string, string | string[] | undefined>

function queryValue(
  value: LocationQuery[string] | string | string[] | undefined,
): string | string[] | undefined {
  if (value === null || value === undefined) return undefined
  if (Array.isArray(value)) {
    return value.filter((item) => item != null).map(String)
  }
  return value
}

function joinParam(values: Array<string | number>): string | undefined {
  if (!values.length) return undefined
  return values.map(String).join(',')
}

function splitParam(value: string | string[] | undefined): Array<string | number> {
  if (!value) return []
  const raw = Array.isArray(value) ? value.join(',') : value
  return raw.split(',').filter(Boolean).map(normalizeFilterId)
}

function firstQueryString(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) return undefined
  return Array.isArray(value) ? value[0] : value
}

export function parseAdsSort(value: string | string[] | undefined): AdsSort {
  const raw = firstQueryString(value)
  return raw === 'salary' ? 'salary' : 'newest'
}

/**
 * Pretty ads URL queries, e.g.
 * /ad?type=full_time,part_time&q=حسابدار&sort=salary&page=2
 */
export function adsFiltersToRouteQuery(
  filters: JobFiltersModel,
  page: number,
  sort: AdsSort = 'newest',
): Record<string, string> {
  const query: Record<string, string> = {}

  if (page > 1) query.page = String(page)
  if (sort !== 'newest') query.sort = sort

  const type = joinParam(filters.jobTypes)
  if (type) query.type = type

  const contract = joinParam(filters.contractTypes)
  if (contract) query.contract = contract

  const q = filters.titleSearch.trim()
  if (q) query.q = q

  const group = joinParam(filters.jobGroups)
  if (group) query.group = group

  const city = joinParam(filters.cities)
  if (city) query.city = city

  const salary = joinParam(filters.salaries)
  if (salary) query.salary = salary

  const experience = joinParam(filters.workHistory)
  if (experience) query.experience = experience

  const benefits = joinParam(filters.benefits)
  if (benefits) query.benefits = benefits

  return query
}

export function routeQueryToAdsFilters(query: RouteQuery): {
  filters: JobFiltersModel
  page: number
  sort: AdsSort
} {
  const filters = createEmptyJobFilters()

  filters.jobTypes = splitParam(queryValue(query.type))
  filters.contractTypes = splitParam(queryValue(query.contract))

  const q = queryValue(query.q)
  filters.titleSearch = typeof q === 'string' ? q : (q?.[0] ?? '')

  filters.jobGroups = splitParam(queryValue(query.group))
  filters.cities = splitParam(queryValue(query.city))
  filters.salaries = splitParam(queryValue(query.salary))
  filters.workHistory = splitParam(queryValue(query.experience))
  filters.benefits = splitParam(queryValue(query.benefits))

  const pageRaw = queryValue(query.page)
  const page = Math.max(1, Number(Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) || 1)
  const sort = parseAdsSort(queryValue(query.sort))

  return { filters, page, sort }
}

export { areRouteQueriesEqual }
