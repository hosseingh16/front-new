<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box" :style="`max-width:${width}px`">
      <div class="modal-action flex justify-between mt-0">
        <h1 class="font-yb-bold leading-6! mb-4">{{ title }}</h1>
        <form v-if="closeButton" method="dialog" class="leading-0!">
          <button class="cursor-pointer">
            <icons-close color="#667085" class="w-8 h-8" />
          </button>
        </form>
      </div>
      <slot />
    </div>
  </dialog>
</template>

<script setup lang="ts">
// Props
withDefaults(
  defineProps<{
    title?: string;
    width?: number;
    closeButton?: boolean;
  }>(),
  { width: 500, closeButton: false },
);

// Variables
const dialogRef = ref<HTMLDialogElement | null>(null);

// Functions
function showModal() {
  dialogRef.value?.showModal();
}

function closeModal() {
  dialogRef.value?.close();
}

//
defineExpose({
  showModal,
  closeModal,
});
</script>
