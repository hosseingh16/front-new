<template>
  <div v-if="isClient" class="relative inline-block">
    <div
      class="bg-white cursor-pointer h-10 w-36 rounded-lg border border-gray-300 flex justify-between items-center gap-2 pr-2 pl-2"
      @click="toggleDropdown"
    >
      <span class="text-gray-700 text-sm font-normal line-clamp-1">
        {{ model || 'انتخاب کنید' }}
      </span>
      <icons-chevron-down
        class="transition-transform duration-200"
        :class="{ 'rotate-180': open }"
      />
    </div>

    <div
      v-if="open"
      class="absolute mt-2 menu bg-white rounded-lg z-10 min-w-52 p-0 shadow-sm border border-gray-200"
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
  options: { type: Array as () => string[], required: true },
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
