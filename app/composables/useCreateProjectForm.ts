import type { ApiResponse } from '~/types/api'
import type { Company } from '~/types/company'
import type { Project } from '~/types/project'
import type {
  CreateProjectFormErrors,
  CreateProjectFormModel,
} from '~/types/create-project-form'
import {
  CREATE_PROJECT_DRAFT_KEY,
  createEmptyCreateProjectForm,
} from '~/types/create-project-form'
import {
  buildCreateProjectPayload,
  validateCreateProjectForm,
} from '~/utils/create-project-payload'
import { provinces } from '~/feeders/provinces'
import { isDefaultCompanyLogo } from '~/utils/company-basic-info'

type PublishResponse = ApiResponse<{
  project?: Project
  payment?: {
    redirect_url?: string
    action?: string
    payment_id?: number
  } | null
}>

export function useCreateProjectForm() {
  const api = useApi()
  const router = useRouter()
  const { $toast } = useNuxtApp()

  const form = ref<CreateProjectFormModel>(createEmptyCreateProjectForm())
  const errors = ref<CreateProjectFormErrors>({})
  const submitting = ref(false)
  const savingDraft = ref(false)

  const companyName = ref('شرکت شما')
  const companyLogo = ref('')
  const companyProvince = ref('')
  const companyCity = ref('')
  const payableAmount = ref(0)

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
      if (company.logo && !isDefaultCompanyLogo(company.logo)) {
        companyLogo.value = company.logo
      }

      const provinceId =
        company.province_id ??
        (provinces.find((item) => item.label === company.province_name)
          ?.value as number | undefined) ??
        null

      companyProvince.value =
        (provinceId != null
          ? provinces.find((item) => item.value === provinceId)?.label
          : undefined) ??
        company.province_name ??
        ''
      companyCity.value = company.city_name ?? ''
    } catch {
      // Keep defaults when company preview cannot be loaded.
    }
  }

  function saveDraft() {
    if (!import.meta.client) return

    savingDraft.value = true
    try {
      localStorage.setItem(CREATE_PROJECT_DRAFT_KEY, JSON.stringify(form.value))
      $toast.success('پیش‌نویس ذخیره شد')
    } finally {
      savingDraft.value = false
    }
  }

  async function publish() {
    const validationErrors = validateCreateProjectForm(form.value)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length) {
      $toast.error('لطفا فیلدهای الزامی را تکمیل کنید')
      return false
    }

    submitting.value = true
    try {
      const payload = buildCreateProjectPayload(form.value)
      const result = await api.post<PublishResponse>('/employers/projects', payload)

      if (import.meta.client) {
        localStorage.removeItem(CREATE_PROJECT_DRAFT_KEY)
      }

      $toast.success('پروژه با موفقیت ثبت شد')

      if (result.data?.payment?.payment_id) {
        await navigateTo(`/r/${result.data.payment.payment_id}`)
        return true
      }

      await router.push('/dashboard/employer/projects')
      return true
    } catch (err: unknown) {
      const apiErrors =
        err && typeof err === 'object' && 'errors' in err
          ? (err as { errors?: Record<string, string[] | string> }).errors
          : undefined

      if (apiErrors && typeof apiErrors === 'object') {
        const next: CreateProjectFormErrors = {}
        for (const [key, value] of Object.entries(apiErrors)) {
          const message = Array.isArray(value) ? value[0] : value
          if (typeof message === 'string') {
            next[key as keyof CreateProjectFormErrors] = message
          }
        }
        errors.value = { ...errors.value, ...next }
      }

      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'ثبت پروژه با خطا مواجه شد'
      $toast.error(message)
      return false
    } finally {
      submitting.value = false
    }
  }

  watch(
    () => form.value.presence_mode,
    (mode) => {
      if (mode === 'required') return

      form.value.min_time_value = null
      form.value.max_time_value = null
      if (errors.value.min_time || errors.value.max_time) {
        const next = { ...errors.value }
        delete next.min_time
        delete next.max_time
        errors.value = next
      }
    },
  )

  onMounted(() => {
    loadCompanyPreview()
  })

  return {
    form,
    errors,
    submitting,
    savingDraft,
    payableAmount,
    companyName,
    companyLogo,
    companyProvince,
    companyCity,
    loadCompanyPreview,
    saveDraft,
    publish,
  }
}
