import type { ApiResponse } from '~/types/api'
import type { BookmarkEntry, BookmarksData } from '~/types/bookmark'
import { emptyBookmarksData } from '~/types/bookmark'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت نشان‌شده‌ها'
}

function unwrapEntries<T>(raw: unknown): BookmarkEntry<T>[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const entry = item as Record<string, unknown>
      if (entry.model && typeof entry.model === 'object') {
        return {
          model: entry.model as T,
          created_at:
            typeof entry.created_at === 'string' ? entry.created_at : undefined,
        }
      }
      // Fallback if API ever returns the model directly
      return { model: item as T }
    })
    .filter((item): item is BookmarkEntry<T> => item != null)
}

function normalizeBookmarks(raw: unknown): BookmarksData {
  const empty = emptyBookmarksData()
  if (!raw || typeof raw !== 'object') return empty

  const data = raw as Record<string, unknown>

  return {
    ad: unwrapEntries(data.ad),
    project: unwrapEntries(data.project),
    company: unwrapEntries(data.company),
    user: unwrapEntries(data.user),
    consultant: unwrapEntries(data.consultant),
  }
}

export function useBookmarks() {
  const api = useApi()

  const groups = ref<BookmarksData>(emptyBookmarksData())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  async function fetchBookmarks() {
    loading.value = true
    error.value = null

    try {
      const result = await api.get<ApiResponse<BookmarksData | unknown>>(
        '/bookmarks',
      )
      groups.value = normalizeBookmarks(result.data)
    } catch (err: unknown) {
      error.value = getFetchErrorMessage(err)
      groups.value = emptyBookmarksData()
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  onMounted(() => {
    fetchBookmarks()
  })

  return {
    groups,
    loading,
    initialized,
    error,
    fetchBookmarks,
  }
}
