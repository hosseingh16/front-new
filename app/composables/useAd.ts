import type { MaybeRef } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { Ad } from '~/types/ad'
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

  const { data, pending, error: fetchError, status } = useAsyncData(
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

  return {
    ad,
    loading: pending,
    initialized,
    error,
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
