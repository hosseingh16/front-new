<template>
  <section class="pt-6" :class="{ 'border-t border-surface-200': divider }">
    <h2 class="font-yb-bold text-sm text-primary-500">{{ title }}</h2>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  divider: { type: Boolean, default: true },
});
</script>
