<template>
  <FilterSearchField
    v-if="sectionIndex === 0"
    v-model="search"
    placeholder="جستجوی نام شرکت یا نوع فعالیت ..."
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 1"
    v-model="selectedProvinces"
    :options="filters.provinces"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 2"
    v-model="selectedActivities"
    :options="filters.activities"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 3"
    v-model="selectedSizes"
    :options="filters.sizes"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 4"
    v-model="selectedBenefits"
    :options="filters.benefits"
  />
</template>

<script setup lang="ts">
import FilterCheckboxList from '~/components/Elements/FilterCheckboxList.vue'
import FilterSearchField from '~/components/Elements/FilterSearchField.vue'
import { COMPANY_FILTERS_INJECTION_KEY } from '~/composables/company-filters-context'

defineProps<{
  sectionIndex: number
}>()

const filters = inject(COMPANY_FILTERS_INJECTION_KEY)
if (!filters) {
  throw new Error('Company filters context is missing')
}

const model = filters.model

const search = computed({
  get: () => model.search,
  set: (value) => {
    model.search = value
  },
})

const selectedProvinces = computed({
  get: () => model.provinces,
  set: (value) => {
    model.provinces = value as number[]
  },
})

const selectedActivities = computed({
  get: () => model.activities,
  set: (value) => {
    model.activities = value
  },
})

const selectedSizes = computed({
  get: () => model.sizes,
  set: (value) => {
    model.sizes = value
  },
})

const selectedBenefits = computed({
  get: () => model.benefits,
  set: (value) => {
    model.benefits = value
  },
})
</script>
