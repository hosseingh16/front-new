<template>
  <div class="flex justify-between items-center">
    <p class="font-yb-bold text-xl"><span class="text-primary-500">-</span> <slot /></p>
    <Icon v-if="withIcon" name="svg:info" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  withIcon: { type: Boolean, default: true },
});
</script>
