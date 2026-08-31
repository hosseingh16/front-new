import type { Ref } from 'vue'
import type { LocationQuery } from 'vue-router'
import { JOB_FILTERS_LOOKUP_KEYS, type JobFiltersModel } from '~/types/job-filters'
import type { ISelectItem } from '~/types/select-item'

export function useJobFilterProvinceOptions() {
  const { items } = useLookups(JOB_FILTERS_LOOKUP_KEYS)
  return items('provinces')
}

export function useResolveProvinceFiltersFromRoute(
  filters: Ref<JobFiltersModel>,
  provinceOptions: Ref<ISelectItem[]>,
  parseProvinces: (
    query: LocationQuery,
    provinces: ISelectItem[],
  ) => JobFiltersModel,
) {
  const route = useRoute()

  watch(
    provinceOptions,
    (options) => {
      if (!options.length || route.query.province == null) return

      const parsed = parseProvinces(route.query, options)
      if (
        !parsed.provinces.length ||
        JSON.stringify(parsed.provinces) ===
          JSON.stringify(filters.value.provinces)
      ) {
        return
      }

      filters.value = {
        ...filters.value,
        provinces: parsed.provinces,
      }
    },
    { immediate: true },
  )
}
