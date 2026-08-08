<template>
  <dialog
    ref="dialogRef"
    class="modal"
    dir="rtl"
    aria-labelledby="ad-resume-incomplete-title"
    @click="handleBackdropClick"
  >
    <div
      class="modal-box w-[calc(100%-2rem)] rounded-2xl p-6"
      :style="`max-width:${width}px`"
      @click.stop
    >
      <div class="relative">
        <button
          type="button"
          class="absolute left-0 top-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-1.5 text-text-passive transition-opacity hover:opacity-80"
          aria-label="بستن"
          @click="closeModal"
        >
          <Icon name="material-symbols:close" size="20" />
        </button>

        <div class="flex flex-col items-center text-center">
          <div
            class="flex size-16 items-center justify-center rounded-full bg-[#FFF4E5]"
            aria-hidden="true"
          >
            <Icon name="svg:warning" size="40" />
          </div>

          <h2
            id="ad-resume-incomplete-title"
            class="mt-4 font-yb-bold text-[21px] leading-[1.7] text-text-primary"
          >
            تکمیل اطلاعات پایه رزومه
          </h2>

          <p class="mt-2 max-w-md text-base leading-[1.7] text-text-tertiary">
            برای ارسال رزومه، ابتدا باید اطلاعات پایه خود را در رزومه‌ساز تکمیل
            کنید.
          </p>
        </div>
      </div>

      <NuxtLink
        to="/dashboard/cv"
        class="btn btn-primary mt-6 flex h-10 w-full gap-1"
        @click="closeModal"
      >
        رفتن به رزومه‌ساز
        <Icon name="material-symbols:chevron-left" size="24" class="size-6 shrink-0" />
      </NuxtLink>
    </div>
  </dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: number
  }>(),
  {
    width: 480,
  },
)

const dialogRef = ref<HTMLDialogElement | null>(null)

function showModal() {
  dialogRef.value?.showModal()
}

function closeModal() {
  dialogRef.value?.close()
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

defineExpose({
  showModal,
  closeModal,
})
</script>
