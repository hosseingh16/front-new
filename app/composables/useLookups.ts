import type { ApiResponse } from '~/types/api'
import type { ISelectItem } from '~/types/select-item'

export type LookupKey = string

export function useLookups(keys: MaybeRef<LookupKey | LookupKey[]>) {
  const api = useApi()
  const keysRef = computed(() => {
    const value = toValue(keys)
    return Array.isArray(value) ? value.join(',') : value
  })

  const { data, pending, error, refresh } = useAsyncData(
    () => `lookups-${keysRef.value}`,
    async () => {
      const response = await api.get<ApiResponse<Record<string, ISelectItem[]>>>(
        '/lookups',
        { query: { keys: keysRef.value } },
      )
      return response.data ?? {}
    },
    {
      watch: [keysRef],
      default: () => ({} as Record<string, ISelectItem[]>),
    },
  )

  function items(key: string) {
    return computed(() => data.value?.[key] ?? [])
  }

  return {
    lookups: data,
    loading: pending,
    error,
    refresh,
    items,
  }
}
