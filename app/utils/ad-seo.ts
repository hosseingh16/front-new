import type { Ad, AdList } from '~/types/ad'
import { provinces } from '~/feeders/provinces'
import type { ISelectItem } from '~/types/select-item'
import { normalizeFilterId } from '~/utils/job-filters-query'

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: 'تمام وقت',
  part_time: 'پاره وقت',
  project_based: 'پروژه',
  project: 'پروژه',
  remote: 'دورکاری',
  internship: 'کارآموزی',
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

  const key = raw
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .toLowerCase()
    .replace(/[\s-]+/g, '_')

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

export function resolveAdsListLocationLabel(
  selectedCityIds: Array<string | number>,
  citiesByProvince: Record<number, ISelectItem[]>,
  ads: Array<Pick<AdList, 'city_name'>>,
): string {
  const selectedIds = selectedCityIds.map((id) => String(normalizeFilterId(id)))
  if (!selectedIds.length) return ''

  if (selectedIds.length === 1) {
    const cityId = selectedIds[0]
    if (!cityId) return ''

    for (const cities of Object.values(citiesByProvince)) {
      const match = cities.find(
        (city) => String(normalizeFilterId(city.value)) === cityId,
      )
      if (match?.label) return trimText(match.label)
    }

    const names = [
      ...new Set(ads.map((ad) => trimText(ad.city_name)).filter(Boolean)),
    ]
    return names[0] ?? ''
  }

  const selectedSet = new Set(selectedIds)
  const matchedProvinceLabels: string[] = []
  const accountedIds = new Set<string>()

  for (const province of provinces) {
    const cities = citiesByProvince[province.value as number]
    if (!cities?.length) continue

    const cityIds = cities.map((city) => String(normalizeFilterId(city.value)))
    const selectedInProvince = cityIds.filter((id) => selectedSet.has(id))
    if (!selectedInProvince.length) continue
    if (selectedInProvince.length !== cityIds.length) return ''

    matchedProvinceLabels.push(province.label)
    cityIds.forEach((id) => accountedIds.add(id))
  }

  if (
    matchedProvinceLabels.length === 1 &&
    accountedIds.size === selectedSet.size
  ) {
    return matchedProvinceLabels[0] ?? ''
  }

  return ''
}
