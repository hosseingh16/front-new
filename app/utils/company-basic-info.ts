import type { CompanyProfileFormModel } from '~/types/company-profile-form'

const DEFAULT_LOGO_MARKERS = [
  'company-default',
  'images/company-default',
  'default-avatar',
]

export function isDefaultCompanyLogo(url: string | null | undefined): boolean {
  if (!url) return true
  return DEFAULT_LOGO_MARKERS.some((marker) => url.includes(marker))
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
