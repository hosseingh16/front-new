<template>
  <div class="flex relative w-[380px]">
    <div :class="{ 'absolute left-5': isOrange }">
      <Icon name="svg:cloud" size="60" />
      <Icon
        :name="`svg:${isOrange ? 'data-orang' : 'data'}`"
        size="25"
        class="absolute top-4 -right-1"
      />
    </div>
    <div class="z-10 mt-3" :class="{ 'mr-8': isOrange, '-mr-8': !isOrange }">
      <p class="font-semibold">{{ title }}</p>
      <p class="text-gray-600">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps({
  title: String,
  description: String,
  isOrange: Boolean,
});
</script>
