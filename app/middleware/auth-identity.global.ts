import { paths } from '~/routes'

function isGuardedIdentityRoute(path: string) {
  return (
    path === paths.login ||
    path === paths.entering ||
    path.startsWith('/dashboard')
  )
}

/**
 * Loads the Sanctum user once per navigation. Public pages may skip when the
 * guest hint is set. Dashboard, login, and entering always verify unless this
 * Nuxt app already finished a check.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const guarded = isGuardedIdentityRoute(to.path)
  const { ensureIdentity } = useAuthIdentity()
  const outcome = await ensureIdentity({ ignoreGuestHint: guarded })

  if (guarded && outcome === 'unavailable') {
    return authIdentityUnavailableError()
  }
})
