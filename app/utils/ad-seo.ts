import type { Ad } from '~/types/ad'

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: 'تمام وقت',
  part_time: 'پاره وقت',
  project_based: 'پروژه',
  project: 'پروژه',
  remote: 'دورکاری',
  internship: 'کارآموزی',
}

function normalizeEmploymentTypeText(value?: string | number | null): string {
  return trimText(value)
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .toLowerCase()
    .replace(/[\s\u200c-]+/g, '_')
}

export function normalizeEmploymentTypeKey(
  type?: string | number | null,
): string {
  const raw = trimText(type)
  if (!raw) return ''

  const normalized = normalizeEmploymentTypeText(raw)
  if (EMPLOYMENT_TYPE_LABELS[normalized]) return normalized

  for (const [key, label] of Object.entries(EMPLOYMENT_TYPE_LABELS)) {
    if (normalizeEmploymentTypeText(label) === normalized) return key
  }

  return normalized
}

export function matchesEmploymentType(
  adEmploymentType: string | undefined,
  filterType: string,
): boolean {
  return (
    normalizeEmploymentTypeKey(adEmploymentType) ===
    normalizeEmploymentTypeKey(filterType)
  )
}

type AdSeoSource = Pick<
  Ad,
  'title' | 'employment_type' | 'city_name' | 'province_name' | 'company_name'
>

function trimText(value?: string | number | null): string {
  if (value == null) return ''
  return String(value).trim()
}

function joinSeoParts(parts: Array<string | undefined | null>): string {
  return parts.map((part) => trimText(part)).filter(Boolean).join(' ')
}

export function employmentTypeSeoLabel(type?: string | number | null): string {
  const raw = trimText(type)
  if (!raw) return ''

  const key = normalizeEmploymentTypeKey(raw)
  return EMPLOYMENT_TYPE_LABELS[key] || raw
}

export function adLocationSeoLabel(
  ad?: Pick<Ad, 'city_name' | 'province_name'> | null,
): string {
  return trimText(ad?.city_name) || trimText(ad?.province_name)
}

function jobTitleSeoLabel(title?: string | null): string {
  const raw = trimText(title).replace(/^استخدام\s+/u, '').trim()
  return raw || 'حسابدار'
}

export function getAdDetailSeoMeta(ad?: AdSeoSource | null) {
  const jobTitle = jobTitleSeoLabel(ad?.title)
  const employment = employmentTypeSeoLabel(ad?.employment_type)
  const city = adLocationSeoLabel(ad)
  const company = trimText(ad?.company_name) || 'شرکت'
  const role = joinSeoParts([jobTitle, employment])

  const title = city
    ? `استخدام ${role} در ${city} `
    : `استخدام ${role} `

  const description = city
    ? `${company} در ${city} به‌دنبال ${role} است؛ همین الان با های‌حساب رزومه بسازید و درخواست دهید.`
    : `${company} به‌دنبال ${role} است؛ همین الان با های‌حساب رزومه بسازید و درخواست دهید.`

  return { title, description }
}

export function getCityAdsListSeoMeta(
  location: string | null | undefined,
  fallback: { title: string; description: string },
) {
  const name = trimText(location)
  if (!name) return fallback

  return {
    title: `استخدام حسابدار در ${name} | جدیدترین فرصت‌های شغلی حسابداری`,
    description: `جدیدترین آگهی‌های استخدام حسابدار در ${name} را در های‌حساب ببینید؛ رزومه بسازید و درخواست‌تان را همین الان ارسال کنید.`,
  }
}
