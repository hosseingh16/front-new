<template>
  <div v-if="model.length === 0" class="dropdown">
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
      class="dropdown-content mt-2 menu bg-base-100 rounded-box z-1 min-w-52 p-4 shadow-sm"
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
    </div>
  </div>
  <div
    v-else
    class="bg-[#e4ebfc] border border-[#3a54c9] px-2 rounded-lg flex gap-4 items-center justify-between w-52 text-14"
  >
    <span>{{ model[0]?.title }}</span>
    <div
      class="w-4 h-4 rounded-full flex justify-center items-center bg-[#2f3faa] text-white cursor-pointer"
      @click="deleteItem(model[0]?.id!)"
    >
      <icons-close />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFilterData } from '~/interfaces/IFilterData';

// Model
const model = defineModel<IFilterData[]>({ default: [] });

// Props and emits
const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array as () => any[], required: true },
  hasSearch: Boolean,
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
    if (model.value && model.value.length > 1) {
      model.value.splice(0, 1);
    }
  }
);

// Functions
function search() {
  options.value = [...allOptions.value].filter((x) => x.title.includes(keyword.value));
}

function deleteItem(id: number) {
  model.value = model.value.filter((x) => x.id !== id);
}
</script>
