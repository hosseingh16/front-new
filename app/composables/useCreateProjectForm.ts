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
import { isDefaultCompanyLogo } from '~/utils/company-basic-info'

type PublishResponse = ApiResponse<{
  project?: Project
  payment?: {
    id?: number
    redirect_url?: string
    action?: string
    payment_id?: number
    price?: number | string
    original_price?: number | string
    model_id?: number
  } | null
}>

export type ProjectCheckoutContext = {
  adId: number | string
  projectId: number | string
  paymentId: number
  price: number
}

export function useCreateProjectForm() {
  const api = useApi()
  const router = useRouter()
  const { $toast } = useNuxtApp()
  const { items } = useLookups('provinces')
  const provinces = items('provinces')

  const form = ref<CreateProjectFormModel>(createEmptyCreateProjectForm())
  const errors = ref<CreateProjectFormErrors>({})
  const submitting = ref(false)
  const savingDraft = ref(false)

  const companyName = ref('شرکت شما')
  const companyLogo = ref('')
  const companyProvince = ref('')
  const companyCity = ref('')
  const payableAmount = ref(500000)
  const preparedCheckout = ref<ProjectCheckoutContext | null>(null)

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
        (provinces.value.find((item) => item.label === company.province_name)
          ?.value as number | undefined) ??
        null

      companyProvince.value =
        (provinceId != null
          ? provinces.value.find((item) => item.value === provinceId)?.label
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

      const paymentId = resolvePaymentId(result.data?.payment)
      if (paymentId != null) {
        await navigateTo(`/r/${paymentId}`)
        return true
      }

      await router.push('/dashboard/employer/projects')
      return true
    } catch (err: unknown) {
      applyApiErrors(err)
      $toast.error(readErrorMessage(err, 'ثبت پروژه با خطا مواجه شد'))
      return false
    } finally {
      submitting.value = false
    }
  }

  async function preparePaidPublish(): Promise<ProjectCheckoutContext | null> {
    const validationErrors = validateCreateProjectForm(form.value)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length) {
      $toast.error('لطفا فیلدهای الزامی را تکمیل کنید')
      return null
    }

    if (preparedCheckout.value) return preparedCheckout.value

    submitting.value = true
    try {
      const payload = buildCreateProjectPayload(form.value)
      const result = await api.post<PublishResponse>('/employers/projects', payload)
      const payment = result.data?.payment
      const paymentId = resolvePaymentId(payment)
      const projectId = result.data?.project?.id ?? payment?.model_id

      if (import.meta.client) {
        localStorage.removeItem(CREATE_PROJECT_DRAFT_KEY)
      }

      if (paymentId == null || projectId == null) {
        $toast.error('پرداخت برای این پروژه ایجاد نشد')
        return null
      }

      preparedCheckout.value = {
        adId: projectId,
        projectId,
        paymentId,
        price: resolvePaymentPrice(payment),
      }

      return preparedCheckout.value
    } catch (err: unknown) {
      applyApiErrors(err)
      $toast.error(readErrorMessage(err, 'ثبت پروژه با خطا مواجه شد'))
      return null
    } finally {
      submitting.value = false
    }
  }

  async function goToPayment(paymentId: number, free = false) {
    if (!free) {
      await navigateTo(`/r/${paymentId}`)
      return
    }

    const config = useRuntimeConfig()
    const client = useSanctumClient()
    const baseURL = String(config.public.apiBase).replace(/\/v1\/?$/, '')

    try {
      await client(`/payments/${paymentId}/pay`, {
        baseURL,
        method: 'GET',
      })
      $toast.success('پروژه با موفقیت ثبت شد')
      await router.push('/dashboard/employer/projects')
    } catch (err: unknown) {
      $toast.error(readErrorMessage(err, 'ثبت پروژه رایگان با خطا مواجه شد'))
    }
  }

  function resolvePaymentId(
    payment: NonNullable<PublishResponse['data']>['payment'] | null | undefined,
  ) {
    const id = payment?.payment_id ?? payment?.id
    const value = Number(id)
    return Number.isFinite(value) && value > 0 ? value : null
  }

  function applyApiErrors(err: unknown) {
    const apiErrors =
      err && typeof err === 'object' && 'errors' in err
        ? (err as { errors?: Record<string, string[] | string> }).errors
        : undefined

    if (!apiErrors || typeof apiErrors !== 'object') return

    const next: CreateProjectFormErrors = {}
    for (const [key, value] of Object.entries(apiErrors)) {
      const message = Array.isArray(value) ? value[0] : value
      if (typeof message === 'string') {
        next[key as keyof CreateProjectFormErrors] = message
      }
    }
    errors.value = { ...errors.value, ...next }
  }

  function resolvePaymentPrice(
    payment: NonNullable<PublishResponse['data']>['payment'],
  ) {
    const raw = payment?.original_price ?? payment?.price ?? payableAmount.value
    const value = Number(raw)
    return Number.isFinite(value) ? value : payableAmount.value
  }

  function readErrorMessage(err: unknown, fallback: string) {
    return err && typeof err === 'object' && 'message' in err
      ? String((err as { message?: string }).message || fallback)
      : fallback
  }

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
    preparePaidPublish,
    goToPayment,
  }
}
