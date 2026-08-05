import type { ApiResponse } from '~/types/api'
import type { UserStatusPayload } from '~/types/user-status'

export function useUserStatus() {
  const api = useApi()
  const { user } = useCurrentUser()

  async function fetchStatus(): Promise<UserStatusPayload | null> {
    const id = user.value?.id
    if (id == null || id === '') return null

    try {
      const result = await api.get<ApiResponse<UserStatusPayload>>(
        `/users/${String(id)}/status`,
      )
      return result.data ?? null
    } catch {
      return null
    }
  }

  return {
    fetchStatus,
  }
}
