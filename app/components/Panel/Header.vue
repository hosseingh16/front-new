<template>
  <header
    class="fixed right-0 left-0 z-20 flex h-16 items-center justify-between border-gray-default bg-surface-50 px-4 shadow-sm max-md:border-b-2"
  >
    <div class="flex gap-12">
      <div class="flex gap-2 items-center">
        <!-- <div class="lg:hidden">
          <Icon name="svg:menu" size="20" />
        </div> -->
        <NuxtLink to="/" class="flex items-center">
          <NuxtImg src="/images/logo.png" alt="Logo" class="lg:w-10 lg:h-12" />

          <div class="max-lg:hidden">
            <h1 class="font-semibold text-text-tertiary">های‌حساب</h1>
            <h2 class="text-caption text-text-secondary">
              خانه حسابداران با تجربه
            </h2>
          </div>
        </NuxtLink>
        <div class="flex items-center gap-2 max-lg:hidden mr-8">
          <button
            type="button"
            class="flex items-center justify-center rounded-lg p-1 text-text-passive transition-opacity hover:opacity-80"
            :aria-label="collapsed ? 'باز کردن منو' : 'بستن منو'"
            :aria-pressed="collapsed"
            @click="toggle"
          >
            <Icon name="svg:panel-right" size="16" />
          </button>
          <span class="text-gray-default">|</span>
          <NuxtLink to="/" class="text-sm hover:opacity-80">
            <Icon name="svg:home" size="16" />
          </NuxtLink>
          <span class="text-gray-default">/</span>
          <span class="text-text-muted text-caption">پنل کاربری</span>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <button class="btn btn-ghost w-12 h-12 p-0">
        <Icon name="svg:search-1" size="24" />
      </button>
      <button class="btn btn-ghost w-12 h-12 p-0">
        <Icon name="svg:bell" size="24" />
      </button>
      <m-dropdown>
        <template #btn>
          <button class="btn btn-ghost w-12 h-12 p-0 max-lg:hidden">
            <Avatar class="w-6 h-6" />
          </button>
        </template>
        <template #content>
          <panel-avatar-menu />
        </template>
      </m-dropdown>
      <m-dropdown>
        <template #btn>
          <button
            class="btn btn-ghost-primary text-sm max-lg:w-9 max-lg:h-9 max-lg:p-2"
            tabindex="0"
          >
            <Icon name="svg:plus-blue" size="16" />
            <span class="max-lg:hidden text-text-tertiary">ایجاد کردن</span>
          </button>
        </template>
        <template #content>
          <ul class="min-w-56 p-2">
            <li v-for="item in createMenuItems" :key="item.title">
              <NuxtLink
                :to="item.to"
                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-100"
              >
                <Icon :name="item.icon" size="16" class="text-text-passive" />
                <span>{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </template>
      </m-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
const { collapsed, toggle } = useDashboardSidebar();

const createMenuItems = [
  { title: "آگهی تمام وقت", to: "#", icon: "svg:new-briefcase" },
  { title: "آگهی نیمه وقت", to: "#", icon: "svg:new-briefcase" },
  { title: "پروژه", to: "#", icon: "svg:new-notepad-text" },
];
</script>
