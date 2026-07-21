import { provinces } from '~/feeders/provinces'
import {
  createEmptyJobFilters,
  type JobFiltersModel,
  type LocationTreeItem,
  type ProvinceCheckState,
} from '~/types/job-filters'
import { normalizeFilterId } from '~/utils/job-filters-query'
import type { ISelectItem } from '~/types/select-item'

export function useJobFilters(model?: Ref<JobFiltersModel>) {
  const api = useApi()
  const { items } = useLookups([
    'job_titles',
    'employment_types',
    'experience_levels',
    'salary_ranges',
    'benefits',
  ])

  const jobTitleSearch = ref('')
  const jobGroupSearch = ref('')
  const citySearch = ref('')

  const jobTitles = items('job_titles')
  const employmentTypes = items('employment_types')
  const experienceLevels = items('experience_levels')
  const salaryRanges = items('salary_ranges')
  const benefits = items('benefits')

  const selectedJobTypes = ref<Array<string | number>>([])
  const selectedJobGroups = ref<Array<string | number>>([])
  const selectedSalaries = ref<Array<string | number>>([])
  const selectedWorkHistory = ref<Array<string | number>>([])
  const selectedContractTypes = ref<Array<string | number>>([])
  const selectedBenefits = ref<Array<string | number>>([])

  const expandedProvinces = ref<number[]>([])
  const citiesByProvince = ref<Record<number, ISelectItem[]>>({})
  const citiesLoading = ref<Record<number, boolean>>({})
  const selectedCities = ref<Array<string | number>>([])
  const selectedProvinces = ref<number[]>([])

  const adTypeOptions = computed(() =>
    employmentTypes.value.filter((item) =>
      ['full_time', 'part_time', 'project_based'].includes(String(item.value)),
    ),
  )

  const contractTypeOptions = computed(() =>
    employmentTypes.value.filter((item) =>
      ['full_time', 'part_time', 'remote', 'internship'].includes(String(item.value)),
    ),
  )

  const filteredJobGroups = computed(() => {
    const query = jobGroupSearch.value.trim()
    if (!query) return jobTitles.value
    return jobTitles.value.filter((group) => group.label.includes(query))
  })

  const filteredLocationTree = computed<LocationTreeItem[]>(() => {
    const query = citySearch.value.trim()

    if (!query) {
      return provinces.map((province) => ({
        province,
        cities: citiesByProvince.value[province.value as number] ?? [],
        forceExpand: false,
      }))
    }

    return provinces
      .map((province) => {
        const provinceId = province.value as number
        const cities = citiesByProvince.value[provinceId] ?? []
        const provinceMatch = province.label.includes(query)
        const matchingCities = provinceMatch
          ? cities
          : cities.filter((city) => city.label.includes(query))

        return {
          province,
          cities: matchingCities,
          forceExpand: matchingCities.length > 0,
          visible: provinceMatch || matchingCities.length > 0,
        }
      })
      .filter((item) => item.visible)
      .map(({ province, cities, forceExpand }) => ({ province, cities, forceExpand }))
  })

  const activeFilterCount = computed(() => {
    let count = selectedJobTypes.value.length

    if (jobTitleSearch.value.trim()) count += 1
    count += selectedJobGroups.value.length
    count += selectedCities.value.length
    count += selectedSalaries.value.length
    count += selectedWorkHistory.value.length
    count += selectedContractTypes.value.length
    count += selectedBenefits.value.length

    return count
  })

  const filtersModel = computed<JobFiltersModel>(() => ({
    jobTypes: [...selectedJobTypes.value],
    titleSearch: jobTitleSearch.value,
    jobGroups: [...selectedJobGroups.value],
    cities: [...selectedCities.value],
    provinces: [...selectedProvinces.value],
    salaries: [...selectedSalaries.value],
    workHistory: [...selectedWorkHistory.value],
    contractTypes: [...selectedContractTypes.value],
    benefits: [...selectedBenefits.value],
  }))

  function applyFiltersModel(value: JobFiltersModel) {
    selectedJobTypes.value = value.jobTypes.map(normalizeFilterId)
    jobTitleSearch.value = value.titleSearch
    jobGroupSearch.value = ''
    selectedJobGroups.value = value.jobGroups.map(normalizeFilterId)
    citySearch.value = ''
    selectedCities.value = value.cities.map(normalizeFilterId)
    selectedProvinces.value = [...value.provinces]
    selectedSalaries.value = value.salaries.map(normalizeFilterId)
    selectedWorkHistory.value = value.workHistory.map(normalizeFilterId)
    selectedContractTypes.value = value.contractTypes.map(normalizeFilterId)
    selectedBenefits.value = value.benefits.map(normalizeFilterId)
  }

  function isCitySelected(cityValue: string | number) {
    const id = normalizeFilterId(cityValue)
    return selectedCities.value.some((city) => normalizeFilterId(city) === id)
  }

  if (model?.value) {
    applyFiltersModel(model.value)
  }

  watch(
    () => model?.value,
    (value) => {
      if (!value) return
      const current = filtersModel.value
      const unchanged =
        value.titleSearch === current.titleSearch &&
        JSON.stringify(value) === JSON.stringify(current)
      if (!unchanged) applyFiltersModel(value)
    },
    { deep: true },
  )

  watch(
    filtersModel,
    (value) => {
      if (model) model.value = value
    },
    { deep: true },
  )

  watch(citySearch, async (query) => {
    if (!query.trim()) return
    await Promise.all(
      provinces.map((province) => ensureProvinceCities(province.value as number)),
    )
  })

  function clearFilters() {
    selectedJobTypes.value = []
    jobTitleSearch.value = ''
    jobGroupSearch.value = ''
    selectedJobGroups.value = []
    citySearch.value = ''
    expandedProvinces.value = []
    selectedCities.value = []
    selectedProvinces.value = []
    selectedSalaries.value = []
    selectedWorkHistory.value = []
    selectedContractTypes.value = []
    selectedBenefits.value = []

    if (model) model.value = createEmptyJobFilters()
  }

  function provinceCheckState(provinceId: number): ProvinceCheckState {
    const cities = citiesByProvince.value[provinceId] ?? []
    if (!cities.length) {
      return selectedProvinces.value.includes(provinceId) ? 'all' : 'none'
    }

    const selectedCount = cities.filter((city) =>
      isCitySelected(city.value),
    ).length

    if (selectedCount === 0) return 'none'
    if (selectedCount === cities.length) return 'all'
    return 'some'
  }

  function setProvinceIndeterminate(
    el: Element | ComponentPublicInstance | null,
    provinceId: number,
  ) {
    const input = el instanceof HTMLInputElement ? el : null
    if (!input) return
    input.indeterminate = provinceCheckState(provinceId) === 'some'
  }

  function isProvinceExpanded(item: LocationTreeItem) {
    if (item.forceExpand) return true
    return expandedProvinces.value.includes(item.province.value as number)
  }

  async function ensureProvinceCities(provinceId: number) {
    if (citiesByProvince.value[provinceId] || citiesLoading.value[provinceId]) return

    citiesLoading.value[provinceId] = true
    try {
      citiesByProvince.value[provinceId] = await api.get<ISelectItem[]>(
        `/cities/${provinceId}`,
      )
    } finally {
      citiesLoading.value[provinceId] = false
    }
  }

  async function toggleProvinceExpand(provinceId: number) {
    if (expandedProvinces.value.includes(provinceId)) {
      expandedProvinces.value = expandedProvinces.value.filter((id) => id !== provinceId)
      return
    }

    expandedProvinces.value = [...expandedProvinces.value, provinceId]
    await ensureProvinceCities(provinceId)
  }

  async function toggleProvince(provinceId: number) {
    await ensureProvinceCities(provinceId)
    const cities = citiesByProvince.value[provinceId] ?? []
    const state = provinceCheckState(provinceId)

    if (state === 'all') {
      const cityValues = new Set(cities.map((city) => normalizeFilterId(city.value)))
      selectedCities.value = selectedCities.value.filter(
        (id) => !cityValues.has(normalizeFilterId(id)),
      )
      selectedProvinces.value = selectedProvinces.value.filter((id) => id !== provinceId)
      return
    }

    const nextCities = new Set(selectedCities.value.map(normalizeFilterId))
    for (const city of cities) {
      nextCities.add(normalizeFilterId(city.value))
    }
    selectedCities.value = [...nextCities]

    if (!selectedProvinces.value.includes(provinceId)) {
      selectedProvinces.value = [...selectedProvinces.value, provinceId]
    }
  }

  function toggleCity(
    cityValue: string | number,
    provinceId: number,
    event: Event,
  ) {
    const checked = (event.target as HTMLInputElement).checked
    const id = normalizeFilterId(cityValue)

    if (checked) {
      if (!isCitySelected(id)) {
        selectedCities.value = [...selectedCities.value, id]
      }
      if (!selectedProvinces.value.includes(provinceId)) {
        selectedProvinces.value = [...selectedProvinces.value, provinceId]
      }
      return
    }

    selectedCities.value = selectedCities.value.filter(
      (city) => normalizeFilterId(city) !== id,
    )
    const hasSelectedCity = (citiesByProvince.value[provinceId] ?? []).some((city) =>
      isCitySelected(city.value),
    )

    if (!hasSelectedCity) {
      selectedProvinces.value = selectedProvinces.value.filter((id) => id !== provinceId)
    }
  }

  return {
    jobTitleSearch,
    jobGroupSearch,
    citySearch,
    jobTitles,
    employmentTypes,
    experienceLevels,
    salaryRanges,
    benefits,
    selectedJobTypes,
    selectedJobGroups,
    selectedSalaries,
    selectedWorkHistory,
    selectedContractTypes,
    selectedBenefits,
    selectedCities,
    citiesLoading,
    adTypeOptions,
    contractTypeOptions,
    filteredJobGroups,
    filteredLocationTree,
    activeFilterCount,
    filtersModel,
    clearFilters,
    provinceCheckState,
    setProvinceIndeterminate,
    isProvinceExpanded,
    toggleProvinceExpand,
    toggleProvince,
    toggleCity,
    isCitySelected,
  }
}
