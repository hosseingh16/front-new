import { paths } from '~/routes'

/**
 * Protect /dashboard/* — guests go to login.
 * Authenticated users without a role are handled by the dashboard layout dialog.
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
})
