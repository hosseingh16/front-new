<template>
  <aside
    class="fixed top-0 right-0 flex h-full w-72 flex-col border-l-2 border-t-2 border-gray-default bg-base-100 px-4 py-5 transition-transform duration-300 max-lg:hidden [&_button]:text-sm [&_button]:font-normal"
    :class="collapsed ? 'translate-x-full' : 'translate-x-0'"
  >
    <div class="flex min-h-0 flex-1 flex-col pt-16">
      <div class="flex flex-col gap-y-2 overflow-y-auto">
        <SidebarMenuItem
          v-for="(item, index) in sidebarMenu"
          :key="item.key ?? `menu-${index}`"
          :item="item"
          :active-path="route.path"
          :open="openKey === itemKey(item, index)"
          @toggle="toggleOpen(itemKey(item, index))"
        />
      </div>
    </div>

    <div class="flex flex-col gap-y-2 border-t border-gray-default">
      <div class="flex gap-2 px-4 pt-3">
        <Avatar class="h-10 w-10" />
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

function itemKey(item: MenuItem, index: number) {
  return item.key ?? `menu-${index}`;
}

function toggleOpen(key: string) {
  openKey.value = openKey.value === key ? null : key;
}

function findOpenKeyForPath(path: string) {
  for (const [index, item] of props.sidebarMenu.entries()) {
    if (!item.children?.length) continue;
    const childActive = item.children.some(
      (child) =>
        child.to && (path === child.to || path.startsWith(`${child.to}/`)),
    );
    if (childActive) return itemKey(item, index);
  }

  return null;
}

watch(
  [() => route.path, () => props.sidebarMenu],
  () => {
    openKey.value = findOpenKeyForPath(route.path);
  },
  { immediate: true },
);
</script>
