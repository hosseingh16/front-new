<!-- <template>
  <div class="dropdown">
    <div
      tabindex="0"
      class="cursor-pointer h-10 w-52 rounded-lg border border-gray-200 lg:border-gray-300 flex justify-between items-center gap-12 pr-2"
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
        class="flex items-center gap-2 mt-4 [&>.btn]:font-bold [&>.btn]:text-sm [&>.btn]:h-8"
      >
        <button class="btn btn-ghost text-[#dd4a48] text-sm font-bold h-10">
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

// Parameters
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
</script> -->

<template>
  <div class="relative inline-block">
    <div
      ref="trigger"
      tabindex="0"
      class="cursor-pointer h-10 w-52 rounded-lg border border-gray-200 lg:border-gray-300 flex justify-between items-center gap-12 pr-2 bg-white"
      @click="toggleDropdown"
    >
      <span class="text-gray-700 text-sm font-semibold">{{ title }}</span>
      <icons-chevron-down />
    </div>

    <teleport to="body">
      <div
        v-if="open"
        dir="rtl"
        ref="dropdown"
        class="w-80! absolute z-[9999] bg-white border border-gray-200 rounded-lg shadow-md p-4"
        :style="dropdownStyle"
      >
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
        <div
          class="flex items-center gap-2 mt-4 [&>.btn]:font-bold [&>.btn]:text-sm [&>.btn]:h-8"
        >
          <button class="btn btn-ghost text-[#dd4a48] text-sm font-bold h-10">
            <delete-filters />
          </button>
          <button class="btn btn-primary">مشاهده نتایج</button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import type { IFilterData } from '~/interfaces/IFilterData';
import DeleteFilters from './DeleteFilters.vue';

// Model
const model = defineModel<IFilterData[]>({ default: [] });

// Props & Emits
const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array as () => any[], required: true },
});

// Parameters
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
