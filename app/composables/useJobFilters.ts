import {
  createEmptyJobFilters,
  JOB_FILTERS_LOOKUP_KEYS,
  type JobFiltersModel,
} from '~/types/job-filters'
import { normalizeFilterId } from '~/utils/job-filters-query'

export function useJobFilters(model?: Ref<JobFiltersModel>) {
  const { items } = useLookups(JOB_FILTERS_LOOKUP_KEYS)

  const jobTitleSearch = ref('')
  const jobGroupSearch = ref('')
  const provinceSearch = ref('')

  const jobTitles = items('job_titles')
  const employmentTypes = items('employment_types')
  const experienceLevels = items('experience_levels')
  const salaryRanges = items('salary_ranges')
  const benefits = items('benefits')
  const provinces = items('provinces')

  const selectedJobTypes = ref<Array<string | number>>([])
  const selectedJobGroups = ref<Array<string | number>>([])
  const selectedSalaries = ref<Array<string | number>>([])
  const selectedWorkHistory = ref<Array<string | number>>([])
  const selectedContractTypes = ref<Array<string | number>>([])
  const selectedBenefits = ref<Array<string | number>>([])
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

  const filteredProvinces = computed(() => {
    const query = provinceSearch.value.trim()
    if (!query) return provinces.value
    return provinces.value.filter((province) => province.label.includes(query))
  })

  const activeFilterCount = computed(() => {
    let count = selectedJobTypes.value.length

    if (jobTitleSearch.value.trim()) count += 1
    count += selectedJobGroups.value.length
    count += selectedProvinces.value.length
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
    provinceSearch.value = ''
    selectedProvinces.value = [...value.provinces]
    selectedSalaries.value = value.salaries.map(normalizeFilterId)
    selectedWorkHistory.value = value.workHistory.map(normalizeFilterId)
    selectedContractTypes.value = value.contractTypes.map(normalizeFilterId)
    selectedBenefits.value = value.benefits.map(normalizeFilterId)
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

  function clearFilters() {
    selectedJobTypes.value = []
    jobTitleSearch.value = ''
    jobGroupSearch.value = ''
    selectedJobGroups.value = []
    provinceSearch.value = ''
    selectedProvinces.value = []
    selectedSalaries.value = []
    selectedWorkHistory.value = []
    selectedContractTypes.value = []
    selectedBenefits.value = []

    if (model) model.value = createEmptyJobFilters()
  }

  return {
    jobTitleSearch,
    jobGroupSearch,
    provinceSearch,
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
    selectedProvinces,
    adTypeOptions,
    contractTypeOptions,
    filteredJobGroups,
    filteredProvinces,
    activeFilterCount,
    filtersModel,
    clearFilters,
  }
}
