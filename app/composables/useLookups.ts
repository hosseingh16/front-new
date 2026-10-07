import type { ApiResponse } from '~/types/api'
import type { ISelectItem } from '~/types/select-item'
import {
  readLookupCatalogFromStorage,
  removeLookupCatalogFromStorage,
  writeLookupCatalogToStorage,
} from '~/utils/lookup-storage'

export type LookupKey = string

/** Single in-flight catalog fetch shared across all useLookups callers. */
let catalogInflight: Promise<void> | null = null

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

function normalizeCatalog(
  data: Record<string, ISelectItem[] | undefined> | null | undefined,
): Record<string, ISelectItem[]> {
  const entries: Record<string, ISelectItem[]> = {}
  if (!data) return entries

  for (const [key, value] of Object.entries(data)) {
    entries[key] = Array.isArray(value) ? value : []
  }

  return entries
}

export function useLookups(keys: MaybeRef<LookupKey | LookupKey[]>) {
  const api = useApi()
  const cache = useState<Record<string, ISelectItem[]>>(
    'lookup-cache',
    () => ({}),
  )
  const catalogLoaded = useState<boolean>('lookup-catalog-loaded', () => false)
  const catalogPending = useState<boolean>('lookup-catalog-pending', () => false)
  const catalogError = useState<unknown>('lookup-catalog-error', () => null)

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

  const pending = computed(
    () =>
      catalogPending.value &&
      normalizedKeys.value.some((key) => !isCached(cache.value, key)),
  )

  const ready = computed(
    () =>
      catalogLoaded.value &&
      normalizedKeys.value.every((key) => isCached(cache.value, key)) &&
      !pending.value,
  )

  const error = computed(() => catalogError.value)

  function setCacheEntries(entries: Record<string, ISelectItem[]>) {
    cache.value = { ...cache.value, ...entries }
  }

  function applyCatalog(data: Record<string, ISelectItem[]>) {
    setCacheEntries(data)

    // Ensure requested keys exist even if API omitted them.
    const fillers: Record<string, ISelectItem[]> = {}
    for (const key of normalizedKeys.value) {
      if (!(key in data) && !isCached(cache.value, key)) {
        fillers[key] = []
      }
    }
    if (Object.keys(fillers).length) {
      setCacheEntries(fillers)
    }

    catalogLoaded.value = true
  }

  function fillMissingRequestedKeys() {
    const fillers: Record<string, ISelectItem[]> = {}
    for (const key of normalizedKeys.value) {
      if (!isCached(cache.value, key)) {
        fillers[key] = []
      }
    }
    if (Object.keys(fillers).length) {
      setCacheEntries(fillers)
    }
  }

  function hydrateFromLocalStorage(): boolean {
    if (catalogLoaded.value && Object.keys(cache.value).length) {
      fillMissingRequestedKeys()
      return true
    }

    const stored = readLookupCatalogFromStorage()
    if (!stored) return false

    applyCatalog(stored)
    return true
  }

  async function fetchAllLookups(force = false) {
    if (!force && hydrateFromLocalStorage()) return

    if (!force && catalogLoaded.value && Object.keys(cache.value).length) {
      fillMissingRequestedKeys()
      return
    }

    if (catalogInflight) {
      await catalogInflight
      fillMissingRequestedKeys()
      return
    }

    catalogInflight = (async () => {
      catalogPending.value = true
      catalogError.value = null

      try {
        // Do not send Cache-Control request headers — API CORS allow-list
        // only includes accept/authorization/content-type/xsrf/etc.
        const response = await api.get<
          ApiResponse<Record<string, ISelectItem[]>>
        >('/lookups', {
          query: { keys: 'all' },
        })

        const entries = normalizeCatalog(response.data)
        applyCatalog(entries)
        writeLookupCatalogToStorage(entries)
      } catch (err) {
        const stored = readLookupCatalogFromStorage()
        if (stored) {
          applyCatalog(stored)
        } else {
          fillMissingRequestedKeys()
          catalogLoaded.value = true
        }
        catalogError.value = err
        throw err
      } finally {
        catalogPending.value = false
        catalogInflight = null
      }
    })()

    await catalogInflight
  }

  async function ensure(force = false) {
    if (!normalizedKeys.value.length && !force) return
    await fetchAllLookups(force)
  }

  watch(
    normalizedKeys,
    () => {
      void ensure().catch(() => {
        // Errors are stored in catalogError; avoid unhandled rejection from watch.
      })
    },
    { immediate: true },
  )

  function items(key: string) {
    return computed(() => cache.value[key] ?? [])
  }

  async function refresh() {
    removeLookupCatalogFromStorage()
    cache.value = {}
    catalogLoaded.value = false
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
