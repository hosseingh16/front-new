<template>
  <NuxtLink
    v-if="!disabled && to"
    :to="to"
    class="relative flex items-center gap-2 rounded-2xl border border-gray-default bg-white py-5 text-center transition-colors cursor-pointer hover:border-primary-300 hover:bg-[#F8FAFF]"
  >
    <Icon :name="icon" size="92" class="pointer-events-none absolute" />
    <div class="flex flex-col items-start gap-2 pr-[92px]">
      <p class="font-yb-bold text-sm text-text-tertiary">{{ title }}</p>
      <p v-if="subtitle" class="text-xs text-text-passive">{{ subtitle }}</p>
    </div>
  </NuxtLink>

  <div
    v-else
    class="relative flex items-center gap-2 rounded-2xl border border-gray-default bg-white py-5 text-center opacity-55"
  >
    <Icon :name="icon" size="92" class="pointer-events-none absolute" />
    <div class="flex flex-col items-start gap-2 pr-[92px]">
      <p class="font-yb-bold text-sm text-text-tertiary">{{ title }}</p>
      <p v-if="subtitle" class="text-xs text-text-passive">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  icon: string;
  to?: string;
  disabled?: boolean;
}>();
</script>
