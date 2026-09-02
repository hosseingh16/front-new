export const SETTINGS_DEFAULTS = {
  'ads.max_softwares': 3,
  'ads.paid_cities': ['مشهد', 'تهران'],
  'ads.paid_city_price': 345_000,
  'ads.resume_terms_max_length': 5000,
  'ads.resume_terms_min_length': 10,
  'cv.max_educations': 5,
  'cv.max_priors': 12,
  'cv.max_softwares': 5,
  'otp.length': 5,
  'otp.resend_seconds': 60,
  'otp.voice_delay_seconds': 20,
  'pagination.ads': 12,
  'pagination.my_requests': 5,
  'pagination.similar_ads': 6,
  'pagination.tax_returns': 12,
  'search.home_result_limit': 5,
  'tax_return.desc_max_length': 500,
  'tax_return.payable_price': 1_000_000,
  'upload.company_image_max_mb': 2,
  'upload.company_logo_modal_max_mb': 10,
  'upload.cv_avatar_max_mb': 10,
  'upload.cv_file_max_mb': 50,
  'upload.default_max_mb': 10,
  'upload.signup_avatar_max_mb': 2,
} as const

export type SettingKey = keyof typeof SETTINGS_DEFAULTS

export type AppSettings = {
  [K in SettingKey]: (typeof SETTINGS_DEFAULTS)[K] extends readonly string[]
    ? string[]
    : number
}

export function mbToBytes(mb: number) {
  return mb * 1024 * 1024
}

export function createEmptyOtpDigits(
  length = SETTINGS_DEFAULTS['otp.length'],
) {
  return Array.from({ length }, () => '')
}

export function otpCompletePattern(length: number) {
  return new RegExp(`^\\d{${length}}$`)
}
