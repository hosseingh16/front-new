<template>
  <AdRequestFiltersMobile class="col-span-full min-w-0 md:hidden" />

  <aside
    class="hidden md:block bg-white rounded-lg border border-b-0 border-gray-default text-text-tertiary text-sm"
    :class="props.class"
  >
    <div class="flex w-full items-center justify-between px-4 py-2 mt-2">
      <span class="text-sm font-semibold text-text-passive">فیلترها</span>
      <button
        type="button"
        class="flex items-center gap-1.5 text-sm font-semibold text-[#dd4a48] transition-opacity hover:opacity-80 disabled:cursor-default disabled:opacity-50 cursor-pointer"
        :disabled="filters.activeFilterCount === 0"
        @click="filters.clearFilters"
      >
        <span>حذف فیلترها</span>
        <span
          v-if="filters.activeFilterCount > 0"
          class="inline-flex min-w-5 items-center justify-center rounded-md bg-[#dd4a4814] px-1.5 py-0.5 text-xs font-semibold leading-none text-[#dd4a48]"
        >
          {{ toPersianDigits(filters.activeFilterCount) }}
        </span>
      </button>
    </div>

    <div class="join join-vertical w-full">
      <FilterCollapse
        v-for="(section, index) in AD_REQUEST_FILTER_SECTIONS"
        :key="section.title"
        :expand="index === 0"
      >
        <template #title>
          <Icon :name="`svg:${section.icon}`" />
          {{ section.title }}
        </template>

        <template #content>
          <AdRequestFilterSectionContent :section-index="index" />
        </template>
      </FilterCollapse>
    </div>
  </aside>
</template>

<script setup lang="ts">
import AdRequestFilterSectionContent from '~/components/Elements/AdRequestFilterSectionContent.vue'
import AdRequestFiltersMobile from '~/components/Elements/AdRequestFiltersMobile.vue'
import FilterCollapse from '~/features/home/FilterCollapse.vue'
import { toPersianDigits } from '~/composables/useCountUp'
import {
  EMPLOYER_AD_REQUEST_FILTERS_INJECTION_KEY,
  type EmployerAdRequestFiltersState,
} from '~/composables/employer-ad-request-filters-context'
import { useEmployerAdRequestFilters } from '~/composables/useEmployerAdRequestFilters'
import {
  AD_REQUEST_FILTER_SECTIONS,
  type EmployerAdRequestFiltersModel,
} from '~/types/employer-ad-request'

const props = defineProps<{
  class?: string
}>()

const model = defineModel<EmployerAdRequestFiltersModel>({ required: true })

const filters = reactive(useEmployerAdRequestFilters(model)) as EmployerAdRequestFiltersState
provide(EMPLOYER_AD_REQUEST_FILTERS_INJECTION_KEY, filters)
</script>
