import type { ApiError } from '~/types/api'

export function useApiClient() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const user = useState<any | null>('user', () => null)

  const request = async <T>(
    url: string,
    options: any = {}
  ): Promise<T> => {
    try {
      return await $fetch<T>(url, {
        baseURL,
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      })
    } catch (err: any) {
      const status = err?.response?.status
      const data = err?.response?._data

      const error: ApiError = {
        status,
        message: data?.message,
        errors: data?.errors,
      }

      if (status === 401) {
        user.value = null
        await navigateTo('/login')
      }

      throw error
    }
  }

  return { request }
}