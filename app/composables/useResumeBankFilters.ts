import {
  createEmptyResumeBankFilters,
  RESUME_BANK_JOB_STATUS_OPTIONS,
  RESUME_BANK_LOOKUP_KEYS,
  type ResumeBankFiltersModel,
} from '~/types/resume-bank'
import { mapEmployerGenderOptions } from '~/utils/employer-ad-request-lookups'
import { normalizeFilterId } from '~/utils/job-filters-query'

export function useResumeBankFilters(model?: Ref<ResumeBankFiltersModel>) {
  const { items } = useLookups(RESUME_BANK_LOOKUP_KEYS)

  const titleSearch = ref('')
  const jobGroupSearch = ref('')
  const skillSearch = ref('')
  const provinceSearch = ref('')

  const jobTitles = items('job_titles')
  const experienceLevels = items('experience_levels')
  const salaryRanges = items('salary_ranges')
  const educationLevels = items('education_levels')
  const genders = items('genders')
  const provinces = items('provinces')
  const skills = items('proficiencies')

  const selectedJobTitles = ref<Array<string | number>>([])
  const selectedSkills = ref<Array<string | number>>([])
  const selectedJobStatuses = ref<Array<string | number>>([])
  const selectedExperience = ref<Array<string | number>>([])
  const selectedSalaries = ref<Array<string | number>>([])
  const selectedEducation = ref<Array<string | number>>([])
  const selectedProvinces = ref<number[]>([])
  const selectedGender = ref<string | null>(null)

  const jobStatusOptions = computed(() =>
    RESUME_BANK_JOB_STATUS_OPTIONS.map((item) => ({
      label: item.label,
      value: item.value,
    })),
  )
  const genderOptions = computed(() => mapEmployerGenderOptions(genders.value))

  const filteredJobTitles = computed(() => {
    const query = jobGroupSearch.value.trim()
    if (!query) return jobTitles.value
    return jobTitles.value.filter((item) => item.label.includes(query))
  })

  const filteredSkills = computed(() => {
    const query = skillSearch.value.trim()
    if (!query) return skills.value
    return skills.value.filter((item) => item.label.includes(query))
  })

  const filteredProvinces = computed(() => {
    const query = provinceSearch.value.trim()
    if (!query) return provinces.value
    return provinces.value.filter((item) => item.label.includes(query))
  })

  const selectedGenderValues = computed(() =>
    selectedGender.value != null ? [selectedGender.value] : [],
  )

  const activeFilterCount = computed(() => {
    let count = 0

    if (titleSearch.value.trim()) count += 1
    count += selectedJobTitles.value.length
    count += selectedSkills.value.length
    count += selectedJobStatuses.value.length
    count += selectedExperience.value.length
    count += selectedSalaries.value.length
    count += selectedEducation.value.length
    count += selectedProvinces.value.length
    if (selectedGender.value != null) count += 1

    return count
  })

  const filtersModel = computed<ResumeBankFiltersModel>(() => ({
    titleSearch: titleSearch.value,
    jobTitles: selectedJobTitles.value.map(String),
    skills: selectedSkills.value.map(String),
    jobStatuses: selectedJobStatuses.value.map(String),
    experience: selectedExperience.value.map(String),
    salaries: selectedSalaries.value.map(String),
    education: selectedEducation.value.map(String),
    provinces: [...selectedProvinces.value],
    gender: selectedGender.value,
  }))

  function applyFiltersModel(value: ResumeBankFiltersModel) {
    titleSearch.value = value.titleSearch
    jobGroupSearch.value = ''
    skillSearch.value = ''
    provinceSearch.value = ''
    selectedJobTitles.value = value.jobTitles.map(normalizeFilterId)
    selectedSkills.value = value.skills.map(normalizeFilterId)
    selectedJobStatuses.value = value.jobStatuses.map(normalizeFilterId)
    selectedExperience.value = value.experience.map(normalizeFilterId)
    selectedSalaries.value = value.salaries.map(normalizeFilterId)
    selectedEducation.value = value.education.map(normalizeFilterId)
    selectedProvinces.value = [...value.provinces]
    selectedGender.value = value.gender
  }

  if (model?.value) {
    applyFiltersModel(model.value)
  }

  watch(
    () => model?.value,
    (value) => {
      if (!value) return
      const current = filtersModel.value
      const unchanged = JSON.stringify(value) === JSON.stringify(current)
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
    titleSearch.value = ''
    jobGroupSearch.value = ''
    skillSearch.value = ''
    provinceSearch.value = ''
    selectedJobTitles.value = []
    selectedSkills.value = []
    selectedJobStatuses.value = []
    selectedExperience.value = []
    selectedSalaries.value = []
    selectedEducation.value = []
    selectedProvinces.value = []
    selectedGender.value = null

    if (model) model.value = createEmptyResumeBankFilters()
  }

  function setGenderSelection(values: Array<string | number>) {
    if (!values.length) {
      selectedGender.value = null
      return
    }

    selectedGender.value = String(values[values.length - 1])
  }

  return {
    titleSearch,
    jobGroupSearch,
    skillSearch,
    provinceSearch,
    jobTitles,
    experienceLevels,
    salaryRanges,
    educationLevels,
    genderOptions,
    jobStatusOptions,
    filteredJobTitles,
    filteredSkills,
    filteredProvinces,
    selectedJobTitles,
    selectedSkills,
    selectedJobStatuses,
    selectedExperience,
    selectedSalaries,
    selectedEducation,
    selectedProvinces,
    selectedGender,
    selectedGenderValues,
    filtersModel,
    activeFilterCount,
    clearFilters,
    setGenderSelection,
  }
}
