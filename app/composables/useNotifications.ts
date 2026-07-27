import type { AppNotification, NotificationPayload, NotificationsResponse } from '~/types/notification'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت اعلان‌ها'
}

function parsePayload(raw: unknown): NotificationPayload {
  if (!raw) return {}

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object'
        ? (parsed as NotificationPayload)
        : { message: raw }
    } catch {
      return { message: raw }
    }
  }

  if (typeof raw === 'object') {
    return raw as NotificationPayload
  }

  return {}
}

function normalizeNotification(raw: unknown): AppNotification | null {
  if (!raw || typeof raw !== 'object') return null

  const item = raw as Record<string, unknown>
  const id = item.id
  if (typeof id !== 'string' && typeof id !== 'number') return null

  return {
    id: String(id),
    type: typeof item.type === 'string' ? item.type : undefined,
    data: parsePayload(item.data),
    read_at: typeof item.read_at === 'string' ? item.read_at : null,
    created_at:
      typeof item.created_at === 'string' ? item.created_at : '',
    updated_at:
      typeof item.updated_at === 'string' ? item.updated_at : undefined,
    notifiable_id:
      typeof item.notifiable_id === 'number' || typeof item.notifiable_id === 'string'
        ? item.notifiable_id
        : undefined,
    notifiable_type:
      typeof item.notifiable_type === 'string' ? item.notifiable_type : undefined,
  }
}

function unwrapList(raw: unknown): AppNotification[] {
  let source: unknown[] = []

  if (Array.isArray(raw)) {
    source = raw
  } else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    const nested =
      obj.data && typeof obj.data === 'object'
        ? (obj.data as Record<string, unknown>)
        : null

    if (nested && Array.isArray(nested.notifications)) {
      source = nested.notifications
    } else if (Array.isArray(obj.notifications)) {
      source = obj.notifications
    } else if (Array.isArray(obj.data)) {
      source = obj.data
    }
  }

  return source
    .map(normalizeNotification)
    .filter((item): item is AppNotification => item != null)
}

export function useNotifications() {
  const api = useApi()

  const items = useState<AppNotification[]>('notifications-items', () => [])
  const loading = useState<boolean>('notifications-loading', () => false)
  const marking = useState<boolean>('notifications-marking', () => false)
  const error = useState<string | null>('notifications-error', () => null)
  const initialized = useState<boolean>('notifications-initialized', () => false)

  const unreadCount = computed(
    () => items.value.filter((item) => !item.read_at).length,
  )

  async function fetchNotifications() {
    loading.value = true
    error.value = null

    try {
      const result = await api.get<NotificationsResponse>('/notifications')
      items.value = unwrapList(result)
    } catch (err: unknown) {
      error.value = getFetchErrorMessage(err)
      items.value = []
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function markAsRead(notificationId?: string) {
    if (marking.value) return

    marking.value = true
    error.value = null

    const path = notificationId
      ? `/notifications/read/${notificationId}`
      : '/notifications/read'

    try {
      await api.post(path)

      if (notificationId) {
        const now = new Date().toISOString()
        items.value = items.value.map((item) =>
          item.id === notificationId && !item.read_at
            ? { ...item, read_at: now }
            : item,
        )
      } else {
        const now = new Date().toISOString()
        items.value = items.value.map((item) =>
          item.read_at ? item : { ...item, read_at: now },
        )
      }
    } catch (err: unknown) {
      error.value = getFetchErrorMessage(err)
      throw err
    } finally {
      marking.value = false
    }
  }

  async function markAllAsRead() {
    return markAsRead()
  }

  return {
    items,
    loading,
    marking,
    error,
    initialized,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
}
