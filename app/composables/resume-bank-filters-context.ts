import type { InjectionKey, UnwrapNestedRefs } from 'vue'
import type { useResumeBankFilters } from '~/composables/useResumeBankFilters'

export type ResumeBankFiltersContext = ReturnType<typeof useResumeBankFilters>
export type ResumeBankFiltersState = UnwrapNestedRefs<ResumeBankFiltersContext>

export const RESUME_BANK_FILTERS_INJECTION_KEY: InjectionKey<ResumeBankFiltersState> =
  Symbol('resumeBankFilters')
