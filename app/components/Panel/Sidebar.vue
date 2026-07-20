<template>
  <aside
    class="fixed top-0 right-0 flex h-full w-72 flex-col border-l-2 border-t-2 border-gray-default bg-white py-5 max-lg:hidden [&_button]:text-sm [&_button]:font-normal px-4 transition-transform duration-300"
    :class="collapsed ? 'translate-x-full' : 'translate-x-0'"
  >
    <div class="flex min-h-0 flex-1 flex-col pt-16">
      <div class="flex flex-col gap-y-2 overflow-y-auto">
        <SidebarMenuItem
          v-for="(item, index) in topMenu"
          :key="item.key ?? `top-${index}`"
          :item="item"
          :active-path="route.path"
          :open="openKey === itemKey(item, 'top', index)"
          @toggle="toggleOpen(itemKey(item, 'top', index))"
        />
      </div>

      <div v-if="bottomMenu.length" class="mt-auto flex flex-col gap-y-2 py-4">
        <SidebarMenuItem
          v-for="(item, index) in bottomMenu"
          :key="item.key ?? `bottom-${index}`"
          :item="item"
          :active-path="route.path"
          :open="openKey === itemKey(item, 'bottom', index)"
          @toggle="toggleOpen(itemKey(item, 'bottom', index))"
        />
      </div>
    </div>

    <div class="flex flex-col gap-y-2 border-t border-gray-default">
      <div class="flex gap-2 px-4 pt-3">
        <Avatar />
        <div class="flex flex-col gap-3">
          <span class="font-semibold">آرمان علیمرادی</span>
          <button class="flex items-center">
            <Icon name="svg:settings" />
            <span class="text-sm font-normal text-text-passive">تنظیمات</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { MenuItem } from "~/types/panel-config";
import SidebarMenuItem from "./SidebarMenuItem.vue";

const props = defineProps<{
  sidebarMenu: MenuItem[];
}>();

const route = useRoute();
const openKey = ref<string | null>(null);
const { collapsed } = useDashboardSidebar();

const topMenu = computed(() =>
  props.sidebarMenu.filter((item) => item.placement !== "bottom"),
);

const bottomMenu = computed(() =>
  props.sidebarMenu.filter((item) => item.placement === "bottom"),
);

function itemKey(item: MenuItem, group: "top" | "bottom", index: number) {
  return item.key ?? `${group}-${index}`;
}

function toggleOpen(key: string) {
  openKey.value = openKey.value === key ? null : key;
}

watch(
  topMenu,
  (items) => {
    const firstWithChildren = items.find((item) => item.children?.length);
    if (firstWithChildren) {
      openKey.value = itemKey(
        firstWithChildren,
        "top",
        items.indexOf(firstWithChildren),
      );
    }
  },
  { immediate: true },
);
</script>
