<template>
  <div
    class="mt-3 flex justify-center gap-1 bg-surface-100 p-1 mx-3 rounded-xl [&>.btn]:text-sm [&>.btn]:h-8">
    <button
      v-for="item in themes"
      class="btn btn-ghost text-caption"
      :class="
        selectedTheme === item.value
          ? 'bg-white text-text-primay'
          : 'bg-surface-100 text-text-passive'
      "
      @click="selectedTheme=item.value"
    >
      <icons-theme-icon
        :theme="item.value"
        :color="selectedTheme === item.value ? 'black' : '#757575'"
      />
      {{ item.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ThemeType } from '~/types/ThemeType';

// Props
defineProps({
  theme: { type: Object as () => ThemeType, required: true },
});

// Variables
const selectedTheme = ref<ThemeType>('light');
const themes = ref<{ title: string; value: ThemeType }[]>([
  { title: 'سیستم', value: 'system' },
  { title: 'روشن', value: 'light' },
  { title: 'تاریک', value: 'dark' },
]);
</script>
