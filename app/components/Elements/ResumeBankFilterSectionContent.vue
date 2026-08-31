<template>
  <div v-if="sectionIndex === 0" class="pb-1">
    <FilterSearchField
      v-model="filters.titleSearch"
      placeholder="جستجوی عنوان شغلی و ..."
      wrapper-class="mb-3"
    />
    <FilterSearchField
      v-model="filters.jobGroupSearch"
      placeholder="جستجو در گروه‌های شغلی"
      wrapper-class="mb-3"
    />
    <FilterCheckboxList
      v-model="filters.selectedJobTitles"
      :options="filters.filteredJobTitles"
    />
  </div>

  <div v-else-if="sectionIndex === 1" class="pb-1">
    <FilterSearchField
      v-model="filters.skillSearch"
      placeholder="جستجو در مهارت‌ها"
      wrapper-class="mb-3"
    />
    <FilterCheckboxList
      v-model="filters.selectedSkills"
      :options="filters.filteredSkills"
      list-class="pb-1"
    />
  </div>

  <div v-else-if="sectionIndex === 2" class="space-y-4 pb-1">
    <FilterCheckboxList
      v-model="filters.selectedJobStatuses"
      :options="filters.jobStatusOptions"
    />
    <FilterCheckboxList
      v-model="filters.selectedExperience"
      :options="filters.experienceLevels"
      list-class="pb-1"
    />
  </div>

  <FilterCheckboxList
    v-else-if="sectionIndex === 3"
    v-model="filters.selectedSalaries"
    :options="filters.salaryRanges"
    list-class="pb-1"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 4"
    v-model="filters.selectedEducation"
    :options="filters.educationLevels"
    list-class="pb-1"
  />

  <div v-else-if="sectionIndex === 5" class="pb-1">
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
    v-else-if="sectionIndex === 6"
    :model-value="filters.selectedGenderValues"
    :options="filters.genderOptions"
    list-class="pb-1"
    @update:model-value="filters.setGenderSelection"
  />
</template>

<script setup lang="ts">
import FilterCheckboxList from "~/components/Elements/FilterCheckboxList.vue";
import FilterSearchField from "~/components/Elements/FilterSearchField.vue";
import { RESUME_BANK_FILTERS_INJECTION_KEY } from "~/composables/resume-bank-filters-context";

defineProps<{
  sectionIndex: number;
}>();

const filters = (() => {
  const ctx = inject(RESUME_BANK_FILTERS_INJECTION_KEY);
  if (!ctx) {
    throw new Error(
      "ResumeBankFilterSectionContent must be used within a resume bank filters provider",
    );
  }
  return ctx;
})();
</script>
