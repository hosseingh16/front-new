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
          <DashboardStatusAlert
            v-if="welcomeAlert"
            class="mb-5"
            v-bind="welcomeAlert"
            @dismiss="dismissWelcome"
            @action="dismissWelcome"
          />
          <slot />
        </div>
        <panel-bottom-navigation />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppTheme } from "~/composables/useAppTheme";
import DashboardStatusAlert from "~/pages/dashboard/components/DashboardStatusAlert.vue";
import { paths } from "~/routes";

const route = useRoute();
const { fetchMenu, sidebarMenu } = usePanelConfig();
const { collapsed } = useDashboardSidebar();
const { isDark } = useAppTheme();
const { user } = useCurrentUser();
const { userId } = useAccountAuth();
const { isAuthenticated } = useSanctumAuth();
const { needsRoleSelection } = useRoleGate();
const { welcomeAlert, dismissWelcome, initWelcome } = useFirstVisitWelcome();

onMounted(() => {
  initWelcome();
});

watch(
  user,
  (value) => {
    if (value?.id != null) userId.value = String(value.id);
  },
  { immediate: true },
);

if (!isAuthenticated.value) {
  await navigateTo(paths.login, { replace: true });
} else if (!needsRoleSelection.value) {
  await fetchMenu();
} else {
  // Role guard runs in dashboard-auth middleware; this is a safety net only.
  await navigateTo(
    { path: paths.login, query: { step: "5", redirect: route.fullPath } },
    { replace: true },
  );
}
</script>
