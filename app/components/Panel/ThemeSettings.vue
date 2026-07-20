<template>
  <div
    class="mt-3 mx-3 flex justify-center gap-1 rounded-xl bg-surface-100 p-1 [&>.btn]:h-8 [&>.btn]:text-sm"
  >
    <button
      v-for="item in themes"
      :key="item.value"
      type="button"
      class="btn btn-ghost text-caption"
      :class="
        preference === item.value
          ? 'bg-white text-text-primay dark:bg-surface-200 dark:text-text-tertiary'
          : 'bg-surface-100 text-text-passive'
      "
      @click="setTheme(item.value)"
    >
      <icons-theme-icon
        :theme="item.value"
        :color="preference === item.value ? activeIconColor : '#757575'"
      />
      {{ item.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ThemeType } from '~/types/theme'

const { preference, isDark, setTheme } = useAppTheme()

const themes: { title: string; value: ThemeType }[] = [
  { title: 'سیستم', value: 'system' },
  { title: 'روشن', value: 'light' },
  { title: 'تاریک', value: 'dark' },
]

const activeIconColor = computed(() => (isDark.value ? '#f5f5f5' : 'black'))
</script>
