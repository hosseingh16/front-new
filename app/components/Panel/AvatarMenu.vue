<template>
  <div class="bg-surface-100 max-lg:p-1 max-lg:h-[110%] max-lg:overflow-scroll">
    <div class="rounded-lg bg-white p-6 flex flex-col items-center gap-y-3">
      <Avatar class="w-20 h-20" />
      <span class="font-semibold">آرمان علیمرادی</span>
      <button class="flex items-center">
        <Icon name="svg:settings" />
        <span class="text-text-passive text-sm font-normal">تنظیمات</span>
      </button>
    </div>
    <div class="rounded-lg px-3 lg:p-0 py-3 mt-1 bg-white">
      <ul class="space-y-4">
        <li v-for="item in menus1">
          <NuxtLink
            :to="item.to"
            class="flex"
            :class="item.children ? 'justify-between items-center' : 'justify-start'"
          >
            <div class="flex justify-start items-center">
              <Icon :name="`svg:${item.icon}`" />
              <span class="text-text-secondary mr-1 font-normal text-sm">{{
                item.title
              }}</span>
            </div>
            <icons-chevron v-if="item.children" class="rotate-90" />
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div class="rounded-lg px-3 lg:p-0 py-3 mt-1 bg-white">
      <ul class="space-y-4">
        <li v-for="item in menus2">
          <NuxtLink :to="item.to">
            <div class="flex justify-start">
              <Icon :name="`svg:${item.icon}`" />
              <span class="text-text-secondary mr-1 font-normal text-sm">{{
                item.title
              }}</span>
            </div>
          </NuxtLink>
        </li>
        <li>
          <div class="flex justify-start">
            <Icon name="svg:log-out" />
            <span class="text-danger-500 mr-1 font-normal text-sm">
              خروج از حساب کاربری
            </span>
          </div>
        </li>
      </ul>
      <div class="lg:pb-2 max-lg:mt-5">
        <panel-theme-settings theme="light"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Variables
const menus1 = [
  { title: 'پیشخوان', to: '#', icon: 'gauge-1' },
  { title: 'فرصت‌های شغلی', to: '#', icon: 'jobs-2' },
  { title: 'پروفایل‌های شغلی', to: '#', icon: 'search-briefcase', children: [] },
  { title: 'آگهی‌ها', to: '#', icon: 'bag-3', children: [] },
  { title: 'پروژه‌ها', to: '#', icon: 'projects-1', children: [] },
  { title: 'مشاوره‌ها', to: '#', icon: 'users-1', children: [] },
];

const menus2 = [
  { title: 'نشان شده‌ها', to: '#', icon: 'bookmark-1' },
  { title: 'رزومه من', to: '#', icon: 'work-history' },
  { title: 'پروفایل سازمان', to: '#', icon: 'buildings-5' },
];

const theme = ref<'system' | 'light' | 'dark'>('light');
</script>
