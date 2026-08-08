<template>
  <dialog
    ref="dialogRef"
    class="modal"
    dir="rtl"
    aria-labelledby="ad-resume-success-title"
    @click="handleBackdropClick"
  >
    <div
      class="modal-box w-[calc(100%-2rem)] overflow-visible rounded-2xl p-6"
      :style="`max-width:${width}px`"
      @click.stop
    >
      <div class="relative overflow-visible">
        <button
          type="button"
          class="absolute left-0 top-0 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-1.5 text-text-passive transition-opacity hover:opacity-80"
          aria-label="بستن"
          @click="closeModal"
        >
          <Icon name="material-symbols:close" size="20" />
        </button>

        <div class="flex flex-col items-center overflow-visible text-center">
          <div class="relative -mb-13.5 size-60 shrink-0">
            <NuxtImg
              src="/images/resume-sent-success.png"
              width="240"
              height="240"
              alt=""
              class="size-full object-contain"
            />
          </div>

          <div class="relative z-10 flex w-full flex-col items-center gap-2">
            <h2
              id="ad-resume-success-title"
              class="font-yb-bold text-[21px] leading-[1.7] text-text-primary"
            >
              رزومه شما با موفقیت ارسال شد
            </h2>

            <p class="max-w-md text-base leading-[1.7] text-text-tertiary">
              رزومه شما با موفقیت به فرصت شغلی موردنظر ارسال شد.
              <br />
              می‌توانید وضعیت بررسی رزومه خود را در داشبورد دنبال کنید.
            </p>
          </div>
        </div>
      </div>

      <NuxtLink
        to="/dashboard/my-requests"
        class="btn btn-primary mt-4 flex h-10 w-full gap-1"
        @click="closeModal"
      >
        درخواست‌های شغلی
        <Icon name="svg:receive-briefcase" size="24" class="size-6 shrink-0" />
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
    width: 560,
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
