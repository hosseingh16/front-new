<template>
  <div class="bg-gray-soft py-12 px-6 lg:px-[120px]">
    <NuxtImg src="/images/single-job.png" class="w-full" />
    <div class="bg-white p-6 rounded-b-lg">
      <div class="flex flex-wrap gap-2 justify-between items-center">
        <div class="flex items-center gap-4">
          <div
            class="flex justify-center items-center border p-2 border-gray-300 rounded-lg"
          >
            <NuxtImg src="/images/company-logo.png" class="h-[75px]" />
          </div>
          <div>
            <p class="font-yb-bold text-2xl text-gray-800">{{ title }}</p>
            <div class="flex items-center gap-2">
              <NuxtLink
                to="/company"
                class="text-[rgba(85,116,255,1)] underline underline-offset-8 text-14 font-normal"
              >
                <Icon name="svg:link" />
                خانومی
              </NuxtLink>
              <span class="text-xs font-normal text-gray-600"> - 25 رزومه ارسال شده</span>
            </div>
          </div>
        </div>
        <button class="btn btn-success px-12" onclick="modal_1.showModal()">
          ارسال رزومه
        </button>
        <dialog1 id="modal_1" :title type="warning" :width="420">
          <p class="text-14 font-normal text-gray-600 px-8">
            لطفا برای ارسال رزومه از طریق دکمه زیر وارد حساب کاربری خود شوید
          </p>
          <form method="dialog">
            <button class="btn btn-primary w-full mt-4" onclick="modal_2.showModal()">
              ورود و ثبت‌نام
            </button>
          </form>
        </dialog1>
        <dialog1
          id="modal_2"
          title="رزومه شما برای موقعیت شغلی استخدام مدیر مالی (آقا) با موفقیت ارسال شد"
          type="success"
        >
          <p class="text-14 font-normal text-gray-600 px-8 leading-6!">
            در صورت تایید یا رد رزومه شما توسط کارفرما از طریق پیامک به شما اطلاع داده
            خواهد شد . همچنین می توانید نتیجه را در بخش “ درخواست من ” در پنل کاربری خود
            مشاهده نمایید.
          </p>
          <form method="dialog">
            <button class="btn btn-success w-full mt-4">فهمیدم</button>
          </form>
        </dialog1>
      </div>
      <div class="mt-4">
        <div class="flex items-center gap-2">
          <Icon name="svg:location-2" />
          <span class="text-14 font-normal text-secondary-900">تهران</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="svg:user-octagon" />
          <span class="text-14 font-normal text-gray-800">نوع همکاری : پاره وقت</span>
          <span class="text-gray-300">|</span>
          <div
            class="px-[2px] h-6 flex justify-center items-center font-normal text-xs text-[rgba(25,118,210,1)] bg-[rgba(227,243,255,1)] w-fit"
          >
            امکان کارآموزی
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="svg:money-4" />
          <span class="text-14 font-normal text-gray-800">حقوق : توافقی</span>
        </div>
        <div class="flex items-center gap-2">
          <icons-bag color="rgba(123,130,144,1)" :size="14" />
          <span class="text-14 font-normal text-gray-800"
            >آدرس :تهران - خیابان ولی‌عصر-ساختمان کیان، پلاک ۲۵۵۱</span
          >
        </div>
      </div>
      <div class="mt-6 flex items-center flex-wrap gap-2 justify-between">
        <div
          class="bg-gray-100 flex justify-center items-center text-xs text-gray-800 h-6 rounded-lg px-4"
        >
          6 روز پیش
        </div>
        <div class="flex gap-2 flex-wrap">
          <button class="btn text-gray-600 border-0 bg-gray-200 px-3">
            <icons-send />
            <span class="text-14 font-semibold">اشتراک‌گذاری</span>
          </button>
          <button
            class="btn text-gray-600 border-0 bg-gray-200 px-3"
            @click="showBookmarkModal"
          >
            <icons-star />
            <span class="text-14 font-semibold">نشان کردن</span>
          </button>
        </div>
      </div>
    </div>
    <div class="mt-8 grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 py-2 px-4 bg-white rounded-2xl h-fit pb-20">
        <m-tabs
          :tabs="[
            { label: 'توضیحات شغل', component: Tab1 },
            { label: 'درباره شرکت', component: Tab2 },
          ]"
        />
      </div>
      <div>
        <p class="font-yb-bold text-gray-800 mb-4">فرصت های شغلی فعال در مجموعه</p>
        <div class="grid gap-4">
          <job-box v-for="n in 2" go-to-page />
        </div>
        <div class="w-full h-[2px] bg-gray-300 mt-8 mb-4"></div>
        <div class="p-4 bg-[rgba(228,235,252,1)] rounded-lg">
          <p class="font-yb-bold text-gray-800">کارفرما هستید ؟</p>
          <div class="mt-2 grid grid-cols-2 gap-3 [&>.btn]:font-semibold">
            <button class="btn btn-outline">بخش کارفرمایان</button>
            <button class="btn bg-gray-700 text-white">ایجاد آگهی</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tab1 from './components/Tab1.vue';
import Tab2 from './components/Tab2.vue';

// Variables
const title = ref('استخدام مدیر مالی (آقا)');

// Functions
function showBookmarkModal() {
  (document.getElementById('bookmarkModal') as HTMLDialogElement).showModal();
}
</script>
