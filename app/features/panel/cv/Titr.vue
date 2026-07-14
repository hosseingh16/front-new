<template>
  <div class="mb-2 flex justify-between items-center gap-2">
    <div class="flex items-center gap-2">
      <span
        class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
        aria-hidden="true"
      />
      <h2 class="font-yb-bold text-base text-text-primay"><slot /></h2>
    </div>
    <Icon v-if="withIcon" name="svg:info" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  withIcon: { type: Boolean, default: false },
});
</script>
