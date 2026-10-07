import type { ISelectItem } from '~/types/select-item'

/** Bump when lookup catalog shape / strategy changes. */
const STORAGE_KEY = 'hihesab:lookups:v2:all'

/** Client persistence TTL (24h). */
export const LOOKUPS_STORAGE_TTL_MS = 24 * 60 * 60 * 1000

type StoredLookupCatalog = {
  savedAt: number
  data: Record<string, ISelectItem[]>
}

function canUseStorage(): boolean {
  return import.meta.client && typeof localStorage !== 'undefined'
}

function isFresh(savedAt: number): boolean {
  return Date.now() - savedAt < LOOKUPS_STORAGE_TTL_MS
}

/** Full catalog from localStorage, or null if missing/(optionally) expired. */
export function readLookupCatalogFromStorage(
  options: { allowStale?: boolean } = {},
): Record<string, ISelectItem[]> | null {
  if (!canUseStorage()) return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as StoredLookupCatalog
    if (
      !parsed ||
      typeof parsed.savedAt !== 'number' ||
      !parsed.data ||
      typeof parsed.data !== 'object'
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    if (!(options.allowStale || isFresh(parsed.savedAt))) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed.data
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    return null
  }
}

export function writeLookupCatalogToStorage(
  data: Record<string, ISelectItem[]>,
): void {
  if (!canUseStorage()) return

  try {
    const payload: StoredLookupCatalog = {
      savedAt: Date.now(),
      data,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Quota / private mode — ignore
  }
}

export function removeLookupCatalogFromStorage(): void {
  if (!canUseStorage()) return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
