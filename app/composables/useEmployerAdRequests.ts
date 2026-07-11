import type { Ref } from 'vue'
import type { ApiResponse } from '~/types/api'
import type {
  EmployerAdRequest,
  EmployerAdRequestFiltersModel,
  EmployerAdRequestTab,
} from '~/types/employer-ad-request'
import { resolveAdRequestStatusQuery } from '~/utils/employer-ad-request-filters-query'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت درخواست‌ها'
}

function cloneFilters(filters: EmployerAdRequestFiltersModel): EmployerAdRequestFiltersModel {
  return {
    statuses: [...filters.statuses],
    experience: filters.experience,
    gender: filters.gender,
  }
}

type EmployerAdRequestsResult = {
  requests: EmployerAdRequest[]
  currentPage: number
  lastPage: number
  total: number
}

function buildRequestsQuery(
  filters: EmployerAdRequestFiltersModel,
  page: number,
  tab: EmployerAdRequestTab,
): Record<string, string | number> {
  const query: Record<string, string | number> = { page }

  const status = resolveAdRequestStatusQuery(filters.statuses)
  if (status != null) query.status = status
  if (filters.experience) query.experience = filters.experience
  if (filters.gender != null) query.gender = filters.gender
  if (tab === 'bookmarked') query.only_bookmarked = 1

  return query
}

export function useEmployerAdRequests(
  adId: Ref<number>,
  filters: Ref<EmployerAdRequestFiltersModel>,
  page: Ref<number>,
  tab: Ref<EmployerAdRequestTab>,
) {
  const api = useApi()
  const debouncedFilters = ref<EmployerAdRequestFiltersModel>(cloneFilters(filters.value))

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const requestsQuery = computed(() =>
    buildRequestsQuery(debouncedFilters.value, page.value, tab.value),
  )

  const cacheKey = computed(() => `employer-ad-requests-${adId.value}`)

  const { data, pending, error: fetchError, status, refresh } = useAsyncData(
    cacheKey,
    () => {
      if (!adId.value) {
        return Promise.resolve({
          requests: [],
          currentPage: 1,
          lastPage: 1,
          total: 0,
        } satisfies EmployerAdRequestsResult)
      }

      return api
        .get<ApiResponse<EmployerAdRequest[]>>(`/employers/ads/requests/${adId.value}`, {
          query: requestsQuery.value,
        })
        .then((result): EmployerAdRequestsResult => ({
          requests: result.data ?? [],
          currentPage: result.meta?.current_page ?? page.value,
          lastPage: result.meta?.last_page ?? 1,
          total: result.meta?.total ?? 0,
        }))
    },
    {
      default: (): EmployerAdRequestsResult => ({
        requests: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
      }),
      watch: [adId, page, debouncedFilters, tab],
    },
  )

  watch(
    filters,
    (value) => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        debouncedFilters.value = cloneFilters(value)
      }, 300)
    },
    { deep: true },
  )

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  const requests = computed(() => data.value?.requests ?? [])
  const currentPage = computed(() => data.value?.currentPage ?? page.value)
  const lastPage = computed(() => data.value?.lastPage ?? 1)
  const total = computed(() => data.value?.total ?? 0)

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  )

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  async function confirmRequest(requestId: number) {
    await api.post(`/employers/ads/${adId.value}/requests/${requestId}/confirm`)
    await refresh()
  }

  async function rejectRequest(requestId: number) {
    await api.post(`/employers/ads/${adId.value}/requests/${requestId}/reject`)
    await refresh()
  }

  async function markRequestSeen(requestId: number) {
    await api.post(`/employers/ads/${adId.value}/requests/${requestId}/seen`)
    await refresh()
  }

  return {
    requests,
    currentPage,
    lastPage,
    total,
    loading: pending,
    initialized,
    error,
    refresh,
    confirmRequest,
    rejectRequest,
    markRequestSeen,
  }
}
