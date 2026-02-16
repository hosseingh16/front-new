<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.6 20V5.77778C15.6 5.30628 15.4104 4.8541 15.0728 4.5207C14.7352 4.1873 14.2774 4 13.8 4H10.2C9.72261 4 9.26477 4.1873 8.92721 4.5207C8.58964 4.8541 8.4 5.30628 8.4 5.77778V20M4.8 7.55556H19.2C20.1941 7.55556 21 8.35149 21 9.33333V18.2222C21 19.2041 20.1941 20 19.2 20H4.8C3.80589 20 3 19.2041 3 18.2222V9.33333C3 8.35149 3.80589 7.55556 4.8 7.55556Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
// Props
defineProps({
  color: { type: String, default: '#5C6573' },
  size: { type: Number, default: 12 },
});
</script>
