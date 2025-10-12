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
          <p class="text-14 text-gray-600">روغن فوکس ایرانیان</p>
        </div>
        <div class="flex gap-2 items-center">
          <Icon name="svg:location-2" />
          <p class="text-14 text-[rgba(16,185,129,1)]">تهران</p>
        </div>
      </div>
      <div class="border border-gray-300 p-2 rounded-[10px]">
        <NuxtImg src="/images/img-13.png" width="46" height="46" />
      </div>
    </div>
    <div class="flex flex-wrap gap-2 items-start">
      <Icon name="svg:timer" class="mt-2" />
      <div class="flex flex-wrap items-center gap-1">
        <p class="text-14 text-gray-600">تمام وقت | 15-20 میلیون تومان |</p>
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
          @click="showModal"
        >
          <Icon name="svg:star" />
        </button>
        <NuxtLink :to="goToPage ? '/single-job' : ''">
          <button class="btn btn-outline h-8 text-primary-900 px-2">
            <span class="text-14">مشاهده و ارسال رزومه</span>
            <Icon name="svg:arrow-left-circle" size="20" />
          </button>
        </NuxtLink>
      </div>
    </div>
    <dialog1
      id="modal_3"
      title="برای نشانک گذاری آگهی مورد نظر ابتدا وارد حساب کاربری خود شوید "
      type="warning"
      :width="512"
    >
      <div class="text-right">
        <div>
          <p class="font-semibold">ورود | ثبت نام</p>
          <p class="mt-4 text-14 text-gray-700 font-normal">شماره موبایل</p>
          <input
            placeholder="لطفا شماره موبایل خود را وارد کنید"
            class="placeholder:text-14 placeholder:text-gray-500 w-full p-2 bg-gray-100 rounded-lg focus:outline-0"
          />
          <span class="text-gray-500 text-xs font-font-regular"
            >مثال :*** **** 0912
          </span>
        </div>
        <form method="dialog">
          <button class="btn btn-primary w-full mt-8" onclick="modal_3.showModal()">
            دریافت کد تأیید
          </button>
        </form>
        <div class="flex justify-end gap-2 text-gray-500 text-xs font-yb-bold">
          <button class="flex gap-2 items-center">
            <Icon name="svg:key" />
            <span>ورود با رمز عبور</span>
          </button>
        </div>
      </div>
    </dialog1>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps({
  goToPage: Boolean,
});

// Functions
function showModal() {
  (document.getElementById('modal_3') as HTMLDialogElement).showModal();
}
</script>
