<template>
  <div
    class="dropdown dropdown-start mx-1"
    :class="{ 'dropdown-hover': hover }"
  >
    <div :tabindex="Math.round(1)">
      <slot name="btn" />
    </div>
    <div
      class="dropdown-content left-0 z-1 min-w-62 w-fit rounded-xl border-3 border-gray-default bg-surface-50 p-0 font-semibold shadow-sm"
      :class="hover ? 'mt-0' : 'mt-2'"
    >
      <!-- <img src="/images/rectangle.png" class="absolute -top-2 left-5" /> -->
      <Icon
        name="tabler:triangle-filled"
        size="12"
        class="absolute -top-3 left-5 text-surface-200"
      />
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
