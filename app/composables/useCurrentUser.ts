/**
 * Resolves the authenticated user payload from nuxt-auth-sanctum.
 * API shape is usually `{ data: { name, ... } }` but may also be flat.
 */
export function useCurrentUser() {
  const sanctumUser = useSanctumUser<any>()

  const user = computed(() => {
    const raw = sanctumUser.value
    if (!raw || typeof raw !== 'object') return null

    const root = raw as Record<string, unknown>
    if (root.data && typeof root.data === 'object') {
      return root.data as Record<string, unknown>
    }

    return root
  })

  const name = computed(() => {
    const value = user.value?.name
    if (typeof value !== 'string') return '—'
    const trimmed = value.trim()
    return trimmed || '—'
  })

  const avatar = computed(() => {
    const value =
      user.value?.avatar ??
      user.value?.profile_image ??
      user.value?.profileImage
    return typeof value === 'string' && value.trim() ? value.trim() : null
  })

  const cellphone = computed(() => {
    const value =
      user.value?.cellphone ??
      user.value?.phone ??
      user.value?.username ??
      user.value?.mobile
    if (typeof value !== 'string' && typeof value !== 'number') return '—'
    const trimmed = String(value).trim()
    return trimmed || '—'
  })

  const roleNames = computed(() => {
    const raw = user.value?.roles
    if (!Array.isArray(raw)) return [] as string[]
    return raw
      .map((entry) => {
        if (typeof entry === 'string') return entry
        if (entry && typeof entry === 'object' && typeof (entry as any).name === 'string') {
          return (entry as any).name as string
        }
        return null
      })
      .filter((name): name is string => !!name)
  })

  const userType = computed(() => {
    const value = user.value?.type
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (value && typeof value === 'object' && typeof (value as any).value === 'string') {
      return ((value as any).value as string).trim()
    }
    return null
  })

  /** True when Spatie roles or user.type is present. */
  const hasRole = computed(() => roleNames.value.length > 0 || !!userType.value)

  async function refreshUser() {
    const api = useApi()

    try {
      const result = await api.get<any>('/user')
      if (!result || typeof result !== 'object') return

      if (result.data && typeof result.data === 'object') {
        sanctumUser.value = result
        return
      }

      sanctumUser.value = {
        ...(sanctumUser.value && typeof sanctumUser.value === 'object'
          ? sanctumUser.value
          : {}),
        data: result,
      }
    } catch {
      // Keep the current user if refresh fails.
    }
  }

  return {
    sanctumUser,
    user,
    name,
    avatar,
    cellphone,
    roleNames,
    userType,
    hasRole,
    refreshUser,
  }
}
