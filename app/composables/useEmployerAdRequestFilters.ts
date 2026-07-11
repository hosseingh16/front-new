import {
  AD_REQUEST_EXPERIENCE_OPTIONS,
  AD_REQUEST_GENDER_OPTIONS,
  AD_REQUEST_STATUS_OPTIONS,
  createEmptyEmployerAdRequestFilters,
  type EmployerAdRequestFiltersModel,
} from '~/types/employer-ad-request'

export function useEmployerAdRequestFilters(model?: Ref<EmployerAdRequestFiltersModel>) {
  const selectedStatuses = ref<number[]>(
    AD_REQUEST_STATUS_OPTIONS.map((item) => item.value),
  )
  const selectedExperience = ref<string | null>(null)
  const selectedGender = ref<string | null>(null)

  const statusOptions = AD_REQUEST_STATUS_OPTIONS
  const experienceOptions = AD_REQUEST_EXPERIENCE_OPTIONS
  const genderOptions = AD_REQUEST_GENDER_OPTIONS

  const filtersModel = computed<EmployerAdRequestFiltersModel>(() => ({
    statuses: [...selectedStatuses.value],
    experience: selectedExperience.value,
    gender: selectedGender.value,
  }))

  const activeFilterCount = computed(() => {
    let count = 0

    if (selectedStatuses.value.length !== statusOptions.length) {
      count += 1
    }
    if (selectedExperience.value) count += 1
    if (selectedGender.value != null) count += 1

    return count
  })

  function applyFiltersModel(value: EmployerAdRequestFiltersModel) {
    selectedStatuses.value = [...value.statuses]
    selectedExperience.value = value.experience
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
    const empty = createEmptyEmployerAdRequestFilters()
    selectedStatuses.value = [...empty.statuses]
    selectedExperience.value = empty.experience
    selectedGender.value = empty.gender

    if (model) model.value = empty
  }

  function isStatusSelected(value: number) {
    return selectedStatuses.value.includes(value)
  }

  function toggleStatus(value: number) {
    if (isStatusSelected(value)) {
      if (selectedStatuses.value.length === 1) return
      selectedStatuses.value = selectedStatuses.value.filter((item) => item !== value)
      return
    }

    selectedStatuses.value = [...selectedStatuses.value, value]
  }

  function isExperienceSelected(value: string) {
    return selectedExperience.value === value
  }

  function toggleExperience(value: string) {
    selectedExperience.value = selectedExperience.value === value ? null : value
  }

  function isGenderSelected(value: string) {
    return selectedGender.value === value
  }

  function toggleGender(value: string) {
    selectedGender.value = selectedGender.value === value ? null : value
  }

  return {
    selectedStatuses,
    selectedExperience,
    selectedGender,
    statusOptions,
    experienceOptions,
    genderOptions,
    filtersModel,
    activeFilterCount,
    clearFilters,
    isStatusSelected,
    toggleStatus,
    isExperienceSelected,
    toggleExperience,
    isGenderSelected,
    toggleGender,
  }
}
