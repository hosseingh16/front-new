<template>
  <div>
    <divider title="ارزش های برند خانومی" icon="medal-star" />
    <div v-for="item in items" class="mt-4">
      <div class="flex items-center gap-2">
        <Icon name="svg:heart-tick" />
        <p class="font-bold text-gray-800">{{ item.title }}</p>
      </div>
      <p class="text-sm text-gray-700 -mt-2">{{ item.text }}</p>
    </div>
    <divider title="تصاویر گالری برند خانومی" icon="medal-star" class="mt-10" />
    <div class="grid grid-cols-2 gap-4 [&>img]:w-full [&>img]:h-full">
      <NuxtImg src="/images/about-1.png" class="md:col-span-2" />
      <NuxtImg src="/images/about-2.png" />
      <NuxtImg src="/images/about-3.png" />
      <NuxtImg src="/images/about-4.png" class="md:col-span-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Divider from './Divider.vue';

// Variables
const items = [
  {
    title: 'احترام',
    text: 'رفتار و کلام ما با مخاطب مبتنی بر احترام است. ما به نیاز، انتخاب و درخواست مخاطبان در تمامی سطوح احترام می‌گذاریم.',
  },
  {
    title: 'صداقت و شفافیت',
    text: 'رفتار و کلام ما با مخاطبان هم از نظر محتوا و هم از نظر شیوه‌ی اجرا و بیان، صادقانه و شفاف است.',
  },
  {
    title: 'مسئولیت پذیری و تعهد',
    text: 'رفتار و کلام ما در نقطه تماس با مخاطبان (در راستای کمک به آن‌ها) مسئولانه و قابل اجرا است.',
  },
  {
    title: 'تخصص',
    text: 'ما تلاش می‌کنیم با ارائه سرویس‌های ویژه در بازار مرتبط با زنان و تولید محتوای تخصصی، متخصص بازار حوزه زنان باشیم..',
  },
];
</script>
