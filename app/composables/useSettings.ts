import type { ApiResponse } from '~/types/api'
import {
  SETTINGS_DEFAULTS,
  type AppSettings,
  type SettingKey,
} from '~/configs/settings-defaults'

type SettingsPayload = Partial<Record<SettingKey, unknown>>

/** Module-level so parallel callers share the first GET. */
let inflight: Promise<void> | null = null

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

function unwrapSettings(response: unknown): SettingsPayload | null {
  if (!isRecord(response)) return null

  const nested = response.data
  if (isRecord(nested)) return nested as SettingsPayload

  return response as SettingsPayload
}

function readPositiveInt(
  data: SettingsPayload | null,
  key: SettingKey,
  fallback: number,
) {
  const parsed = Number(data?.[key])
  if (Number.isInteger(parsed) && parsed > 0) return parsed
  return fallback
}

function readNonNegativeNumber(
  data: SettingsPayload | null,
  key: SettingKey,
  fallback: number,
) {
  const parsed = Number(data?.[key])
  if (Number.isFinite(parsed) && parsed >= 0) return parsed
  return fallback
}

function readStringArray(
  data: SettingsPayload | null,
  key: SettingKey,
  fallback: readonly string[],
) {
  const raw = data?.[key]
  if (!Array.isArray(raw)) return [...fallback]
  const values = raw
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
  return values
}

