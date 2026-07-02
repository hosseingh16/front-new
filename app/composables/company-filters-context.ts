import type { ComputedRef, InjectionKey, Ref } from 'vue'
import {
  createEmptyCompanyFilters,
  type CompanyFiltersModel,
} from '~/types/company-filters'

export interface CompanyFiltersState {
  model: Ref<CompanyFiltersModel>
  activeFilterCount: ComputedRef<number>
  clearFilters: () => void
}

export const COMPANY_FILTERS_INJECTION_KEY = Symbol(
  'company-filters',
) as InjectionKey<CompanyFiltersState>

export function useCompanyFilters(model: Ref<CompanyFiltersModel>): CompanyFiltersState {
  const activeFilterCount = computed(() => {
    let count = 0
    if (model.value.search.trim()) count += 1
    count += model.value.provinces.length
    count += model.value.cities.length
    count += model.value.activities.length
    count += model.value.sizes.length
    count += model.value.adCounts.length
    count += model.value.benefits.length
    return count
  })

  function clearFilters() {
    model.value = createEmptyCompanyFilters()
  }

  return {
    model,
    activeFilterCount,
    clearFilters,
  }
}
