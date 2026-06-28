import type { Ref } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { AdList } from '~/types/ad'
import type { JobFiltersModel } from '~/types/job-filters'
import { buildAdsQueryFromFilters } from '~/utils/build-ads-query'

export function useJobAds(filters: Ref<JobFiltersModel>) {
  const api = useApi()

  const ads = ref<AdList[]>([])
  const loading = ref(true)
  const initialized = ref(false)
  const error = ref<string | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const fetchAds = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await api.get<ApiResponse<AdList[]>>('/ads', {
        query: buildAdsQueryFromFilters(filters.value),
      })
      ads.value = result.data ?? []
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message?: string }).message)
        : 'خطا در دریافت آگهی‌ها'
      error.value = message
      ads.value = []
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  const scheduleFetch = () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(fetchAds, 300)
  }

  watch(filters, scheduleFetch, { deep: true })

  onMounted(fetchAds)

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return { ads, loading, initialized, error, fetchAds }
}
