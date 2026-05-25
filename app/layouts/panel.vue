<template>
  <div dir="rtl">
    <div>
      <div
        class="bg-surface-50 flex flex-col justify-between fixed inset-0 max-w-384 w-full m-auto"
      >
        <panel-header />
        <panel-sidebar />
        <div class="no-scrollbar flex-1 overflow-y-auto max-lg:pb-28 pl-4 pr-4 lg:pr-76 py-6">
          <slot />
        </div>
        <panel-bottom-navigation />
      </div>
    </div>
  </div>
</template>
