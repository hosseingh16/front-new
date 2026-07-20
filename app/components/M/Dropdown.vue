<template>
  <div
    class="dropdown dropdown-start mx-1"
    :class="{ 'dropdown-hover': hover }"
  >
    <div :tabindex="Math.round(1)">
      <slot name="btn" />
    </div>
    <div
      class="dropdown-content p-0 left-0 menu bg-base-100 rounded-xl z-1 min-w-62 w-fit border-3 border-surface-100 font-semibold"
      :class="hover ? 'mt-0' : 'mt-2'"
    >
      <img src="/images/rectangle.png" class="absolute -top-2 left-5" />
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    hover?: boolean;
  }>(),
  {
    hover: false,
  },
);
</script>
