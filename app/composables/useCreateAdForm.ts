import type { MaybeRef } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { Ad } from '~/types/ad'
import type { Company } from '~/types/company'
import type { CreateAdFormErrors, CreateAdFormModel } from '~/types/create-ad-form'
import {
  createEmptyCreateAdForm,
  createEmptyPartTimeWeekSchedule,
} from '~/types/create-ad-form'
import {
  buildCreateAdPayload,
  getResumeTermsValidationError,
  validateCreateAdForm,
} from '~/utils/create-ad-payload'
import type { ISelectItem } from '~/types/select-item'
import {
  isPaidAdCity,
  PAID_AD_CITY_PRICE,
} from '~/pages/dashboard/employer/ads/utils/paid-ad-cities'
import { isDraftEmployerAdStatus } from '~/pages/dashboard/employer/utils/employer-ad'

const LOOKUP_KEYS =
  'job_titles,employment_types,experience_levels,salary_ranges,benefits,proficiencies,education_levels,genders,accounting_programs,provinces'

/** The API stores lookup labels on the ad; map them back to option values. */
function reverseLookup(
  options: ISelectItem[],
  label: string | number | null | undefined,
) {
  if (label == null || label === '') return ''
  const match = options.find(
    (item) =>
      item.label === String(label) || String(item.value) === String(label),
  )
  return match ? String(match.value) : String(label)
}

