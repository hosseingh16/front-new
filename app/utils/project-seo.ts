import type { Project } from '~/types/project'
import { getProjectTitle } from '~/utils/project-display'

type ProjectSeoSource = Pick<
  Project,
  'title' | 'type' | 'company_name' | 'company'
>

function trimText(value?: string | number | null): string {
  if (value == null) return ''
  return String(value).trim()
}

export function getProjectDetailSeoMeta(project?: ProjectSeoSource | null) {
  const titleLabel = getProjectTitle(project)
  const company = trimText(project?.company_name) || 'شرکت'
  const city =
    trimText(project?.company?.city_name) ||
    trimText(project?.company?.province_name)

  const title = city
    ? `${titleLabel} در ${city}`
    : titleLabel

  const description = city
    ? `${company} در ${city} پروژه «${titleLabel}» را در های‌حساب منتشر کرده است؛ جزئیات را ببینید و درخواست دهید.`
    : `${company} پروژه «${titleLabel}» را در های‌حساب منتشر کرده است؛ جزئیات را ببینید و درخواست دهید.`

  return { title, description }
}
