import type { Ref } from 'vue'
import { JOB_FILTERS_LOOKUP_KEYS, type JobFiltersModel } from '~/types/job-filters'

export function useAdsListLocationLabel(filters: Ref<JobFiltersModel>) {
  const { items } = useLookups(JOB_FILTERS_LOOKUP_KEYS)
  const provinces = items('provinces')

  return computed(() => {
    const selectedProvinceIds = filters.value.provinces
    if (selectedProvinceIds.length !== 1) return ''

    const match = provinces.value.find(
      (province) => province.value === selectedProvinceIds[0],
    )

    return match?.label ?? ''
  })
}
