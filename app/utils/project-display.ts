import type { Project } from '~/types/project'
import { getProjectCategoryLabel } from '~/data/project-types'

export { getProjectCategoryLabel }

export function getProjectTitle(
  project?: Pick<Project, 'title' | 'type'> | null,
) {
  if (project?.title?.trim()) return project.title.trim()
  if (project?.type?.trim()) {
    const type = project.type.trim()
    return type.startsWith('پروژه') ? type : `پروژه ${type}`
  }
  return 'پروژه حسابداری'
}

export function getProjectScopeLabels(
  scopes?: Project['scopes'],
): string[] {
  if (!scopes) return []
  if (Array.isArray(scopes)) {
    return scopes.map((item) => String(item).trim()).filter(Boolean)
  }

  return String(scopes)
    .split(/[,،|]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function formatProjectTimeRange(
  min?: number | null,
  max?: number | null,
) {
  if (min == null && max == null) return ''
  if (min != null && max != null) {
    if (min === max) return `${min} روز`
    return `${min} تا ${max} روز`
  }
  if (min != null) return `از ${min} روز`
  return `تا ${max} روز`
}

function toBudgetNumber(value: number | string | null | undefined) {
  if (value == null || value === '') return null
  const amount = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(amount) ? amount : null
}

/** Matches backend App\Support\TomanBudget::format */
export function formatTomanBudgetMillions(
  value: number | string | null | undefined,
) {
  const amount = toBudgetNumber(value)
  if (amount == null || amount < 0) return ''

  const millions = amount / 1_000_000
  const rounded = Math.round(millions)
  const label =
    Math.abs(millions - rounded) < 0.0001
      ? String(rounded)
      : String(Number(millions.toFixed(2)))

  return `${label} میلیون`
}

function withTomanSuffix(label: string) {
  const trimmed = label.trim()
  if (!trimmed) return ''
  if (trimmed.includes('تومان')) return trimmed
  return `${trimmed} تومان`
}

/** Matches backend App\Support\TomanBudget::range */
export function formatTomanBudgetRange(
  min?: number | string | null,
  max?: number | string | null,
) {
  const minLabel = formatTomanBudgetMillions(min)
  const maxLabel = formatTomanBudgetMillions(max)

  if (minLabel && maxLabel) {
    return withTomanSuffix(
      minLabel === maxLabel ? minLabel : `${minLabel} تا ${maxLabel}`,
    )
  }

  return withTomanSuffix(minLabel || maxLabel)
}

export function formatProjectBudgetLabel(
  project?: Pick<Project, 'budget' | 'min_budget' | 'max_budget'> | null,
) {
  const apiBudget = project?.budget?.trim()
  if (apiBudget) return withTomanSuffix(apiBudget)

  return (
    formatTomanBudgetRange(project?.min_budget, project?.max_budget) ||
    'بودجه توافقی'
  )
}

export function getProjectPresenceLabel(needsPresence?: boolean) {
  if (needsPresence == null) return ''
  return needsPresence ? 'نیاز به حضور' : 'بدون نیاز به حضور'
}
