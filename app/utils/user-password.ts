import * as Yup from 'yup'
import { toEnglishDigits } from '~/utils/digits'

const MIN_PASSWORD_LENGTH = 6

export function normalizeUserPassword(value: string): string {
  return toEnglishDigits(value).trim()
}

export function optionalUserPasswordSchema() {
  return Yup.string()
    .transform((value) => {
      if (typeof value !== 'string') return value
      const normalized = normalizeUserPassword(value)
      return normalized === '' ? undefined : normalized
    })
    .optional()
    .min(MIN_PASSWORD_LENGTH, 'رمز عبور باید حداقل ۶ کاراکتر باشد')
}
