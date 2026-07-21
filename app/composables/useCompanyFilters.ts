import {
  createEmptyCompanyFilters,
  type CompanyFiltersModel,
} from '~/types/company-filters'
import type { ISelectItem } from '~/types/select-item'

export function useCompanyFilters(model: Ref<CompanyFiltersModel>) {
  const { items } = useLookups([
    'provinces',
    'industries',
    'company_sizes',
    'benefits',
  ])

  const provinces = items('provinces')
  const activities = items('industries')
  const sizes = items('company_sizes')
  const benefits = items('benefits')

  const activeFilterCount = computed(() => {
    let count = 0
    if (model.value.search.trim()) count += 1
    count += model.value.provinces.length
    count += model.value.cities.length
    count += model.value.activities.length
    count += model.value.sizes.length
    count += model.value.benefits.length
    return count
  })

  function sectionOptions(sectionIndex: number) {
    switch (sectionIndex) {
      case 1:
        return provinces.value
      case 2:
        return activities.value
      case 3:
        return sizes.value
      case 4:
        return benefits.value
      default:
        return []
    }
  }

  function clearFilters() {
    model.value = createEmptyCompanyFilters()
  }

  return {
    model,
    provinces,
    activities,
    sizes,
    benefits,
    activeFilterCount,
    sectionOptions,
    clearFilters,
  }
}
