<template>
  <div>
    <div class="flex items-center gap-2">
      <!-- <delete-filters /> -->
      <button
        class="btn btn-link no-underline px-0 ml-8 text-[#dd4a48] text-14 font-bold h-10"
      >
        <delete-filters />
      </button>
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
import type { IFilterData } from '~/interfaces/IFilterData';
import DeleteFilters from './DeleteFilters.vue';

// Variables
const filtersData = ref<any>(null);
const programs = ref<IFilterData[]>([]);
const salaries = ref<IFilterData[]>([]);
const history = ref<IFilterData[]>([]);
const contractTypes = ref<IFilterData[]>([]);
const benefits = ref<IFilterData[]>([]);

//
onBeforeMount(async () => {
  const { status, data } = await axios.get('/mock/filters-data.json');
  if (status == 200) filtersData.value = data;
});
</script>
