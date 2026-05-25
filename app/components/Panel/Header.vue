<template>
  <header
    class=" fixed right-0 left-0 z-20 h-16 px-4 shadow-sm flex justify-between items-center bg-white max-md:border-b-2 max-md:border-gray-default"
  >
    <div class="flex gap-12">
      <div class="flex gap-2 items-center">
        <!-- <div class="lg:hidden">
          <Icon name="svg:menu" size="20" />
        </div> -->
        <NuxtLink to="/">
          <NuxtImg src="/images/logo.png" alt="Logo" class="lg:w-10 lg:h-12" />
        </NuxtLink>
        <div class="max-lg:hidden">
          <h1 class="font-semibold">های‌حساب</h1>
          <h2 class="text-caption">خانه حسابداران با تجربه</h2>
        </div>
        <div class="flex items-center gap-2 max-lg:hidden mr-8">
          <NuxtLink to="" class="text-sm hover:opacity-80">
            <Icon name="svg:panel-right" size="16" />
          </NuxtLink>
          <span class="text-gray-default">|</span>
          <NuxtLink to="" class="text-sm hover:opacity-80">
            <Icon name="svg:home" size="16" />
          </NuxtLink>
          <span class="text-gray-default">/</span>
          <span class="text-text-muted text-caption">عنوان</span>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <button class="btn btn-ghost w-12 h-12 p-0">
        <Icon name="svg:search-1" size="24" />
      </button>
      <button class="btn btn-ghost w-12 h-12 p-0 max-lg:-mr-3">
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
            <span class="max-lg:hidden">ایجاد کردن</span>
          </button>
        </template>
        <template #content>
          <ul class="space-y-2 p-2 rounded-xl">
            <li>
              <NuxtLink>
                <Icon name="svg:new-briefcase" />
                <span>آگهی تمام وقت</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink>
                <Icon name="svg:new-briefcase" />
                <span>آگهی نیمه وقت</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink>
                <Icon name="svg:new-notepad-text" />
                <span>پروژه</span>
              </NuxtLink>
            </li>
          </ul>
        </template>
      </m-dropdown>
    </div>
  </header>
</template>
