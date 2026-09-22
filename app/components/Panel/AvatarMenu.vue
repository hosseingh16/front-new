<template>
  <div
    class="users-menu relative z-100 bg-surface-100 max-lg:h-full max-lg:min-h-full max-lg:overflow-y-auto max-lg:bg-surface-50 max-lg:p-1 rounded-xl"
  >
    <NuxtLink
      :to="profileLink"
      class="flex flex-col items-center gap-y-3 rounded-lg bg-surface-50 p-6 transition-colors hover:bg-surface-100"
      :aria-label="profileAriaLabel"
      @click="closeBottomMenu"
    >
      <Avatar class="w-20 h-20" />
      <span class="font-semibold text-text-tertiary">{{ userName }}</span>
      <span class="text-text-passive text-sm font-normal">{{
        cellphone
      }}</span>
    </NuxtLink>

    <div
      v-if="topMenu.length"
      class="mt-1 bg-surface-50 px-3 py-3 [&_.btn]:text-sm [&_.btn]:font-normal"
    >
      <div class="flex flex-col gap-y-2">
        <template v-for="item in topMenu" :key="item.key ?? item.label">
          <NuxtLink
            v-if="!item.disabled && !item.children?.length"
            :to="item.to"
            class="flex"
          >
            <span
              class="btn btn-block btn-ghost flex justify-start"
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
            class="btn btn-block btn-ghost flex justify-start"
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
      </div>
    </div>

    <div
      class="mt-1 bg-surface-50 px-3 py-3 [&_.btn]:text-sm [&_.btn]:font-normal"
    >
      <div class="flex flex-col gap-y-2">
        <template v-for="item in bottomMenu" :key="item.key ?? item.label">
          <NuxtLink
            v-if="!item.disabled && !item.children?.length"
            :to="item.to"
            class="flex"
          >
            <span
              class="btn btn-block btn-ghost flex justify-start"
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
            class="btn btn-block btn-ghost flex justify-start"
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
          @click="openLogoutConfirm"
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

    <Teleport to="body">
      <RemoveItemModal
        ref="logoutModalRef"
        title="خروج از حساب کاربری"
        subtitle="آیا از خروج مطمئن هستید؟"
        description="با خروج از حساب، برای دسترسی دوباره باید وارد شوید."
        confirm-text="خروج"
        cancel-text="انصراف"
        :icon-src="logoutIllustration"
        confirm-icon="material-symbols:logout"
        :loading="loggingOut"
        @confirm="confirmLogout"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUser } from "~/composables/useCurrentUser";
import type { MenuItem } from "~/types/panel-config";
import RemoveItemModal from "~/components/M/RemoveItemModal.vue";
import logoutIllustration from "~/assets/vectors/logout.svg?url";

const HIDDEN_ACCOUNT_KEYS = new Set(["user_my_resume", "my_resume"]);

const route = useRoute();
const { name: userName, cellphone, isEmployer } = useCurrentUser();
const { logout } = useSanctumAuth();
const { accountMenu } = usePanelConfig();
const showBottomMenu = useState("showBottomMenu_state", () => false);

const loggingOut = ref(false);
const logoutModalRef = ref<InstanceType<typeof RemoveItemModal> | null>(null);

const profileLink = computed(() =>
  isEmployer.value
    ? "/dashboard/employer/company#section-logo"
    : "/dashboard/cv?edit=basic",
);

const profileAriaLabel = computed(() =>
  isEmployer.value ? "تغییر لوگو سازمان" : "ویرایش اطلاعات پایه رزومه",
);

function closeBottomMenu() {
  showBottomMenu.value = false;
}

const topMenu = computed(() =>
  accountMenu.value.filter(
    (item) =>
      item.placement !== "bottom" && !HIDDEN_ACCOUNT_KEYS.has(item.key ?? ""),
  ),
);

const bottomMenu = computed(() =>
  accountMenu.value.filter(
    (item) =>
      item.placement === "bottom" && !HIDDEN_ACCOUNT_KEYS.has(item.key ?? ""),
  ),
);

function openLogoutConfirm() {
  if (loggingOut.value) return;
  logoutModalRef.value?.showModal();
}

async function confirmLogout() {
  if (loggingOut.value) return;
  loggingOut.value = true;
  try {
    await logout();
    logoutModalRef.value?.closeModal();
  } finally {
    loggingOut.value = false;
  }
}

function menuButtonClass(item: MenuItem) {
  const pathOnly = item.to.split("?")[0] || item.to;
  const isActive =
    !item.disabled &&
    !!pathOnly &&
    (pathOnly === "/dashboard"
      ? route.path === "/dashboard"
      : route.path === pathOnly || route.path.startsWith(`${pathOnly}/`));

  return [
    item.children?.length ? "items-center justify-between" : "justify-start",
    {
      "bg-primary-50": isActive,
    },
    item.disabled
      ? "cursor-not-allowed opacity-55 hover:bg-transparent"
      : isActive
        ? "hover:bg-primary-50"
        : "hover:bg-gray-100 dark:hover:bg-surface-200",
  ];
}
</script>

<style scoped>
.users-menu :deep(.btn),
.users-menu :deep(button),
.users-menu :deep(a) {
  transition: background-color 50ms cubic-bezier(0.4, 0, 0.2, 1) !important;
}
</style>
