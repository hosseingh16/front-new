<template>
  <div v-if="sectionIndex === 0" class="space-y-2">
    <div
      v-for="jobType in filters.adTypeOptions"
      :key="jobType.value"
      class="flex items-center gap-2"
    >
      <input
        v-model="filters.selectedJobTypes"
        type="checkbox"
        :value="jobType.value"
        class="checkbox checkbox-primary p-1.5"
      />
      <Icon name="svg:bag-3" />
      <span>{{ jobType.label }}</span>
    </div>
  </div>

  <div v-else-if="sectionIndex === 1" class="pb-1">
    <FilterSearchField
      v-model="filters.jobTitleSearch"
      placeholder="جستجوی عنوان شغلی و ..."
    />
  </div>

  <div v-else-if="sectionIndex === 2" class="pb-1">
    <FilterSearchField
      v-model="filters.jobGroupSearch"
      placeholder="جستجو در گروه‌های شغلی"
      wrapper-class="mb-3"
    />
    <FilterCheckboxList
      v-model="filters.selectedJobGroups"
      :options="filters.filteredJobGroups"
    />
  </div>

  <div v-else-if="sectionIndex === 3" class="pb-1">
    <FilterSearchField
      v-model="filters.citySearch"
      placeholder="جستجو در شهرها"
      wrapper-class="mb-3"
    />
    <div class="max-h-[280px] space-y-2 overflow-y-auto overflow-x-hidden">
      <div
        v-for="item in filters.filteredLocationTree"
        :key="item.province.value"
        class="space-y-2"
      >
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="filters.provinceCheckState(item.province.value as number) === 'all'"
            :ref="(el) => filters.setProvinceIndeterminate(el, item.province.value as number)"
            class="checkbox checkbox-primary p-1.5"
            @change="filters.toggleProvince(item.province.value as number)"
          />
          <span
            class="flex-1 cursor-pointer"
            @click="filters.toggleProvinceExpand(item.province.value as number)"
          >
            {{ item.province.label }}
          </span>
          <button
            type="button"
            class="shrink-0 p-0.5"
            @click="filters.toggleProvinceExpand(item.province.value as number)"
          >
            <icons-chevron
              class="transition-transform"
              :class="{ 'rotate-180': filters.isProvinceExpanded(item) }"
              color="#757575"
            />
          </button>
        </div>
        <div v-if="filters.isProvinceExpanded(item)" class="me-6 space-y-2">
          <p
            v-if="filters.citiesLoading[item.province.value as number]"
            class="text-xs text-text-passive"
          >
            در حال بارگذاری...
          </p>
          <div
            v-for="city in item.cities"
            :key="city.value"
            class="flex items-center gap-2 px-2"
          >
            <input
              type="checkbox"
              :checked="filters.isCitySelected(city.value)"
              class="checkbox checkbox-primary p-1.5"
              @change="filters.toggleCity(city.value, item.province.value as number, $event)"
            />
            <span>{{ city.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <FilterCheckboxList
    v-else-if="sectionIndex === 4"
    v-model="filters.selectedSalaries"
    :options="filters.salaryRanges"
    list-class="pb-1"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 5"
    v-model="filters.selectedWorkHistory"
    :options="filters.experienceLevels"
    list-class="pb-1"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 6"
    v-model="filters.selectedContractTypes"
    :options="filters.contractTypeOptions"
    list-class="pb-1"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 7"
    v-model="filters.selectedBenefits"
    :options="filters.benefits"
    list-class="pb-1"
  />
</template>

<script setup lang="ts">
import FilterCheckboxList from '~/components/Elements/FilterCheckboxList.vue'
import FilterSearchField from '~/components/Elements/FilterSearchField.vue'
import { JOB_FILTERS_INJECTION_KEY } from '~/composables/job-filters-context'

defineProps<{
  sectionIndex: number
}>()

const filters = (() => {
  const ctx = inject(JOB_FILTERS_INJECTION_KEY)
  if (!ctx) {
    throw new Error('JobFilterSectionContent must be used within a job filters provider')
  }
  return ctx
})()
</script>