export function useSettings() {
  const api = useApi()
  const cache = useState<SettingsPayload | null>(
    'app-settings-data',
    () => null,
  )
  const loaded = useState('app-settings-loaded', () => false)

  async function ensure() {
    if (loaded.value) return
    if (inflight) {
      await inflight
      return
    }

    inflight = (async () => {
      try {
        const response = await api.get<
          ApiResponse<SettingsPayload> | SettingsPayload
        >('/settings')
        const payload = unwrapSettings(response)
        if (payload) cache.value = payload
      } catch {
        // Keep local defaults when the endpoint is unavailable.
      } finally {
        loaded.value = true
        inflight = null
      }
    })()

    await inflight
  }

  void ensure()

  const adsMaxSoftwares = computed(() =>
    readPositiveInt(
      cache.value,
      'ads.max_softwares',
      SETTINGS_DEFAULTS['ads.max_softwares'],
    ),
  )
  const adsPaidCities = computed(() =>
    readStringArray(
      cache.value,
      'ads.paid_cities',
      SETTINGS_DEFAULTS['ads.paid_cities'],
    ),
  )
  const adsPaidCityPrice = computed(() =>
    readNonNegativeNumber(
      cache.value,
      'ads.paid_city_price',
      SETTINGS_DEFAULTS['ads.paid_city_price'],
    ),
  )
  const adsResumeTermsMaxLength = computed(() =>
    readPositiveInt(
      cache.value,
      'ads.resume_terms_max_length',
      SETTINGS_DEFAULTS['ads.resume_terms_max_length'],
    ),
  )
  const adsResumeTermsMinLength = computed(() =>
    readPositiveInt(
      cache.value,
      'ads.resume_terms_min_length',
      SETTINGS_DEFAULTS['ads.resume_terms_min_length'],
    ),
  )
  const cvMaxEducations = computed(() =>
    readPositiveInt(
      cache.value,
      'cv.max_educations',
      SETTINGS_DEFAULTS['cv.max_educations'],
    ),
  )
  const cvMaxPriors = computed(() =>
    readPositiveInt(
      cache.value,
      'cv.max_priors',
      SETTINGS_DEFAULTS['cv.max_priors'],
    ),
  )
  const cvMaxSoftwares = computed(() =>
    readPositiveInt(
      cache.value,
      'cv.max_softwares',
      SETTINGS_DEFAULTS['cv.max_softwares'],
    ),
  )
  const otpLength = computed(() =>
    readPositiveInt(cache.value, 'otp.length', SETTINGS_DEFAULTS['otp.length']),
  )
  const otpResendSeconds = computed(() =>
    readPositiveInt(
      cache.value,
      'otp.resend_seconds',
      SETTINGS_DEFAULTS['otp.resend_seconds'],
    ),
  )
  const otpVoiceDelaySeconds = computed(() =>
    readPositiveInt(
      cache.value,
      'otp.voice_delay_seconds',
      SETTINGS_DEFAULTS['otp.voice_delay_seconds'],
    ),
  )
  const paginationAds = computed(() =>
    readPositiveInt(
      cache.value,
      'pagination.ads',
      SETTINGS_DEFAULTS['pagination.ads'],
    ),
  )
  const paginationMyRequests = computed(() =>
    readPositiveInt(
      cache.value,
      'pagination.my_requests',
      SETTINGS_DEFAULTS['pagination.my_requests'],
    ),
  )
  const paginationSimilarAds = computed(() =>
    readPositiveInt(
      cache.value,
      'pagination.similar_ads',
      SETTINGS_DEFAULTS['pagination.similar_ads'],
    ),
  )
  const paginationTaxReturns = computed(() =>
    readPositiveInt(
      cache.value,
      'pagination.tax_returns',
      SETTINGS_DEFAULTS['pagination.tax_returns'],
    ),
  )
  const searchHomeResultLimit = computed(() =>
    readPositiveInt(
      cache.value,
      'search.home_result_limit',
      SETTINGS_DEFAULTS['search.home_result_limit'],
    ),
  )
  const taxReturnDescMaxLength = computed(() =>
    readPositiveInt(
      cache.value,
      'tax_return.desc_max_length',
      SETTINGS_DEFAULTS['tax_return.desc_max_length'],
    ),
  )
  const taxReturnPayablePrice = computed(() =>
    readNonNegativeNumber(
      cache.value,
      'tax_return.payable_price',
      SETTINGS_DEFAULTS['tax_return.payable_price'],
    ),
  )
  const uploadCompanyImageMaxMb = computed(() =>
    readPositiveInt(
      cache.value,
      'upload.company_image_max_mb',
      SETTINGS_DEFAULTS['upload.company_image_max_mb'],
    ),
  )
  const uploadCompanyLogoModalMaxMb = computed(() =>
    readPositiveInt(
      cache.value,
      'upload.company_logo_modal_max_mb',
      SETTINGS_DEFAULTS['upload.company_logo_modal_max_mb'],
    ),
  )
  const uploadCvAvatarMaxMb = computed(() =>
    readPositiveInt(
      cache.value,
      'upload.cv_avatar_max_mb',
      SETTINGS_DEFAULTS['upload.cv_avatar_max_mb'],
    ),
  )
  const uploadCvFileMaxMb = computed(() =>
    readPositiveInt(
      cache.value,
      'upload.cv_file_max_mb',
      SETTINGS_DEFAULTS['upload.cv_file_max_mb'],
    ),
  )
  const uploadDefaultMaxMb = computed(() =>
    readPositiveInt(
      cache.value,
      'upload.default_max_mb',
      SETTINGS_DEFAULTS['upload.default_max_mb'],
    ),
  )
  const uploadSignupAvatarMaxMb = computed(() =>
    readPositiveInt(
      cache.value,
      'upload.signup_avatar_max_mb',
      SETTINGS_DEFAULTS['upload.signup_avatar_max_mb'],
    ),
  )

  const resolved = computed<AppSettings>(() => ({
    'ads.max_softwares': adsMaxSoftwares.value,
    'ads.paid_cities': adsPaidCities.value,
    'ads.paid_city_price': adsPaidCityPrice.value,
    'ads.resume_terms_max_length': adsResumeTermsMaxLength.value,
    'ads.resume_terms_min_length': adsResumeTermsMinLength.value,
    'cv.max_educations': cvMaxEducations.value,
    'cv.max_priors': cvMaxPriors.value,
    'cv.max_softwares': cvMaxSoftwares.value,
    'otp.length': otpLength.value,
    'otp.resend_seconds': otpResendSeconds.value,
    'otp.voice_delay_seconds': otpVoiceDelaySeconds.value,
    'pagination.ads': paginationAds.value,
    'pagination.my_requests': paginationMyRequests.value,
    'pagination.similar_ads': paginationSimilarAds.value,
    'pagination.tax_returns': paginationTaxReturns.value,
    'search.home_result_limit': searchHomeResultLimit.value,
    'tax_return.desc_max_length': taxReturnDescMaxLength.value,
    'tax_return.payable_price': taxReturnPayablePrice.value,
    'upload.company_image_max_mb': uploadCompanyImageMaxMb.value,
    'upload.company_logo_modal_max_mb': uploadCompanyLogoModalMaxMb.value,
    'upload.cv_avatar_max_mb': uploadCvAvatarMaxMb.value,
    'upload.cv_file_max_mb': uploadCvFileMaxMb.value,
    'upload.default_max_mb': uploadDefaultMaxMb.value,
    'upload.signup_avatar_max_mb': uploadSignupAvatarMaxMb.value,
  }))

  return {
    ensure,
    loaded,
    resolved,
    adsMaxSoftwares,
    adsPaidCities,
    adsPaidCityPrice,
    adsResumeTermsMaxLength,
    adsResumeTermsMinLength,
    cvMaxEducations,
    cvMaxPriors,
    cvMaxSoftwares,
    otpLength,
    otpResendSeconds,
    otpVoiceDelaySeconds,
    paginationAds,
    paginationMyRequests,
    paginationSimilarAds,
    paginationTaxReturns,
    searchHomeResultLimit,
    taxReturnDescMaxLength,
    taxReturnPayablePrice,
    uploadCompanyImageMaxMb,
    uploadCompanyLogoModalMaxMb,
    uploadCvAvatarMaxMb,
    uploadCvFileMaxMb,
    uploadDefaultMaxMb,
    uploadSignupAvatarMaxMb,
  }
}
