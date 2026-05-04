<template>
  <div>
    <div class="mb-3">
      <Circle :percent="78" />
    </div>

    <div
      v-for="item in [
        'اطلاعات پایه',
        'اطلاعات تحصیلی',
        'سوابق کاری',
        'نرم‌افزار حسابداری',
        'مهارت‌ها',
        'ارزیابی بیمه‌ای و مالیاتی',
        'فایل ضمیمه',
      ]"
      class="flex justify-between items-center mt-3"
    >
      <div class="flex items-center">
        <icons-chevron class="rotate-90" />
        <span class="text-text-passive text-sm">{{ item }}</span>
      </div>
      <div
        class="flex justify-center items-center bg-[#EF403514] h-6 w-8 text-danger-500 text-caption rounded-lg"
      >
        0%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Circle from './Circle.vue';
</script>
