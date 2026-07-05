import type { InjectionKey, UnwrapNestedRefs } from 'vue'
import type { useCompanyFilters } from '~/composables/useCompanyFilters'

export type CompanyFiltersContext = ReturnType<typeof useCompanyFilters>
export type CompanyFiltersState = UnwrapNestedRefs<CompanyFiltersContext>

export const COMPANY_FILTERS_INJECTION_KEY: InjectionKey<CompanyFiltersState> =
  Symbol('company-filters')
