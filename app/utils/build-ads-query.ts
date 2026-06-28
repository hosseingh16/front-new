import type { JobFiltersModel } from '~/types/job-filters'

function joinParam(values: Array<string | number>): string | undefined {
  if (!values.length) return undefined
  return values.map(String).join(',')
}

export function buildAdsQueryFromFilters(
  filters: JobFiltersModel,
  count = 12,
): Record<string, string | number> {
  const query: Record<string, string | number> = { count }

  const employmentTypes = [
    ...new Set([...filters.jobTypes, ...filters.contractTypes]),
  ]
  const employmentType = joinParam(employmentTypes)
  if (employmentType) query.employment_type = employmentType

  const titleParts = filters.jobGroups.map(String)
  const search = filters.titleSearch.trim()
  if (search) titleParts.push(search)
  if (titleParts.length) query.title = titleParts.join(',')

  const city = joinParam(filters.cities)
  if (city) query.city = city

  const salaryRange = joinParam(filters.salaries)
  if (salaryRange) query.salary_range = salaryRange

  const advantages = joinParam(filters.benefits)
  if (advantages) query.advantages = advantages

  const experience = joinParam(filters.workHistory)
  if (experience) query.experience = experience

  return query
}
