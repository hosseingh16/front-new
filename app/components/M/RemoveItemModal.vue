<template>
  <dialog
    ref="dialogRef"
    class="modal"
    dir="rtl"
    :aria-labelledby="titleId"
    @click="handleBackdropClick"
    @close="handleDialogClose"
  >
    <div
      class="modal-box w-[calc(100%-2rem)] overflow-visible p-0"
      :style="`max-width:${width}px`"
      role="alertdialog"
      aria-modal="true"
      @click.stop
    >
      <div class="overflow-visible px-4 pb-5 pt-5 text-center sm:px-6 sm:pb-6 sm:pt-6">
        <div class="remove-item-modal-illustration relative overflow-visible">
          <slot name="illustration">
            <img
              v-if="iconSrc"
              :src="iconSrc"
              alt=""
              class="mx-auto block h-auto w-full max-w-[min(100%,256px)]"
              :width="iconSize"
              :height="iconSize"
            />
            <Icon
              v-else
              :name="icon"
              :size="iconSize"
              class="mx-auto block h-auto max-w-full"
            />
          </slot>
          <h2
            :id="titleId"
            class="relative z-10 -mt-[4.375rem] font-yb-bold text-xl text-text-tertiary sm:-mt-[4.5rem] sm:text-2xl"
          >
            {{ title }}
          </h2>
        </div>

        <p
          v-if="subtitle"
          class="mt-3 text-sm leading-7 text-text-tertiary sm:text-base"
        >
          {{ subtitle }}
        </p>
        <p
          v-if="description"
          class="mt-3 text-sm leading-7 text-text-passive sm:text-base"
        >
          {{ description }}
        </p>

        <slot />

        <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            class="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#FDECEB] text-sm font-semibold text-[#EF4035] transition-opacity hover:opacity-90 disabled:opacity-60"
            :disabled="loading"
            @click="handleCancel"
          >
            <Icon :name="cancelIcon" size="18" />
            {{ cancelText }}
          </button>

          <button
            type="button"
            class="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#EF4035] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            :disabled="loading"
            @click="handleConfirm"
          >
            <Icon v-if="!loading" :name="confirmIcon" size="18" />
            <span
              v-else
              class="loading loading-spinner loading-sm text-white"
            />
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open?: boolean;
    title?: string;
    subtitle?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: string;
    iconSrc?: string;
    iconSize?: number | string;
    confirmIcon?: string;
    cancelIcon?: string;
    width?: number;
    loading?: boolean;
  }>(),
  {
    open: false,
    title: "حذف مورد",
    subtitle: "آیا از حذف این مورد مطمئن هستید؟",
    description: "",
    confirmText: "حذف",
    cancelText: "انصراف",
    icon: "svg:delete",
    iconSrc: "",
    iconSize: 256,
    confirmIcon: "material-symbols:delete-outline",
    cancelIcon: "material-symbols:close-rounded",
    width: 520,
    loading: false,
  },
);

const emit = defineEmits<{
  "update:open": [value: boolean];
  confirm: [];
  cancel: [];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const titleId = `remove-item-modal-title-${useId()}`;

function showModal() {
  if (!import.meta.client) return;
  dialogRef.value?.showModal();
  emit("update:open", true);
}

function closeModal() {
  dialogRef.value?.close();
  emit("update:open", false);
}

function handleConfirm() {
  emit("confirm");
}

function handleCancel() {
  emit("cancel");
  closeModal();
}

function handleBackdropClick(event: MouseEvent) {
  if (props.loading) return;
  if (event.target === event.currentTarget) {
    handleCancel();
  }
}

function handleDialogClose() {
  emit("update:open", false);
}

watch(
  () => props.open,
  (isOpen) => {
    if (!import.meta.client) return;
    if (isOpen && !dialogRef.value?.open) {
      dialogRef.value?.showModal();
    } else if (!isOpen && dialogRef.value?.open) {
      dialogRef.value?.close();
    }
  },
);

defineExpose({
  showModal,
  closeModal,
});
</script>

<style scoped>
.remove-item-modal-illustration :deep(svg),
.remove-item-modal-illustration img {
  height: auto;
  max-width: min(100%, 256px);
}

@media (max-width: 639px) {
  .remove-item-modal-illustration :deep(svg),
  .remove-item-modal-illustration img {
    max-width: 200px;
  }
}
</style>