<template>
  <div class="px-[10%] mt-10 relative">
    <div
      class="relative rounded-3xl pt-12 px-3 border-2 border-[#599CFF] bg-[#D2E4FF] flex flex-col h-[500px] max-lg:h-[800px] max-md:h-[900px]"
    >
      <h1
        class="font-bold md:text-2xl leading-14 text-center px-5 600:px-10 inline-flex items-center flex-wrap justify-center"
      >
        بیش از 3000
        <i class="icon-chart mx-1 text-4xl"></i>
        حسابدار با رزومه‌ی ما استخدام شدند
      </h1>
      <p class="text-center">
        ۹۰٪ کاربران ما در کمتر از ۳۰ روز شغل مناسب خود را پیدا کردند
      </p>
      <div class="self-center mt-20 absolute bottom-0 z-10">
        <NuxtImg src="/images/img-9.png" class="w-[310px] lg:w-[550px]" />
        <div
          class="rounded-t-xl bg-gradient-to-b from-25% from-white to-gray-700 opacity-35 w-full h-full absolute top-0"
        ></div>
      </div>
    </div>
    <div
      class="grid grid-cols-1 lg:grid-cols-4 gap-4 -mt-[200px] lg:-mt-16 relative z-20 max-lg:px-40"
    >
      <div
        v-for="(item, index) in items"
        class="max-lg:absolute"
        :class="`${index == 0 || index == 3 ? 'lg:-mt-10' : ''} 
        ${index == 0 || index == 2 ? 'max-lg:right-10' : ''}
          ${index == 1 || index == 3 ? 'max-lg:left-10' : ''}
          ${index == 0 ? '-top-[40px]' : ''}
          ${index == 1 ? '-top-[160px]' : ''}
          ${index == 2 ? '-top-[280px]' : ''}
          ${index == 3 ? '-top-[400px]' : ''}
         ${index == 0 ? 'lg:-mr-10' : ''} ${index == 3 ? 'lg:-ml-10' : ''}`"
        :style="`top:-${70 * (index + 1)}px`"
      >
        <div
          class="lg:h-[120px] max-lg:w-[250px] bg-white p-4 text-xs rounded-lg shadow-[0px_0px_10px_0px_#4885E140]"
        >
          <div class="flex items-center gap-2">
            <input
              id="rd1"
              type="radio"
              class="radio radio-sm"
              :class="item.color"
              checked
            />
            <span>{{ item.name }}</span>
            <div class="w-[2px] h-6 bg-[#EBECF1]"></div>
            <span>{{ item.role }}</span>
          </div>
          <p class="leading-5">{{ item.comment }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Variables
const items = [
  {
    name: 'ستایش ثانی',
    role: 'حسابدار ارشد',
    comment: 'رزومه‌ی من باعث شد تو کمتر از دو هفته شغل پیدا کنم',
    color: 'text-[#38A95E]',
  },
  {
    name: 'بهار فرهی',
    role: 'مدیر مالی',
    comment: 'رزومه‌ای که ساختم باعث شد تو کمتر از یک ماه شغل دلخواهم رو پیدا کنم.',
    color: 'text-[#E268B5]',
  },
  {
    name: 'فائزه فرزانه',
    role: 'حسابرس',
    comment: 'رزومه‌ی حرفه‌ای اینجا بهم کمک کرد تو اولین مصاحبه‌ام قبول بشم.',
    color: 'text-[#3883A9]',
  },
  {
    name: 'کوثر حیدری',
    role: 'حسابرس',
    comment: 'خیلی راحت و سریع تونستم با این رزومه مصاحبه بگیرم',
    color: 'text-[#38A95E]',
  },
];
</script>
