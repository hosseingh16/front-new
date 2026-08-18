import type { AccountRole } from '~/features/account/types'
import { paths } from '~/routes'
import { resolvePrimaryRole } from '~/utils/user-role'

const ROLE_SELECTION_STEP = '5'

export type RoleAccessResult =
  | { allowed: true }
  | { allowed: false; redirect: { path: string; query?: Record<string, string> } }

/**
 * Shared guard for users who are authenticated but have not chosen a role yet.
 * Callers must perform navigation — do not navigate from async helpers here.
 */
export function useRoleGate() {
  const { isAuthenticated } = useSanctumAuth()
  const { user, refreshUser } = useCurrentUser()
  const { updateUserRole } = useAccountAuth()

  const needsRoleSelection = computed(
    () => isAuthenticated.value && resolvePrimaryRole(user.value) === null,
  )

  async function ensureUserLoaded() {
    if (!isAuthenticated.value) return

    const hasRoleData =
      user.value?.type != null || Array.isArray(user.value?.roles)

    if (!hasRoleData) {
      await refreshUser()
    }
  }

  function roleSelectionLocation(redirect?: string) {
    return {
      path: paths.login,
      query: {
        step: ROLE_SELECTION_STEP,
        ...(redirect ? { redirect } : {}),
      },
    }
  }

  /**
   * Assign a role when the user's action already implies it (e.g. apply resume → job seeker).
   * No-op when the user already has a role.
   */
  async function ensureRoleForAction(role: AccountRole): Promise<boolean> {
    if (!isAuthenticated.value) return false

    await ensureUserLoaded()

    if (resolvePrimaryRole(user.value)) {
      return true
    }

    try {
      await updateUserRole(role)
      await refreshUser()
      return resolvePrimaryRole(user.value) !== null
    } catch {
      return false
    }
  }

  /**
   * Check role access for a path. Returns a redirect target when SignUp3 is required.
   * Visiting a page never assigns a role — only explicit actions do.
   */
  async function resolveRoleAccess(path: string): Promise<RoleAccessResult> {
    if (!isAuthenticated.value) {
      return { allowed: false, redirect: roleSelectionLocation(path) }
    }

    await ensureUserLoaded()

    if (resolvePrimaryRole(user.value)) {
      return { allowed: true }
    }

    return { allowed: false, redirect: roleSelectionLocation(path) }
  }

  return {
    needsRoleSelection,
    ensureUserLoaded,
    roleSelectionLocation,
    ensureRoleForAction,
    resolveRoleAccess,
  }
}
