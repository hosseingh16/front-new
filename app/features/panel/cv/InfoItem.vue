<template>
  <div>
    <p>{{ title }}</p>
    <p v-if="value" class="font-semibold mt-4 text-text-primay">{{ value }}</p>
    <p v-else class="font-semibold mt-4 text-text-muted">داده ای وارد نشده است</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | undefined;
}>();
</script>
