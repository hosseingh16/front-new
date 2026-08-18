import { paths } from '~/routes'

/**
 * Keep /login for guests. Authenticated users go to the dashboard,
 * except when finishing role selection (?step=5).
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, refreshIdentity } = useSanctumAuth()

  if (!isAuthenticated.value) {
    try {
      await refreshIdentity()
    } catch {
      // still unauthenticated
    }
  }

  if (!isAuthenticated.value) return

  const { needsRoleSelection, ensureUserLoaded } = useRoleGate()
  await ensureUserLoaded()

  if (to.query.step === '5' && needsRoleSelection.value) {
    return
  }

  const redirect =
    typeof to.query.redirect === 'string' && to.query.redirect.startsWith('/')
      ? to.query.redirect
      : paths.dashboard

  return navigateTo(redirect, { replace: true })
})
