<template>
  <svg
    class="pointer-events-none relative left-2 z-10 col-start-1 row-start-1 h-12 w-4 self-center justify-self-end forced-colors:hidden"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      d="M8.00001 11.2C7.53335 11.2 7.06668 11.02 6.71335 10.6667L2.36668 6.32C2.17335 6.12667 2.17335 5.80667 2.36668 5.61333C2.56001 5.42 2.88001 5.42 3.07335 5.61333L7.42001 9.96C7.74001 10.28 8.26001 10.28 8.58001 9.96L12.9267 5.61333C13.12 5.42 13.44 5.42 13.6333 5.61333C13.8267 5.80667 13.8267 6.12667 13.6333 6.32L9.28668 10.6667C8.93335 11.02 8.46668 11.2 8.00001 11.2Z"
      :fill="color"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  color: { type: String, default: '#292C31' },
});
</script>
