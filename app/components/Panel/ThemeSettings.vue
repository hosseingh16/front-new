<template>
  <div
    class="mt-3 mx-3 flex justify-between gap-1 rounded-xl bg-surface-100 p-1 [&>.btn]:h-8 [&>.btn]:text-sm"
  >
    <button
      v-for="item in themes"
      :key="item.value"
      type="button"
      class="btn btn-ghost text-caption"
      :class="
        preference === item.value
          ? 'bg-surface-50 text-text-primay'
          : 'bg-surface-100 text-text-passive'
      "
      @click="setTheme(item.value)"
    >
      <icons-theme-icon
        :theme="item.value"
        :color="preference === item.value ? '#757575' : item.activeIconColor"
      />
      {{ item.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ThemeType } from "~/types/theme";

const { preference, isDark, setTheme } = useAppTheme();

const themes: { title: string; value: ThemeType; activeIconColor: string }[] = [
  { title: "سیستم", value: "system", activeIconColor: "#757575" },
  { title: "روشن", value: "light", activeIconColor: "#FFD600" }, // sun color
  { title: "تاریک", value: "dark", activeIconColor: "#757575" },
];
</script>
