import type { MaybeRef } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { Company } from '~/types/company'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت اطلاعات شرکت'
}

export function useCompany(slug: MaybeRef<string>) {
  const api = useApi()
  const slugRef = toRef(slug)

  const { data, pending, error: fetchError, status } = useAsyncData(
    () => `company-${slugRef.value}`,
    async () => {
      try {
        const result = await api.get<ApiResponse<Company>>(`/companies/${slugRef.value}`)
        return result.data ?? null
      } catch (err: unknown) {
        const statusCode =
          err && typeof err === 'object' && 'status' in err
            ? Number((err as { status?: number }).status)
            : undefined

        if (statusCode === 404) {
          throw createError({ statusCode: 404, statusMessage: 'شرکت یافت نشد' })
        }

        throw err
      }
    },
    {
      watch: [slugRef],
    },
  )

  const company = computed(() => data.value ?? null)

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  )

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  return {
    company,
    loading: pending,
    initialized,
    error,
  }
}
