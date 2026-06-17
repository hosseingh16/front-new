<template>
  <div>
    <EducationSection />

    <ExperienceSection />

    <ProgramSection />

    <div class="bg-white p-4 rounded-2xl mt-8">
      <Titr>مهارت‌ها</Titr>
      <div class="mt-4 grid lg:grid-cols-2 gap-x-4 gap-y-12">
        <Slider color="#FFA726" label="میزان آشنایی به نرم افزار اکسل:" />
        <Slider color="#2E7D32" label="میزان آشنایی به حسابداری بهای تمام شده:" />
        <Slider color="#2E7D32" label="میزان تجربه شما در حوزه حسابداری پیمان:" />
        <Slider color="#2E7D32" label="میزان آشنایی با تهیه صورت مالی استاندارد:" />
      </div>
      <div class="flex justify-end mt-9">
        <button class="btn btn-ghost">
          <Icon name="svg:close" />
          انصراف
        </button>
        <m-button class="btn-primary">
          <Icon name="svg:check-check" />
          ذخیره
        </m-button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-2xl mt-8">
      <Titr>ارزیابی بیمه ای و مالیاتی</Titr>
      <div class="mt-4 grid lg:grid-cols-2 gap-x-4 gap-y-12">
        <Slider color="#FFA726" label="میزان آشنایی با مالیات ارزش افزوده:" />
        <Slider color="#2E7D32" label="میزان آشنایی به مالیات عملکرد:" />
        <Slider color="#2E7D32" label="میزان آشنایی به بیمه های پرسنلی و قراردادی:" />
        <Slider
          color="#2E7D32"
          label="میزان آشنایی به سامانه مودیان و پایانه های فروشگاهی:"
        />
      </div>
      <div class="flex justify-end mt-9">
        <button class="btn btn-ghost">
          <Icon name="svg:close" />
          انصراف
        </button>
        <m-button class="btn-primary">
          <Icon name="svg:check-check" />
          ذخیره
        </m-button>
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
        <m-button class="btn-primary">
          <Icon name="svg:check-check" />
          ذخیره
        </m-button>
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
import type { ISelectItem } from '~/types/select-item.js';
import Slider from './Slider.vue';
import Titr from './Titr.vue';
import EducationSection from './Tab2/EducationSection.vue';
import ExperienceSection from './Tab2/ExperienceSection.vue';
import ProgramSection from './Tab2/ProgramSection.vue';

// Variabels
const levels = ref<ISelectItem[]>([{ label: 'کارشناسی', value: '1' }]);
const years = ref<ISelectItem[]>([{ label: '1400', value: '1' }]);
const educationItems = ref<any[]>([]);
</script>
