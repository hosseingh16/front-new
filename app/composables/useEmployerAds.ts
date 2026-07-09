import type { ApiResponse } from '~/types/api'
import type { EmployerAdsData } from '~/types/employer-ad'

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message)
  }
  return 'خطا در دریافت آگهی‌ها'
}

const emptyAdGroups = (): EmployerAdsData => ({
  active: [],
  draft: [],
  expired: [],
  total: [],
})

export function useEmployerAds() {
  const api = useApi()

  const adGroups = ref<EmployerAdsData>(emptyAdGroups())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  const ads = computed(() => adGroups.value.total)

  async function fetchAds() {
    loading.value = true
    error.value = null

    try {
      const result = await api.get<ApiResponse<EmployerAdsData>>('/employers/ads')
      const data = result.data

      adGroups.value = {
        active: data?.active ?? [],
        draft: data?.draft ?? [],
        expired: data?.expired ?? [],
        total: data?.total ?? [],
      }
    } catch (err: unknown) {
      error.value = getFetchErrorMessage(err)
      adGroups.value = emptyAdGroups()
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  onMounted(() => {
    fetchAds()
  })

  async function deleteAd(id: number) {
    await api.delete(`/employers/ads/${id}`)
    await fetchAds()
  }

  return {
    adGroups,
    ads,
    loading,
    initialized,
    error,
    fetchAds,
    deleteAd,
  }
}
