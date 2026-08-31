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

      <Icon :name="jobTypeIcon(jobType.value)" />
      <span class="text-text-tertiary">{{ jobType.label }}</span>
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
      v-model="filters.provinceSearch"
      placeholder="جستجو در استان‌ها"
      wrapper-class="mb-3"
    />
    <FilterCheckboxList
      v-model="filters.selectedProvinces"
      :options="filters.filteredProvinces"
      list-class="pb-1"
    />
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
import FilterCheckboxList from "~/components/Elements/FilterCheckboxList.vue";
import FilterSearchField from "~/components/Elements/FilterSearchField.vue";
import { JOB_FILTERS_INJECTION_KEY } from "~/composables/job-filters-context";

defineProps<{
  sectionIndex: number;
}>();

const filters = (() => {
  const ctx = inject(JOB_FILTERS_INJECTION_KEY);
  if (!ctx) {
    throw new Error(
      "JobFilterSectionContent must be used within a job filters provider",
    );
  }
  return ctx;
})();

function jobTypeIcon(value: string | number) {
  switch (String(value)) {
    case "full_time":
      return "svg:bag-3";
    case "part_time":
      return "svg:timer";
    case "project_based":
      return "svg:projects-1";
    default:
      return "svg:bag-3";
  }
}
</script>
