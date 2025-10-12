<template>
  <dialog id="selectedJobModal" class="modal">
    <div
      class="modal-box bg-gray-soft relative w-screen max-w-screen h-full rounded-none overflow-x-hidden flex flex-col justify-between gap-12 p-0"
    >
      <div>
        <div class="text-left flex justify-end bg-white p-6">
          <form method="dialog">
            <button class="flex items-center gap-2">
              <span class="font-semibold text-gray-800 text-14">بازگشت</span>
              <Icon name="svg:chevron-down" class="rotate-90" size="12" />
            </button>
          </form>
        </div>
        <div
          class="px-6 py-3 bg-primary-900 rounded-b-lg flex flex-col min-[450px]:flex-row flex-wrap justify-between gap-2 items-center"
        >
          <p class="font-yb-bold text-gray-100">استخدام مدیر مالی (آقا)</p>
          <div class="flex justify-end items-center">
            <button class="btn bg-transparent border-0 px-3" @click="showBookmarkModal">
              <icons-star color="rgba(245,246,248,1)" />
              <span class="text-xs font-normal text-gray-100">نشان کردن</span>
            </button>
            <button class="btn bg-transparent border-0 px-3">
              <icons-send color="rgba(245,246,248,1)" />
              <span class="text-xs font-normal text-gray-100">اشتراک‌گذاری</span>
            </button>
          </div>
        </div>
      </div>
      <selected-job class="px-6 pb-6" />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import SelectedJob from './SelectedJob.vue';

// Functions
function showBookmarkModal() {
  (document.getElementById('bookmarkModal') as HTMLDialogElement).showModal();
}
</script>
