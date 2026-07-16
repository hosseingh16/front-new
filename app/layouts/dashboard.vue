<template>
  <div dir="rtl">
    <div class="min-h-screen">
      <div
        class="bg-surface-50 flex flex-col justify-between max-w-384 w-full m-auto"
      >
        <panel-header />
        <panel-sidebar :sidebar-menu="sidebarMenu" />
        <div
          class="min-h-screen no-scrollbar mt-16 flex-1 max-lg:pb-28 pl-4 pr-4 lg:pr-76 py-6 md-h-full"
        >
          <slot />
        </div>
        <panel-bottom-navigation />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetchMenu, sidebarMenu } = usePanelConfig();
await fetchMenu();
</script>
