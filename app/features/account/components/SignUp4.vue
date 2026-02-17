<template>
  <DaisyCard class="w-full min-[1052px]:w-[1052px]">
    <div class="flex justify-between items-center">
      <Icon name="svg:chevron-right" class="cursor-pointer" @click="goBack" />
      <img :src="`/images/3-3.png`" width="54" />
    </div>

    <p class="mt-4 text-2xl sm:text-h1 font-yb-bold">نوع آگهی:</p>
    <div class="flex gap-1 items-center mt-2">
      <Icon name="svg:hint" />
      <span class="text-sm text-[#757575]"
        >برای ایجاد آگهی، باید سازمان یا نماینده سازمان باشید.</span
      >
    </div>

    <div class="grid grid-cols-1 min-[1052px]:grid-cols-3 gap-4 mt-4">
      <div
        v-for="item in items"
        class="border border-gray-default hover:border-primary-900 rounded-2xl px-1 py-4 min-[1052px]:p-6 flex flex-row min-[1052px]:flex-col items-center group cursor-pointer"
      >
        <NuxtImg
          :src="`/images/${item.image}`"
          class="w-32 h-32 min-[1052px]:w-[200px] min-[1052px]:h-[200px]"
        />
        <div class="min-[1052px]:text-center">
          <p class="min-[1052px]:-mt-10 text-lg sm:text-xl font-yb-bold">
            {{ item.title }}
          </p>
          <p class="my-2 leading-7 max-[1052px]:text-sm">{{ item.description }}</p>
          <button class="btn btn-soft group-hover:btn-primary h-10">
            <span :class="`icon-${item.icon}`" class="text-2xl"></span>
            <span class="max-[450px]:text-xs">{{ item.buttonText }}</span>
          </button>
        </div>
      </div>
    </div>
  </DaisyCard>
</template>

<script setup lang="ts">
import type { DirectionT } from '../types';

// Props
const props = defineProps<{
  step: number;
}>();

// Emits
const emits = defineEmits<{
  (e: 'onChangeStep', step: number): void;
  (e: 'onChangeDirection', step: DirectionT): void;
}>();

// Parameters
const items = [
  {
    image: 'request-type-1.png',
    title: 'آگهی تمام‌وقت',
    description: 'استخدام نیروی تمام‌وقت برای همکاری بلندمدت و پایدار.',
    icon: 'bag-1',
    buttonText: 'ایجاد آگهی تمام‌وقت',
  },
  {
    image: 'request-type-5.png',
    title: 'آگهی نیمه‌وقت',
    description: 'جذب نیروی نیمه‌وقت برای همکاری منعطف و پاره‌وقت.',
    icon: 'bag-1',
    buttonText: 'ایجاد آگهی نیمه‌وقت',
  },
  {
    image: 'request-type-6.png',
    title: 'پروژه حسابداری',
    description: 'تعریف پروژه مشخص و دریافت رزومه از متخصصان پروژه.',
    icon: 'bag-1',
    buttonText: 'ایجاد پروژه',
  },
];

// Functions
function goBack() {
  emits('onChangeDirection', 'back');
  emits('onChangeStep', 5);
}
</script>
