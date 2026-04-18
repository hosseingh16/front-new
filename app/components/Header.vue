<template>
  <header
    class="py-4 px-5 min-1130:px-20 shadow-sm flex justify-between items-center"
  >
    <NuxtLink to="/">
      <NuxtImg src="/images/logo.png" alt="Logo" />
    </NuxtLink>
    <nav class="flex items-center gap-6 max-1130:hidden">
      <NuxtLink to="/" class="text-sm hover:opacity-80">خانه</NuxtLink>
      <NuxtLink to="/jobs" class="text-sm hover:opacity-80">فرصت‌های شغلی</NuxtLink>
      <NuxtLink to="/account/sign-in" class="text-sm hover:opacity-80">ورود | ثبت‌نام</NuxtLink>
    </nav>
    <NuxtLink to="/account/sign-in" class="min-1130:hidden">
      <button class="btn btn-sm bg-gray-800 text-gray-100">
        <Icon name="svg:user" />
        ورود
      </button>
    </NuxtLink>
  </header>
</template>
