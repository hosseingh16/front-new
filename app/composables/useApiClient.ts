import type { ApiError } from '~/types/api'

export function useApiClient() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const client = useSanctumClient()

  const user = useState<any | null>('user', () => null)

  const request = async <T>(
    url: string,
    options: any = {}
  ): Promise<T> => {
    try {
      return await client<T>(url, {
        baseURL, // 👈 اینجا استفاده می‌شود
        headers: {
          Accept: 'application/json',
          ...(options.headers ?? {}),
        },
        ...options,
      })
    } catch (err: any) {
      const status = err?.response?.status
      const data = err?.response?._data

      if (status === 401) {
        user.value = null
        await navigateTo('/login')
      }

      const error: ApiError = {
        status,
        message: data?.message ?? err?.message,
        errors: data?.errors,
      }

      throw error
    }
  }

  return { request }
}