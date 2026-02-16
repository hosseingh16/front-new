<template>
  <div class="mt-40 lg:mt-6">
    <h1 class="font-bold text-2xl text-center">
      مراحل ساخت رزومه حرفه ای در “های‌حساب “
    </h1>
    <NuxtImg src="/images/line.png" class="mt-8 w-full max-md:h-[40px]" />
    <div class="py-10 px-16 grid hd:grid-cols-5 gap-10 hd:gap-5">
      <div
        v-for="(item, index) in items"
        :class="{ 'hd:-mt-12': index == 0 || index == 2 || index == 4 }"
      >
        <div class="bg-gradient-to-b from-white to-[#DADAE1] rounded-3xl p-[1px]">
          <div class="bg-[#EBECF1] rounded-3xl relative p-4 h-full">
            <p
              class="font-semibold text-[80px] text-[#DBDBE1] absolute top-10 left-7 z-0"
            >
              {{ index + 1 }}
            </p>
            <div
              class="absolute -top-4 right-10 text-[10px] leading-3 px-4 py-2 rounded-lg border"
              :style="`background-color: ${item.bgColor};border-color:${item.borderColor}`"
            >
              {{ item.title1 }}
            </div>
            <p class="font-semibold text-sm text-gray-700 z-10 relative">
              {{ item.title2 }}
            </p>
            <p class="mt-3 text-sm text-gray-600 z-10 relative">{{ item.description }}</p>
          </div>
        </div>
        <div
          class="max-hd:hidden mt-5 bg-gradient-to-b from-[#DADAE1] to-white rounded-3xl h-28 p-[1px]"
        >
          <div class="bg-[#F6F6F6] h-full rounded-3xl p-4"></div>
        </div>
      </div>
    </div>

    <!-- <div class="py-10 px-32 grid md:grid-cols-5 gap-5">
      <div v-for="(item, index) in items" class="bg-gray-300 rounded-3xl p-3 relative">
        <div
          class="absolute -top-4 right-10 text-[10px] leading-3 px-4 py-2 rounded-lg border"
          :style="`background-color: ${item.bgColor};border-color:${item.borderColor}`"
        >
          {{ item.title1 }}
        </div>
        <p class="font-semibold text-sm text-gray-700">{{ item.title2 }}</p>
        <p class="mt-3 text-sm text-gray-600">{{ item.description }}</p>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
// Parameters
const items = [
  {
    title1: 'مسیر شغلی',
    title2: 'انتخاب مسیر شغلی حسابداری',
    description:
      'زمینه تخصصی خودت رو مشخص کن: مالی، مالیاتی، صنعتی، خدمات حسابرسی یا پاره‌وقت.',
    bgColor: '#EBF6EF',
    borderColor: '#38A95E',
  },
  {
    title1: 'مهارت‌ها',
    title2: 'ثبت مهارت‌های نرم‌افزاری و فنی با جزئیات',
    description:
      'انتخاب نرم‌افزار مد نظرت و  تعیین سطح تسلطت در هر زیرسیستم (مثلاً خزانه‌داری، انبار، حقوق و دستمزد)',
    bgColor: '#FFF7E9',
    borderColor: '#FCB428',
  },
  {
    title1: 'ارزیابی',
    title2: 'ارزیابی توانمندی های کلیدی',
    description:
      'میزان آشنایی‌ات با مفاهیم مثل حسابداری به طور کامل ، مالیات ، تحلیل مالی و اکسل پیشرفته رو وارد کن.',
    bgColor: '#FCEDED',
    borderColor: '#DD4A48',
  },
  {
    title1: 'نمودار حرفه‌ای',
    title2: 'نمایش مهارت ها با نمودار حرفه ای ',
    description:
      'مهارت‌هات رو با نمودار های سطح‌بندی نمایش بده ، دقیقا همون چیزی که کارفرماها دنبالشن',
    bgColor: '#FFE6D6',
    borderColor: '#FF8030',
  },
  {
    title1: 'ایجاد رزومه',
    title2: 'دریافت فایل نهایی و شروع ارسال رزومه',
    description:
      'رزومه ات رو به صورت pdf  با یک کلیک دانلود کن و آماده موقعیت های شغلی هدفمند باش',
    bgColor: '#E4EBFC',
    borderColor: '#4864E1',
  },
];
</script>
