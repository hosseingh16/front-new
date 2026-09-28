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

  const position = joinParam(filters.jobGroups)
  if (position) query.position = position

  const search = filters.titleSearch.trim()
  if (search) query.title = search

  const province = joinParam(filters.provinces)
  if (province) query.province = province

  const salaryRange = joinParam(filters.salaries)
  if (salaryRange) query.salary_range = salaryRange

  const advantages = joinParam(filters.benefits)
  if (advantages) query.advantages = advantages

  const experience = joinParam(filters.workHistory)
  if (experience) query.experience = experience

  return query
}
