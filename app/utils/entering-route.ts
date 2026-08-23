import type { AccountRole } from '~/features/account/types'
import { paths } from '~/routes'

const RESERVED_QUERY_KEYS = new Set(['to', 'role'])

export type EnteringDestination = {
  destination: string
  role?: AccountRole
  forwardQuery: Record<string, string>
}

function isSafeInternalPath(value: string) {
  return value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')
}

export function parseEnteringQuery(
  query: Record<string, unknown>,
): EnteringDestination | null {
  const to = typeof query.to === 'string' ? query.to : null
  if (!to || !isSafeInternalPath(to)) return null

  const role =
    query.role === 'employer' || query.role === 'job_seeker'
      ? query.role
      : undefined

  const forwardQuery: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    if (RESERVED_QUERY_KEYS.has(key)) continue
    if (typeof value === 'string') forwardQuery[key] = value
  }

  return { destination: to, role, forwardQuery }
}

export function buildEnteringRoute(options: {
  to: string
  role?: AccountRole
  query?: Record<string, string>
}) {
  const query: Record<string, string> = { to: options.to }
  if (options.role) query.role = options.role
  if (options.query) Object.assign(query, options.query)

  return { path: paths.entering, query }
}

const DEFAULT_ENTERING_MESSAGE = 'در حال ورود به پیشخوان...'

function matchesPath(destination: string, base: string) {
  return destination === base || destination.startsWith(`${base}/`)
}

export function enteringMessageForDestination(destination: string) {
  if (matchesPath(destination, '/dashboard/cv')) {
    return 'در حال ورود به رزومه‌ساز...'
  }

  if (matchesPath(destination, '/dashboard/employer/ads/create')) {
    return 'در حال ورود به صفحه ایجاد آگهی ...'
  }

  if (matchesPath(destination, paths.jobs.root) || matchesPath(destination, '/dashboard/ad')) {
    return 'در حال آماده‌سازی فرصت‌های شغلی...'
  }

  return DEFAULT_ENTERING_MESSAGE
}
