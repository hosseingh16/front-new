import type { Ref } from 'vue'
import type { ApiResponse } from '~/types/api'
import type {
  ResumeBankFiltersModel,
  ResumeBankTab,
  ResumeBankUser,
} from '~/types/resume-bank'
import { buildResumeBankApiQuery } from '~/utils/resume-bank-query'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت بانک رزومه'
}

function cloneFilters(filters: ResumeBankFiltersModel): ResumeBankFiltersModel {
  return {
    titleSearch: filters.titleSearch,
    jobTitles: [...filters.jobTitles],
    skills: [...filters.skills],
    jobStatuses: [...filters.jobStatuses],
    experience: [...filters.experience],
    salaries: [...filters.salaries],
    education: [...filters.education],
    provinces: [...filters.provinces],
    gender: filters.gender,
  }
}

type ResumeBankResult = {
  users: ResumeBankUser[]
  currentPage: number
  lastPage: number
  total: number
}

export function useResumeBank(
  filters: Ref<ResumeBankFiltersModel>,
  page: Ref<number>,
  tab: Ref<ResumeBankTab>,
) {
  const api = useApi()
  const debouncedFilters = ref<ResumeBankFiltersModel>(cloneFilters(filters.value))

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  const hasLoadedOnce = ref(false)

  const usersQuery = computed(() =>
    buildResumeBankApiQuery(debouncedFilters.value, page.value, tab.value),
  )

  const {
    data,
    pending,
    error: fetchError,
    status,
    refresh,
  } = useAsyncData(
    'resume-bank-users',
    () =>
      api
        .get<ApiResponse<ResumeBankUser[]>>('/users', {
          query: usersQuery.value,
        })
        .then(
          (result): ResumeBankResult => ({
            users: result.data ?? [],
            currentPage: result.meta?.current_page ?? page.value,
            lastPage: result.meta?.last_page ?? 1,
            total: result.meta?.total ?? result.data?.length ?? 0,
          }),
        ),
    {
      default: (): ResumeBankResult => ({
        users: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
      }),
      watch: [page, debouncedFilters, tab],
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

  const users = computed(() => data.value?.users ?? [])
  const lastPage = computed(() => data.value?.lastPage ?? 1)
  const total = computed(() => data.value?.total ?? 0)

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  )

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  const loading = computed(() => pending.value && !hasLoadedOnce.value)

  return {
    users,
    lastPage,
    total,
    loading,
    initialized,
    error,
    refresh,
  }
}
