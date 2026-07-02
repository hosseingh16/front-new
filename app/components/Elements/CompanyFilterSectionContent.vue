<template>
  <FilterSearchField
    v-if="sectionIndex === 0"
    v-model="search"
    placeholder="جستجوی نام شرکت یا نوع فعالیت ..."
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 1"
    v-model="provinces"
    :options="COMPANY_PROVINCE_OPTIONS"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 2"
    v-model="activities"
    :options="COMPANY_ACTIVITY_OPTIONS"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 3"
    v-model="sizes"
    :options="COMPANY_SIZE_OPTIONS"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 4"
    v-model="adCounts"
    :options="COMPANY_AD_COUNT_OPTIONS"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 5"
    v-model="benefits"
    :options="COMPANY_BENEFIT_OPTIONS"
  />
</template>

<script setup lang="ts">
import FilterCheckboxList from '~/components/Elements/FilterCheckboxList.vue'
import FilterSearchField from '~/components/Elements/FilterSearchField.vue'
import {
  COMPANY_ACTIVITY_OPTIONS,
  COMPANY_AD_COUNT_OPTIONS,
  COMPANY_BENEFIT_OPTIONS,
  COMPANY_PROVINCE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
} from '~/constants/company-filter-options'
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
  get: () => model.value.search,
  set: (value) => {
    model.value.search = value
  },
})

const provinces = computed({
  get: () => model.value.provinces,
  set: (value) => {
    model.value.provinces = value as number[]
  },
})

const activities = computed({
  get: () => model.value.activities,
  set: (value) => {
    model.value.activities = value
  },
})

const sizes = computed({
  get: () => model.value.sizes,
  set: (value) => {
    model.value.sizes = value
  },
})

const adCounts = computed({
  get: () => model.value.adCounts,
  set: (value) => {
    model.value.adCounts = value
  },
})

const benefits = computed({
  get: () => model.value.benefits,
  set: (value) => {
    model.value.benefits = value
  },
})
</script>
