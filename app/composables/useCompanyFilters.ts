import type { ApiResponse } from '~/types/api'
import {
  createEmptyCompanyFilters,
  type CompanyFiltersModel,
} from '~/types/company-filters'
import type { ISelectItem } from '~/types/select-item'

export function useCompanyFilters(model: Ref<CompanyFiltersModel>) {
  const api = useApi()

  const provinces = ref<ISelectItem[]>([])
  const activities = ref<ISelectItem[]>([])
  const sizes = ref<ISelectItem[]>([])
  const benefits = ref<ISelectItem[]>([])

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

  async function loadLookups() {
    const response = await api.get<ApiResponse<Record<string, ISelectItem[]>>>(
      '/lookups?keys=all',
    )
    const data = response.data ?? {}

    provinces.value = data.provinces ?? []
    activities.value = data.industries ?? []
    sizes.value = data.company_sizes ?? []
    benefits.value = data.benefits ?? []
  }

  onMounted(() => {
    loadLookups()
  })

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
