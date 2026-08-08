<template>
  <div
    class="bg-surface-100 z-100 max-lg:h-[110%] max-lg:overflow-scroll max-lg:p-1 rounded-xl"
  >
    <div
      class="flex flex-col items-center gap-y-3 rounded-lg bg-surface-50 p-6"
    >
      <Avatar class="w-20 h-20" />
      <span class="font-semibold text-text-tertiary">{{ userName }}</span>
      <button class="flex items-center">
        <span class="text-text-passive text-sm font-normal">{{
          cellphone
        }}</span>
      </button>
    </div>

    <div
      v-if="topMenu.length"
      class="mt-1 bg-surface-50 px-3 py-3 hover:rounded-none lg:p-0 [&_button]:text-sm [&_button]:font-normal"
    >
      <div class="flex flex-col gap-y-2">
        <template v-for="item in topMenu" :key="item.key ?? item.label">
          <NuxtLink
            v-if="!item.disabled && !item.children?.length"
            :to="item.to"
            class="flex"
          >
            <span
              class="btn btn-block btn-ghost flex hover:rounded-none"
              :class="menuButtonClass(item)"
            >
              <div class="flex items-center justify-start">
                <Icon
                  :name="`${item.icon}`"
                  class="text-text-passive"
                  size="16"
                />
                <span class="mr-2 text-text-secondary">
                  {{ item.label }}
                </span>
              </div>
              <Icon
                v-if="item.children?.length"
                name="lucide:chevron-left"
                size="12"
              />
            </span>
          </NuxtLink>
          <button
            v-else
            type="button"
            class="btn btn-block btn-ghost flex hover:rounded-none"
            :class="menuButtonClass(item)"
            :disabled="item.disabled"
          >
            <div class="flex items-center justify-start">
              <Icon
                :name="`${item.icon}`"
                class="text-text-passive"
                size="16"
                :class="{ 'opacity-50': item.disabled }"
              />
              <span
                class="mr-2 text-text-secondary"
                :class="{ 'opacity-50': item.disabled }"
              >
                {{ item.label }}
              </span>
            </div>
            <Icon
              v-if="item.children?.length"
              name="lucide:chevron-left"
              size="12"
              :class="{ 'opacity-50': item.disabled }"
            />
          </button>
        </template>
      </div>
    </div>

    <div
      class="mt-1 bg-surface-50 px-3 py-3 hover:rounded-none lg:p-0 [&_button]:text-sm [&_button]:font-normal"
    >
      <div class="flex flex-col gap-y-2">
        <template v-for="item in bottomMenu" :key="item.key ?? item.label">
          <NuxtLink
            v-if="!item.disabled && !item.children?.length"
            :to="item.to"
            class="flex"
          >
            <span
              class="btn btn-block btn-ghost flex justify-start hover:rounded-none"
              :class="menuButtonClass(item)"
            >
              <div class="flex items-center justify-start">
                <Icon
                  :name="`${item.icon}`"
                  class="text-text-passive"
                  size="16"
                />
                <span class="mr-2 text-text-secondary">
                  {{ item.label }}
                </span>
              </div>
            </span>
          </NuxtLink>
          <button
            v-else
            type="button"
            class="btn btn-block btn-ghost flex justify-start hover:rounded-none"
            :class="menuButtonClass(item)"
            :disabled="item.disabled"
          >
            <div class="flex items-center justify-start">
              <Icon
                :name="`${item.icon}`"
                class="text-text-passive"
                size="16"
                :class="{ 'opacity-50': item.disabled }"
              />
              <span
                class="mr-2 text-text-secondary"
                :class="{ 'opacity-50': item.disabled }"
              >
                {{ item.label }}
              </span>
            </div>
          </button>
        </template>

        <button
          type="button"
          class="btn btn-block btn-ghost flex justify-start hover:bg-gray-100 dark:hover:bg-surface-200"
          :disabled="loggingOut"
          @click="handleLogout"
        >
          <div class="flex items-center justify-start">
            <Icon name="svg:log-out" class="text-danger-500" size="16" />
            <span class="mr-2 font-normal text-danger-500">
              خروج از حساب کاربری
            </span>
          </div>
        </button>
      </div>

      <div class="lg:pb-2 max-lg:mt-5">
        <panel-theme-settings />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUser } from "~/composables/useCurrentUser";
import type { MenuItem } from "~/types/panel-config";

const route = useRoute();
const { name: userName, cellphone } = useCurrentUser();
const { logout } = useSanctumAuth();
const { accountMenu } = usePanelConfig();

const loggingOut = ref(false);

const topMenu = computed(() =>
  accountMenu.value.filter((item) => item.placement !== "bottom"),
);

const bottomMenu = computed(() =>
  accountMenu.value.filter((item) => item.placement === "bottom"),
);

async function handleLogout() {
  if (loggingOut.value) return;
  loggingOut.value = true;
  try {
    await logout();
  } finally {
    loggingOut.value = false;
  }
}

function menuButtonClass(item: MenuItem) {
  return [
    item.children?.length ? "items-center justify-between" : "justify-start",
    {
      "bg-primary-50": !item.disabled && route.path === item.to,
    },
    item.disabled
      ? "cursor-not-allowed opacity-55 hover:bg-transparent"
      : route.path !== item.to
        ? "hover:bg-gray-100 dark:hover:bg-surface-200"
        : "hover:bg-primary-50",
  ];
}
</script>
