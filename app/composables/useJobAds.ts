import type { Ref } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { AdList } from '~/types/ad'
import type { JobFiltersModel } from '~/types/job-filters'
import { buildAdsQueryFromFilters } from '~/utils/build-ads-query'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت آگهی‌ها'
}

export function useJobAds(filters: Ref<JobFiltersModel>) {
  const api = useApi()
  const adsQuery = computed(() => buildAdsQueryFromFilters(filters.value))

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const { data, pending, error: fetchError, status, refresh } = useAsyncData(
    'jobs-ads',
    () =>
      api
        .get<ApiResponse<AdList[]>>('/ads', { query: adsQuery.value })
        .then((result) => result.data ?? []),
    { default: () => [] as AdList[] },
  )

  const scheduleRefresh = () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => refresh(), 300)
  }

  watch(filters, scheduleRefresh, { deep: true })

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  )

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  return { ads: data, loading: pending, initialized, error, fetchAds: refresh }
}
