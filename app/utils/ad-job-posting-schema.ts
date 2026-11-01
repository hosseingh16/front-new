import type { Ad } from '~/types/ad'
import { normalizeEmploymentTypeKey } from '~/utils/ad-seo'

const NEGOTIATED_SALARY_RE =
  /توافقی|اعلام\s*نمی\s*شود|مشخص\s*نشده|مخفی|نامشخص|negotiat/i

const EMPLOYMENT_TYPE_SCHEMA: Record<string, 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR'> =
  {
    full_time: 'FULL_TIME',
    part_time: 'PART_TIME',
    project_based: 'CONTRACTOR',
    project: 'CONTRACTOR',
    contractor: 'CONTRACTOR',
  }

const EDUCATION_CREDENTIAL: Array<{
  pattern: RegExp
  credentialCategory: string
}> = [
  { pattern: /دکترا|دکتری|phd/i, credentialCategory: 'doctorate degree' },
  {
    pattern: /کارشناسی\s*ارشد|فوق\s*لیسانس|ارشد|master/i,
    credentialCategory: 'postgraduate degree',
  },
  {
    pattern: /کارشناسی|لیسانس|bachelor/i,
    credentialCategory: 'bachelor degree',
  },
  {
    pattern: /کاردانی|فوق\s*دیپلم|associate/i,
    credentialCategory: 'associate degree',
  },
  { pattern: /دیپلم|high\s*school/i, credentialCategory: 'high school' },
]

function trimText(value?: string | number | null): string {
  if (value == null) return ''
  return String(value).trim()
}

function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

function toHtmlParagraph(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return looksLikeHtml(trimmed) ? trimmed : `<p>${trimmed}</p>`
}

function toIsoDate(value?: string | null): string | undefined {
  const raw = trimText(value)
  if (!raw) return undefined

  if (/^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
  }

  const parsed = new Date(raw)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10)
  }

  const match = raw.match(/^(\d{4}-\d{2}-\d{2})/)
  return match?.[1]
}

function toValidThrough(value?: string | null): string | undefined {
  const raw = trimText(value)
  if (!raw) return undefined

  if (/T\d{2}:\d{2}/.test(raw)) return raw

  const isoDate = toIsoDate(raw)
  if (!isoDate) return undefined

  return `${isoDate}T23:59+03:30`
}

function extractSalaryNumbers(raw: string): number[] {
  return (
    raw
      .match(/[\d٠-٩۰-۹]+(?:[.,][\d٠-٩۰-۹]+)*/g)
      ?.map((token) =>
        Number(
          token
            .replace(/[٠-٩]/g, (digit) =>
              String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)),
            )
            .replace(/[۰-۹]/g, (digit) =>
              String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)),
            )
            .replace(/,/g, ''),
        ),
      )
      .filter((value) => Number.isFinite(value) && value > 0) ?? []
  )
}

/** Convert a displayed salary label/number into IRR min/max, or null when negotiated/hidden. */
export function parseAdSalaryIrrRange(
  ad: Pick<Ad, 'salary' | 'salary_range'>,
): { minValue: number; maxValue: number } | null {
  if (typeof ad.salary === 'number' && Number.isFinite(ad.salary) && ad.salary > 0) {
    const value = ad.salary < 1_000 ? ad.salary * 10_000_000 : ad.salary
    return { minValue: value, maxValue: value }
  }

  const raw = trimText(ad.salary ?? ad.salary_range)
  if (!raw || NEGOTIATED_SALARY_RE.test(raw)) return null

  const numbers = extractSalaryNumbers(raw)
  if (!numbers.length) return null

  let minValue = Math.min(...numbers)
  let maxValue = Math.max(...numbers)

  if (/میلیون/i.test(raw) || (minValue < 1000 && maxValue < 1000)) {
    minValue *= 10_000_000
    maxValue *= 10_000_000
  } else if (/تومان/i.test(raw) && maxValue < 1_000_000_000) {
    minValue *= 10
    maxValue *= 10
  }

  return { minValue, maxValue }
}

