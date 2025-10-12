<template>
  <div v-if="model.length === 0" class="relative inline-block">
    <div
      ref="trigger"
      tabindex="0"
      class="cursor-pointer h-10 w-fit rounded-lg border border-gray-200 lg:border-gray-300 flex justify-between items-center gap-12 pr-2 bg-white"
      @click="toggleDropdown"
    >
      <span class="text-gray-700 text-sm font-semibold whitespace-nowrap">{{ title }}</span>
      <icons-chevron-down />
    </div>

    <teleport to="body">
      <div
        v-if="open"
        dir="rtl"
        ref="dropdown"
        class="absolute z-[9999] bg-white border border-gray-200 rounded-lg shadow-md p-4"
        :style="dropdownStyle"
      >
        <input
          v-if="hasSearch"
          v-model="keyword"
          type="text"
          placeholder="جستجو کنید ..."
          class="mb-4 text-gray-600 bg-[#f1f1f1] text-xs font-semibold input border-0 outline-0 shadow-none focus:outline-0 focus:shadow-none placeholder:text-gray-600 placeholder:text-xs"
          @input="search"
        />

        <div class="min-h-[150px] max-h-[200px] overflow-y-auto overflow-x-hidden">
          <div v-for="item in options" :key="item.id" class="flex items-center gap-2">
            <label class="text-gray-700 text-sm font-medium cursor-pointer">
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
    </teleport>
  </div>
  <div
    v-else
    class="bg-[#e4ebfc] border border-[#3a54c9] px-2 rounded-lg flex gap-4 items-center justify-between text-14 w-52 flex-shrink-0"
  >
    <span class="truncate">{{ model[0]?.title }}</span>
    <div
      class="w-4 h-4 rounded-full flex justify-center items-center bg-[#2f3faa] text-white cursor-pointer flex-shrink-0"
      @click="deleteItem(model[0]?.id!)"
    >
      <icons-close />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import type { IFilterData } from '~/interfaces/IFilterData';

// Props & Emits
const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array as () => any[], required: true },
  hasSearch: Boolean,
});
const model = defineModel<IFilterData[]>({ default: [] });

// States
const allOptions = ref<IFilterData[]>([]);
const options = ref<IFilterData[]>([]);
const keyword = ref('');
const open = ref(false);
const trigger = ref<HTMLElement | null>(null);
const dropdown = ref<HTMLElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});

// Watchers
watch(
  () => props.items,
  () => {
    options.value = props.items || [];
    allOptions.value = props.items || [];
  },
  { immediate: true }
);

watch(
  () => model.value,
  () => {
    if (model.value.length > 1) {
      model.value.splice(0, 1);
    }
  }
);

// Methods
function toggleDropdown() {
  open.value = !open.value;
  if (open.value) updateDropdownPosition();
}

function search() {
  options.value = allOptions.value.filter((x) => x.title.includes(keyword.value));
}

function deleteItem(id: number) {
  model.value = model.value.filter((x) => x.id !== id);
}

function updateDropdownPosition() {
  if (!trigger.value) return;
  const rect = trigger.value.getBoundingClientRect();
  dropdownStyle.value = {
    position: 'absolute',
    top: `${rect.bottom + window.scrollY}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
  };
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (
    open.value &&
    dropdown.value &&
    !dropdown.value.contains(event.target as Node) &&
    !trigger.value?.contains(event.target as Node)
  ) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', updateDropdownPosition);
  window.addEventListener('resize', updateDropdownPosition);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', updateDropdownPosition);
  window.removeEventListener('resize', updateDropdownPosition);
});
</script>
