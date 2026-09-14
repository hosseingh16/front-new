<template>
  <div
    class="users-menu bg-surface-100 z-100 max-lg:h-[110%] max-lg:overflow-scroll max-lg:p-1 rounded-xl"
  >
    <NuxtLink
      to="/dashboard/cv?edit=basic"
      class="flex flex-col items-center gap-y-3 rounded-lg bg-surface-50 p-6 transition-colors hover:bg-surface-100"
      aria-label="ویرایش اطلاعات پایه رزومه"
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
          <button
            v-if="item.key === DOWNLOAD_RESUME_KEY"
            type="button"
            class="flex appearance-none border-0 bg-transparent p-0 text-start"
            :disabled="downloadingPdf"
            @click="downloadPdf"
          >
            <span
              class="btn btn-block btn-ghost flex justify-start"
              :class="[
                menuButtonClass(item),
                downloadingPdf ? 'cursor-wait opacity-60' : '',
              ]"
            >
              <div class="flex items-center justify-start">
                <Icon
                  :name="downloadingPdf ? 'lucide:loader-circle' : item.icon"
                  class="text-text-passive"
                  size="16"
                  :class="{ 'animate-spin': downloadingPdf }"
                />
                <span class="mr-2 text-text-secondary">
                  {{ downloadingPdf ? "در حال آماده‌سازی..." : item.label }}
                </span>
              </div>
            </span>
          </button>
          <NuxtLink
            v-else-if="!item.disabled && !item.children?.length"
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
const DOWNLOAD_RESUME_KEY = "download_resume";
const EDIT_RESUME_KEYS = new Set(["user_edit_resume", "resume_edit"]);

const route = useRoute();
const api = useApi();
const { $toast } = useNuxtApp();
const { name: userName, cellphone } = useCurrentUser();
const { logout } = useSanctumAuth();
const { accountMenu } = usePanelConfig();
const showBottomMenu = useState("showBottomMenu_state", () => false);

const loggingOut = ref(false);
const downloadingPdf = ref(false);
const logoutModalRef = ref<InstanceType<typeof RemoveItemModal> | null>(null);

function closeBottomMenu() {
  showBottomMenu.value = false;
}

const downloadResumeItem: MenuItem = {
  key: DOWNLOAD_RESUME_KEY,
  label: "دانلود رزومه",
  icon: "lucide:download",
  to: "",
};

const topMenu = computed(() => {
  const items = accountMenu.value.filter(
    (item) =>
      item.placement !== "bottom" && !HIDDEN_ACCOUNT_KEYS.has(item.key ?? ""),
  );

  const editIdx = items.findIndex((item) =>
    EDIT_RESUME_KEYS.has(item.key ?? ""),
  );
  if (editIdx >= 0) {
    const next = [...items];
    next.splice(editIdx + 1, 0, downloadResumeItem);
    return next;
  }

  return [...items, downloadResumeItem];
});

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

async function downloadPdf() {
  if (downloadingPdf.value || !import.meta.client) return;

  downloadingPdf.value = true;
  try {
    const blob = await api.get<Blob>("/cv/pdf-link", {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });

    if (!(blob instanceof Blob) || blob.size === 0) {
      $toast.error("دانلود رزومه ممکن نشد");
      return;
    }

    if (
      blob.type.includes("json") ||
      blob.type.includes("text") ||
      blob.type.includes("html")
    ) {
      $toast.error("دانلود رزومه ممکن نشد");
      return;
    }

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "resume.pdf";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    closeBottomMenu();
  } catch {
    $toast.error("دانلود رزومه ممکن نشد");
  } finally {
    downloadingPdf.value = false;
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