export function mapEmploymentTypeSchema(
  type?: string | number | null,
): 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | undefined {
  const key = normalizeEmploymentTypeKey(type)
  if (!key) return undefined
  return EMPLOYMENT_TYPE_SCHEMA[key]
}

function mapEducationRequirements(degree?: string | null) {
  const raw = trimText(degree)
  if (!raw) return undefined

  const match = EDUCATION_CREDENTIAL.find((item) => item.pattern.test(raw))
  if (!match) return undefined

  return {
    '@type': 'EducationalOccupationalCredential' as const,
    credentialCategory: match.credentialCategory,
  }
}

function buildJobDescription(ad: Ad): string {
  const parts = [
    toHtmlParagraph(trimText(ad.job_description)),
    toHtmlParagraph(trimText(ad.resume_terms)),
  ].filter(Boolean)

  if (parts.length) return parts.join('')

  const title = trimText(ad.title) || 'فرصت شغلی'
  const company = trimText(ad.company_name) || 'شرکت'
  return `<p>${company} در های‌حساب آگهی «${title}» را منتشر کرده است.</p>`
}

export type AdJobPostingSchema = {
  '@context': 'https://schema.org'
  '@type': 'JobPosting'
  title: string
  description: string
  datePosted?: string
  validThrough?: string
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR'
  directApply?: boolean
  educationRequirements?: {
    '@type': 'EducationalOccupationalCredential'
    credentialCategory: string
  }
  hiringOrganization: {
    '@type': 'Organization'
    name: string
    description?: string
  }
  jobLocation: {
    '@type': 'Place'
    address: {
      '@type': 'PostalAddress'
      addressLocality?: string
      addressRegion?: string
      addressCountry: 'IR'
    }
  }
  baseSalary?: {
    '@type': 'MonetaryAmount'
    currency: 'IRR'
    value: {
      '@type': 'QuantitativeValue'
      minValue: number
      maxValue: number
      unitText: 'MONTH'
    }
  }
}

export function buildAdJobPostingSchema(
  ad?: Ad | null,
): AdJobPostingSchema | null {
  if (!ad?.title) return null

  const datePosted = toIsoDate(ad.publish_date || ad.created_at)
  const validThrough = toValidThrough(ad.expire_date)
  const employmentType = mapEmploymentTypeSchema(ad.employment_type)
  const educationRequirements = mapEducationRequirements(ad.minimum_degree)
  const salaryRange = parseAdSalaryIrrRange(ad)
  const orgDescription =
    trimText(ad.company_description) ||
    trimText(ad.company?.intro) ||
    undefined
  const city = trimText(ad.city_name) || trimText(ad.company?.city_name)
  const region =
    trimText(ad.province_name) || trimText(ad.company?.province_name)

  const schema: AdJobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: trimText(ad.title),
    description: buildJobDescription(ad),
    hiringOrganization: {
      '@type': 'Organization',
      name: trimText(ad.company_name) || trimText(ad.company?.name) || 'شرکت',
      ...(orgDescription ? { description: orgDescription } : {}),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        ...(city ? { addressLocality: city } : {}),
        ...(region ? { addressRegion: region } : {}),
        addressCountry: 'IR',
      },
    },
    directApply: !ad.expired,
  }

  if (datePosted) schema.datePosted = datePosted
  if (validThrough) schema.validThrough = validThrough
  if (employmentType) schema.employmentType = employmentType
  if (educationRequirements) schema.educationRequirements = educationRequirements

  if (salaryRange) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'IRR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: salaryRange.minValue,
        maxValue: salaryRange.maxValue,
        unitText: 'MONTH',
      },
    }
  }

  return schema
}

export function buildHomeOrganizationWebsiteSchema(siteUrl = 'https://hihesab.com') {
  const origin = siteUrl.replace(/\/$/, '')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${origin}/#org`,
        name: 'های حساب',
        alternateName: 'HiHesab',
        url: origin,
        logo: `${origin}/_ipx/_/images/logo.png`,
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: 'های حساب',
        inLanguage: 'fa-IR',
        publisher: { '@id': `${origin}/#org` },
      },
    ],
  }
}
