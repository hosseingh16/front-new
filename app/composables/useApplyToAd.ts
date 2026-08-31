import {
  getApiErrorMessage,
  isResumeBasicInfoRequiredError,
} from '~/utils/api-error'

/**
 * Jobseeker apply — send resume/request to an ad.
 * POST /ads/{ad}/apply
 */
export function useApplyToAd() {
  const api = useApi()
  const { $toast } = useNuxtApp()
  const loading = ref(false)

  async function applyToAd(adId: string | number) {
    if (!adId) {
      $toast.error('شناسه آگهی یافت نشد')
      throw new Error('ad_id missing')
    }

    loading.value = true
    try {
      await api.post(`/ads/${adId}/apply`)
      return true
    } catch (err: any) {
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
    applyToAd,
  }
}
