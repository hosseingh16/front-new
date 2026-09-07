<template>
  <header
    class="py-4 px-5 flex justify-between items-center bg-transparent max-md:border-b-2 max-md:border-gray-default"
  >
    <div class="flex gap-12">
      <div class="flex gap-2 items-center">
        <button
          type="button"
          class="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary"
          aria-label="باز کردن منو"
          :aria-expanded="isDrawerOpen"
          @click="openDrawer"
        >
          <Icon name="svg:menu" size="20" />
        </button>
        <NuxtLink to="/" class="flex items-center">
          <NuxtImg src="/images/logo.png" alt="Logo" class="lg:w-10 lg:h-12" />

          <div class="max-lg:hidden">
            <div class="font-semibold text-text-tertiary">های‌حساب</div>
            <div class="text-caption text-text-secondary">
              خانه حسابداران با تجربه
            </div>
          </div>
        </NuxtLink>
      </div>
      <div class="flex items-center gap-12 max-lg:hidden">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm hover:opacity-80"
        >
          {{ link.label }}
        </NuxtLink>
        <!-- #future
        <NuxtLink to="/companies" class="text-sm hover:opacity-80"
          >شرکت‌ها</NuxtLink
        >
        <NuxtLink to="/" class="flex text-sm hover:opacity-80"
          >رزومه‌های شغلی
          <icons-chevron />
        </NuxtLink>
        -->
      </div>
    </div>
    <div class="flex items-center gap-1">
      <!-- #future
      <button class="btn border-none">
        <icons-search2 color="#4A4A4A" />
      </button>
      -->

      <NuxtLink v-if="canAccessDashboard" to="/dashboard">
        <button class="btn btn-primary">
          <Icon name="lucide:home" size="16" />
          پیشخوان
        </button>
      </NuxtLink>

      <NuxtLink
        v-else-if="needsRoleSelection"
        :to="{ path: '/login', query: { step: '5' } }"
      >
        <button class="btn btn-primary">
          <Icon name="svg:user-plus-white" size="16" />
          تکمیل ثبت‌نام
        </button>
      </NuxtLink>

      <NuxtLink v-else to="/login">
        <button class="btn btn-primary">
          <Icon name="svg:user-plus-white" size="16" />
          ورود | ثبت نام
        </button>
      </NuxtLink>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="header-drawer">
      <div
        v-if="isDrawerOpen"
        class="fixed inset-0 z-100 lg:hidden"
        dir="rtl"
        @keydown.escape="closeDrawer"
      >
        <div
          class="modal-backdrop header-drawer-backdrop absolute inset-0"
          @click="closeDrawer"
        />
        <aside
          class="header-drawer-panel absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-surface-50 shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-label="منوی اصلی"
        >
          <div
            class="flex items-center justify-between border-b border-gray-default px-4 py-4"
          >
            <div class="flex items-center gap-2">
              <NuxtImg src="/images/logo.png" alt="" class="h-10 w-8" />
              <div>
                <p class="font-semibold text-sm">های‌حساب</p>
                <p class="text-caption text-text-passive">
                  خانه حسابداران با تجربه
                </p>
              </div>
            </div>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary"
              aria-label="بستن منو"
              @click="closeDrawer"
            >
              <Icon name="svg:close" size="20" />
            </button>
          </div>

          <nav class="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="rounded-lg px-3 py-3 text-sm font-semibold transition-colors"
              :class="
                isActive(link.to)
                  ? 'bg-primary-50 text-primary-500'
                  : 'text-text-tertiary hover:bg-surface-100'
              "
              @click="closeDrawer"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { resolvePrimaryRole } from "~/utils/user-role";

const route = useRoute();
const { isAuthenticated } = useSanctumAuth();
const { user } = useCurrentUser();
const { needsRoleSelection } = useRoleGate();

const navLinks = [
  { label: "خانه", to: "/" },
  { label: "کارفرمایان", to: "/employers" },
  { label: "فرصت‌های شغلی", to: "/jobs" },
] as const;

const isDrawerOpen = ref(false);

const canAccessDashboard = computed(
  () => isAuthenticated.value && resolvePrimaryRole(user.value) !== null,
);

function isActive(to: string) {
  if (to === "/") return route.path === "/";
  return route.path === to || route.path.startsWith(`${to}/`);
}

function openDrawer() {
  isDrawerOpen.value = true;
}

function closeDrawer() {
  isDrawerOpen.value = false;
}

function setBodyScrollLock(lock: boolean) {
  if (!import.meta.client) return;
  document.body.style.overflow = lock ? "hidden" : "";
}

watch(isDrawerOpen, (open) => {
  setBodyScrollLock(open);
});

watch(
  () => route.fullPath,
  () => {
    closeDrawer();
  },
);

onUnmounted(() => {
  setBodyScrollLock(false);
});
</script>
