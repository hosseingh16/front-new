import * as Yup from 'yup'
import { toEnglishDigits } from '~/utils/digits'

/** Canonical Iranian mobile stored and looked up in the API: 11 ASCII digits starting with 09. */
export const IRAN_MOBILE_PATTERN = /^09\d{9}$/

export function normalizeIranMobile(value: string): string {
  const digits = toEnglishDigits(value).replace(/\D/g, '')
  if (!digits) return ''
  return digits.startsWith('0') ? digits : `0${digits}`
}

export function iranMobileSchema() {
  return Yup.string()
    .transform((value) =>
      typeof value === 'string' ? normalizeIranMobile(value) : value,
    )
    .required('شماره همراه وارد نشده است')
    .matches(IRAN_MOBILE_PATTERN, { message: 'شماره همراه معتبر نیست' })
}
