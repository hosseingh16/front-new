import { resolvePostLoginLocation } from '~/utils/entering-route'

/**
 * Keep /login for guests. Authenticated users with a role leave for the CTA
 * destination or dashboard. Users without a role stay for signup and role
 * selection (SignUp3), even when a CTA already implies their role.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { ensureIdentity } = useAuthIdentity()
  const outcome = await ensureIdentity({ ignoreGuestHint: true })

  if (outcome === 'unavailable') {
    return authIdentityUnavailableError()
  }

  if (outcome !== 'auth') return

  const { needsRoleSelection, ensureUserLoaded } = useRoleGate()
  await ensureUserLoaded()

  if (needsRoleSelection.value) return

  return navigateTo(resolvePostLoginLocation(to.query, true), { replace: true })
})
