import type { ApiResponse } from '~/types/api'
import type { Ad } from '~/types/ad'
import type { CreateAdFormErrors, CreateAdFormModel } from '~/types/create-ad-form'
import {
  CREATE_AD_DRAFT_KEY,
  createEmptyCreateAdForm,
} from '~/types/create-ad-form'
import {
  buildCreateAdPayload,
  validateCreateAdForm,
} from '~/utils/create-ad-payload'
import type { ISelectItem } from '~/types/select-item'

const LOOKUP_KEYS =
  'job_titles,employment_types,experience_levels,salary_ranges,benefits,proficiencies,education_levels,genders,accounting_programs'

export function useCreateAdForm() {
  const api = useApi()
  const router = useRouter()
  const { $toast } = useNuxtApp()

  const form = ref<CreateAdFormModel>(createEmptyCreateAdForm())
  const errors = ref<CreateAdFormErrors>({})
  const submitting = ref(false)
  const savingDraft = ref(false)

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
    const validationErrors = validateCreateAdForm(form.value)
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
      const result = await api.post<
        ApiResponse<{ ad: Ad; payment?: { redirect_url?: string } | null }>
      >('/employers/ads', payload)

      if (import.meta.client) {
        localStorage.removeItem(CREATE_AD_DRAFT_KEY)
      }

      $toast.success('آگهی با موفقیت ثبت شد')

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
          : 'ثبت آگهی با خطا مواجه شد'
      $toast.error(message)
      return false
    } finally {
      submitting.value = false
    }
  }

  onMounted(() => {
    // restoreDraft()
  })

  return {
    form,
    errors,
    submitting,
    savingDraft,
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
