<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 16 16`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 15L1 8M1 8L8 1M1 8H15"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  color: { type: String, required: true },
  size: { type: Number, required: true },
});
</script>
