import type { ApiResponse } from '~/types/api'
import type { ISelectItem } from '~/types/select-item'

export type LookupKey = string

/** In-flight promises keyed by lookup key (module-level for cross-composable dedupe). */
const inflightByKey = new Map<string, Promise<void>>()

function normalizeLookupKeys(input: LookupKey | LookupKey[]) {
  const rawKeys = Array.isArray(input) ? input : String(input).split(',')

  return [...new Set(rawKeys.map((key) => key.trim()).filter(Boolean))].sort()
}

function isCached(
  cache: Record<string, ISelectItem[]>,
  key: string,
) {
  return Object.prototype.hasOwnProperty.call(cache, key)
}

export function useLookups(keys: MaybeRef<LookupKey | LookupKey[]>) {
  const api = useApi()
  const cache = useState<Record<string, ISelectItem[]>>(
    'lookup-cache',
    () => ({}),
  )
  const pendingMap = useState<Record<string, boolean>>(
    'lookup-pending-map',
    () => ({}),
  )
  const errorMap = useState<Record<string, unknown>>(
    'lookup-error-map',
    () => ({}),
  )

  const normalizedKeys = computed(() => normalizeLookupKeys(toValue(keys)))

  const lookups = computed<Record<string, ISelectItem[]>>(() =>
    normalizedKeys.value.reduce(
      (result, key) => {
        result[key] = cache.value[key] ?? []
        return result
      },
      {} as Record<string, ISelectItem[]>,
    ),
  )

  const pending = computed(() =>
    normalizedKeys.value.some((key) => Boolean(pendingMap.value[key])),
  )

  const ready = computed(
    () =>
      normalizedKeys.value.every((key) => isCached(cache.value, key)) &&
      !pending.value,
  )

  const error = computed(() => {
    const failedKey = normalizedKeys.value.find(
      (key) => errorMap.value[key] != null,
    )
    return failedKey != null ? errorMap.value[failedKey] : null
  })

  function setPending(keysToUpdate: string[], value: boolean) {
    const next = { ...pendingMap.value }
    for (const key of keysToUpdate) {
      next[key] = value
    }
    pendingMap.value = next
  }

  function setCacheEntries(entries: Record<string, ISelectItem[]>) {
    cache.value = { ...cache.value, ...entries }
  }

  function setErrors(keysToUpdate: string[], err: unknown) {
    const next = { ...errorMap.value }
    for (const key of keysToUpdate) {
      next[key] = err
    }
    errorMap.value = next
  }

  function clearErrors(keysToUpdate: string[]) {
    const next = { ...errorMap.value }
    for (const key of keysToUpdate) {
      next[key] = null
    }
    errorMap.value = next
  }

  /**
   * Recover from HMR / aborted SSR where pending stayed true but the
   * module-level promise map was wiped.
   */
  function clearStalePending(keysToCheck: string[]) {
    const stale = keysToCheck.filter(
      (key) => pendingMap.value[key] && !inflightByKey.has(key),
    )
    if (!stale.length) return
    setPending(stale, false)
  }

  async function fetchLookupBatch(requestedKeys: string[], force = false) {
    if (!requestedKeys.length) return

    clearStalePending(requestedKeys)

    // Wait for any overlapping in-flight fetches so callers don't race.
    const waiting = requestedKeys
      .map((key) => inflightByKey.get(key))
      .filter((promise): promise is Promise<void> => promise != null)

    if (waiting.length) {
      await Promise.allSettled(waiting)
    }

    const keysToFetch = requestedKeys.filter((key) => {
      if (inflightByKey.has(key)) return false
      if (force) return true
      return !isCached(cache.value, key)
    })

    if (!keysToFetch.length) return

    const promise = (async () => {
      setPending(keysToFetch, true)
      clearErrors(keysToFetch)

      try {
        const response = await api.get<
          ApiResponse<Record<string, ISelectItem[]>>
        >('/lookups', {
          query: { keys: keysToFetch.join(',') },
        })
        const data = response.data ?? {}
        const entries: Record<string, ISelectItem[]> = {}

        for (const key of keysToFetch) {
          entries[key] = data[key] ?? []
        }

        setCacheEntries(entries)
      } catch (err) {
        // Cache empty arrays so consumers (forms/selects) are not blocked forever.
        const entries: Record<string, ISelectItem[]> = {}
        for (const key of keysToFetch) {
          entries[key] = cache.value[key] ?? []
        }
        setCacheEntries(entries)
        setErrors(keysToFetch, err)
        throw err
      } finally {
        for (const key of keysToFetch) {
          inflightByKey.delete(key)
        }
        setPending(keysToFetch, false)
      }
    })()

    for (const key of keysToFetch) {
      inflightByKey.set(key, promise)
    }

    await promise
  }

  async function ensure(force = false) {
    await fetchLookupBatch(normalizedKeys.value, force)
  }

  watch(
    normalizedKeys,
    () => {
      void ensure().catch(() => {
        // Errors are stored in errorMap; avoid unhandled rejection from watch.
      })
    },
    { immediate: true },
  )

  function items(key: string) {
    return computed(() => cache.value[key] ?? [])
  }

  async function refresh() {
    const keysToRefresh = normalizedKeys.value
    if (!keysToRefresh.length) return

    const nextCache = { ...cache.value }
    for (const key of keysToRefresh) {
      delete nextCache[key]
    }
    cache.value = nextCache

    await ensure(true)
  }

  return {
    lookups,
    loading: pending,
    ready,
    error,
    refresh,
    items,
    ensure,
  }
}
