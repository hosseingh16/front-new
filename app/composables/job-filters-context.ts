import type { InjectionKey, UnwrapNestedRefs } from 'vue'
import type { useJobFilters } from '~/composables/useJobFilters'

export type JobFiltersContext = ReturnType<typeof useJobFilters>
export type JobFiltersState = UnwrapNestedRefs<JobFiltersContext>

export const JOB_FILTERS_INJECTION_KEY: InjectionKey<JobFiltersState> =
  Symbol('jobFilters')
