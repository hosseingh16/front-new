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

function cloneFilters(filters: JobFiltersModel): JobFiltersModel {
  return {
    jobTypes: [...filters.jobTypes],
    titleSearch: filters.titleSearch,
    jobGroups: [...filters.jobGroups],
    cities: [...filters.cities],
    provinces: [...filters.provinces],
    salaries: [...filters.salaries],
    workHistory: [...filters.workHistory],
    contractTypes: [...filters.contractTypes],
    benefits: [...filters.benefits],
  }
}

type JobAdsResult = {
  ads: AdList[]
  currentPage: number
  lastPage: number
}

export function useJobAds(filters: Ref<JobFiltersModel>, page: Ref<number>) {
  const api = useApi()
  const debouncedFilters = ref<JobFiltersModel>(cloneFilters(filters.value))

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const adsQuery = computed(() => ({
    ...buildAdsQueryFromFilters(debouncedFilters.value),
    page: page.value,
  }))

  const { data, pending, error: fetchError, status } = useAsyncData(
    'jobs-ads',
    () =>
      api
        .get<ApiResponse<AdList[]>>('/ads', { query: adsQuery.value })
        .then((result): JobAdsResult => ({
          ads: result.data ?? [],
          currentPage: result.meta?.current_page ?? page.value,
          lastPage: result.meta?.last_page ?? 1,
        })),
    {
      default: (): JobAdsResult => ({
        ads: [],
        currentPage: 1,
        lastPage: 1,
      }),
      watch: [page, debouncedFilters],
      dedupe: false,
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

  const ads = computed(() => data.value?.ads ?? [])
  const currentPage = computed(() => data.value?.currentPage ?? page.value)
  const lastPage = computed(() => data.value?.lastPage ?? 1)

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  )

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  return {
    ads,
    currentPage,
    lastPage,
    loading: pending,
    initialized,
    error,
  }
}
