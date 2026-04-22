<template>
  <div class="mt-2 pb-20">
    <div class="px-5 lg:px-[13%]">
      <m-titr class="text-center">
        آنچه <span class="text-primary-500">های‌حساب</span> ارائه می‌دهد
      </m-titr>
      <div class="grid lg:grid-cols-3 gap-4 mt-6">
        <div
          v-for="item in items1"
          class="py-3 px-5 flex flex-col justify-center items-center bg-[#F5F6F8] shadow-[0px_1px_7px_0px_#5599FF61] rounded-lg"
        >
          <p class="font-semibold text-gray-700">{{ item.title }}</p>
          <button
            class="btn btn-ghost text-sm font-semibold text-primary-500 max-lg:underline max-lg:underline-offset-8"
          >
            {{ item.btn }}
            <Icon name="svg:arrow-left-2" size="10" class="max-lg:hidden" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap-reverse justify-center gap-x-20 lg:gap-28 mt-16 px-5">
      <NuxtImg src="/images/img-12.png" width="300" />
      <div class="w-[350px]">
        <m-title-box>انتخاب بهترین‌ها</m-title-box>
        <m-titr class="mt-4">
          چرا <span class="text-[#FF8030]">رزومه حرفه‌ای</span> مهم است؟
        </m-titr>
        <p class="font-semibold text-gray-700 mt-3 leading-9">
          رزومه شما اولین برخورد کارفرمایان با شماست. یک رزومه حرفه‌ای و منظم می‌تواند
          شانس شما را برای دعوت به مصاحبه و کسب شغل مورد نظرتان به طرز چشمگیری افزایش دهد.
        </p>
        <button class="btn btn-outline mt-12 border-[#AEB5BE] max-md:text-sm">
          ساخت رزومه رایگان
          <Icon name="svg:arrow-left-3" size="10" />
        </button>
      </div>
    </div>
    <div class="px-5 lg:px-[13%] grid min-[800px]:grid-cols-3 gap-x-10 gap-y-5 mt-28">
      <div v-for="item in items2" class="bg-[#F5F6F8] p-4 rounded-lg">
        <div class="flex gap-2 items-center">
          <Icon :name="`svg:${item.icon}`" size="50" />
          <p class="font-bold">{{ item.title }}</p>
        </div>
        <p class="text-sm text-gray-500 leading-[30px]">{{ item.description }}</p>
        <button class="text-sm text-primary-500 mt-4">
          {{ item.btn }}
          <Icon name="svg:arrow-left-2" size="10" class="mr-2"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Variables
const items1 = [
  { title: 'رزومه حرفه‌ای حسابداری', btn: 'ایجاد رزومه' },
  { title: 'جستجوی تخصصی حسابداری', btn: 'فرصت های شغلی' },
  { title: 'درج آگهی اختصاصی حسابداری', btn: 'ایجاد آگهی' },
];

const items2 = [
  {
    title: 'محاسبه مالیات بر درآمد',
    description:
      'محاسبه مالیات بر اساس نوع کسب‌وکار و مبلغ فروش برای تعیین مقدار مالیات پرداختی',
    btn: 'مالیات خود را محاسبه کنید',
    icon: 'tax',
  },
  {
    title: 'محاسبه حقوق و دستمزد',
    description:
      'محاسبه حقوق بر اساس تجربه، مهارت‌ها و ساعات کاری برای تخمین دقیق درآمد ماهانه',
    btn: 'حقوق خود را محاسبه کنید',
    icon: 'cal',
  },
  {
    title: 'محاسبه عیدی و پاداش',
    description:
      'محاسبه عیدی بر اساس تعداد ماه های سال که در سازمان مربوطه مشغول به کار هستید',
    btn: 'عیدی خود را محاسبه کنید',
    icon: 'reward',
  },
];
</script>
