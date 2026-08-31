import {
  buildEnteringRoute,
  enteringFromAuthQuery,
  resolvePostLoginLocation,
} from '~/utils/entering-route'

/**
 * Keep /login for guests. Authenticated users with a role leave for the CTA
 * destination or dashboard. Users without a role stay for signup, unless a
 * CTA already implies their role — then they go through /entering.
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

  if (needsRoleSelection.value) {
    const entering = enteringFromAuthQuery(to.query)
    if (entering?.role) {
      return navigateTo(buildEnteringRoute(entering), { replace: true })
    }
    return
  }

  return navigateTo(resolvePostLoginLocation(to.query, true), { replace: true })
})
