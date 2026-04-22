<template>
  <div class="rounded-lg bg-white shadow p-4">
    <div
      class="flex bg-[rgba(253,235,235,1)] px-2 items-center gap-1 rounded-full w-fit h-6"
    >
      <m-circles
        :size="15"
        :scale="0.7"
        :colors="['rgba(214,54,54,0.25)', 'rgba(214,54,54,0.3)', 'rgba(214,54,54,1)']"
      />
      <span class="text-[rgba(221,74,72,1)] font-semibold text-xs">فوری</span>
    </div>
    <div class="flex justify-between items-start">
      <div>
        <p class="text-[rgba(47,50,65,1)] font-bold">
          استخدام حسابدار <span class="font-semibold text-gray-600">(خانم)</span>
        </p>
        <div class="flex gap-2 items-center">
          <Icon name="svg:buildings-3" />
          <p class="text-sm text-gray-600">روغن فوکس ایرانیان</p>
        </div>
        <div class="flex gap-2 items-center">
          <Icon name="svg:location-2" />
          <p class="text-sm text-[rgba(16,185,129,1)]">تهران</p>
        </div>
      </div>
      <div class="border border-gray-300 p-2 rounded-[10px]">
        <NuxtImg src="/images/img-13.png" width="46" height="46" />
      </div>
    </div>
    <div class="flex flex-wrap gap-2 items-start">
      <Icon name="svg:timer" class="mt-2" />
      <div class="flex flex-wrap items-center gap-1">
        <p class="text-sm text-gray-600">تمام وقت | 15-20 میلیون تومان |</p>
        <div
          class="px-2 h-6 flex justify-center items-center font-normal text-xs text-[rgba(25,118,210,1)] bg-[rgba(227,243,255,1)] w-fit"
        >
          امکان کارآموزی
        </div>
      </div>
    </div>
    <div class="mt-1 h-[1px] bg-gray-300"></div>
    <div class="flex flex-wrap justify-between items-center gap-1 mt-2">
      <div
        class="bg-gray-100 flex justify-center items-center text-xs text-gray-800 h-6 rounded-lg px-4"
      >
        6 روز پیش
      </div>
      <div class="flex items-center gap-2">
        <button
          class="h-8 w-8 cursor-pointer border border-gray-600 rounded-lg flex justify-center items-center active:bg-gray-200"
          @click="showBookmarkModal"
        >
          <icons-star />
        </button>
        <NuxtLink :to="goToPage ? '/single-job' : ''">
          <button class="btn btn-outline h-8 text-primary-500 px-2">
            <span class="text-sm">مشاهده و ارسال رزومه</span>
            <Icon name="svg:arrow-left-circle" />
          </button>
        </NuxtLink>
      </div>
    </div>
    <bookmark />
  </div>
</template>

<script setup lang="ts">
// Props
defineProps({
  goToPage: Boolean,
});

// Functions
function showBookmarkModal() {
  (document.getElementById('bookmarkModal') as HTMLDialogElement).showModal();
}
</script>
