import type { MaybeRef } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { Ad } from '~/types/ad'
import type { CreateAdFormErrors, CreateAdFormModel } from '~/types/create-ad-form'
import {
  CREATE_AD_DRAFT_KEY,
  createEmptyCreateAdForm,
  createEmptyPartTimeWeekSchedule,
} from '~/types/create-ad-form'
import {
  buildCreateAdPayload,
  validateCreateAdForm,
} from '~/utils/create-ad-payload'
import type { ISelectItem } from '~/types/select-item'

const LOOKUP_KEYS =
  'job_titles,employment_types,experience_levels,salary_ranges,benefits,proficiencies,education_levels,genders,accounting_programs'

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
  const router = useRouter()
  const { $toast } = useNuxtApp()

  const adIdRef = toRef(options.adId ?? null)
  const isEdit = computed(() => adIdRef.value != null && adIdRef.value !== '')

  const form = ref<CreateAdFormModel>(createEmptyCreateAdForm())
  const errors = ref<CreateAdFormErrors>({})
  const submitting = ref(false)
  const savingDraft = ref(false)
  const loadingAd = ref(false)
  const editingAd = ref<Ad | null>(null)

  const { items, loading: lookupsLoading } = useLookups(LOOKUP_KEYS)

  const jobTitles = items('job_titles')
  const employmentTypes = items('employment_types')
  const experienceLevels = items('experience_levels')
  const salaryRanges = items('salary_ranges')
  const benefits = items('benefits')
  const proficiencies = items('proficiencies')
  const educationLevels = items('education_levels')
  const genders = items('genders')
  const accountingPrograms = items('accounting_programs')

  const cityOptions = ref<ISelectItem[]>([])
  const regionOptions = ref<ISelectItem[]>([])
  const citiesLoading = ref(false)
  const regionsLoading = ref(false)

  const companyName = ref('شرکت شما')
  const companyLogo = ref('')

  const isPartTime = computed(() => {
    const selected = employmentTypes.value.find(
      (item) => String(item.value) === String(form.value.employment_type),
    )
    const label = selected?.label ?? form.value.employment_type
    return /پاره\s*وقت/.test(String(label))
  })

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

  async function loadRegions(cityId: number) {
    regionsLoading.value = true
    try {
      regionOptions.value = await api.get<ISelectItem[]>(`/regions/${cityId}`)
    } catch {
      regionOptions.value = []
    } finally {
      regionsLoading.value = false
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
        next.collaboration_type = parsed.collaboration_type ?? ''
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

    form.value = next

    if (next.province) {
      loadCities(next.province).then(() => {
        if (next.city) {
          loadRegions(next.city)
        }
      })
    }
  }

  async function loadAdForEdit() {
    if (!isEdit.value) return
    loadingAd.value = true
    try {
      const result = await api.get<ApiResponse<Ad>>(`/ads/${adIdRef.value}`)
      editingAd.value = result.data ?? null
      if (!editingAd.value) {
        $toast.error('آگهی مورد نظر یافت نشد')
      }
    } catch {
      $toast.error('دریافت اطلاعات آگهی با خطا مواجه شد')
    } finally {
      loadingAd.value = false
    }
  }

  // Prefill only after both the ad and the lookups have loaded, since
  // mapping stored labels back to option values needs the lookups.
  let prefilled = false
  watchEffect(() => {
    if (prefilled || !editingAd.value || lookupsLoading.value) return
    prefilled = true
    applyAdToForm(editingAd.value)
  })

  function restoreDraft() {
    if (!import.meta.client) return

    const raw = localStorage.getItem(CREATE_AD_DRAFT_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as CreateAdFormModel
      form.value = { ...createEmptyCreateAdForm(), ...parsed }
      if (
        parsed.minimum_work_experience != null &&
        parsed.minimum_work_experience !== ''
      ) {
        form.value.minimum_work_experience = String(parsed.minimum_work_experience)
      }
      if (form.value.province) {
        loadCities(form.value.province).then(() => {
          if (form.value.city) {
            loadRegions(form.value.city)
          }
        })
      }
      $toast.info('پیش‌نویس بازیابی شد')
    } catch {
      localStorage.removeItem(CREATE_AD_DRAFT_KEY)
    }
  }

  function saveDraft() {
    if (!import.meta.client) return

    savingDraft.value = true
    try {
      localStorage.setItem(CREATE_AD_DRAFT_KEY, JSON.stringify(form.value))
      $toast.success('پیش‌نویس ذخیره شد')
    } finally {
      savingDraft.value = false
    }
  }

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
      const payload = buildCreateAdPayload(form.value, {
        jobTitles: jobTitles.value,
        employmentTypes: employmentTypes.value,
        experienceLevels: experienceLevels.value,
        salaryRanges: salaryRanges.value,
        benefits: benefits.value,
        accountingPrograms: accountingPrograms.value,
        educationLevels: educationLevels.value,
        genders: genders.value,
      })
      type PublishResponse = ApiResponse<{
        ad: Ad
        payment?: { redirect_url?: string } | null
      }>

      const result = isEdit.value
        ? await api.put<PublishResponse>(
            `/employers/ads/${adIdRef.value}`,
            payload,
          )
        : await api.post<PublishResponse>('/employers/ads', payload)

      if (!isEdit.value && import.meta.client) {
        localStorage.removeItem(CREATE_AD_DRAFT_KEY)
      }

      $toast.success(
        isEdit.value ? 'آگهی با موفقیت ویرایش شد' : 'آگهی با موفقیت ثبت شد',
      )

      const paymentUrl = result.data?.payment?.redirect_url
      if (paymentUrl && import.meta.client) {
        window.location.href = paymentUrl
        return true
      }

      await router.push('/dashboard/employer/ads')
      return true
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : isEdit.value
            ? 'ویرایش آگهی با خطا مواجه شد'
            : 'ثبت آگهی با خطا مواجه شد'
      $toast.error(message)
      return false
    } finally {
      submitting.value = false
    }
  }

  onMounted(() => {
    if (isEdit.value) {
      loadAdForEdit()
      return
    }
    // restoreDraft()
  })

  return {
    form,
    errors,
    isPartTime,
    isEdit,
    submitting,
    savingDraft,
    loadingAd,
    lookupsLoading,
    citiesLoading,
    regionOptions,
    regionsLoading,
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
    loadRegions,
    saveDraft,
    publish,
  }
}
