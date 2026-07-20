<template>
  <div class="bg-surface-100 max-lg:h-[110%] max-lg:overflow-scroll max-lg:p-1">
    <div
      class="flex flex-col items-center gap-y-3 rounded-lg bg-surface-50 p-6"
    >
      <Avatar class="w-20 h-20" />
      <span class="font-semibold text-text-tertiary">آرمان علیمرادی</span>
      <button class="flex items-center">
        <Icon name="svg:settings" />
        <span class="text-text-passive text-sm font-normal">تنظیمات</span>
      </button>
    </div>

    <div
      class="mt-1 bg-surface-50 px-3 py-3 hover:rounded-none lg:p-0 [&_button]:text-sm [&_button]:font-normal"
    >
      <div class="flex flex-col gap-y-2">
        <NuxtLink
          v-for="item in menus1"
          :key="item.title"
          class="flex"
          :to="item.children ? '' : item.to"
        >
          <button
            type="button"
            class="btn btn-block btn-ghost flex hover:rounded-none"
            :class="[
              item.children ? 'items-center justify-between' : 'justify-start',
              { 'bg-primary-50': route.path === item.to },
              route.path !== item.to
                ? 'hover:bg-gray-100 dark:hover:bg-surface-200'
                : 'hover:bg-primary-50',
            ]"
          >
            <div class="flex items-center justify-start">
              <Icon
                :name="`svg:${item.icon}`"
                class="text-text-passive"
                size="16"
              />
              <span class="mr-2 text-text-secondary">{{ item.title }}</span>
            </div>
            <icons-chevron v-if="item.children" />
          </button>
        </NuxtLink>
      </div>
    </div>

    <div
      class="mt-1 bg-surface-50 px-3 py-3 hover:rounded-none lg:p-0 [&_button]:text-sm [&_button]:font-normal"
    >
      <div class="flex flex-col gap-y-2">
        <NuxtLink
          v-for="item in menus2"
          :key="item.title"
          class="flex"
          :to="item.to"
        >
          <button
            type="button"
            class="btn btn-block btn-ghost flex justify-start hover:rounded-none"
            :class="[
              { 'bg-primary-50': route.path === item.to },
              route.path !== item.to
                ? 'hover:bg-gray-100 dark:hover:bg-surface-200'
                : 'hover:bg-primary-50',
            ]"
          >
            <div class="flex items-center justify-start">
              <Icon
                :name="`svg:${item.icon}`"
                class="text-text-passive"
                size="16"
              />
              <span class="mr-2 text-text-secondary">{{ item.title }}</span>
            </div>
          </button>
        </NuxtLink>

        <button
          type="button"
          class="btn btn-block btn-ghost flex justify-start hover:bg-gray-100 dark:hover:bg-surface-200"
        >
          <div class="flex items-center justify-start">
            <Icon name="svg:log-out" class="text-danger-500" size="16" />
            <span class="mr-2 font-normal text-danger-500">
              خروج از حساب کاربری
            </span>
          </div>
        </button>
      </div>

      <div class="lg:pb-2 max-lg:mt-5">
        <panel-theme-settings />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const menus1 = [
  { title: "پیشخوان", to: "/dashboard", icon: "gauge-1" },
  { title: "فرصت‌های شغلی", to: "#", icon: "jobs-2" },
  {
    title: "پروفایل‌های شغلی",
    to: "#",
    icon: "search-briefcase",
    children: [],
  },
  {
    title: "آگهی‌ها",
    to: "/dashboard/employer/ads",
    icon: "bag-3",
    children: [],
  },
  // { title: "پروژه‌ها", to: "#", icon: "projects-1", children: [] },
  // { title: "مشاوره‌ها", to: "#", icon: "users-1", children: [] },
];

const menus2 = [
  { title: "نشان شده‌ها", to: "/dashboard/bookmarks", icon: "bookmark-1" },
  { title: "رزومه من", to: "#", icon: "work-history" },
  {
    title: "پروفایل سازمان",
    to: "/dashboard/employer/company",
    icon: "buildings-5",
  },
];
</script>
