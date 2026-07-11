import type { InjectionKey, UnwrapNestedRefs } from 'vue'
import type { useEmployerAdRequestFilters } from '~/composables/useEmployerAdRequestFilters'

export type EmployerAdRequestFiltersContext = ReturnType<typeof useEmployerAdRequestFilters>
export type EmployerAdRequestFiltersState = UnwrapNestedRefs<EmployerAdRequestFiltersContext>

export const EMPLOYER_AD_REQUEST_FILTERS_INJECTION_KEY: InjectionKey<EmployerAdRequestFiltersState> =
  Symbol('employerAdRequestFilters')
