<template>
  <div>
    <div class="flex items-center gap-2">
      <button
        v-if="showDeleteFilters"
        class="max-md:hidden btn btn-link no-underline px-0 ml-8 text-[#dd4a48] text-sm font-bold h-10"
        @click="clearFilters"
      >
        <delete-filters />
      </button>
      <button
        class="md:hidden btn btn-link no-underline px-0 text-[rgba(85,116,255,1)] text-xs font-normal h-10"
        onclick="allFiltersModal.showModal()"
        @click="show = true"
      >
        همه فیلترها
      </button>
      <all-filters
        :filters-data
        @set-filters="setFilters($event)"
        :show
        :job-titles
        :programs
        :salaries
        :history
        :contract-types
        :benefits
      />
      <filter-item-single-choice
        v-model="jobTitles"
        class="lg:hidden"
        title="عنوان شغلی"
        :items="filtersData?.jobTitles"
        @update:model-value="jobTitles = $event"
      />
      <filter-item-single-choice
        v-model="programs"
        title="نرم‌افزار حسابداری"
        has-search
        :items="filtersData?.programs"
        @update:model-value="programs = $event"
      />
      <filter-item-single-choice
        v-model="salaries"
        title="حقوق"
        :items="filtersData?.salaries"
        @update:model-value="salaries = $event"
      />
      <filter-item-single-choice
        v-model="history"
        title="سابقه کار"
        :items="filtersData?.history"
        @update:model-value="history = $event"
      />
      <filter-item-single-choice
        v-model="contractTypes"
        title="نوع قرارداد"
        :items="filtersData?.contractTypes"
        @update:model-value="contractTypes = $event"
      />
      <filter-item-multiple-choice
        v-model="benefits"
        title="مزایای شغلی"
        :items="filtersData?.benefits"
        @update:model-value="benefits = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import FilterItemMultipleChoice from './FilterItemMultipleChoice.vue';
import FilterItemSingleChoice from './FilterItemSingleChoice.vue';
import DeleteFilters from './DeleteFilters.vue';
import AllFilters from './AllFilters.vue';
import type { IFilterData } from '~/interfaces/IFilterData';

// Variables
const filtersData = ref<any>(null);
const jobTitles = ref<IFilterData[]>([]);
const programs = ref<IFilterData[]>([]);
const salaries = ref<IFilterData[]>([]);
const history = ref<IFilterData[]>([]);
const contractTypes = ref<IFilterData[]>([]);
const benefits = ref<IFilterData[]>([]);
const show = ref(false);

// Computeds
const showDeleteFilters = computed(
  () =>
    jobTitles.value.length > 0 ||
    programs.value.length > 0 ||
    salaries.value.length > 0 ||
    history.value.length > 0 ||
    contractTypes.value.length > 0 ||
    benefits.value.length > 0
);

// Functions
function setFilters(e: any) {
  show.value = false;
  jobTitles.value = e['jobTitles'];
  programs.value = e['programs'];
  salaries.value = e['salaries'];
  history.value = e['history'];
  contractTypes.value = e['contractTypes'];
  benefits.value = e['benefits'];
}

function clearFilters() {
  jobTitles.value = [];
  programs.value = [];
  salaries.value = [];
  history.value = [];
  contractTypes.value = [];
  benefits.value = [];
}

//
onBeforeMount(async () => {
  const { status, data } = await axios.get('/mock/filters-data.json');
  if (status == 200) filtersData.value = data;
});
</script>
