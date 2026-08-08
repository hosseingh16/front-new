<template>
  <div dir="rtl" :class="{ dark: isDark }">
    <div class="min-h-screen bg-surface-50">
      <div
        class="bg-surface-50 flex flex-col justify-between max-w-384 w-full m-auto"
      >
        <panel-header />
        <panel-sidebar :sidebar-menu="sidebarMenu" />
        <div
          class="min-h-screen no-scrollbar mt-16 flex-1 max-lg:pb-28 pl-4 pr-4 py-6 md-h-full transition-[padding] duration-300"
          :class="collapsed ? 'lg:pr-4' : 'lg:pr-76'"
        >
          <slot />
        </div>
        <panel-bottom-navigation />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppTheme } from "~/composables/useAppTheme";
import { paths } from "~/routes";

const { fetchMenu, sidebarMenu } = usePanelConfig();
const { collapsed } = useDashboardSidebar();
const { isDark } = useAppTheme();
const { user } = useCurrentUser();
const { userId } = useAccountAuth();
const { isAuthenticated } = useSanctumAuth();

watch(
  user,
  (value) => {
    if (value?.id != null) userId.value = String(value.id);
  },
  { immediate: true },
);

if (!isAuthenticated.value) {
  await navigateTo(paths.login, { replace: true });
} else {
  await fetchMenu();
}
</script>
