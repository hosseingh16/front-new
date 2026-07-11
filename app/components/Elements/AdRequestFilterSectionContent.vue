<template>
  <div v-if="sectionIndex === 0" class="space-y-3">
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
      <span
        class="inline-block h-2 w-2 shrink-0 rounded-full"
        :style="{ backgroundColor: status.dotColor }"
      />
      <span>{{ status.label }}</span>
    </label>
  </div>

  <div v-else-if="sectionIndex === 1" class="space-y-3">
    <label
      v-for="experience in filters.experienceOptions"
      :key="experience"
      class="flex cursor-pointer items-center gap-2"
    >
      <input
        type="checkbox"
        class="checkbox checkbox-primary p-1.5"
        :checked="filters.isExperienceSelected(experience)"
        @change="filters.toggleExperience(experience)"
      />
      <span>{{ experience }}</span>
    </label>
  </div>

  <div v-else-if="sectionIndex === 2" class="space-y-3">
    <label
      v-for="gender in filters.genderOptions"
      :key="gender.value"
      class="flex cursor-pointer items-center gap-2"
    >
      <input
        type="checkbox"
        class="checkbox checkbox-primary p-1.5"
        :checked="filters.isGenderSelected(gender.value)"
        @change="filters.toggleGender(gender.value)"
      />
      <span>{{ gender.label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { EMPLOYER_AD_REQUEST_FILTERS_INJECTION_KEY } from '~/composables/employer-ad-request-filters-context'

defineProps<{
  sectionIndex: number
}>()

const filters = (() => {
  const ctx = inject(EMPLOYER_AD_REQUEST_FILTERS_INJECTION_KEY)
  if (!ctx) {
    throw new Error('AdRequestFilterSectionContent must be used within a filters provider')
  }
  return ctx
})()
</script>
