import type { ApiResponse } from '~/types/api'
import type { ISelectItem } from '~/types/select-item'
import type {
  TaxReturnFormErrors,
  TaxReturnFormModel,
} from '~/types/tax-return-form'
import { createEmptyTaxReturnForm } from '~/types/tax-return-form'
import {
  buildTaxReturnPayload,
  isTaxReturnFormReady,
  validateTaxReturnForm,
} from '~/utils/tax-return-payload'

type TaxReturnPayment = {
  redirect_url?: string
  action?: string
} | null

type StoreTaxReturnResponse = ApiResponse<{
  taxReturn?: unknown
  payment?: TaxReturnPayment
}>

export function useTaxReturnForm() {
  const api = useApi()
  const { $toast } = useNuxtApp()
  const { user, name, cellphone } = useCurrentUser()

  const form = ref<TaxReturnFormModel>(createEmptyTaxReturnForm())
  const errors = ref<TaxReturnFormErrors>({})
  const submitting = ref(false)
  const editingContact = ref(false)

  const cityOptions = ref<ISelectItem[]>([])
  const citiesLoading = ref(false)

  const canSubmit = computed(() => isTaxReturnFormReady(form.value))

  function syncContactFromUser() {
    form.value.name = name.value === '—' ? '' : name.value
    form.value.cellphone = cellphone.value === '—' ? '' : cellphone.value

    const email = user.value?.email
    form.value.email = typeof email === 'string' ? email.trim() : ''
  }

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

  function onMapSelect(coords: { lat: number; long: number }) {
    form.value.lat = coords.lat
    form.value.long = coords.long
    if (errors.value.location) {
      const next = { ...errors.value }
      delete next.location
      errors.value = next
    }
  }

  async function submit() {
    const validationErrors = validateTaxReturnForm(form.value)
    errors.value = validationErrors

    if (Object.keys(validationErrors).length) {
      $toast.error('لطفا فیلدهای الزامی را تکمیل کنید')
      return false
    }

    submitting.value = true
    try {
      const payload = buildTaxReturnPayload(form.value)
      const result = await api.post<StoreTaxReturnResponse>(
        '/tax-returns',
        payload,
      )

      $toast.success('درخواست اظهارنامه با موفقیت ثبت شد')

      const payment = result.data?.payment
      const paymentUrl = payment?.redirect_url || payment?.action
      if (paymentUrl && import.meta.client) {
        window.location.href = paymentUrl
        return true
      }

      return true
    } catch (err: unknown) {
      const apiErrors =
        err && typeof err === 'object' && 'errors' in err
          ? (err as { errors?: Record<string, string[] | string> }).errors
          : undefined

      if (apiErrors && typeof apiErrors === 'object') {
        const next: TaxReturnFormErrors = {}
        for (const [key, value] of Object.entries(apiErrors)) {
          const message = Array.isArray(value) ? value[0] : value
          if (typeof message === 'string') {
            next[key as keyof TaxReturnFormErrors] = message
          }
        }
        errors.value = { ...errors.value, ...next }
      }

      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'ثبت درخواست با خطا مواجه شد'
      $toast.error(message)
      return false
    } finally {
      submitting.value = false
    }
  }

  onMounted(() => {
    syncContactFromUser()
  })

  watch(user, () => {
    if (!editingContact.value) syncContactFromUser()
  })

  return {
    form,
    errors,
    submitting,
    editingContact,
    cityOptions,
    citiesLoading,
    canSubmit,
    loadCities,
    onMapSelect,
    submit,
  }
}
