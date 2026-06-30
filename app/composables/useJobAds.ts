import type { Ref } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { JobFiltersModel } from '~/types/job-filters'
import type { Opportunity } from '~/types/opportunity'
import { buildAdsQueryFromFilters } from '~/utils/build-ads-query'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت فرصت‌های شغلی'
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

type JobOpportunitiesResult = {
  opportunities: Opportunity[]
  currentPage: number
  lastPage: number
}

function buildOpportunitiesQuery(
  filters: JobFiltersModel,
  page: number,
): Record<string, string | number> {
  const query = buildAdsQueryFromFilters(filters)
  const jobTypes = filters.jobTypes.map(String)
  const hasProject = jobTypes.includes('project')
  const employmentTypes = [
    ...new Set([
      ...jobTypes.filter((type) => type !== 'project'),
      ...filters.contractTypes.map(String),
    ]),
  ]

  if (employmentTypes.length) {
    query.employment_type = employmentTypes.join(',')
  } else {
    delete query.employment_type
  }

  if (hasProject && !employmentTypes.length) {
    query.type = 'project'
  }

  return {
    ...query,
    page,
  }
}

export function useJobAds(filters: Ref<JobFiltersModel>, page: Ref<number>) {
  const api = useApi()
  const debouncedFilters = ref<JobFiltersModel>(cloneFilters(filters.value))

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const opportunitiesQuery = computed(() =>
    buildOpportunitiesQuery(debouncedFilters.value, page.value),
  )

  const { data, pending, error: fetchError, status } = useAsyncData(
    'jobs-opportunities',
    () =>
      api
        .get<ApiResponse<Opportunity[]>>('/opportunities', {
          query: opportunitiesQuery.value,
        })
        .then((result): JobOpportunitiesResult => ({
          opportunities: result.data ?? [],
          currentPage: result.meta?.current_page ?? page.value,
          lastPage: result.meta?.last_page ?? 1,
        })),
    {
      default: (): JobOpportunitiesResult => ({
        opportunities: [],
        currentPage: 1,
        lastPage: 1,
      }),
      watch: [page, debouncedFilters],
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

  const opportunities = computed(() => data.value?.opportunities ?? [])
  const currentPage = computed(() => data.value?.currentPage ?? page.value)
  const lastPage = computed(() => data.value?.lastPage ?? 1)

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  )

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  return {
    opportunities,
    currentPage,
    lastPage,
    loading: pending,
    initialized,
    error,
  }
}
