import type { LocationQuery } from 'vue-router'
import {
  createEmptyResumeBankFilters,
  type ResumeBankFiltersModel,
  type ResumeBankTab,
} from '~/types/resume-bank'
import { normalizeGenderFilterValue } from '~/utils/employer-ad-request-lookups'
import { normalizeFilterId } from '~/utils/job-filters-query'

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

function splitNumbers(value: string | string[] | undefined): number[] {
  return splitParam(value).map(Number).filter((item) => Number.isFinite(item))
}

export function buildResumeBankApiQuery(
  filters: ResumeBankFiltersModel,
  page: number,
  tab: ResumeBankTab,
  count = 12,
): Record<string, string | number> {
  const query: Record<string, string | number> = { page, count }

  if (tab === 'bookmarked') query.only_bookmarked = 1

  const titleParts = [...filters.jobTitles.map(String)]
  const search = filters.titleSearch.trim()
  if (search) titleParts.push(search)
  const title = joinParam(titleParts)
  if (title) query.title = title

  const skills = joinParam(filters.skills)
  if (skills) query.proficiencies = skills

  const jobStatus = joinParam(filters.jobStatuses)
  if (jobStatus) query.job_status = jobStatus

  const experience = joinParam(filters.experience)
  if (experience) query.experience = experience

  const salary = joinParam(filters.salaries)
  if (salary) query.salary_range = salary

  const education = joinParam(filters.education)
  if (education) query.education = education

  const province = joinParam(filters.provinces)
  if (province) query.province = province

  if (filters.gender != null) query.gender = filters.gender

  return query
}

export function resumeBankFiltersToRouteQuery(
  filters: ResumeBankFiltersModel,
  page: number,
  tab: ResumeBankTab,
): Record<string, string> {
  const query: Record<string, string> = {}

  if (page > 1) query.page = String(page)
  if (tab === 'bookmarked') query.tab = 'bookmarked'

  const search = filters.titleSearch.trim()
  if (search) query.q = search

  const jobTitle = joinParam(filters.jobTitles)
  if (jobTitle) query.title = jobTitle

  const skills = joinParam(filters.skills)
  if (skills) query.skills = skills

  const jobStatus = joinParam(filters.jobStatuses)
  if (jobStatus) query.job_status = jobStatus

  const experience = joinParam(filters.experience)
  if (experience) query.experience = experience

  const salary = joinParam(filters.salaries)
  if (salary) query.salary = salary

  const education = joinParam(filters.education)
  if (education) query.education = education

  const province = joinParam(filters.provinces)
  if (province) query.province = province

  if (filters.gender != null) query.gender = String(filters.gender)

  return query
}

export function routeQueryToResumeBankFilters(query: RouteQuery): {
  filters: ResumeBankFiltersModel
  page: number
  tab: ResumeBankTab
} {
  const filters = createEmptyResumeBankFilters()

  const q = queryValue(query.q)
  filters.titleSearch = typeof q === 'string' ? q : (q?.[0] ?? '')

  filters.jobTitles = splitParam(queryValue(query.title)).map(String)
  filters.skills = splitParam(queryValue(query.skills)).map(String)
  filters.jobStatuses = splitParam(queryValue(query.job_status)).map(String)
  filters.experience = splitParam(queryValue(query.experience)).map(String)
  filters.salaries = splitParam(queryValue(query.salary)).map(String)
  filters.education = splitParam(queryValue(query.education)).map(String)
  filters.provinces = splitNumbers(queryValue(query.province))

  const genderValue = queryValue(query.gender)
  const rawGender =
    typeof genderValue === 'string'
      ? genderValue
      : (genderValue?.[0] ?? null)
  filters.gender = normalizeGenderFilterValue(rawGender)

  const pageRaw = queryValue(query.page)
  const page = Math.max(
    1,
    Number(Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) || 1,
  )

  const tabValue = queryValue(query.tab)
  const tabRaw = Array.isArray(tabValue) ? tabValue[0] : tabValue
  const tab: ResumeBankTab = tabRaw === 'bookmarked' ? 'bookmarked' : 'all'

  return { filters, page, tab }
}

export function areResumeBankRouteQueriesEqual(
  current: RouteQuery,
  next: Record<string, string>,
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

  const left = normalize(current)
  const right = next
  const keys = new Set([...Object.keys(left), ...Object.keys(right)])

  for (const key of keys) {
    if ((left[key] ?? '') !== (right[key] ?? '')) return false
  }

  return true
}
