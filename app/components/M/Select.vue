<template>
  <div v-if="isClient" class="relative inline-block w-full">
    <div
      class="bg-white cursor-pointer h-10 rounded-lg flex justify-between items-center gap-2 pr-2 pl-2"
      @click="toggleDropdown"
    >
      <span class="text-gray-600 lg:text-gray-700 text-xs md:text-sm font-semibold line-clamp-1">
        {{ model || label }}
      </span>
      <icons-chevron-down
        class="transition-transform duration-200"
        :class="{ 'rotate-180': open }"
      />
    </div>

    <div
      v-if="open"
      class="absolute mt-2 menu bg-white rounded-lg z-50 w-full p-0 shadow-sm border border-gray-200"
    >
      <div class="max-h-[200px] overflow-y-auto cursor-pointer">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Model
const model = defineModel<string>();

// Props
defineProps({
  label: String,
  options: { type: Array as () => string[], required: true },
});

// Parameters
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
