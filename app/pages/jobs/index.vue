<template>
  <div class="py-8 bg-gray-soft">
    <p class="text-center text-xl font-bold">در فرصت های شغلی حسابداری جست و جو کنید</p>
    <div class="mt-8 py-4 bg-[#10b9810d]">
      <div class="bg-[#10b981] h-1 mx-28 rounded-t-xl"></div>
      <div class="py-4 bg-white px-28">
        <div class="grid grid-cols-4 gap-2 border-b-1 border-gray-300 pb-4">
          <div class="flex items-center border-l-1 border-gray-300">
            <icons-search />
            <input
              type="text"
              placeholder="کلید واژه (عنوان شغلی و ...)"
              class="text-gray-500 text-[16px] input border-0 outline-0 shadow-none focus:outline-0 focus:shadow-none placeholder:text-gray-500 placeholder:text-[16px]"
            />
          </div>
          <div class="flex items-center border-l-1 border-gray-300">
            <Icon name="svg:user-search-3" size="16" />
            <m-select
              placeholder="انتخاب عنوان شغلی"
              class="w-full"
              no-border
              :options="[
                { title: 'مسیر1', value: 1 },
                { title: 'مسیر2', value: 2 },
                { title: 'مسیر3', value: 3 },
              ]"
            />
          </div>
          <div class="flex items-center">
            <Icon name="svg:location" size="16" />
            <m-select
              placeholder="همه شهرها"
              class="w-full"
              no-border
              :options="[
                { title: 'تهران', value: 1 },
                { title: 'شیراز', value: 2 },
              ]"
            />
          </div>
          <div class="text-left">
            <button class="btn btn-primary w-[200px]">
              <icons-search color="white" />
              جستجو در مشاغل
            </button>
          </div>
        </div>
        <div class="gap-2 pt-4">
          <Filters />
        </div>
      </div>
    </div>
    <div class="h-[400px]"></div>
  </div>
</template>

<script setup lang="ts">
import Filters from './components/Filters.vue';
</script>
