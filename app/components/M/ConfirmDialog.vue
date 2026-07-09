<template>
  <dialog ref="dialogRef" class="modal" @click="handleBackdropClick">
    <div class="modal-box p-0" :style="`max-width:${width}px`" @click.stop>
      <div class="px-6 pb-6 pt-5 text-center">
        <Icon :name="icon" size="256" />
        <h2 class="font-yb-bold text-2xl text-text-tertiary mt-[-70px]">{{ title }}</h2>

        <p class="mt-3 text-sm leading-7 text-text-tertiary">{{ subtitle }}</p>
        <p class="mt-3 text-sm leading-7 text-text-passive">{{ description }}</p>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            class="btn h-9 border-none text-black"
            @click="handleCancel"
          >
            <Icon name="material-symbols:close" size="16" />
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="btn h-9 border-none bg-[#EF4035] text-white hover:bg-[#E3382D]"
            @click="handleConfirm"
          >
            <Icon name="material-symbols:delete-outline" size="16" />
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    description?: string
    confirmText?: string
    cancelText?: string
    icon?: string
    width?: number
  }>(),
  {
    title: 'تایید عملیات',
    subtitle: 'آیا مطمئن هستید؟',
    description: '',
    confirmText: 'تایید',
    cancelText: 'انصراف',
    icon: 'svg:delete',
    width: 520,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

function showModal() {
  dialogRef.value?.showModal()
}

function closeModal() {
  dialogRef.value?.close()
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  closeModal()
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    handleCancel()
  }
}

defineExpose({
  showModal,
  closeModal,
})
</script>
