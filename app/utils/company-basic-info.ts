import type { CompanyProfileFormModel } from '~/types/company-profile-form'
import { DEFAULT_COMPANY_LOGO_SRC } from '~/libs/utils'

const DEFAULT_LOGO_MARKERS = [
  'company-default',
  'images/company-default',
  'default-avatar',
]

export function isDefaultCompanyLogo(url: string | null | undefined): boolean {
  if (!url) return true
  return DEFAULT_LOGO_MARKERS.some((marker) => url.includes(marker))
}

function normalizeApiOrigin(apiOrigin?: string): string {
  return (apiOrigin ?? '').replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
}

/** Display URL for a company logo (swaps API placeholders for the local company default). */
export function resolveCompanyLogoDisplaySrc(
  url: string | null | undefined,
  apiOrigin?: string,
): string {
  if (!url?.trim() || isDefaultCompanyLogo(url)) {
    return DEFAULT_COMPANY_LOGO_SRC
  }

  const value = url.trim()
  const origin = normalizeApiOrigin(apiOrigin)

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value)
      if (/^\/companies\//.test(parsed.pathname)) {
        return `${parsed.origin}/storage${parsed.pathname}`
      }
    } catch {
      // keep original
    }

    return value
  }

  if (!origin) return value

  if (value.startsWith('/storage/') || value.startsWith('storage/')) {
    return `${origin}/${value.replace(/^\//, '')}`
  }

  if (value.startsWith('companies/')) {
    return `${origin}/storage/${value}`
  }

  if (value.startsWith('/')) {
    return `${origin}${value}`
  }

  return `${origin}/storage/${value}`
}

export function needsCompanyBasicInfoModal(
  form: CompanyProfileFormModel,
): boolean {
  if (!form.id) return true
  if (!form.name.trim()) return true
  if (!form.logo?.url || isDefaultCompanyLogo(form.logo.url)) return true
  return false
}

export function validateCompanyBasicInfoModal(
  form: CompanyProfileFormModel,
): { name?: string; logo?: string } {
  const errors: { name?: string; logo?: string } = {}

  if (!form.name.trim()) {
    errors.name = 'نام شرکت الزامی است'
  }

  if (!form.logo?.url || isDefaultCompanyLogo(form.logo.url)) {
    errors.logo = 'لوگو سازمان الزامی است'
  }

  return errors
}