function splitList(raw: string | string[] | null | undefined) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map((item) => item.trim()).filter(Boolean)
  return String(raw)
    .split(/,|،/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function useCreateAdForm(
  options: { adId?: MaybeRef<string | number | null> } = {},
) {
  const api = useApi()
  const route = useRoute()
  const router = useRouter()
  const { $toast } = useNuxtApp()

  const adIdRef = toRef(options.adId ?? null)
  const isEdit = computed(() => adIdRef.value != null && adIdRef.value !== '')

  const copyAdId = computed(() => {
    if (isEdit.value) return null
    const raw = route.query.copy
    const value = Array.isArray(raw) ? raw[0] : raw
    if (!value) return null
    const id = Number(value)
    return Number.isFinite(id) && id > 0 ? id : null
  })

  const form = ref<CreateAdFormModel>(createEmptyCreateAdForm())
  const errors = ref<CreateAdFormErrors>({})
  const submitting = ref(false)
  const savingDraft = ref(false)
  const loadingAd = ref(false)
  const editingAd = ref<Ad | null>(null)
  const copyingAd = ref<Ad | null>(null)

  const {
    items,
    loading: lookupsLoading,
    ready: lookupsReady,
  } = useLookups(LOOKUP_KEYS)

  const jobTitles = items('job_titles')
  const employmentTypes = items('employment_types')
  const experienceLevels = items('experience_levels')
  const salaryRanges = items('salary_ranges')
  const benefits = items('benefits')
  const proficiencies = items('proficiencies')
  const educationLevels = items('education_levels')
  const genders = items('genders')
  const accountingPrograms = items('accounting_programs')
  const provinces = items('provinces')

  function applyEmploymentTypeFromQuery() {
    if (isEdit.value) return

    const raw = route.query.employment_type
    const value = Array.isArray(raw) ? raw[0] : raw
    if (!value) return

    const match = employmentTypes.value.find(
      (item) => String(item.value) === String(value),
    )
    if (!match) return

    form.value.employment_type = String(match.value)
  }

  const cityOptions = ref<ISelectItem[]>([])
  const citiesLoading = ref(false)

  const companyName = ref('شرکت شما')
  const companyLogo = ref('')

  async function loadCompanyPreview() {
    try {
      const result = await api.get<
        ApiResponse<{
          company?: Company & {
            province_id?: number | null
            city_id?: number | null
          }
        }>
      >('/user')
      const company = result.data?.company
      if (!company) return

      if (company.name) companyName.value = company.name
      if (
        company.logo &&
        !company.logo.includes('company-default') &&
        !company.logo.includes('default-avatar')
      ) {
        companyLogo.value = company.logo
      }

      if (company.address && !form.value.company_address) {
        form.value.company_address = company.address
      }

      // Prefer ad edit/copy values; only prefill empty location from company.
      if (isEdit.value || copyAdId.value || form.value.province != null) return

      const provinceId =
        company.province_id ??
        (provinces.value.find((item) => item.label === company.province_name)
          ?.value as number | undefined) ??
        null

      if (provinceId == null) {
        if (company.province_name) {
          form.value.province_name = company.province_name
        }
        if (company.city_name) {
          form.value.city_name = company.city_name
        }
        return
      }

      form.value.province = provinceId
      form.value.province_name =
        provinces.value.find((item) => item.value === provinceId)?.label ??
        company.province_name ??
        ''

      await loadCities(provinceId)

      const cityId =
        company.city_id ??
        (cityOptions.value.find((item) => item.label === company.city_name)
          ?.value as number | undefined) ??
        null

      if (cityId != null) {
        form.value.city = cityId
        form.value.city_name =
          cityOptions.value.find((item) => item.value === cityId)?.label ??
          company.city_name ??
          ''
      } else if (company.city_name) {
        form.value.city_name = company.city_name
      }
    } catch {
      // Keep defaults when company preview cannot be loaded.
    }
  }

  const isPartTime = computed(() => {
    const selected = employmentTypes.value.find(
      (item) => String(item.value) === String(form.value.employment_type),
    )
    const label = selected?.label ?? form.value.employment_type
    return /پاره\s*وقت/.test(String(label))
  })

  const payableAmount = computed(() =>
    isPaidAdCity(form.value.city_name) ? PAID_AD_CITY_PRICE : 0,
  )

  async function loadCities(provinceId: number) {
    citiesLoading.value = true
    try {
      cityOptions.value = await api.get<ISelectItem[]>(`/cities/${provinceId}`)
    } catch {
      cityOptions.value = []
    } finally {
      citiesLoading.value = false
    }
  }

  function applyAdToForm(ad: Ad) {
    const next = createEmptyCreateAdForm()

    next.title = reverseLookup(jobTitles.value, ad.title)
    next.company_address = ad.company_address ?? ''
    next.province =
      ad.province != null && ad.province !== '' ? Number(ad.province) : null
    next.province_name = ad.province_name ?? ''
    next.city = ad.city != null && ad.city !== '' ? Number(ad.city) : null
    next.city_name = ad.city_name ?? ''
    next.employment_type = reverseLookup(
      employmentTypes.value,
      ad.employment_type,
    )
    next.salary_range = reverseLookup(salaryRanges.value, ad.salary_range)
    next.minimum_work_experience = reverseLookup(
      experienceLevels.value,
      ad.minimum_work_experience,
    )
    next.gender = reverseLookup(genders.value, ad.gender)
    next.minimum_degree = reverseLookup(educationLevels.value, ad.minimum_degree)
    next.resume_terms = ad.resume_terms ?? ''
    next.company_software = splitList(ad.company_software).map((item) =>
      reverseLookup(accountingPrograms.value, item),
    )
    next.company_advantages = splitList(ad.company_advantages).map((item) =>
      reverseLookup(benefits.value, item),
    )
    next.excel_skill =
      typeof ad.excel_skill === 'string' && ad.excel_skill
        ? ad.excel_skill
        : null
    next.maliat_skill =
      typeof ad.maliat_skill === 'string' && ad.maliat_skill
        ? ad.maliat_skill
        : null
    next.bimeh_skill =
      typeof ad.bimeh_skill === 'string' && ad.bimeh_skill
        ? ad.bimeh_skill
        : null
    next.baha_skill =
      typeof ad.baha_skill === 'string' && ad.baha_skill ? ad.baha_skill : null

    if (typeof ad.static_hours === 'string') {
      try {
        const parsed = JSON.parse(ad.static_hours) as {
          schedule?: string
          travel?: string
        }
        next.work_schedule = parsed?.schedule ?? ''
        next.travel_need = parsed?.travel ?? ''
      } catch {
        // legacy numeric/plain value, nothing to prefill
      }
    }

    const rawPartTime = (ad as { part_time_conditions?: string })
      .part_time_conditions
    if (rawPartTime) {
      try {
        const parsed = JSON.parse(rawPartTime) as {
          accounting_management?: string
          accounting_needs?: string[]
          work_hours_type?: string
          collaboration_type?: string
          days_per_week?: string | number
          hours_per_day?: string | number
          schedule?: Array<{
            day: string
            ranges: Array<{ start: string; end: string }>
          }>
        }
        next.accounting_management = parsed.accounting_management ?? ''
        next.accounting_needs = parsed.accounting_needs ?? []
        const legacyWorkHoursType =
          parsed.collaboration_type === 'floating'
            ? 'dynamic'
            : parsed.collaboration_type === 'fixed'
              ? 'static'
              : parsed.collaboration_type
        next.work_hours_type =
          parsed.work_hours_type ?? legacyWorkHoursType ?? ''
        next.floating_days =
          parsed.days_per_week != null ? String(parsed.days_per_week) : ''
        next.floating_hours =
          parsed.hours_per_day != null ? String(parsed.hours_per_day) : ''

        if (Array.isArray(parsed.schedule)) {
          next.fixed_schedule = createEmptyPartTimeWeekSchedule().map((day) => {
            const saved = parsed.schedule?.find((item) => item.day === day.day)
            if (!saved) return day
            return {
              day: day.day,
              enabled: true,
              ranges: saved.ranges?.length ? saved.ranges : day.ranges,
            }
          })
        }
      } catch {
        // malformed conditions, keep defaults
      }
    }

    if (!next.work_hours_type && ad.work_hours_type) {
      next.work_hours_type = ad.work_hours_type
    }
    if (!next.floating_days && ad.dynamic_need_days != null) {
      next.floating_days = String(ad.dynamic_need_days)
    }
    if (!next.floating_hours && ad.dynamic_need_hours != null) {
      next.floating_hours = String(ad.dynamic_need_hours)
    }

    form.value = next

    if (next.province) {
      loadCities(next.province)
    }
  }

  async function fetchOwnedAd(id: string | number) {
    try {
      const result = await api.get<ApiResponse<Ad>>(`/ads/${id}`)
      if (result.data) return result.data
    } catch {
      // Drafts and unpublished ads may only be available on the employer endpoint.
    }

    const result = await api.get<ApiResponse<Ad | { ad: Ad }>>(
      `/employers/ads/${id}`,
    )
    const data = result.data
    if (data && 'ad' in data && data.ad) return data.ad
    if (data && 'id' in data) return data as Ad
    return null
  }

  async function loadAdForEdit() {
    if (!isEdit.value) return
    loadingAd.value = true
    try {
      editingAd.value = await fetchOwnedAd(adIdRef.value as string | number)
      if (!editingAd.value) {
        $toast.error('آگهی مورد نظر یافت نشد')
      }
    } catch {
      $toast.error('دریافت اطلاعات آگهی با خطا مواجه شد')
    } finally {
      loadingAd.value = false
    }
  }

  async function loadAdForCopy() {
    if (!copyAdId.value) return
    loadingAd.value = true
    try {
      const result = await api.get<ApiResponse<Ad>>(`/ads/${copyAdId.value}`)
      copyingAd.value = result.data ?? null
      if (!copyingAd.value) {
        $toast.error('آگهی مورد نظر برای کپی یافت نشد')
      }
    } catch {
      $toast.error('دریافت اطلاعات آگهی برای کپی با خطا مواجه شد')
    } finally {
      loadingAd.value = false
    }
  }

  // Prefill only after both the ad and the lookups have loaded, since
  // mapping stored labels back to option values needs the lookups.
  let prefilled = false
  watchEffect(() => {
    if (prefilled || !lookupsReady.value) return

    if (editingAd.value) {
      prefilled = true
      applyAdToForm(editingAd.value)
      return
    }

    if (copyingAd.value) {
      prefilled = true
      applyAdToForm(copyingAd.value)
    }
  })

  watch(
    [lookupsReady, () => route.query.employment_type],
    ([ready]) => {
      if (!ready || copyAdId.value) return
      applyEmploymentTypeFromQuery()
    },
    { immediate: true },
  )

  const isEditingDraft = computed(() =>
    isDraftEmployerAdStatus(editingAd.value?.status),
  )
  const canSaveDraft = computed(() => !isEdit.value || isEditingDraft.value)

  type AdWriteResponse = ApiResponse<{
    ad?: Ad
    payment?: {
      redirect_url?: string
      action?: string
      payment_id?: number
    } | null
  } & Partial<Ad>>

  function buildPayload(isDraft = false) {
    return buildCreateAdPayload(
      form.value,
      {
        jobTitles: jobTitles.value,
        employmentTypes: employmentTypes.value,
        experienceLevels: experienceLevels.value,
        salaryRanges: salaryRanges.value,
        benefits: benefits.value,
        accountingPrograms: accountingPrograms.value,
        educationLevels: educationLevels.value,
        genders: genders.value,
      },
      { isDraft },
    )
  }

  function getWriteErrorMessage(err: unknown, fallback: string) {
    if (err && typeof err === 'object' && 'message' in err) {
      const message = String((err as { message?: string }).message)
      if (message) return message
    }
    return fallback
  }

  function getSavedAd(result: AdWriteResponse): Ad | null {
    const data = result.data
    if (!data) return null
    if (data.ad && typeof data.ad === 'object' && 'id' in data.ad) {
      return data.ad
    }
    if ('id' in data && data.id != null) {
      return data as Ad
    }
    return null
  }

  async function writeAd(isDraft: boolean) {
    const payload = buildPayload(isDraft)
    return isEdit.value
      ? await api.put<AdWriteResponse>(
          `/employers/ads/${adIdRef.value}`,
          payload,
        )
      : await api.post<AdWriteResponse>('/employers/ads', payload)
  }

  async function saveDraft() {
    errors.value = {}
    savingDraft.value = true
    try {
      const result = await writeAd(true)
      const saved = getSavedAd(result)
      $toast.success('پیش‌نویس ذخیره شد')

      if (!isEdit.value && saved?.id) {
        await router.replace(`/dashboard/employer/ads/${saved.id}/edit`)
        return true
      }

      if (saved) {
        editingAd.value = {
          ...(editingAd.value ?? saved),
          ...saved,
          status: saved.status || editingAd.value?.status || 'پیش نویس',
        }
      }
      return true
    } catch (err: unknown) {
      $toast.error(getWriteErrorMessage(err, 'ذخیره پیش‌نویس با خطا مواجه شد'))
      return false
    } finally {
      savingDraft.value = false
    }
  }

  watch(
    () => form.value.resume_terms,
    (value) => {
      if (!errors.value.resume_terms) return

      const nextError = getResumeTermsValidationError(value)
      if (nextError) {
        errors.value = { ...errors.value, resume_terms: nextError }
        return
      }

      const { resume_terms: _removed, ...rest } = errors.value
      errors.value = rest
    },
  )

  async function publish() {
    const validationErrors = validateCreateAdForm(form.value, {
      isPartTime: isPartTime.value,
    })
    errors.value = validationErrors

    if (Object.keys(validationErrors).length) {
      $toast.error('لطفا فیلدهای الزامی را تکمیل کنید')
      return false
    }

    submitting.value = true
    try {
      const result = await writeAd(false)

      $toast.success(
        isEdit.value ? 'آگهی با موفقیت ویرایش شد' : 'آگهی با موفقیت ثبت شد',
      )

      if (result.data?.payment?.payment_id) {
        await navigateTo(`/r/${result.data.payment.payment_id}`)
        return true
      }

      await router.push('/dashboard/employer/ads')
      return true
    } catch (err: unknown) {
      $toast.error(
        getWriteErrorMessage(
          err,
          isEdit.value ? 'ویرایش آگهی با خطا مواجه شد' : 'ثبت آگهی با خطا مواجه شد',
        ),
      )
      return false
    } finally {
      submitting.value = false
    }
  }

  onMounted(() => {
    loadCompanyPreview()

    if (isEdit.value) {
      loadAdForEdit()
      return
    }

    if (copyAdId.value) {
      loadAdForCopy()
    }
  })

  return {
    form,
    errors,
    isPartTime,
    payableAmount,
    isEdit,
    isCopy: computed(() => copyAdId.value != null),
    isEditingDraft,
    canSaveDraft,
    submitting,
    savingDraft,
    loadingAd,
    lookupsLoading,
    citiesLoading,
    cityOptions,
    companyName,
    companyLogo,
    jobTitles,
    employmentTypes,
    experienceLevels,
    salaryRanges,
    benefits,
    proficiencies,
    educationLevels,
    genders,
    accountingPrograms,
    loadCities,
    saveDraft,
    publish,
    loadCompanyPreview,
  }
}
