<template>
  <header
    class="py-4 px-4 shadow-sm flex justify-between items-center bg-white max-md:border-b-2 max-md:border-gray-default"
  >
    <div class="flex gap-12">
      <div class="flex gap-2 items-center">
        <div class="lg:hidden">
          <Icon name="svg:menu" size="20" />
        </div>
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
  </header>
</template>
