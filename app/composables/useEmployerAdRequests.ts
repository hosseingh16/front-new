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
    experience: [...filters.experience],
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
  if (filters.experience.length) {
    query.experience = filters.experience.join(',')
  }
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
  const hasLoadedOnce = ref(false)

  async function fetchRequests(): Promise<EmployerAdRequestsResult> {
    if (!adId.value) {
      return {
        requests: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
      }
    }

    const result = await api.get<ApiResponse<EmployerAdRequest[]>>(
      `/employers/ads/requests/${adId.value}`,
      { query: requestsQuery.value },
    )

    return {
      requests: result.data ?? [],
      currentPage: result.meta?.current_page ?? page.value,
      lastPage: result.meta?.last_page ?? 1,
      total: result.meta?.total ?? 0,
    }
  }

  const { data, pending, error: fetchError, status, refresh } = useAsyncData(
    cacheKey,
    fetchRequests,
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
    status,
    (value) => {
      if (value === 'success' || value === 'error') {
        hasLoadedOnce.value = true
      }
    },
    { immediate: true },
  )

  watch(adId, () => {
    hasLoadedOnce.value = false
  })

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

  const loading = computed(() => pending.value && !hasLoadedOnce.value)

  function patchRequest(requestId: number, patch: Partial<EmployerAdRequest>) {
    if (!data.value) return

    data.value = {
      ...data.value,
      requests: data.value.requests.map((request) =>
        request.id === requestId ? { ...request, ...patch } : request,
      ),
    }
  }

  async function syncRequestsSilently() {
    try {
      data.value = await fetchRequests()
    } catch {
      // Keep optimistic UI; next filter/page change will refetch.
    }
  }

  async function confirmRequest(requestId: number) {
    await api.post(`/employers/ads/${adId.value}/requests/${requestId}/confirm`)
    patchRequest(requestId, { status: 'تایید برای مصاحبه' })
  }

  async function rejectRequest(requestId: number) {
    await api.post(`/employers/ads/${adId.value}/requests/${requestId}/reject`)
    patchRequest(requestId, { status: 'رد شده' })
  }

  async function markRequestSeen(requestId: number) {
    await api.post(`/employers/ads/${adId.value}/requests/${requestId}/seen`)
    patchRequest(requestId, { status: 'مشاهده شده', seen: '1' })
    await syncRequestsSilently()
  }

  return {
    requests,
    currentPage,
    lastPage,
    total,
    loading,
    initialized,
    error,
    refresh,
    confirmRequest,
    rejectRequest,
    markRequestSeen,
  }
}
