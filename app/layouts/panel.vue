<template>
  <div dir="rtl">
    <div class="bg-surface-50 flex flex-col justify-between fixed inset-0">
      <div class="flex-1 overflow-y-auto">
        <panel-header />
        <div class="flex max-lg:pb-28">
          <panel-sidebar />
          <div class="px-4 py-6 w-full">
            <slot />
          </div>
        </div>
      </div>
      <panel-bottom-navigation />
    </div>
  </div>
</template>
