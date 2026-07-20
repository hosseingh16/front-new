<template>
  <CompanyFiltersMobile class="col-span-full min-w-0 md:hidden" />

  <aside
    class="hidden md:block bg-surface-50 rounded-lg border border-b-0 border-gray-default text-text-tertiary text-sm"
    :class="props.class"
  >
    <div class="flex w-full items-center justify-between px-4 py-2 mt-2">
      <span class="text-sm font-semibold text-text-passive">فیلترها</span>
      <button
        type="button"
        class="flex items-center gap-1.5 text-sm font-semibold text-[#dd4a48] transition-opacity hover:opacity-80 disabled:cursor-default disabled:opacity-50 cursor-pointer"
        :disabled="activeFilterCount === 0"
        @click="clearFilters"
      >
        <span>حذف فیلترها</span>
        <span
          v-if="activeFilterCount > 0"
          class="inline-flex min-w-5 items-center justify-center rounded-md bg-[#dd4a4814] px-1.5 py-0.5 text-xs font-semibold leading-none text-[#dd4a48]"
        >
          {{ toPersianDigits(activeFilterCount) }}
        </span>
      </button>
    </div>

    <div class="join join-vertical w-full">
      <FilterCollapse
        v-for="(section, index) in COMPANY_FILTER_SECTIONS"
        :key="section.title"
        :expand="index === 0"
      >
        <template #title>
          <Icon :name="`svg:${section.icon}`" />
          {{ section.title }}
        </template>

        <template #content>
          <CompanyFilterSectionContent :section-index="index" />
        </template>
      </FilterCollapse>
    </div>
  </aside>
</template>

<script setup lang="ts">
import CompanyFilterSectionContent from "~/components/Elements/CompanyFilterSectionContent.vue";
import CompanyFiltersMobile from "~/components/Elements/CompanyFiltersMobile.vue";
import FilterCollapse from "~/features/home/FilterCollapse.vue";
import { toPersianDigits } from "~/composables/useCountUp";
import {
  COMPANY_FILTERS_INJECTION_KEY,
  type CompanyFiltersState,
} from "~/composables/company-filters-context";
import { useCompanyFilters } from "~/composables/useCompanyFilters";
import {
  COMPANY_FILTER_SECTIONS,
  type CompanyFiltersModel,
} from "~/types/company-filters";

const props = defineProps<{
  class?: string;
}>();

const model = defineModel<CompanyFiltersModel>({ required: true });

const filters = reactive(useCompanyFilters(model)) as CompanyFiltersState;
provide(COMPANY_FILTERS_INJECTION_KEY, filters);

const activeFilterCount = filters.activeFilterCount;
const clearFilters = filters.clearFilters;
</script>
