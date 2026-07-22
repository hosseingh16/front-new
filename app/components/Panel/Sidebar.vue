<template>
  <aside
    class="fixed top-0 right-0 flex h-full w-72 flex-col border-l-2 border-t-2 border-gray-default bg-base-100 px-4 py-5 transition-transform duration-300 max-lg:hidden [&_button]:text-sm [&_button]:font-normal"
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
        <div class="flex flex-col gap-1">
          <span class="font-semibold text-text-tertiary">{{ userName }}</span>
          <button class="flex items-center">
            <!-- <Icon name="svg:settings" /> -->
            <span class="text-sm font-normal text-text-passive">{{
              cellphone
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { MenuItem } from "~/types/panel-config";
import { useCurrentUser } from "~/composables/useCurrentUser";
import SidebarMenuItem from "./SidebarMenuItem.vue";

const props = defineProps<{
  sidebarMenu: MenuItem[];
}>();

const route = useRoute();
const openKey = ref<string | null>(null);
const { collapsed } = useDashboardSidebar();
const { name: userName, cellphone } = useCurrentUser();

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

function findOpenKeyForPath(path: string) {
  for (const [index, item] of topMenu.value.entries()) {
    if (!item.children?.length) continue;
    const childActive = item.children.some(
      (child) =>
        child.to && (path === child.to || path.startsWith(`${child.to}/`)),
    );
    if (childActive) return itemKey(item, "top", index);
  }

  for (const [index, item] of bottomMenu.value.entries()) {
    if (!item.children?.length) continue;
    const childActive = item.children.some(
      (child) =>
        child.to && (path === child.to || path.startsWith(`${child.to}/`)),
    );
    if (childActive) return itemKey(item, "bottom", index);
  }

  return null;
}

watch(
  [() => route.path, topMenu, bottomMenu],
  () => {
    openKey.value = findOpenKeyForPath(route.path);
  },
  { immediate: true },
);
</script>
