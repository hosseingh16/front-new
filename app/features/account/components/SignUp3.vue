<template>
  <DaisyCard class="w-full min-[1052px]:w-263">
    <div class="flex justify-between items-center">
      <Icon name="svg:chevron-right" class="cursor-pointer" @click="goBack" />
      <img :src="`/images/3-3.png`" width="54" />
    </div>

    <p class="mt-4 text-2xl sm:text-h1 font-yb-bold">نوع درخواست جدید:</p>

    <div class="grid grid-cols-1 min-[1052px]:grid-cols-3 gap-4 mt-4">
      <div
        v-for="(item, index) in items"
        class="border border-gray-default hover:border-primary-500 rounded-2xl py-4 min-[1052px]:p-6 flex flex-row min-[1052px]:flex-col items-center group cursor-pointer"
        @click="onChangeStep(index)"
      >
        <NuxtImg
          :src="`/images/${item.image}`"
          class="w-32 h-32 min-[1052px]:w-50 min-[1052px]:h-50"
        />
        <div class="min-[1052px]:text-center">
          <p class="min-[1052px]:-mt-10 text-lg sm:text-xl font-yb-bold">
            {{ item.title }}
          </p>
          <p class="my-2 leading-7 max-[1052px]:text-sm">{{ item.description }}</p>
          <button
            class="btn btn-soft group-hover:btn-primary h-10"
            @click="onChangeStep(index)"
          >
            <span :class="`icon-${item.icon}`" class="text-2xl"></span>
            <span>{{ item.title }}</span>
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

// Variables
const items = [
  {
    image: 'request-type-1.png',
    title: 'ایجاد آگهی',
    description: 'آگهی استخدامی یا پروژه ایجاد کنید و نیروی موردنظر را جذب کنید.',
    icon: 'bag-1',
  },
  {
    image: 'request-type-2.png',
    title: 'فرصت‌های شغلی',
    description: 'فرصت‌های شغلی را مشاهده کنید و رزومه خود را برای آن‌ها ارسال کنید.',
    icon: 'bag-2',
  },
  {
    image: 'request-type-3.png',
    title: 'دریافت مشاوره',
    description: 'لیست مشاوران را ببینید و زمان مناسب برای مشاوره رزرو کنید.',
    icon: 'users',
  },
];

// Functions
function goBack() {
  emits('onChangeDirection', 'back');
  emits('onChangeStep', 4);
}

function onChangeStep(index: number) {
  if (index === 0) emits('onChangeStep', 6);
}
</script>
