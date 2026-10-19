<template>
  <header
    class="sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300"
    :class="
      isScrolled
        ? 'border-b border-gray-default/80 bg-white/95 shadow-[0_4px_20px_rgba(15,23,42,0.06)] backdrop-blur-md'
        : 'border-b border-transparent bg-transparent max-md:border-b-2 max-md:border-gray-default'
    "
  >
    <div
      class="custom-pad mx-auto flex max-w-384 items-center justify-between px-5 py-4"
    >
      <div class="flex gap-12">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary lg:hidden"
            aria-label="باز کردن منو"
            :aria-expanded="isDrawerOpen"
            @click="openDrawer"
          >
            <Icon name="svg:menu" size="20" />
          </button>
          <NuxtLink to="/" class="flex items-center">
            <NuxtImg
              src="/images/logo.png"
              alt="Logo"
              class="lg:h-12 lg:w-10"
            />

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
            :target="link.blank ? '_blank' : undefined"
            :rel="link.blank ? 'noopener noreferrer' : undefined"
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
              :target="link.blank ? '_blank' : undefined"
              :rel="link.blank ? 'noopener noreferrer' : undefined"
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

const SCROLL_THRESHOLD = 12;

const route = useRoute();
const { isAuthenticated } = useSanctumAuth();
const { user } = useCurrentUser();
const { needsRoleSelection } = useRoleGate();

const navLinks = [
  { label: "خانه", to: "/", blank: false },
  { label: "کارفرمایان", to: "/employers", blank: false },
  { label: "فرصت‌های شغلی", to: "/jobs", blank: false },
  { label: "مقالات", to: "/blog", blank: true },
] as const;

const isDrawerOpen = ref(false);
const isScrolled = ref(false);

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

function getScrollTop() {
  if (!import.meta.client) return 0;
  return Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
  );
}

function updateScrolledState() {
  isScrolled.value = getScrollTop() > SCROLL_THRESHOLD;
}

watch(isDrawerOpen, (open) => {
  setBodyScrollLock(open);
});

watch(
  () => route.fullPath,
  () => {
    closeDrawer();
    nextTick(updateScrolledState);
  },
);

onMounted(() => {
  nextTick(updateScrolledState);
  window.addEventListener("scroll", updateScrolledState, { passive: true });
  document.addEventListener("scroll", updateScrolledState, {
    passive: true,
    capture: true,
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateScrolledState);
  document.removeEventListener("scroll", updateScrolledState, true);
});

onUnmounted(() => {
  setBodyScrollLock(false);
});
</script>
