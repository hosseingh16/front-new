import type { Ref } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { TaxReturnConsultant } from '~/types/tax-return-consultant'
import { asyncDataCacheKey } from '~/utils/async-data-cache-key'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت لیست مشاوران'
}

type ConsultantsResult = {
  consultants: TaxReturnConsultant[]
  currentPage: number
  lastPage: number
  total: number
}

export function useTaxReturnConsultants(page: Ref<number>) {
  const api = useApi()

  const consultantsQuery = computed(() => ({ page: page.value }))

  const cacheKey = computed(() =>
    asyncDataCacheKey('tax-return-consultants', consultantsQuery.value),
  )

  const { data, pending, error: fetchError, status } = useCachedAsyncData(
    cacheKey,
    () =>
      api
        .get<ApiResponse<TaxReturnConsultant[]>>('/tax-return-consultants', {
          query: consultantsQuery.value,
        })
        .then(
          (result): ConsultantsResult => ({
            consultants: result.data ?? [],
            currentPage: result.meta?.current_page ?? page.value,
            lastPage: result.meta?.last_page ?? 1,
            total: result.meta?.total ?? result.data?.length ?? 0,
          }),
        ),
    {
      default: (): ConsultantsResult => ({
        consultants: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
      }),
    },
  )

  const consultants = computed(() => data.value?.consultants ?? [])
  const currentPage = computed(() => data.value?.currentPage ?? page.value)
  const lastPage = computed(() => data.value?.lastPage ?? 1)
  const total = computed(() => data.value?.total ?? 0)

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  )

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  return {
    consultants,
    currentPage,
    lastPage,
    total,
    loading: pending,
    initialized,
    error,
  }
}
