import type { ApiResponse } from '~/types/api'
import type {
  EmployerProject,
  EmployerProjectsData,
} from '~/types/employer-project'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت پروژه‌ها'
}

const emptyProjectGroups = (): EmployerProjectsData => ({
  active: [],
  draft: [],
  expired: [],
  total: [],
})

function asProjectList(value: unknown): EmployerProject[] {
  return Array.isArray(value) ? (value as EmployerProject[]) : []
}

function normalizeProjectGroups(data: unknown): EmployerProjectsData {
  if (Array.isArray(data)) {
    return {
      active: [],
      draft: [],
      expired: [],
      total: asProjectList(data),
    }
  }

  if (!data || typeof data !== 'object') return emptyProjectGroups()

  const payload = data as Record<string, unknown>
  const active = asProjectList(payload.active)
  const draft = asProjectList(payload.draft)
  const expired = asProjectList(payload.expired)
  const total = asProjectList(payload.total)

  return {
    active,
    draft,
    expired,
    total: total.length ? total : [...active, ...draft, ...expired],
  }
}

export function useEmployerProjects(options: { immediate?: boolean } = {}) {
  const api = useApi()
  const immediate = options.immediate ?? true

  const projectGroups = ref<EmployerProjectsData>(emptyProjectGroups())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  const projects = computed(() => projectGroups.value.total)

  async function fetchProjects() {
    loading.value = true
    error.value = null

    try {
      const result = await api.get<
        ApiResponse<EmployerProjectsData | EmployerProject[]>
      >('/employers/projects')
      projectGroups.value = normalizeProjectGroups(result.data)
    } catch (err: unknown) {
      error.value = getFetchErrorMessage(err)
      projectGroups.value = emptyProjectGroups()
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  onMounted(() => {
    if (immediate) fetchProjects()
  })

  async function deleteProject(id: number) {
    await api.delete(`/employers/projects/${id}`)
    await fetchProjects()
  }

  return {
    projectGroups,
    projects,
    loading,
    initialized,
    error,
    fetchProjects,
    deleteProject,
  }
}
