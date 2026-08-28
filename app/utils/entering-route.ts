import type { AccountRole } from '~/features/account/types'
import { paths } from '~/routes'

const RESERVED_QUERY_KEYS = new Set(['to', 'role'])

export type EnteringDestination = {
  destination: string
  role?: AccountRole
  forwardQuery: Record<string, string>
}

export type EnteringRouteOptions = {
  to: string
  role?: AccountRole
  query?: Record<string, string>
}

function isSafeInternalPath(value: string) {
  return value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')
}

/** Match vue-router query encoding so `/entering?...` matches `route.fullPath`. */
function stringifyInternalQuery(query: Record<string, string>) {
  return Object.entries(query)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value).replace(/%2F/gi, '/')}`,
    )
    .join('&')
}

export function splitPathAndQuery(value: string): {
  path: string
  query: Record<string, string>
} {
  const qIndex = value.indexOf('?')
  if (qIndex === -1) return { path: value, query: {} }

  const query: Record<string, string> = {}
  const params = new URLSearchParams(value.slice(qIndex + 1))
  for (const [key, val] of params.entries()) {
    query[key] = val
  }

  return { path: value.slice(0, qIndex), query }
}

export function destinationLocation(
  to: string,
  query?: Record<string, string>,
): { path: string; query: Record<string, string> } {
  const { path, query: fromTo } = splitPathAndQuery(to)
  return { path, query: { ...fromTo, ...query } }
}

export function destinationFullPath(
  to: string,
  query?: Record<string, string>,
) {
  const loc = destinationLocation(to, query)
  const search = stringifyInternalQuery(loc.query)
  return search ? `${loc.path}?${search}` : loc.path
}

export function parseEnteringQuery(
  query: Record<string, unknown>,
): EnteringDestination | null {
  const rawTo = typeof query.to === 'string' ? query.to : null
  if (!rawTo) return null

  const { path: destination, query: toQuery } = splitPathAndQuery(rawTo)
  if (!isSafeInternalPath(destination)) return null

  const role =
    query.role === 'employer' || query.role === 'job_seeker'
      ? query.role
      : undefined

  const forwardQuery: Record<string, string> = { ...toQuery }
  for (const [key, value] of Object.entries(query)) {
    if (RESERVED_QUERY_KEYS.has(key)) continue
    if (typeof value === 'string') forwardQuery[key] = value
  }

  return { destination, role, forwardQuery }
}

export function parseEnteringPath(fullPath: string): EnteringDestination | null {
  if (!isSafeInternalPath(fullPath)) return null

  const { path, query } = splitPathAndQuery(fullPath)
  if (path !== paths.entering) return null

  return parseEnteringQuery(query)
}

export function isEnteringRoleRedirect(redirect: unknown): redirect is string {
  if (typeof redirect !== 'string') return false
  return parseEnteringPath(redirect)?.role != null
}

export function buildEnteringRoute(options: EnteringRouteOptions) {
  const { path: destination, query: destQuery } = destinationLocation(
    options.to,
    options.query,
  )
  const query: Record<string, string> = { to: destination, ...destQuery }
  if (options.role) query.role = options.role

  return { path: paths.entering, query }
}

export function enteringFullPath(options: EnteringRouteOptions) {
  const loc = buildEnteringRoute(options)
  return `${loc.path}?${stringifyInternalQuery(loc.query)}`
}

const DEFAULT_ENTERING_MESSAGE = 'در حال ورود به پیشخوان...'

function matchesPath(destination: string, base: string) {
  return destination === base || destination.startsWith(`${base}/`)
}

export function enteringMessageForDestination(destination: string) {
  if (matchesPath(destination, '/dashboard/cv')) {
    return 'در حال ورود به رزومه‌ساز...'
  }

  if (matchesPath(destination, paths.employer.adsCreate)) {
    return 'در حال ورود به صفحه ایجاد آگهی ...'
  }

  if (matchesPath(destination, paths.employer.taxReturnCreate)) {
    return 'در حال ورود به صفحه درخواست اظهارنامه ...'
  }

  if (matchesPath(destination, paths.jobs.root) || matchesPath(destination, paths.jobSeeker.ads)) {
    return 'در حال آماده‌سازی فرصت‌های شغلی...'
  }

  return DEFAULT_ENTERING_MESSAGE
}
