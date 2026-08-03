<template>
  <div dir="rtl" class="flex justify-center items-center min-h-screen relative">
    <NuxtImg
      src="/images/bg-auth-2.png"
      class="max-sm:hidden sm:fixed w-full h-250 z-[1px] absolute top-0 left-0"
    />
    <div class="z-[2px] relative">
      <slot />
    </div>
  </div>
</template>
