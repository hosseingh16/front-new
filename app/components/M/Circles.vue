<template>
  <div
    class="w-6 h-6 rounded-full flex justify-center items-center"
    :style="`background-color:${colors[0]}`"
  >
    <div
      class="w-4 h-4 rounded-full flex justify-center items-center"
      :style="`background-color:${colors[1]}`"
    >
      <div
        class="w-2 h-2 rounded-full flex justify-center items-center"
        :style="`background-color:${colors[2]}`"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps({
  colors: { type: Array as () => string[], required: true },
});
</script>
