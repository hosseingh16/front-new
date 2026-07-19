<template>
  <component
    :is="tag"
    :to="disabled || !to ? undefined : to"
    class="flex items-center gap-2 rounded-2xl border border-gray-default bg-white py-5 text-center transition-colors"
    :class="[
      disabled
        ? 'cursor-default opacity-55'
        : 'cursor-pointer hover:border-primary-300 hover:bg-[#F8FAFF]',
    ]"
  >
    <Icon :name="icon" size="92" class="absolute" />
    <div class="flex flex-col items-start gap-2 pr-[92px]">
      <p class="font-yb-bold text-sm text-text-tertiary">{{ title }}</p>
      <p v-if="subtitle" class="text-xs text-text-passive">{{ subtitle }}</p>
    </div>
  </component>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string;
  icon: string;
  to?: string;
  disabled?: boolean;
}>();

const tag = computed(() => (props.disabled || !props.to ? "div" : "NuxtLink"));
</script>
