import type { RouteLocationRaw } from 'vue-router'
import type { AccountRole } from '~/features/account/types'
import { paths } from '~/routes'

const RESERVED_QUERY_KEYS = new Set(['to', 'role'])
const AUTH_QUERY_RESERVED = new Set(['redirect', 'to', 'role', 'step'])
const ROLE_SELECTION_STEP = '5'

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

export function firstQueryString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.length > 0) return value
  if (Array.isArray(value) && typeof value[0] === 'string' && value[0].length > 0) {
    return value[0]
  }
  return undefined
}

function parseRole(value: unknown): AccountRole | undefined {
  const role = firstQueryString(value)
  return role === 'employer' || role === 'job_seeker' ? role : undefined
}

function extraQuery(
  query: Record<string, unknown>,
  reserved: Set<string> = AUTH_QUERY_RESERVED,
): Record<string, string> {
  const extra: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    if (reserved.has(key)) continue
    const str = firstQueryString(value)
    if (str) extra[key] = str
  }
  return extra
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

export function locationFromDestination(
  to: string,
  query?: Record<string, string>,
): RouteLocationRaw {
  const loc = destinationLocation(to, query)
  return Object.keys(loc.query).length ? loc : loc.path
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
  const rawTo = firstQueryString(query.to)
  if (!rawTo) return null

  const { path: destination, query: toQuery } = splitPathAndQuery(rawTo)
  if (!isSafeInternalPath(destination)) return null

  const forwardQuery: Record<string, string> = {
    ...toQuery,
    ...extraQuery(query, RESERVED_QUERY_KEYS),
  }
  delete forwardQuery.redirect
  delete forwardQuery.step

  return { destination, role: parseRole(query.role), forwardQuery }
}

export function parseEnteringPath(fullPath: string): EnteringDestination | null {
  if (!isSafeInternalPath(fullPath)) return null

  const { path, query } = splitPathAndQuery(fullPath)
  if (path !== paths.entering) return null

  return parseEnteringQuery(query)
}

/**
 * Read a CTA intent from /login or /entering query.
 * Supports sibling params (`redirect=/entering&to=...&role=...`) and
 * nested `/entering?to=...&role=...` redirect strings.
 */
export function enteringFromAuthQuery(
  query: Record<string, unknown>,
): EnteringRouteOptions | null {
  const redirect = firstQueryString(query.redirect)
  if (redirect) {
    const parsed = parseEnteringPath(redirect)
    if (parsed) {
      return {
        to: parsed.destination,
        role: parsed.role ?? parseRole(query.role),
        query: parsed.forwardQuery,
      }
    }
  }

  const to = firstQueryString(query.to)
  if (!to) return null

  const destPath = splitPathAndQuery(to).path
  if (!isSafeInternalPath(destPath)) return null

  const redirectPath = redirect ? splitPathAndQuery(redirect).path : undefined
  const role = parseRole(query.role)
  if (redirectPath !== paths.entering && !role) return null

  return {
    to,
    role,
    query: extraQuery(query),
  }
}

export function isEnteringRoleRedirect(query: Record<string, unknown> | unknown): boolean {
  if (query && typeof query === 'object' && !Array.isArray(query)) {
    return enteringFromAuthQuery(query as Record<string, unknown>)?.role != null
  }
  if (typeof query === 'string') {
    return parseEnteringPath(query)?.role != null
  }
  return false
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

export function buildLoginIntentQuery(options: EnteringRouteOptions) {
  const dest = destinationLocation(options.to, options.query)
  const query: Record<string, string> = {
    redirect: paths.entering,
    to: dest.path,
    ...dest.query,
  }
  if (options.role) query.role = options.role
  return query
}

/**
 * After login: CTA with a role goes through /entering (or straight to the
 * page if they already have a role). Otherwise role selection or dashboard.
 */
export function resolvePostLoginLocation(
  query: Record<string, unknown>,
  hasRole: boolean,
): RouteLocationRaw {
  const entering = enteringFromAuthQuery(query)
  const redirect = firstQueryString(query.redirect)

  if (!hasRole) {
    if (entering?.role) {
      return buildEnteringRoute(entering)
    }

    const nextQuery: Record<string, string> = { step: ROLE_SELECTION_STEP }
    if (
      redirect &&
      isSafeInternalPath(splitPathAndQuery(redirect).path) &&
      splitPathAndQuery(redirect).path !== paths.entering
    ) {
      nextQuery.redirect = redirect
    }

    return { path: paths.login, query: nextQuery }
  }

  if (entering) {
    return locationFromDestination(entering.to, entering.query)
  }

  if (redirect && isSafeInternalPath(splitPathAndQuery(redirect).path)) {
    if (splitPathAndQuery(redirect).path === paths.entering) {
      return paths.dashboard
    }
    return locationFromDestination(redirect)
  }

  return paths.dashboard
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
