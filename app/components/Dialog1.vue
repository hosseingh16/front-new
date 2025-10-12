<template>
  <dialog :id class="modal">
    <div class="modal-box" :style="`max-width:${width}px`">
      <div class="modal-action flex justify-start mt-0">
        <form method="dialog" class="leading-0!">
          <button class="cursor-pointer">
            <icons-close color="#667085" class="w-8 h-8" />
          </button>
        </form>
      </div>
      <div class="text-center">
        <Icon :name="`svg:${type}`" size="48" />
      </div>
      <div class="text-center px-4 md:px-12">
        <h1 class="font-yb-bold leading-6! mb-4">{{ title }}</h1>
        <slot />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
// Props
defineProps({
  id: { type: String, required: true },
  type: { type: String as PropType<'success' | 'warning'>, required: true },
  title: String,
  width: { type: Number, default: 500 },
});
</script>
