<template>
  <div dir="rtl">
    <div class="bg-surface-50">
      <panel-header />
      <div class="flex max-lg:pb-28">
        <div
          class="p-5 bg-white w-62 border-l-2 border-t-2 border-gray-default h-125 max-lg:hidden"
        ></div>
        <div class="px-4 py-6 w-full">
          <slot />
        </div>
      </div>
      <panel-bottom-navigation />
    </div>
  </div>
</template>
