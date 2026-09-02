import { resolvePostLoginLocation } from '~/utils/entering-route'

/**
 * Keep /login for guests. Authenticated users with a role leave for the CTA
 * destination or dashboard. Users without a role stay for signup and role
 * selection (SignUp3), even when a CTA already implies their role.
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

  if (needsRoleSelection.value) return

  return navigateTo(resolvePostLoginLocation(to.query, true), { replace: true })
})
