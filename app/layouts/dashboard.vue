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

    <!-- Logged in but no role → forced role picker -->
    <dialog
      ref="roleDialogRef"
      class="modal"
      @cancel.prevent
    >
      <div
        class="modal-box max-w-[min(100vw-1rem,1100px)] w-full bg-transparent shadow-none overflow-visible p-2"
      >
        <SignUp3
          :step="5"
          forced
          @selected="onRoleSelected"
        />
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import SignUp3 from "~/features/account/components/SignUp3.vue";
import type { AccountRole } from "~/features/account/types";
import { useAppTheme } from "~/composables/useAppTheme";
import { paths } from "~/routes";

const { fetchMenu, sidebarMenu } = usePanelConfig();
const { collapsed } = useDashboardSidebar();
const { isDark } = useAppTheme();
const { user } = useCurrentUser();
const { userId } = useAccountAuth();
const { isAuthenticated } = useSanctumAuth();

const roleDialogRef = ref<HTMLDialogElement | null>(null);
const needsRoleGate = ref(false);

watch(
  user,
  (value) => {
    if (value?.id != null) userId.value = String(value.id);
  },
  { immediate: true },
);

// Guests are redirected by dashboard-auth middleware; layout only handles no-role case.
if (!isAuthenticated.value) {
  await navigateTo(paths.login, { replace: true });
} else {
  const bootstrapped = await fetchMenu();
  if (!bootstrapped) {
    needsRoleGate.value = true;
  }
}

onMounted(() => {
  if (!needsRoleGate.value) return;
  nextTick(() => roleDialogRef.value?.showModal());
});

async function onRoleSelected(role: AccountRole) {
  roleDialogRef.value?.close();
  needsRoleGate.value = false;

  const ok = await fetchMenu();
  if (!ok) {
    needsRoleGate.value = true;
    nextTick(() => roleDialogRef.value?.showModal());
    return;
  }

  if (role === "job_seeker") {
    await navigateTo(paths.jobs.root);
  }
}
</script>
