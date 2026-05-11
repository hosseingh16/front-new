<template>
  <div
    class="h-screen py-5 bg-white w-72 border-l-2 border-t-2 border-gray-default flex flex-col justify-between max-lg:hidden [&_button]:text-sm [&_button]:font-normal"
  >
    <div class="flex flex-col gap-y-2">
      <NuxtLink to="#" v-for="item in menus1">
        <button
          class="btn btn-block btn-ghost flex"
          :class="item.children ? 'justify-between items-center' : 'justify-start'"
        >
          <div class="flex justify-start items-center">
            <Icon :name="`svg:${item.icon}`" />
            <span class="text-text-secondary mr-2">{{ item.title }}</span>
          </div>
          <icons-chevron v-if="item.children" />
        </button>
      </NuxtLink>
    </div>
    <div class="flex flex-col gap-y-2">
      <div class="border-b border-gray-default pb-4">
        <NuxtLink v-for="item in menus2" :to="item.to">
          <button class="btn btn-block btn-ghost flex justify-start">
            <Icon :name="`svg:${item.icon}`" />
            <span class="text-text-secondary">{{ item.title }}</span>
          </button>
        </NuxtLink>
      </div>
      <div class="flex gap-2 pt-3 px-4">
        <Avatar />
        <div class="flex flex-col gap-3">
          <span class="font-semibold">آرمان علیمرادی</span>
          <button class="flex items-center">
            <Icon name="svg:settings" />
            <span class="text-text-passive text-sm font-normal">تنظیمات</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Variables
const menus1 = [
  { title: 'پیشخوان', to: '#', icon: 'gauge-1' },
  { title: 'رزومه‌های شغلی', to: '#', icon: 'search-briefcase', children: [] },
  { title: 'آگهی‌ها', to: '#', icon: 'bag-3', children: [] },
];
const menus2 = [
  { title: 'نشان شده‌ها', to: '#', icon: 'bookmark-1' },
  { title: 'رزومه من', to: '#', icon: 'work-history' },
  { title: 'رزومه سازمان', to: '#', icon: 'buildings-5' },
];
</script>
