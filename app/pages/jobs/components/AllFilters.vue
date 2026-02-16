<template>
  <dialog id="allFiltersModal" class="modal">
    <div
      class="modal-box w-screen max-w-screen h-full rounded-none overflow-x-hidden flex flex-col justify-between gap-12">
      <div>
        <div class="text-left flex justify-end">
          <form v-if="options.length === 0" method="dialog">
            <button class="flex items-center gap-2">
              <span class="font-semibold text-gray-800 text-sm">بازگشت</span>
              <Icon name="svg:chevron-down" class="rotate-90" size="12" />
            </button>
          </form>
          <button v-else class="flex items-center gap-2" @click="goBack">
            <span class="font-semibold text-gray-800 text-sm">بازگشت</span>
            <Icon name="svg:chevron-down" class="rotate-90" size="12" />
          </button>
        </div>

        <div class="flex justify-between items-center mt-6">
          <form method="dialog">
            <button>
              <span class="font-yb-bold text-[rgba(47,63,170,1)]">فیلترهای شغلی</span>
            </button>
          </form>
          <button
            v-if="options.length === 0"
            class="btn btn-ghost text-[#dd4a48] text-sm font-bold h-10"
            @click="clearFilters"
          >
            <delete-filters />
          </button>
        </div>

        <div class="mt-8">
          <div v-if="options.length === 0">
            <div
              v-for="(item, index) in items"
              :key="item.title"
              class="flex justify-between items-center border-gray-200 py-3 cursor-pointer"
              :class="{ 'border-b': index !== items.length - 1 }"
              @click="openOptions(item)"
            >
              <span class="text-gray-800 font-semibold">{{ item.title }}</span>
              <Icon name="svg:chevron-down" class="rotate-90" />
            </div>
          </div>

          <div v-else>
            <div v-for="opt in options" :key="opt.id" class="flex items-center gap-2">
              <label class="text-gray-700 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm rounded-[2px] bg-gray-200 border-0 shadow-none"
                  :value="opt"
                  v-model="selectedOptions[currentCategory.key]"
                />
                {{ opt.title }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button class="btn btn-primary h-10 text-sm w-full font-yb-bold" @click="search">
          مشاهده نتایج
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type { IFilterData } from '~/interfaces/IFilterData';
import DeleteFilters from './DeleteFilters.vue';

// Props and emits
const props = defineProps({
  filtersData: { type: Object as () => any, required: true },
  show: Boolean,
  jobTitles: { type: Array as () => IFilterData[] },
  programs: { type: Array as () => IFilterData[] },
  salaries: { type: Array as () => IFilterData[] },
  history: { type: Array as () => IFilterData[] },
  contractTypes: { type: Array as () => IFilterData[] },
  benefits: { type: Array as () => IFilterData[] },
});
const emits = defineEmits(['setFilters']);

// Parameters
const items = ref<any[]>([]);
const options = ref<IFilterData[]>([]);
const selectedOptions = ref<Record<string, IFilterData[]>>({});
const currentCategory = ref<any>(null);

// Watches
watch(
  () => props.filtersData,
  () => {
    items.value = [
      {
        title: 'عنوان شغلی',
        key: 'jobTitles',
        items: props.filtersData?.jobTitles,
        single: true,
      },
      {
        title: 'نرم‌افزار حسابداری',
        key: 'programs',
        items: props.filtersData?.programs,
        single: true,
      },
      {
        title: 'حقوق',
        key: 'salaries',
        items: props.filtersData?.salaries,
        single: true,
      },
      { title: 'سابقه', key: 'history', items: props.filtersData?.history, single: true },
      {
        title: 'نوع قرارداد',
        key: 'contractTypes',
        items: props.filtersData?.contractTypes,
        single: true,
      },
      {
        title: 'مزایای شغلی',
        key: 'benefits',
        items: props.filtersData?.benefits,
        single: false,
      },
    ];

    items.value.forEach((item) => {
      selectedOptions.value[item.key] = [];
    });
  },
  { immediate: true }
);
watch(
  selectedOptions,
  (newVal) => {
    if (
      currentCategory.value?.single &&
      newVal[currentCategory.value.key] &&
      newVal[currentCategory.value.key]!.length > 1
    ) {
      newVal[currentCategory.value.key] = [newVal[currentCategory.value.key]!.pop()!];
    }
  },
  { deep: true }
);
watch(
  () => props.show,
  () => {
    if (props.show) options.value = [];
  }
);
watch(
  () => [
    props.jobTitles,
    props.programs,
    props.salaries,
    props.history,
    props.contractTypes,
    props.benefits,
  ],
  () => {
    selectedOptions.value['jobTitles'] = props.jobTitles!;
    selectedOptions.value['programs'] = props.programs!;
    selectedOptions.value['salaries'] = props.salaries!;
    selectedOptions.value['history'] = props.history!;
    selectedOptions.value['contractTypes'] = props.contractTypes!;
    selectedOptions.value['benefits'] = props.benefits!;
  }
);

// Functions
function openOptions(item: any) {
  currentCategory.value = item;
  options.value = item.items || [];
}

function goBack() {
  options.value = [];
}

function clearFilters() {
  Object.keys(selectedOptions.value).forEach((key) => {
    selectedOptions.value[key] = [];
  });
}

function search() {
  emits('setFilters', selectedOptions.value);
  (document.getElementById('allFiltersModal') as any).close();
}
</script>
