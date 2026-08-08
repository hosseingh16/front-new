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

/** Display URL for a company logo (swaps API placeholders for the local company default). */
export function resolveCompanyLogoDisplaySrc(
  url: string | null | undefined,
): string {
  if (isDefaultCompanyLogo(url)) return DEFAULT_COMPANY_LOGO_SRC
  return url as string
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
