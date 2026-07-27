export interface NotificationPayload {
  title?: string
  desc?: string
  message?: string
  body?: string
  text?: string
  description?: string
  url?: string
  link?: string
  action_url?: string
}

export interface AppNotification {
  id: string
  type?: string
  data: NotificationPayload
  read_at: string | null
  created_at: string
  updated_at?: string
  notifiable_id?: number | string
  notifiable_type?: string
}

export interface NotificationsResponse {
  success?: boolean
  data?: {
    notifications?: AppNotification[]
  }
  notifications?: AppNotification[]
  meta?: unknown
}

function cleanText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  let text = value.trim()
  if (!text) return null

  // Some payloads arrive wrapped in extra quotes, e.g. "\"تست\""
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1).trim()
  }

  return text || null
}

export function getNotificationTitle(notification: AppNotification): string {
  const { data } = notification
  return (
    cleanText(data.title) ??
    cleanText(data.message) ??
    cleanText(data.body) ??
    cleanText(data.text) ??
    cleanText(data.desc) ??
    cleanText(data.description) ??
    'اعلان جدید'
  )
}

export function getNotificationMessage(notification: AppNotification): string | null {
  const { data } = notification
  const title = cleanText(data.title)
  const candidates = [
    data.desc,
    data.description,
    data.message,
    data.body,
    data.text,
  ]

  for (const candidate of candidates) {
    const trimmed = cleanText(candidate)
    if (!trimmed || trimmed === title) continue
    return trimmed
  }

  return null
}

export function getNotificationLink(notification: AppNotification): string | null {
  const { data } = notification
  return (
    cleanText(data.link) ??
    cleanText(data.url) ??
    cleanText(data.action_url)
  )
}

export function isExternalNotificationLink(link: string): boolean {
  return /^https?:\/\//i.test(link) || link.startsWith('//')
}
