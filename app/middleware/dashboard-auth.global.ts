import { paths } from '~/routes'
import { isEmployerUser, isJobSeekerUser } from '~/utils/user-role'

const EMPLOYER_ONLY_PREFIXES = [
  '/dashboard/employer',
  '/dashboard/tax-returns',
]

const JOBSEEKER_ONLY_PREFIXES = [
  '/dashboard/my-resume',
  '/dashboard/cv',
  '/dashboard/my-requests',
]

function matchesPrefix(path: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  )
}

/**
 * Protect /dashboard/* — guests go to login.
 * Employers cannot open jobseeker-only routes; jobseekers cannot open employer-only routes.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) return

  const { isAuthenticated, refreshIdentity } = useSanctumAuth()

  if (!isAuthenticated.value) {
    try {
      await refreshIdentity()
    } catch {
      // still unauthenticated
    }
  }

  if (!isAuthenticated.value) {
    return navigateTo(
      {
        path: paths.login,
        query: { redirect: to.fullPath },
      },
      { replace: true },
    )
  }

  const needsRoleCheck =
    matchesPrefix(to.path, EMPLOYER_ONLY_PREFIXES) ||
    matchesPrefix(to.path, JOBSEEKER_ONLY_PREFIXES)

  if (!needsRoleCheck) return

  const { user, isEmployer, isJobSeeker, refreshUser } = useCurrentUser()

  // Ensure type/roles are present (older sessions may lack roles).
  if (!user.value?.type && !Array.isArray(user.value?.roles)) {
    await refreshUser()
  }

  const employer = isEmployer.value || isEmployerUser(user.value)
  const jobseeker = isJobSeeker.value || isJobSeekerUser(user.value)

  if (matchesPrefix(to.path, EMPLOYER_ONLY_PREFIXES) && jobseeker) {
    return navigateTo(paths.dashboard, { replace: true })
  }

  if (matchesPrefix(to.path, JOBSEEKER_ONLY_PREFIXES) && employer) {
    return navigateTo(paths.dashboard, { replace: true })
  }
})
