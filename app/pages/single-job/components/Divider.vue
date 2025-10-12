<template>
  <div class="mb-2 flex items-center gap-2">
    <div class="w-[3px] h-7 rounded-lg bg-[rgba(255,128,64,1)]"></div>
    <p class="text-gray-800 font-yb-bold">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
});
</script>
