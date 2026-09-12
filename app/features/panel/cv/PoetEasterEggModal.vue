<template>
  <dialog
    ref="dialogRef"
    class="modal"
    dir="rtl"
    aria-labelledby="cv-about-easter-egg-title"
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

        <div class="flex flex-col items-center text-center">
          <div class="mt-6 size-44 shrink-0">
            <NuxtImg
              src="/images/shir-khorshid-iran-map.png"
              width="176"
              height="176"
              alt="نقشه ایران با پرچم شیر و خورشید"
              class="size-full object-contain"
            />
          </div>

          <div
            id="cv-about-easter-egg-title"
            class="mt-5 max-w-md space-y-3 text-sm leading-loose text-text-tertiary"
          >
            <p>به یاد تمامی جاویدنامان راه وطن؛</p>
            <p>
              به احترام تمامی آنان که دیگر در میان ما نیستند، اما نامشان زنده
              است؛
            </p>
            <p>
              به احترام تمامی مادران، پدران، خانواده‌ها و عزیزانی که داغی بزرگ را
              با خود حمل می‌کنند؛
            </p>
            <p>
              و به یاد تمامی جاویدنامان راه وطن که در ۱۸ و ۱۹ دی‌ماه، جان خود را
              فدای ایران کردند.
            </p>
            <p class="pt-1">
              نامتان جاوید، یادتان گرامی و راهتان در قلب تاریخ این سرزمین ماندگار
              باد.
            </p>
            <p class="font-yb-bold">ایران، شما را فراموش نخواهد کرد.</p>
            <p class="pt-2">
              <a
                href="https://www.iranintl.com/javidnaman"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary-500 underline underline-offset-4 transition-opacity hover:opacity-80"
              >
                iranintl.com/javidnaman
              </a>
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-primary mt-6 flex h-10 w-full"
        @click="closeModal"
      >
        بستن
      </button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: number;
  }>(),
  {
    width: 480,
  },
);

const dialogRef = ref<HTMLDialogElement | null>(null);

function showModal() {
  dialogRef.value?.showModal();
}

function closeModal() {
  dialogRef.value?.close();
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

defineExpose({
  showModal,
  closeModal,
});
</script>

