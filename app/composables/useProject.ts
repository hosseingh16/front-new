import type { MaybeRef } from 'vue'
import type { ApiResponse } from '~/types/api'
import type { Project } from '~/types/project'
import type { Opportunity } from '~/types/opportunity'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت اطلاعات پروژه'
}

export function useProject(id: MaybeRef<string | number>) {
  const api = useApi()
  const idRef = toRef(id)

  const { data, pending, error: fetchError, status, refresh } = useCachedAsyncData(
    () => `project-${idRef.value}`,
    async () => {
      try {
        const result = await api.get<ApiResponse<Project>>(
          `/projects/${idRef.value}`,
        )
        return result.data ?? null
      } catch (err: unknown) {
        const statusCode =
          err && typeof err === 'object' && 'status' in err
            ? Number((err as { status?: number }).status)
            : undefined

        if (statusCode === 404) {
          throw createError({
            statusCode: 404,
            statusMessage: 'پروژه یافت نشد',
          })
        }

        throw err
      }
    },
    {
      watch: [idRef],
    },
  )

  const project = computed(() => data.value ?? null)

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  )

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  function setHasApplied(value: boolean) {
    if (!data.value) return
    data.value = { ...data.value, has_applied: value }
  }

  return {
    project,
    loading: pending,
    initialized,
    error,
    setHasApplied,
    refresh,
  }
}

export function useSimilarProjects(excludeId: MaybeRef<string | number>) {
  const api = useApi()
  const { paginationSimilarAds } = useSettings()
  const excludeIdRef = toRef(excludeId)

  const { data, pending } = useCachedAsyncData(
    () => `similar-projects-${excludeIdRef.value}`,
    () =>
      api
        .get<ApiResponse<Opportunity[]>>('/opportunities', {
          query: {
            per_page: paginationSimilarAds.value,
            type: 'project',
          },
        })
        .then((result) =>
          (result.data ?? []).filter(
            (item) =>
              item.type === 'project' &&
              item.item.id !== Number(excludeIdRef.value),
          ),
        ),
    {
      default: () => [] as Opportunity[],
      watch: [excludeIdRef, paginationSimilarAds],
    },
  )

  return {
    similarProjects: computed(() => data.value ?? []),
    loadingSimilar: pending,
  }
}
