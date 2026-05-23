<template>
  <div>
    <EducationSection />

    <ExperienceSection />

    <div class="bg-white p-4 rounded-2xl mt-8">
      <Titr>نرم‌افزار حسابداری</Titr>
      <div class="flex flex-col items-center justify-center gap-4 py-10">
        <div class="text-center">
          <img src="/images/no-details.png" alt="" class="w-41" />
          <p class="font-yb-bold -mt-14">نرم‌افزار حسابداری</p>
        </div>
        <p class="text-text-passive text-sm">
          شما هنوز نرم افزار حسابداری خود را تکمیل نکرده‌اید.
        </p>
        <p class="text-text-passive text-sm">
          با افزودن حداقل یک نرم افزار حسابداری، شانس شما برای استخدام افزایش پیدا می‌کند.
        </p>
        <button class="btn btn-primary">
          <Icon name="svg:plus-white" size="16" />
          افزودن نرم‌افزار حسابداری
        </button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-2xl mt-8">
      <Titr>مهارت‌ها</Titr>
      <div class="mt-4 grid lg:grid-cols-2 gap-x-4 gap-y-8">
        <div>
          <p>میزان آشنایی به نرم افزار اکسل:</p>
          <Slider color="#FFA726" />
        </div>
        <div>
          <p>میزان آشنایی به حسابداری بهای تمام شده:</p>
          <Slider color="#2E7D32" />
        </div>
        <div>
          <p>میزان تجربه شما در حوزه حسابداری پیمان:</p>
          <Slider color="#2E7D32" />
        </div>
        <div>
          <p>میزان آشنایی با تهیه صورت مالی استاندارد:</p>
          <Slider color="#2E7D32" />
        </div>
      </div>
      <div class="flex justify-end mt-9">
        <button class="btn btn-ghost">
          <Icon name="svg:close" />
          انصراف
        </button>
        <button class="btn btn-primary">
          <Icon name="svg:check-check" />
          ذخیره
        </button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-2xl mt-8">
      <Titr>ارزیابی بیمه ای و مالیاتی</Titr>
      <div class="mt-4 grid lg:grid-cols-2 gap-x-4 gap-y-8">
        <div>
          <p>میزان آشنایی با مالیات ارزش افزوده:</p>
          <Slider color="#FFA726" />
        </div>
        <div>
          <p>میزان آشنایی به مالیات عملکرد:</p>
          <Slider color="#2E7D32" />
        </div>
        <div>
          <p>میزان آشنایی به بیمه های پرسنلی و قرارادادی:</p>
          <Slider color="#2E7D32" />
        </div>
        <div>
          <p>میزان آشنایی به سامانه مودیان و پایانه های فروشگاهی:</p>
          <Slider color="#2E7D32" />
        </div>
      </div>
      <div class="flex justify-end mt-9">
        <button class="btn btn-ghost">
          <Icon name="svg:close" />
          انصراف
        </button>
        <button class="btn btn-primary">
          <Icon name="svg:check-check" />
          ذخیره
        </button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-2xl mt-8">
      <Titr>فایل ضمیمه</Titr>>
      <div class="mt-5 flex gap-1 items-center">
        <icons-check color="#009F65" />
        <span class="text-text-passive text-sm"
          >در صورتی که فایل رزومه یا توضیحات جداگانه دارید میتوانید آن را اپلود کنید. این
          فایل برای کارفرمایان قابل مشاهده است.</span
        >
      </div>
      <div class="mt-4">
        <m-upload-box
          title="برای آپلود فایل کلیک کنید"
          subtitle="یا فایل را بکشید و در این محل رها کنید"
          :max-size="50"
          :accept="['pdf', 'doc']"
          svg-icon-name="uploading"
          :is-image="false"
        />
      </div>
      <div class="flex justify-end mt-9">
        <button class="btn btn-ghost">
          <Icon name="svg:close" />
          انصراف
        </button>
        <button class="btn btn-primary">
          <Icon name="svg:check-check" />
          ذخیره
        </button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-2xl mt-8">
      <Titr :with-icon="false">قابل رویت برای همه</Titr>
      <div class="mt-4 flex items-center gap-2">
        <div
          class="shrink-0 bg-primary-500 p-1 w-14 h-8 rounded-full cursor-pointer relative"
        >
          <div
            class="bg-white p-2 w-[60%] h-[80%] rounded-full flex justify-center items-center cursor-pointer absolute top-[3.5px] left-1"
          >
            <icons-check color="#4864E1" />
          </div>
        </div>
        <p class="text-text-primay leading-8">
          در صورت فعال بودن، رزومه شما در نتیجه جستجوی کارفرمایان قابل ‌رویت خواهد بود.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISelectItem } from '~/types/ISelectItem';
import EducationModal from './Tab2/EducationModal.vue';
import Slider from './Slider.vue';
import Titr from './Titr.vue';
import EducationSection from './Tab2/EducationSection.vue';
import ExperienceSection from './Tab2/ExperienceSection.vue';

// Variabels
const levels = ref<ISelectItem[]>([{ label: 'کارشناسی', value: '1' }]);
const years = ref<ISelectItem[]>([{ label: '1400', value: '1' }]);
const educationItems = ref<any[]>([]);
</script>
