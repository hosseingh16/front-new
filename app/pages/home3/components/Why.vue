<template>
  <div class="p-10">
    <h1 class="text-center font-semibold text-xl">چرا حسابداران ما رو انتخاب می‌کنن؟</h1>
    <div class="mt-10 grid gap-y-10">
      <div
        v-for="(item, index) in items"
        class="flex flex-col-reverse justify-center items-center gap-5 1000:gap-20"
        :class="`${index == 0 || index == 2 ? '1000:flex-row' : '1000:flex-row-reverse'}`"
      >
        <div class="flex items-start md:w-[400px]">
          <div class="-rotate-90 mt-4 text-[#FF8030] flex gap-2 items-center">
            <span class="font-semibold text-lg">0{{ index+1 }}</span>
            <span class="w-[30px] h-[1.5px] bg-[#FF8030] mb-1"></span>
          </div>
          <div>
            <p class="font-semibold">{{ item.title }}</p>
            <p class="text-sm">
              {{ item.description }}
            </p>
          </div>
        </div>
        <NuxtImg :src="`/images/${item.img}`" width="230" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Variables
const items = [
  {
    title: 'رزومه‌ای متناسب با نیاز بازار حسابداری',
    description:
      ' قالب‌هایی که دقیقاً مطابق با انتظار کارفرماهای حوزه مالی و حسابرسی طراحی شدن.',
    img: 'img-5.png',
  },
  {
    title: 'دیده‌شدن توسط شرکت‌های معتبر',
    description:
      ' رزومه‌ات مستقیماً در معرض دید صدها شرکت مالی، حسابرسی و تولیدی قرار می‌گیره.',
    img: 'img-6.png',
  },
  {
    title: 'پشتیبانی و مشاوره رایگان',
    description:
      ' اگه سوالی داشتی یا خواستی رزومه‌ت رو بهبود بدی، تیم پشتیبانی کنارت هست.',
    img: 'img-7.png',
  },
  {
    title: 'شروع سریع، بدون پیچیدگی',
    description:
      ' حتی اگه اولین باره رزومه می‌سازی، با راهنمای مرحله‌به‌مرحله ما راحت پیش میری',
    img: 'img-8.png',
  },
];
</script>
