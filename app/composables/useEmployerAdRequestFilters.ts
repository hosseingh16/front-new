import {
  createEmptyEmployerAdRequestFilters,
  type EmployerAdRequestFiltersModel,
  type EmployerAdRequestStatusOption,
} from '~/types/employer-ad-request'
import type { ISelectItem } from '~/types/select-item'
import {
  EMPLOYER_AD_REQUEST_LOOKUP_KEYS,
  mapAdRequestStatusOptions,
  mapEmployerGenderOptions,
} from '~/utils/employer-ad-request-lookups'

export function useEmployerAdRequestFilters(model?: Ref<EmployerAdRequestFiltersModel>) {
  const { items } = useLookups(EMPLOYER_AD_REQUEST_LOOKUP_KEYS)

  const statusOptions = ref<EmployerAdRequestStatusOption[]>([])
  const experienceOptions = ref<ISelectItem[]>([])
  const genderOptions = ref<ISelectItem[]>([])
  const adRequestStatuses = items('ad_request_statuses')
  const experienceLevels = items('experience_levels')
  const genders = items('genders')

  const selectedStatuses = ref<number[]>([])
  const selectedExperiences = ref<string[]>([])
  const selectedGender = ref<string | null>(null)

  const filtersModel = computed<EmployerAdRequestFiltersModel>(() => ({
    statuses: [...selectedStatuses.value],
    experience: [...selectedExperiences.value],
    gender: selectedGender.value,
  }))

  const selectedGenderValues = computed(() =>
    selectedGender.value != null ? [selectedGender.value] : [],
  )

  const activeFilterCount = computed(() => {
    let count = 0

    if (
      statusOptions.value.length &&
      selectedStatuses.value.length !== statusOptions.value.length
    ) {
      count += 1
    }
    count += selectedExperiences.value.length
    if (selectedGender.value != null) count += 1

    return count
  })

  function applyFiltersModel(value: EmployerAdRequestFiltersModel) {
    selectedStatuses.value = [...value.statuses]
    selectedExperiences.value = [...value.experience]
    selectedGender.value = value.gender
  }

  function ensureDefaultStatuses() {
    if (!statusOptions.value.length || selectedStatuses.value.length) return
    selectedStatuses.value = statusOptions.value.map((item) => item.value)
  }

  function syncLookupOptions() {
    statusOptions.value = mapAdRequestStatusOptions(adRequestStatuses.value)
    experienceOptions.value = experienceLevels.value
    genderOptions.value = mapEmployerGenderOptions(genders.value)
    ensureDefaultStatuses()
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

  watch(statusOptions, () => {
    ensureDefaultStatuses()
  })

  function clearFilters() {
    const empty = createEmptyEmployerAdRequestFilters(
      statusOptions.value.map((item) => item.value),
    )
    selectedStatuses.value = [...empty.statuses]
    selectedExperiences.value = [...empty.experience]
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

  function isGenderSelected(value: string | number) {
    return selectedGender.value === String(value)
  }

  function toggleGender(value: string | number) {
    const next = String(value)
    selectedGender.value = selectedGender.value === next ? null : next
  }

  function setGenderSelection(values: Array<string | number>) {
    if (!values.length) {
      selectedGender.value = null
      return
    }

    selectedGender.value = String(values[values.length - 1])
  }

  watch(
    [adRequestStatuses, experienceLevels, genders],
    () => {
      syncLookupOptions()
    },
    { immediate: true },
  )

  return {
    selectedStatuses,
    selectedExperiences,
    selectedGender,
    selectedGenderValues,
    statusOptions,
    experienceOptions,
    genderOptions,
    filtersModel,
    activeFilterCount,
    clearFilters,
    isStatusSelected,
    toggleStatus,
    isGenderSelected,
    toggleGender,
    setGenderSelection,
  }
}
