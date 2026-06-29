import type { LocationQuery } from 'vue-router'
import type { JobFiltersModel } from '~/types/job-filters'
import { createEmptyJobFilters } from '~/types/job-filters'

type RouteQuery = LocationQuery | Record<string, string | string[] | undefined>

function queryValue(value: LocationQuery[string]): string | string[] | undefined {
  if (value === null || value === undefined) return undefined
  if (Array.isArray(value)) return value.filter((item): item is string => item !== null)
  return value
}

function splitParam(value: string | string[] | undefined): Array<string | number> {
  if (!value) return []
  const raw = Array.isArray(value) ? value.join(',') : value
  return raw.split(',').filter(Boolean)
}

function joinParam(values: Array<string | number>): string | undefined {
  if (!values.length) return undefined
  return values.map(String).join(',')
}

export function jobFiltersToRouteQuery(
  filters: JobFiltersModel,
  page: number,
): Record<string, string> {
  const query: Record<string, string> = {}

  if (page > 1) query.page = String(page)

  const jobType = joinParam(filters.jobTypes)
  if (jobType) query.job_type = jobType

  const contractType = joinParam(filters.contractTypes)
  if (contractType) query.contract_type = contractType

  const search = filters.titleSearch.trim()
  if (search) query.search = search

  const jobGroup = joinParam(filters.jobGroups)
  if (jobGroup) query.job_group = jobGroup

  const city = joinParam(filters.cities)
  if (city) query.city = city

  const salaryRange = joinParam(filters.salaries)
  if (salaryRange) query.salary_range = salaryRange

  const experience = joinParam(filters.workHistory)
  if (experience) query.experience = experience

  const advantages = joinParam(filters.benefits)
  if (advantages) query.advantages = advantages

  return query
}

export function routeQueryToJobFilters(query: RouteQuery): {
  filters: JobFiltersModel
  page: number
} {
  const filters = createEmptyJobFilters()

  filters.jobTypes = splitParam(queryValue(query.job_type))
  filters.contractTypes = splitParam(queryValue(query.contract_type))

  const search = queryValue(query.search)
  filters.titleSearch = typeof search === 'string' ? search : (search?.[0] ?? '')

  filters.jobGroups = splitParam(queryValue(query.job_group))
  filters.cities = splitParam(queryValue(query.city))
  filters.salaries = splitParam(queryValue(query.salary_range))
  filters.workHistory = splitParam(queryValue(query.experience))
  filters.benefits = splitParam(queryValue(query.advantages))

  const pageRaw = queryValue(query.page)
  const page = Math.max(1, Number(Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) || 1)

  return { filters, page }
}

export function areRouteQueriesEqual(
  query: RouteQuery,
  nextQuery: Record<string, string>,
): boolean {
  const normalize = (rawQuery: RouteQuery) => {
    const out: Record<string, string> = {}
    for (const [key, value] of Object.entries(rawQuery)) {
      const normalized = queryValue(value)
      if (normalized === undefined || normalized === '') continue
      out[key] = Array.isArray(normalized) ? normalized.join(',') : normalized
    }
    return out
  }

  const left = normalize(query)
  const right = nextQuery

  const keys = new Set([...Object.keys(left), ...Object.keys(right)])
  for (const key of keys) {
    if ((left[key] ?? '') !== (right[key] ?? '')) return false
  }
  return true
}
