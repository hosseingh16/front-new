<template>
  <button class="btn" :type :disabled="loading">
    <span v-if="loading" class="loading loading-spinner text-white"></span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'submit' | 'button' | 'reset';
    loading?: boolean;
  }>(),
  { type: 'button' },
);
</script>
