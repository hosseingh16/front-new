<template>
  <div class="flex w-full items-center justify-start gap-2 rounded-full">
    <div
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#4864E114] text-primary-500"
    >
      <Icon :name="icon" size="20" />
    </div>
    <div class="min-w-0 text-right">
      <p class="text-sm text-text-passive">{{ label }}</p>
      <p class="mt-0.5 text-base font-semibold text-text-secondary">{{ value }}</p>
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
