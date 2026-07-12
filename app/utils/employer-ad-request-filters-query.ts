import type { LocationQuery } from 'vue-router'
import {
  AD_REQUEST_STATUS_OPTIONS,
  createEmptyEmployerAdRequestFilters,
  type EmployerAdRequestFiltersModel,
  type EmployerAdRequestTab,
} from '~/types/employer-ad-request'

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

function splitNumbers(value: string | string[] | undefined): number[] {
  if (!value) return []
  const raw = Array.isArray(value) ? value.join(',') : value
  return raw
    .split(',')
    .filter(Boolean)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item))
}

export function resolveAdRequestStatusQuery(
  statuses: number[],
): string | undefined {
  const allStatuses = AD_REQUEST_STATUS_OPTIONS.map((item) => item.value)
  const selected = statuses.filter((status) => allStatuses.includes(status))

  if (!selected.length || selected.length === allStatuses.length) {
    return undefined
  }

  return selected.join(',')
}

export function employerAdRequestFiltersToRouteQuery(
  filters: EmployerAdRequestFiltersModel,
  page: number,
  tab: EmployerAdRequestTab,
): Record<string, string> {
  const query: Record<string, string> = {}
  const allStatuses = AD_REQUEST_STATUS_OPTIONS.map((item) => item.value)
  const selectedStatuses = filters.statuses.filter((status) =>
    allStatuses.includes(status),
  )

  if (page > 1) query.page = String(page)
  if (tab === 'bookmarked') query.tab = 'bookmarked'

  if (
    selectedStatuses.length &&
    selectedStatuses.length !== allStatuses.length
  ) {
    query.status = selectedStatuses.join(',')
  }

  if (filters.experience) query.experience = filters.experience
  if (filters.gender != null) query.gender = String(filters.gender)

  return query
}

export function routeQueryToEmployerAdRequestFilters(query: RouteQuery): {
  filters: EmployerAdRequestFiltersModel
  page: number
  tab: EmployerAdRequestTab
} {
  const filters = createEmptyEmployerAdRequestFilters()
  const pageValue = queryValue(query.page)
  const page = Number(Array.isArray(pageValue) ? pageValue[0] : pageValue)
  const tabValue = queryValue(query.tab)
  const tabRaw = Array.isArray(tabValue) ? tabValue[0] : tabValue
  const tab: EmployerAdRequestTab = tabRaw === 'bookmarked' ? 'bookmarked' : 'requests'

  const statusValue = queryValue(query.status)
  const statuses = splitNumbers(statusValue)
  if (statuses.length) {
    filters.statuses = statuses
  }

  const experienceValue = queryValue(query.experience)
  filters.experience =
    typeof experienceValue === 'string'
      ? experienceValue
      : (experienceValue?.[0] ?? null)

  const genderValue = queryValue(query.gender)
  filters.gender =
    typeof genderValue === 'string'
      ? genderValue
      : (genderValue?.[0] ?? null)

  return {
    filters,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    tab,
  }
}

export function areAdRequestRouteQueriesEqual(
  current: RouteQuery,
  next: Record<string, string>,
): boolean {
  const currentKeys = Object.keys(current).filter((key) => current[key] != null)
  const nextKeys = Object.keys(next)

  if (currentKeys.length !== nextKeys.length) return false

  return nextKeys.every((key) => {
    const currentValue = queryValue(current[key])
    const nextValue = next[key]

    if (Array.isArray(currentValue)) {
      return currentValue.join(',') === nextValue
    }

    return String(currentValue ?? '') === String(nextValue ?? '')
  })
}
