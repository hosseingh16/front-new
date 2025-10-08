<template>
  <div class="mt-4 mb-2">
    <div class="flex items-center gap-1">
      <Icon :name="`svg:${icon}`" size="20" />
      <p class="text-gray-800 font-bold">{{ title }}</p>
    </div>
    <div class="mt-1 h-[1px] bg-gray-300"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: String,
  title: String,
});
</script>
