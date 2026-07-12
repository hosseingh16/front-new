import type { MaybeRef } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { UserResume } from '~/types/user-resume'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت اطلاعات کاربر'
}

export function useUser(id: MaybeRef<string | number>) {
  const api = useApi()
  const idRef = toRef(id)

  const { data, pending, error: fetchError, status } = useAsyncData(
    () => `user-${idRef.value}`,
    async () => {
      const id = idRef.value
      if (id == null || id === '' || Number(id) <= 0) return null

      try {
        const result = await api.get<ApiResponse<UserResume>>(`/users/${id}`)
        return result.data ?? null
      } catch (err: unknown) {
        const statusCode =
          err && typeof err === 'object' && 'status' in err
            ? Number((err as { status?: number }).status)
            : undefined

        if (statusCode === 404) {
          throw createError({ statusCode: 404, statusMessage: 'کاربر یافت نشد' })
        }

        throw err
      }
    },
    {
      watch: [idRef],
    },
  )

  const user = computed(() => data.value ?? null)

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  )

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  return {
    user,
    loading: pending,
    initialized,
    error,
  }
}
