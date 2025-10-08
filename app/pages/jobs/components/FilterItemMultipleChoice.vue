<template>
  <div class="dropdown">
    <div
      tabindex="0"
      class="cursor-pointer h-10 w-52 rounded-lg border border-gray-300 flex justify-between items-center gap-12 pr-2"
    >
      <span class="text-gray-700 text-sm font-semibold">{{ title }}</span>
      <div>
        <icons-chevron-down />
      </div>
    </div>
    <div
      tabindex="0"
      class="dropdown-content mt-2 menu bg-base-100 rounded-box z-1 w-80 p-4 shadow-sm"
    >
      <input
        v-if="hasSearch"
        v-model="keyword"
        type="text"
        placeholder="جستجو کنید ..."
        class="mb-4 text-gray-600 bg-[#f1f1f1] text-xs font-semibold input border-0 outline-0 shadow-none focus:outline-0 focus:shadow-none placeholder:text-gray-600 placeholder:text-xs"
        @update:model-value="search"
      />
      <div class="min-h-[150px] max-h-[200px] overflow-y-auto overflow-x-hidden">
        <div v-for="item in options" class="flex items-center">
          <label class="label">
            <input
              v-model="model"
              type="checkbox"
              class="checkbox checkbox-sm rounded-[2px] bg-gray-200 border-0 shadow-none"
              :value="item"
            />
            {{ item.title }}
          </label>
        </div>
      </div>
      <div
        class="flex items-center gap-2 mt-4 [&>.btn]:font-bold [&>.btn]:text-14 [&>.btn]:h-8"
      >
        <button class="btn btn-ghost text-[#dd4a48] text-14 font-bold h-10">
          <delete-filters />
        </button>
        <button class="btn btn-primary">مشاهده نتایج</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFilterData } from '~/interfaces/IFilterData';
import DeleteFilters from './DeleteFilters.vue';

// Model
const model = defineModel<IFilterData[]>({ default: [] });

// Props and emits
const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array as () => any[], required: true },
  hasSearch: Boolean,
  singleChoice: Boolean,
});
const emits = defineEmits(['update:modelValue']);

// Variables
const allOptions = ref<IFilterData[]>([]);
const options = ref<IFilterData[]>([]);
const keyword = ref('');

// Watches
watch(
  () => props.items,
  () => {
    options.value = props.items;
    allOptions.value = props.items;
  },
  { immediate: true }
);
watch(
  () => model.value,
  () => {
    if (props.singleChoice && model.value && model.value.length > 1) {
      model.value.splice(0, 1);
    }
  }
);

// Functions
function search() {
  options.value = [...allOptions.value].filter((x) => x.title.includes(keyword.value));
}
</script>
