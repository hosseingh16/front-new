import {
  createEmptyJobFilters,
  JOB_FILTERS_LOOKUP_KEYS,
  type JobFiltersModel,
} from '~/types/job-filters'
import { normalizeFilterId } from '~/utils/job-filters-query'

export function useJobFilters(model?: Ref<JobFiltersModel>) {
  const { items } = useLookups(JOB_FILTERS_LOOKUP_KEYS)

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
      ['full_time', 'part_time', 'remote', 'internship'].includes(
        String(item.value),
      ),
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
    return (
      selectedJobTypes.value.length +
      selectedJobGroups.value.length +
      selectedProvinces.value.length +
      selectedSalaries.value.length +
      selectedWorkHistory.value.length +
      selectedContractTypes.value.length +
      selectedBenefits.value.length
    )
  })

  function toFiltersModel(): JobFiltersModel {
    return {
      jobTypes: [...selectedJobTypes.value],
      titleSearch: model?.value?.titleSearch ?? '',
      jobGroups: [...selectedJobGroups.value],
      provinces: selectedProvinces.value.map((id) => Number(id)),
      salaries: [...selectedSalaries.value],
      workHistory: [...selectedWorkHistory.value],
      contractTypes: [...selectedContractTypes.value],
      benefits: [...selectedBenefits.value],
    }
  }

  const filtersModel = computed(() => toFiltersModel())

  function applyFiltersModel(value: JobFiltersModel) {
    selectedJobTypes.value = value.jobTypes.map(normalizeFilterId)
    jobGroupSearch.value = ''
    selectedJobGroups.value = value.jobGroups.map(normalizeFilterId)
    provinceSearch.value = ''
    selectedProvinces.value = value.provinces.map((id) => Number(id))
    selectedSalaries.value = value.salaries.map(normalizeFilterId)
    selectedWorkHistory.value = value.workHistory.map(normalizeFilterId)
    selectedContractTypes.value = value.contractTypes.map(normalizeFilterId)
    selectedBenefits.value = value.benefits.map(normalizeFilterId)
  }

  function pushModel() {
    if (!model) return
    const next = toFiltersModel()
    if (JSON.stringify(model.value) === JSON.stringify(next)) return
    model.value = next
  }

  if (model?.value) {
    applyFiltersModel(model.value)
  }

  watch(
    () => model?.value,
    (value) => {
      if (!value) return
      const current = toFiltersModel()
      const unchanged =
        JSON.stringify({ ...value, titleSearch: '' }) ===
        JSON.stringify({ ...current, titleSearch: '' })
      if (!unchanged) applyFiltersModel(value)
    },
    { deep: true },
  )

  // Watch selection refs directly — reactive() + checkbox v-model can detach
  // from a computed-based model sync.
  watch(
    [
      selectedJobTypes,
      selectedJobGroups,
      selectedProvinces,
      selectedSalaries,
      selectedWorkHistory,
      selectedContractTypes,
      selectedBenefits,
    ],
    pushModel,
    { deep: true },
  )

  function clearFilters() {
    selectedJobTypes.value = []
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

  /** Writable models so reactive() + checkbox v-model always write to the refs. */
  const selectedJobTypesModel = computed({
    get: () => selectedJobTypes.value,
    set: (value: Array<string | number>) => {
      selectedJobTypes.value = value.map(normalizeFilterId)
    },
  })
  const selectedJobGroupsModel = computed({
    get: () => selectedJobGroups.value,
    set: (value: Array<string | number>) => {
      selectedJobGroups.value = value.map(normalizeFilterId)
    },
  })
  const selectedProvincesModel = computed({
    get: () => selectedProvinces.value,
    set: (value: Array<string | number>) => {
      selectedProvinces.value = value.map((id) => Number(id))
    },
  })
  const selectedSalariesModel = computed({
    get: () => selectedSalaries.value,
    set: (value: Array<string | number>) => {
      selectedSalaries.value = value.map(normalizeFilterId)
    },
  })
  const selectedWorkHistoryModel = computed({
    get: () => selectedWorkHistory.value,
    set: (value: Array<string | number>) => {
      selectedWorkHistory.value = value.map(normalizeFilterId)
    },
  })
  const selectedContractTypesModel = computed({
    get: () => selectedContractTypes.value,
    set: (value: Array<string | number>) => {
      selectedContractTypes.value = value.map(normalizeFilterId)
    },
  })
  const selectedBenefitsModel = computed({
    get: () => selectedBenefits.value,
    set: (value: Array<string | number>) => {
      selectedBenefits.value = value.map(normalizeFilterId)
    },
  })

  return {
    jobGroupSearch,
    provinceSearch,
    jobTitles,
    employmentTypes,
    experienceLevels,
    salaryRanges,
    benefits,
    selectedJobTypes: selectedJobTypesModel,
    selectedJobGroups: selectedJobGroupsModel,
    selectedSalaries: selectedSalariesModel,
    selectedWorkHistory: selectedWorkHistoryModel,
    selectedContractTypes: selectedContractTypesModel,
    selectedBenefits: selectedBenefitsModel,
    selectedProvinces: selectedProvincesModel,
    adTypeOptions,
    contractTypeOptions,
    filteredJobGroups,
    filteredProvinces,
    activeFilterCount,
    filtersModel,
    clearFilters,
  }
}
