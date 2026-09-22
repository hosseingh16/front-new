import type { ApiResponse } from '~/types/api'
import type { SiteBanner } from '~/types/banner'

function parseBannerDate(value: string | null | undefined): number | null {
  if (!value?.trim()) return null
  const parsed = Date.parse(value.trim().replace(' ', 'T'))
  return Number.isNaN(parsed) ? null : parsed
}

export function isBannerActive(banner: SiteBanner | null | undefined): boolean {
  if (!banner) return false

  const now = Date.now()
  const from = parseBannerDate(banner.active_from)
  const until = parseBannerDate(banner.active_until)

  if (from != null && now < from) return false
  if (until != null && now > until) return false

  return Boolean(
    banner.default_image || banner.tablet_image || banner.mobile_image,
  )
}

export function useLatestBanner() {
  const api = useApi()

  const { data, pending, status } = useCachedAsyncData(
    'banners-latest',
    async () => {
      try {
        const result = await api.get<ApiResponse<SiteBanner | null>>(
          '/banners/latest',
        )
        return result.data ?? null
      } catch {
        return null
      }
    },
    {
      default: () => null,
    },
  )

  const banner = computed(() => {
    const value = data.value
    return isBannerActive(value) ? value : null
  })

  const initialized = computed(
    () => status.value === 'success' || status.value === 'error',
  )

  return {
    banner,
    loading: pending,
    initialized,
  }
}
