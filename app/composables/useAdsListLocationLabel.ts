import type { Ref } from 'vue'
import type { AdList } from '~/types/ad'
import type { JobFiltersModel } from '~/types/job-filters'
import { resolveAdsListLocationLabel } from '~/utils/ad-seo'

export function useAdsListLocationLabel(
  filters: Ref<JobFiltersModel>,
  ads: Ref<Array<Pick<AdList, 'city_name'>>>,
) {
  const { citiesByProvince, ensureAllProvinceCities } = useProvinceCities()
  const selectedCityIds = computed(() => filters.value.cities)

  useAsyncData(
    () => `ads-list-location-${selectedCityIds.value.join(',')}`,
    async () => {
      if (!selectedCityIds.value.length) return true

      const alreadyResolved = resolveAdsListLocationLabel(
        selectedCityIds.value,
        citiesByProvince.value,
        [],
      )
      if (alreadyResolved) return true

      await ensureAllProvinceCities()
      return true
    },
    { watch: [selectedCityIds] },
  )

  return computed(() =>
    resolveAdsListLocationLabel(
      selectedCityIds.value,
      citiesByProvince.value,
      ads.value,
    ),
  )
}

