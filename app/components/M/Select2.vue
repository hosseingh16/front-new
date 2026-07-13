<template>
  <div :class="{ 'opacity-50 pointer-events-none': disabled }">
    <p class="text-base relative mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400 mb-4 absolute -top-2">*</span>
    </p>
    <div v-if="isClient" ref="dropDownRef" class="relative inline-block w-full">
      <div
        class="bg-white cursor-pointer h-10 w-full rounded-lg border border-gray-300 flex justify-between items-center gap-2 pr-2 pl-2"
        :style="`border-color:${error ? '#f7a09a' : borderColor}`"
        @click="toggleDropdown"
      >
        <span
          class="text-sm font-normal line-clamp-1"
          :class="model ? 'text-gray-700' : 'text-text-muted'"
        >
          {{
            options.find((x) => x.value === model)?.label || placeholder || 'انتخاب کنید'
          }}
        </span>
        <icons-chevron-down
          color="#4864E1"
          class="transition-transform duration-200"
          :class="{ 'rotate-180': open }"
        />
      </div>

      <div
        v-if="open"
        class="absolute mt-2 menu bg-white rounded-lg z-10 w-full p-0 shadow-sm border border-gray-200"
      >
        <div class="max-h-50 overflow-y-auto cursor-pointer">
          <div v-if="search && allOptions.length > 0" class="mb-4 mx-2">
            <m-text-field
              v-model="keyword"
              placeholder="جستجو"
              class="pr-0 placeholder:text-gray-default"
              clearable
            />
          </div>
          <div v-if="options2.length > 0" class="mx-2">
            <p
              v-for="item in options2"
              @click="selectItem(item)"
              class="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              :class="{ 'bg-gray-200 font-semibold': item.value === model }"
            >
              {{ item.label }}
            </p>
          </div>
          <div
            v-else
            class="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg min-h-20 flex justify-center items-center"
            @click="open = false"
          >
            موردی برای نمایش وجود ندارد
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISelectItem } from '~/types/select-item';

// Model
const model = defineModel<string | number>();

// Props
const props = defineProps({
  label: { type: String },
  placeholder: { type: String },
  required: Boolean,
  options: {
    type: Array as () => ISelectItem[],
    default: [],
  },
  borderColor: { type: String, default: '#E8E8E8' },
  error: { type: Boolean },
  disabled: { type: Boolean },
  search: { type: Boolean },
});

// Variables
const open = ref(false);
const isClient = ref(false);
const options2 = ref<ISelectItem[]>([]);
const allOptions = ref<ISelectItem[]>([]);
const keyword = ref('');
const dropDownRef = ref<HTMLElement | null>(null);

// Watches
watch(
  () => props.options,
  () => {
    options2.value = props.options;
    allOptions.value = props.options;
  },
  { immediate: true },
);
watch(
  () => keyword.value,
  (val) => {
    options2.value = [...allOptions.value].filter((x) => x.label.includes(val));
  },
);

// Functions
const toggleDropdown = () => {
  if (props.disabled) return;
  open.value = !open.value;
};

const selectItem = (item: ISelectItem) => {
  if (props.disabled) return;
  model.value = item.value;
  open.value = false;
  keyword.value = '';
};

onMounted(() => {
  isClient.value = true;
  document.addEventListener('click', handleClickOutside, true);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true);
});
const handleClickOutside = (e: MouseEvent) => {
  if (!open.value) return;

  const target = e.target as Node;
  if (dropDownRef.value && !dropDownRef.value.contains(target)) {
    open.value = false;
    keyword.value = '';
  }
};
</script>
