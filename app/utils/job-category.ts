import type { ISelectItem } from '~/types/select-item'

export function normalizeJobCategorySlug(
  value: string | number | null | undefined,
): string {
  if (value == null) return ''
  return String(value).trim().toLowerCase().replace(/\s+/g, '-')
}

export function jobCategoryPath(slug: string | number): string {
  return `/jobs/category/${normalizeJobCategorySlug(slug)}`
}

export function findJobCategoryLabel(
  slug: string | number | null | undefined,
  jobTitles: ISelectItem[],
): string {
  const normalized = normalizeJobCategorySlug(slug)
  if (!normalized) return ''

  const match = jobTitles.find(
    (item) => normalizeJobCategorySlug(item.value) === normalized,
  )
  return match?.label?.trim() || normalized
}

export function getJobCategorySeoMeta(label: string) {
  const name = label.trim() || 'حسابدار'

  return {
    title: `استخدام ${name} | فرصت‌های شغلی ${name}`,
    description: `جدیدترین آگهی‌های استخدام ${name} را در های‌حساب ببینید؛ رزومه بسازید و درخواست‌تان را همین الان ارسال کنید.`,
  }
}
