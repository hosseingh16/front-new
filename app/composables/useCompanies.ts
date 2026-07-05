import type { Ref } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { CompanyList } from '~/types/company'
import type { CompanyFiltersModel } from '~/types/company-filters'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت لیست شرکت‌ها'
}

function cloneFilters(filters: CompanyFiltersModel): CompanyFiltersModel {
  return {
    search: filters.search,
    provinces: [...filters.provinces],
    cities: [...filters.cities],
    activities: [...filters.activities],
    sizes: [...filters.sizes],
    benefits: [...filters.benefits],
  }
}

type CompaniesResult = {
  companies: CompanyList[]
  currentPage: number
  lastPage: number
}

function buildCompaniesQuery(
  filters: CompanyFiltersModel,
  page: number,
): Record<string, string | number> {
  const query: Record<string, string | number> = { page }

  const search = filters.search.trim()
  if (search) query.search = search

  if (filters.provinces.length) {
    query.province_id = filters.provinces.join(',')
  }

  if (filters.cities.length) {
    query.city_id = filters.cities.join(',')
  }

  if (filters.activities.length) {
    query.activity = filters.activities.join(',')
  }

  if (filters.sizes.length) {
    query.size = filters.sizes.join(',')
  }

  if (filters.benefits.length) {
    query.benefits = filters.benefits.join(',')
  }

  return query
}

export function useCompanies(filters: Ref<CompanyFiltersModel>, page: Ref<number>) {
  const api = useApi()
  const debouncedFilters = ref<CompanyFiltersModel>(cloneFilters(filters.value))

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const companiesQuery = computed(() =>
    buildCompaniesQuery(debouncedFilters.value, page.value),
  )

  const { data, pending, error: fetchError, status } = useAsyncData(
    'companies-list',
    () =>
      api
        .get<ApiResponse<CompanyList[]>>('/companies', {
          query: companiesQuery.value,
        })
        .then((result): CompaniesResult => ({
          companies: result.data ?? [],
          currentPage: result.meta?.current_page ?? page.value,
          lastPage: result.meta?.last_page ?? 1,
        })),
    {
      default: (): CompaniesResult => ({
        companies: [],
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

  const companies = computed(() => data.value?.companies ?? [])
  const currentPage = computed(() => data.value?.currentPage ?? page.value)
  const lastPage = computed(() => data.value?.lastPage ?? 1)

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  )

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  return {
    companies,
    currentPage,
    lastPage,
    loading: pending,
    initialized,
    error,
  }
}
