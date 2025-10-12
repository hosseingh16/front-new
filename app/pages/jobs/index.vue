<template>
  <div class="py-8 bg-gray-soft">
    <p class="text-center md:text-xl font-yb-bold">
      در فرصت های شغلی حسابداری جست و جو کنید
    </p>
    <div class="mt-8 py-4 bg-[#10b9810d]">
      <div class="bg-[#10b981] h-1 mx-28 rounded-t-xl"></div>
      <div class="py-4 bg-white px-4 lg:px-28">
        <div
          class="grid grid-cols-2 lg:grid-cols-4 gap-2 max-lg:border lg:border-b border-gray-200 lg:border-gray-300 lg:pb-4 max-lg:rounded-lg max-lg:px-4 max-lg:py-2"
        >
          <div class="flex items-center border-l-2 border-gray-300">
            <icons-search />
            <input
              type="text"
              placeholder="کلید واژه (عنوان شغلی و ...)"
              class="text-gray-700 text-14 font-semibold input border-0 outline-0 shadow-none focus:outline-0 focus:shadow-none placeholder:text-gray-600 placeholder:lg:text-gray-700 placeholder:text-xs placeholder:md:text-14 placeholder:lg:font-semibold"
            />
          </div>
          <div class="flex items-center border-l-2 border-gray-300 max-lg:hidden">
            <Icon name="svg:user-search-3" size="16" />
            <m-select
              label="انتخاب عنوان شغلی"
              no-border
              :options="['حسابدار مالی', 'حسابدار خزانه']"
            />
          </div>
          <div class="flex items-center">
            <Icon name="svg:location" size="16" />
            <m-select label="همه شهرها" no-border :options="['تهران', 'شیراز']" />
          </div>
          <div class="max-lg:hidden text-left">
            <button class="btn btn-primary">
              <icons-search color="white" />
              جستجو در مشاغل
            </button>
          </div>
        </div>
        <div class="gap-2 py-4 overflow-x-auto">
          <filters />
        </div>
      </div>
    </div>

    <div
      class="mt-8 px-6 lg:px-28 flex flex-wrap items-center max-md:justify-between gap-x-8 gap-y-2"
    >
      <p class="text-14 font-semibold text-gray-800">
        مشاغل پیشنهادی:
        <span class="font-normal max-md:text-[rgba(255,150,67,1)]">41,245</span>
      </p>
      <div class="flex gap-1 items-center">
        <p class="max-md:hidden text-14 font-semibold text-gray-800">
          مرتب سازی بر اساس:
        </p>
        <m-select2 v-model="sort" :options="['جدیدترین', 'بیشترین حقوق']" />
      </div>
    </div>

    <div class="mt-4 px-6 lg:px-28 lg:grid lg:grid-cols-12 gap-8">
      <div class="lg:col-span-5">
        <div class="grid gap-4">
          <job-box v-for="n in 7" @click="showJob = true" />
        </div>
      </div>
      <transition name="fade" mode="out-in">
        <div class="col-span-7">
          <div v-if="!showJob" class="max-lg:hidden">
            <div
              class="border border-[rgba(200,205,212,1)] px-2 py-24 rounded-lg flex flex-col justify-center items-center text-[rgba(27,33,60,1)]"
            >
              <Icon name="svg:jobs-1" size="114" />
              <p class="font-yb-extraBold text-2xl mt-4">
                هنوز پروفایل حسابداری خودت رو نساختی؟
              </p>
              <p class="font-semibold mt-2">به جمع حسابدارها بپیوندید</p>
              <button class="btn bg-[rgba(47,50,65,1)] text-white h-10 px-12 mt-2">
                <Icon name="svg:login" />
                <span>ورود | ثبت‌نام</span>
              </button>
            </div>
          </div>
          <selected-job v-else />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import Filters from './components/Filters.vue';
import SelectedJob from './components/SelectedJob.vue';

// Variables
const sort = ref('جدیدترین');
const showJob = ref(false);
</script>
