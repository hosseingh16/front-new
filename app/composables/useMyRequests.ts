import { SETTINGS_DEFAULTS } from '~/configs/settings-defaults'
import type { ApiResponse } from '~/types/api'
import type { MyRequest, MyRequestTab } from '~/types/my-request'
import {
  filterMyRequestsBySearch,
  filterMyRequestsByTab,
} from '~/pages/dashboard/utils/my-request'
import {
  mapJobSeekerAdsRequestToMyRequest,
  type JobSeekerAdsRequestApi,
} from '~/pages/dashboard/utils/map-my-request'

export const MY_REQUESTS_PAGE_SIZE =
  SETTINGS_DEFAULTS['pagination.my_requests']

function getFetchErrorMessage(err: unknown) {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت درخواست‌های شغلی'
}

export function useMyRequests(options: { immediate?: boolean } = {}) {
  const api = useApi()
  const { paginationMyRequests } = useSettings()
  const immediate = options.immediate ?? true
  const requests = ref<MyRequest[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  const activeTab = ref<MyRequestTab>('all')
  const searchQuery = ref('')
  const showSearch = ref(false)
  const currentPage = ref(1)

  async function fetchRequests() {
    loading.value = true
    error.value = null

    try {
      const result = await api.get<ApiResponse<JobSeekerAdsRequestApi[]>>(
        '/ads/requests',
        { query: { count: 100 } },
      )

      requests.value = (result.data ?? []).map(mapJobSeekerAdsRequestToMyRequest)
    } catch (err: unknown) {
      error.value = getFetchErrorMessage(err)
      requests.value = []
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  const filteredRequests = computed(() => {
    const byTab = filterMyRequestsByTab(requests.value, activeTab.value)
    return filterMyRequestsBySearch(byTab, searchQuery.value)
  })

  const totalCount = computed(() => requests.value.length)

  const lastPage = computed(() =>
    Math.max(1, Math.ceil(filteredRequests.value.length / paginationMyRequests.value)),
  )

  const paginatedRequests = computed(() => {
    const start = (currentPage.value - 1) * paginationMyRequests.value
    return filteredRequests.value.slice(start, start + paginationMyRequests.value)
  })

  function goToPage(page: number) {
    if (page < 1 || page > lastPage.value || page === currentPage.value) return
    currentPage.value = page
  }

  async function cancelRequest(id: number) {
    await api.delete(`/ads/requests/${id}`)
    requests.value = requests.value.filter((request) => request.id !== id)
  }

  function updateBookmark(id: number, bookmarked: boolean) {
    const target = requests.value.find((request) => request.id === id)
    if (target) target.is_bookmarked = bookmarked
  }

  watch(activeTab, () => {
    currentPage.value = 1
  })

  watch(searchQuery, () => {
    currentPage.value = 1
  })

  watch(lastPage, (value) => {
    if (currentPage.value > value) currentPage.value = value
  })

  onMounted(() => {
    if (immediate) fetchRequests()
  })

  return {
    requests,
    loading,
    error,
    initialized,
    activeTab,
    searchQuery,
    showSearch,
    currentPage,
    totalCount,
    filteredRequests,
    paginatedRequests,
    lastPage,
    fetchRequests,
    goToPage,
    cancelRequest,
    updateBookmark,
  }
}
