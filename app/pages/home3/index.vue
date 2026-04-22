<template>
  <div class="bg-[#F6F6F6]">
    <div class="flex flex-col items-center">
      <h1
        class="font-bold text-2xl 600:text-[30px] mt-28 md:mt-[169px] leading-14 text-center px-5 600:px-10 inline-flex items-center flex-wrap justify-center"
      >
        برای انتخاب شدن اول باید دیده بشی !
      </h1>
      <div
        class="mt-2 font-medium text-sm md:text-2xl px-5 md:px-10 text-center"
      >
        اولین قدم برای شغلی بهتر در حسابداری، یک رزومه‌ی حرفه‌ایه. ما کنارت
        هستیم!
      </div>
      <button class="btn btn-primary mt-10">
        <Icon name="uil:plus" size="25" />
        ساخت رزومه رایگان
      </button>
      <m-divider2 class="mt-10" blue />
      <div class="w-full px-5 md:px-40 mt-8">
        <div class="h-[2px] bg-[rgba(213,212,220,1)]"></div>
      </div>
    </div>
    <why />
    <m-divider2 class="mt-5" blue />
    <ads1 />
    <m-divider2 class="mt-10" blue />
    <steps />
    <cv />
    <questions class="py-20" />
  </div>
</template>

<script setup lang="ts">
import Why from "./components/Why.vue";
import Ads1 from "./components/Ads1.vue";
import Steps from "./components/Steps.vue";
import Cv from "./components/Cv.vue";
import Questions from "./components/Questions.vue";
</script>
