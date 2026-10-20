import {
  getApiErrorMessage,
  isResumeBasicInfoRequiredError,
} from '~/utils/api-error'

/**
 * Jobseeker apply — send resume/request to a project.
 * POST /projects/{project}/apply
 */
export function useApplyToProject() {
  const api = useApi()
  const { $toast } = useNuxtApp()
  const loading = ref(false)

  async function applyToProject(projectId: string | number) {
    if (!projectId) {
      $toast.error('شناسه پروژه یافت نشد')
      throw new Error('project_id missing')
    }

    loading.value = true
    try {
      await api.post(`/projects/${projectId}/apply`)
      return true
    } catch (err: unknown) {
      if (!isResumeBasicInfoRequiredError(err)) {
        $toast.error(getApiErrorMessage(err, 'ارسال درخواست با خطا مواجه شد'))
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    applyToProject,
  }
}
