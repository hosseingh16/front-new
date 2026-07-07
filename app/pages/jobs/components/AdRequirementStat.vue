<template>
  <div class="flex items-center gap-3 rounded-xl px-3 py-3">
    <div
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F0FE] text-primary-500"
    >
      <Icon :name="icon" size="20" />
    </div>
    <div class="min-w-0">
      <p class="text-xs text-text-passive">{{ label }}</p>
      <p class="mt-0.5 text-sm font-yb-bold text-text-tertiary">{{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
  icon: string
}>()
</script>
