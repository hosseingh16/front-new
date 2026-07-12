import type { LocationQuery } from 'vue-router'
import {
  createEmptyEmployerAdRequestFilters,
  DEFAULT_AD_REQUEST_STATUS_VALUES,
  type EmployerAdRequestFiltersModel,
  type EmployerAdRequestTab,
} from '~/types/employer-ad-request'
import { normalizeGenderFilterValue } from '~/utils/employer-ad-request-lookups'

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

function splitStrings(value: string | string[] | undefined): string[] {
  if (!value) return []
  const raw = Array.isArray(value) ? value.join(',') : value
  return raw.split(',').filter(Boolean)
}

function splitNumbers(value: string | string[] | undefined): number[] {
  return splitStrings(value)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item))
}

export function resolveAdRequestStatusQuery(
  statuses: number[],
  allStatusValues: number[] = DEFAULT_AD_REQUEST_STATUS_VALUES,
): string | undefined {
  const selected = statuses.filter((status) => allStatusValues.includes(status))

  if (!selected.length || selected.length === allStatusValues.length) {
    return undefined
  }

  return selected.join(',')
}

export function employerAdRequestFiltersToRouteQuery(
  filters: EmployerAdRequestFiltersModel,
  page: number,
  tab: EmployerAdRequestTab,
  allStatusValues: number[] = DEFAULT_AD_REQUEST_STATUS_VALUES,
): Record<string, string> {
  const query: Record<string, string> = {}
  const selectedStatuses = filters.statuses.filter((status) =>
    allStatusValues.includes(status),
  )

  if (page > 1) query.page = String(page)
  if (tab === 'bookmarked') query.tab = 'bookmarked'

  if (
    selectedStatuses.length &&
    selectedStatuses.length !== allStatusValues.length
  ) {
    query.status = selectedStatuses.join(',')
  }

  if (filters.experience.length) {
    query.experience = filters.experience.join(',')
  }
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
  const experiences = splitStrings(experienceValue)
  if (experiences.length) {
    filters.experience = experiences
  }

  const genderValue = queryValue(query.gender)
  const rawGender =
    typeof genderValue === 'string'
      ? genderValue
      : (genderValue?.[0] ?? null)
  filters.gender = normalizeGenderFilterValue(rawGender)

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
