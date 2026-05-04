<template>
  <header
    class="py-4 px-5 shadow-sm flex justify-between items-center bg-surface-50 max-md:border-b-2 max-md:border-gray-default"
  >
    <div class="flex gap-12">
      <div class="flex gap-2 items-center">
        <icon name="svg:menu" size="20" class="lg:hidden" />
        <NuxtLink to="/">
          <NuxtImg src="/images/logo.png" alt="Logo" class="lg:w-10 lg:h-12" />
        </NuxtLink>
        <div class="max-lg:hidden">
          <h1 class="font-semibold">های‌حساب</h1>
          <h2 class="text-caption">خانه حسابداران با تجربه</h2>
        </div>
      </div>
      <div class="flex items-center gap-12 max-lg:hidden">
        <NuxtLink to="/" class="text-sm hover:opacity-80">خانه</NuxtLink>
        <NuxtLink to="/" class="text-sm hover:opacity-80">کارفرمایان</NuxtLink>
        <NuxtLink to="/" class="text-sm hover:opacity-80"
          >فرصت‌های شغلی</NuxtLink
        >
        <NuxtLink to="/" class="flex text-sm hover:opacity-80"
          >رزومه‌های شغلی
          <icons-chevron />
        </NuxtLink>
      </div>
    </div>
    <div class="flex items-center gap-1">
      <button class="btn border-none">
        <icons-search2 color="#4A4A4A" />
      </button>
      <NuxtLink to="/account/sign-in">
        <button class="btn btn-primary">
          <Icon name="svg:user-plus-white" size="24" />
          ورود | ثبت نام
        </button>
      </NuxtLink>
    </div>
  </header>
</template>
