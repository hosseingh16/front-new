import type { MaybeRef } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { Ad, AdList } from '~/types/ad'
import type { Opportunity } from '~/types/opportunity'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت اطلاعات آگهی'
}

export function useAd(id: MaybeRef<string | number>) {
  const api = useApi()
  const idRef = toRef(id)

  const { data, pending, error: fetchError, status, refresh } = useAsyncData(
    () => `ad-${idRef.value}`,
    async () => {
      try {
        const result = await api.get<ApiResponse<Ad>>(`/ads/${idRef.value}`)
        return result.data ?? null
      } catch (err: unknown) {
        const statusCode =
          err && typeof err === 'object' && 'status' in err
            ? Number((err as { status?: number }).status)
            : undefined

        if (statusCode === 404) {
          throw createError({ statusCode: 404, statusMessage: 'آگهی یافت نشد' })
        }

        throw err
      }
    },
    {
      watch: [idRef],
    },
  )

  const ad = computed(() => data.value ?? null)

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  )

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  function setHasApplied(value: boolean) {
    if (!data.value) return
    data.value = { ...data.value, has_applied: value }
  }

  return {
    ad,
    loading: pending,
    initialized,
    error,
    setHasApplied,
    refresh,
  }
}

export function useSimilarAds(excludeId: MaybeRef<string | number>) {
  const api = useApi()
  const excludeIdRef = toRef(excludeId)

  const { data, pending } = useAsyncData(
    () => `similar-ads-${excludeIdRef.value}`,
    () =>
      api
        .get<ApiResponse<Opportunity[]>>('/opportunities', {
          query: { per_page: 6, type: 'ad' },
        })
        .then((result) =>
          (result.data ?? []).filter(
            (item) =>
              item.type === 'ad' && item.item.id !== Number(excludeIdRef.value),
          ),
        ),
    {
      default: () => [] as Opportunity[],
      watch: [excludeIdRef],
    },
  )

  return {
    similarAds: computed(() => data.value ?? []),
    loadingSimilar: pending,
  }
}

export function useCompanyAds(
  companyName: MaybeRef<string | null | undefined>,
  excludeId?: MaybeRef<string | number | null | undefined>,
  options?: { enabled?: MaybeRef<boolean> },
) {
  const api = useApi()
  const companyNameRef = toRef(companyName)
  const excludeIdRef = toRef(excludeId)
  const enabledRef = toRef(options?.enabled ?? true)

  const normalizedCompanyName = computed(
    () => companyNameRef.value?.trim() || '',
  )

  const {
    data,
    pending,
    error: fetchError,
    execute,
  } = useAsyncData(
    () =>
      `company-ads-${normalizedCompanyName.value}-${excludeIdRef.value ?? 'all'}`,
    async () => {
      const name = normalizedCompanyName.value
      if (!name) return [] as AdList[]

      const result = await api.get<ApiResponse<AdList[]>>('/ads', {
        query: { company_name: name },
      })

      const exclude = Number(excludeIdRef.value)
      return (result.data ?? []).filter(
        (item) => !exclude || item.id !== exclude,
      )
    },
    {
      default: () => [] as AdList[],
      immediate: false,
      watch: [normalizedCompanyName, excludeIdRef],
    },
  )

  watch(
    [enabledRef, normalizedCompanyName],
    ([enabled, name]) => {
      if (enabled && name) {
        execute()
      }
    },
    { immediate: true },
  )

  const error = computed(() =>
    fetchError.value
      ? getFetchErrorMessage(fetchError.value) ||
        'خطا در دریافت آگهی‌های شرکت'
      : null,
  )

  return {
    companyAds: computed(() => data.value ?? []),
    loadingCompanyAds: pending,
    companyAdsError: error,
  }
}
