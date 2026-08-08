/** Normalize Spatie role / users.type values used across the app. */
export function normalizeUserRole(value: unknown): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const normalized = String(value).trim().toLowerCase().replace(/-/g, '_')
  if (!normalized) return null
  if (normalized === 'job_seeker') return 'jobseeker'
  return normalized
}

export function userRolesFrom(user: Record<string, unknown> | null | undefined): string[] {
  if (!user) return []

  const roles = user.roles
  if (Array.isArray(roles)) {
    return roles
      .map((role) => normalizeUserRole(role))
      .filter((role): role is string => Boolean(role))
  }

  return []
}

export type PrimaryUserRole = 'employer' | 'jobseeker' | 'vip_user'

/**
 * Match PanelResolver: prefer users.type, then fall back to first matching role.
 */
export function resolvePrimaryRole(
  user: Record<string, unknown> | null | undefined,
): PrimaryUserRole | null {
  if (!user) return null

  const type = normalizeUserRole(user.type)
  if (type === 'employer' || type === 'jobseeker' || type === 'vip_user') {
    return type
  }

  const roles = userRolesFrom(user)
  if (roles.includes('employer')) return 'employer'
  if (roles.includes('jobseeker')) return 'jobseeker'
  if (roles.includes('vip_user')) return 'vip_user'

  return null
}

export function isEmployerUser(user: Record<string, unknown> | null | undefined): boolean {
  return resolvePrimaryRole(user) === 'employer'
}

export function isJobSeekerUser(user: Record<string, unknown> | null | undefined): boolean {
  return resolvePrimaryRole(user) === 'jobseeker'
}
