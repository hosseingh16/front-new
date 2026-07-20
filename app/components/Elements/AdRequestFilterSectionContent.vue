<template>
  <div v-if="sectionIndex === 0" class="space-y-2">
    <label
      v-for="status in filters.statusOptions"
      :key="status.value"
      class="flex cursor-pointer items-center gap-2"
    >
      <input
        type="checkbox"
        class="checkbox checkbox-primary p-1.5"
        :checked="filters.isStatusSelected(status.value)"
        @change="filters.toggleStatus(status.value)"
      />
      <Icon :name="adRequestStatusIcon(status.value)" class="text-gray-500" />
      <span class="text-text-tertiary">{{ status.label }}</span>
    </label>
  </div>

  <FilterCheckboxList
    v-else-if="sectionIndex === 1"
    v-model="filters.selectedExperiences"
    :options="filters.experienceOptions"
    list-class="pb-1"
  />

  <FilterCheckboxList
    v-else-if="sectionIndex === 2"
    :model-value="filters.selectedGenderValues"
    :options="filters.genderOptions"
    list-class="pb-1"
    @update:model-value="filters.setGenderSelection"
  />
</template>

<script setup lang="ts">
import FilterCheckboxList from "~/components/Elements/FilterCheckboxList.vue";
import { EMPLOYER_AD_REQUEST_FILTERS_INJECTION_KEY } from "~/composables/employer-ad-request-filters-context";
import { adRequestStatusIcon } from "~/utils/employer-ad-request-lookups";

defineProps<{
  sectionIndex: number;
}>();

const filters = (() => {
  const ctx = inject(EMPLOYER_AD_REQUEST_FILTERS_INJECTION_KEY);
  if (!ctx) {
    throw new Error(
      "AdRequestFilterSectionContent must be used within a filters provider",
    );
  }
  return ctx;
})();
</script>
