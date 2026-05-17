<template>
  <div>
    <p class="text-base relative mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400 mb-4 absolute -top-2">*</span>
    </p>
    <div v-if="isClient" class="relative inline-block w-full">
      <div
        class="bg-white cursor-pointer h-10 w-full rounded-lg border border-gray-300 flex justify-between items-center gap-2 pr-2 pl-2"
        :style="`border-color:${error ? '#f7a09a' : borderColor}`"
        @click="toggleDropdown"
      >
        <span
          class="text-sm font-normal line-clamp-1"
          :class="model ? 'text-gray-700' : 'text-text-muted'"
        >
          {{ model || placeholder || 'انتخاب کنید' }}
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
          <div v-if="options.length > 0">
            <p
              v-for="item in options"
              :key="item"
              @click="selectItem(item)"
              class="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              :class="{ 'bg-gray-200 font-semibold': item === model }"
            >
              {{ item }}
            </p>
          </div>
          <p
            v-else
            class="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            @click="open = false"
          >
            موردی برای نمایش وجود ندارد
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Model
const model = defineModel<string>();

// Props
defineProps({
  label: { type: String },
  placeholder: { type: String },
  required: Boolean,
  options: { type: Array as () => string[], default: [] },
  borderColor: { type: String, default: '#E8E8E8' },
  error: { type: Boolean },
});

// Variables
const open = ref(false);
const isClient = ref(false);

// Methods
const toggleDropdown = () => {
  open.value = !open.value;
};

const selectItem = (item: string) => {
  model.value = item;
  open.value = false;
};

onMounted(() => {
  isClient.value = true;
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.relative.inline-block')) {
    open.value = false;
  }
};
</script>
