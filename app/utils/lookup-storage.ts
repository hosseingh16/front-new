import type { ISelectItem } from '~/types/select-item'

/** Bump when lookup catalog shape / strategy changes. */
const STORAGE_KEY = 'hihesab:lookups:v3:all'

/** Client persistence TTL (24h) — also invalidated by lookups.version mismatch. */
export const LOOKUPS_STORAGE_TTL_MS = 24 * 60 * 60 * 1000

export type StoredLookupCatalog = {
  savedAt: number
  version: number
  data: Record<string, ISelectItem[]>
}

function canUseStorage(): boolean {
  return import.meta.client && typeof localStorage !== 'undefined'
}

function isFresh(savedAt: number): boolean {
  return Date.now() - savedAt < LOOKUPS_STORAGE_TTL_MS
}

/** Full catalog from localStorage, or null if missing/expired/wrong version. */
export function readLookupCatalogFromStorage(
  options: { allowStale?: boolean; expectedVersion?: number | null } = {},
): StoredLookupCatalog | null {
  if (!canUseStorage()) return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<StoredLookupCatalog>
    if (
      !parsed ||
      typeof parsed.savedAt !== 'number' ||
      typeof parsed.version !== 'number' ||
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

    if (
      options.expectedVersion != null &&
      parsed.version !== options.expectedVersion
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed as StoredLookupCatalog
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
  version: number,
): void {
  if (!canUseStorage()) return

  try {
    const payload: StoredLookupCatalog = {
      savedAt: Date.now(),
      version: Math.max(1, version),
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
    // Drop legacy keys from earlier strategies.
    localStorage.removeItem('hihesab:lookups:v2:all')
  } catch {
    // ignore
  }
}
