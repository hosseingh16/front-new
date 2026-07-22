import type { ApiResponse } from '~/types/api'
import type { TaxReturnListItem } from '~/types/tax-return'

function getFetchErrorMessage(err: unknown) {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت درخواست‌های اظهارنامه'
}

export function useTaxReturns() {
  const api = useApi()

  const items = ref<TaxReturnListItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const total = ref(0)

  async function fetchTaxReturns(page = currentPage.value) {
    loading.value = true
    error.value = null

    try {
      const result = await api.get<ApiResponse<TaxReturnListItem[]>>(
        '/tax-returns',
        { query: { page, perPage: 12 } },
      )

      items.value = Array.isArray(result.data) ? result.data : []
      currentPage.value = result.meta?.current_page ?? page
      lastPage.value = result.meta?.last_page ?? 1
      total.value = result.meta?.total ?? items.value.length
    } catch (err: unknown) {
      error.value = getFetchErrorMessage(err)
      items.value = []
      total.value = 0
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  function goToPage(page: number) {
    if (page < 1 || page > lastPage.value || page === currentPage.value) return
    currentPage.value = page
    return fetchTaxReturns(page)
  }

  onMounted(() => {
    fetchTaxReturns()
  })

  return {
    items,
    loading,
    error,
    initialized,
    currentPage,
    lastPage,
    total,
    fetchTaxReturns,
    goToPage,
  }
}
