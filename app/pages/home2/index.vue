<template>
  <div class="bg-[#F6F6F6]">
    <div class="bg-[url('/images/bg-1.png')] bg-cover">
      <div class="flex flex-col items-center">
        <div class="md:hidden mt-10">
          <Icon name="svg:svg-1" class="" size="300" />
        </div>
        <h1
          class="font-bold text-2xl 600:text-[30px] mt-5 md:mt-[169px] leading-14 text-center px-5 600:px-10 inline-flex items-center flex-wrap justify-center"
        >
          دسترسی به هزاران رزومه حرفه‌ای
          <i class="icon-cv mx-1 text-4xl"></i>
          ، آماده برای استخدام!
        </h1>
        <div
          class="mt-2 600:mt-5 font-medium text-sm 600:text-2xl px-5 600:px-10 inline-flex items-center flex-wrap justify-center"
        >
          <i class="icon-search ml-3 text-3xl"
            ><span class="path1"></span><span class="path2"></span
            ><span class="path3"></span
          ></i>
          <span>فیلتر کنید، مقایسه کنید، انتخاب کنید </span>
          <span class="mx-1 max-md:hidden">–</span>
          <i class="icon-clever text-3xl"></i>
          <span>سریع و هوشمند</span>
        </div>
        <button class="btn btn-primary mt-20">
          <Icon name="uil:plus" size="25" />
          ایجاد اولین آگهی
        </button>
        <banner class="max-md:hidden px-10" />
        <m-divider2 class="mt-10" />
      </div>
    </div>
    <data-bank />
    <how />
    <View />
    <feedback />
    <support />
    <questions class="bg-[#EBECF1]" />
  </div>
</template>

<script setup lang="ts">
import Banner from "./components/Banner.vue";
import DataBank from "./components/DataBank.vue";
import How from "./components/How.vue";
import View from "./components/View.vue";
import Feedback from "./components/Feedback.vue";
import Support from "./components/Support.vue";
import Questions from "./components/Questions.vue";
</script>
