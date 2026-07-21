<template>
  <div
    class="fixed bottom-0 z-1000 h-18 w-full border-t-2 border-gray-default bg-surface-50 py-3 lg:hidden"
  >
    <div class="grid grid-cols-5 gap-2">
      <template v-for="(item, index) in menus" :key="item.key ?? index">
        <NuxtLink
          v-if="!item.center"
          :to="item.to"
          class="flex flex-col items-center"
          :target="isOutsideDashboard(item.to) ? '_blank' : undefined"
          :rel="isOutsideDashboard(item.to) ? 'noopener noreferrer' : undefined"
          @click="closeMenu"
        >
          <Icon
            :name="`svg:${item.icon}`"
            size="24"
            :class="
              isActive(item.to) ? 'text-primary-500' : 'text-text-secondary'
            "
          />
          <span
            class="text-[11px]"
            :class="
              isActive(item.to) ? 'text-primary-500' : 'text-text-secondary'
            "
          >
            {{ item.title }}
          </span>
        </NuxtLink>

        <NuxtLink
          v-else
          :to="item.to"
          class="flex justify-center"
          aria-label="پیشخوان"
          :target="isOutsideDashboard(item.to) ? '_blank' : undefined"
          :rel="isOutsideDashboard(item.to) ? 'noopener noreferrer' : undefined"
          @click="closeMenu"
        >
          <div
            class="-mt-8 flex h-12 w-12 items-center justify-center rounded-full"
            :class="
              isActive(item.to)
                ? 'bg-primary-500 text-white'
                : 'bg-primary-100 '
            "
          >
            <Icon name="lucide:gauge" />
          </div>
        </NuxtLink>
      </template>

      <button
        type="button"
        class="flex flex-col items-center"
        @click="showMenuFunc"
      >
        <Icon :name="`svg:${showMenu ? 'menu-opened' : 'menu'}`" size="24" />
        <span
          class="text-[11px]"
          :class="showMenu ? 'text-primary-500' : 'text-text-secondary'"
        >
          منو
        </span>
      </button>

      <div
        v-if="showMenu"
        class="fixed top-16.5 right-0 bottom-40 left-0 bg-surface-50"
      >
        <panel-avatar-menu />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const menus: Array<{
  key: string;
  title: string;
  to: string;
  icon: string;
  center?: boolean;
}> = [
  {
    key: "ads",
    title: "آگهی‌ها",
    to: "/dashboard/employer/ads",
    icon: "bag-1",
  },
  {
    key: "projects",
    title: "پروژه‌ها",
    to: "/projects",
    icon: "projects",
  },
  {
    key: "dashboard",
    title: "",
    to: "/dashboard",
    icon: "lucide:home",
    center: true,
  },
  {
    key: "jobs",
    title: "فرصت‌ها",
    to: "/jobs",
    icon: "jobs",
  },
];

const showMenu = useState("showBottomMenu_state", () => false);
const expandedCvCompletion = useState(
  "expandedCvCompletion_state",
  () => false,
);

function isOutsideDashboard(to: string) {
  return !to.startsWith("/dashboard");
}

function isActive(to: string) {
  if (isOutsideDashboard(to)) return false;
  if (to === "/dashboard") {
    return route.path === "/dashboard";
  }
  return route.path === to || route.path.startsWith(`${to}/`);
}

function closeMenu() {
  showMenu.value = false;
}

function showMenuFunc() {
  showMenu.value = !showMenu.value;
  expandedCvCompletion.value = false;
}

watch(
  () => route.fullPath,
  () => {
    closeMenu();
  },
);
</script>
