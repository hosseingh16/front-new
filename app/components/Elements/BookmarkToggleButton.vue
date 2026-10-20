<template>
  <button
    type="button"
    class="flex cursor-pointer items-center justify-center gap-1 rounded-lg border-2 border-gray-default bg-surface-50 text-sm text-text-tertiary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60 ml-2.5 sm:ml-0"
    :class="iconOnly ? 'h-9 w-9 p-0' : 'h-9 px-4'"
    :disabled="loading"
    :aria-label="bookmarked ? 'حذف نشان' : 'نشان کردن'"
    @click="toggleBookmark"
  >
    <Icon
      :name="
        bookmarked
          ? 'material-symbols:bookmark'
          : 'material-symbols:bookmark-outline'
      "
      size="20"
      :class="bookmarked ? 'text-primary-500' : ''"
    />
    <span class="sm-hidden" v-if="!iconOnly">{{ label }}</span>
  </button>

  <dialog
    ref="authDialogRef"
    class="modal"
    dir="rtl"
    aria-labelledby="bookmark-auth-title"
    @click="handleAuthBackdropClick"
  >
    <div
      class="modal-box w-[calc(100%-2rem)] rounded-2xl p-6"
      style="max-width: 420px"
      @click.stop
    >
      <div class="relative">
        <button
          type="button"
          class="absolute left-0 top-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-1.5 text-text-passive transition-opacity hover:opacity-80"
          aria-label="بستن"
          @click="closeAuthModal"
        >
          <Icon name="material-symbols:close" size="20" />
        </button>

        <div class="flex flex-col items-center text-center">
          <div
            class="flex size-16 items-center justify-center rounded-full bg-[#FFF4E5]"
            aria-hidden="true"
          >
            <Icon name="svg:warning" size="40" />
          </div>

          <h2
            id="bookmark-auth-title"
            class="mt-4 font-yb-bold text-[21px] leading-[1.7] text-text-primay"
          >
            ورود به حساب کاربری
          </h2>

          <p class="mt-2 max-w-md text-base leading-[1.7] text-text-tertiary">
            برای نشان کردن نیاز به ورود به حساب کاربری خود دارید
          </p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <NuxtLink
          :to="paths.login"
          class="btn btn-primary flex h-10 w-full items-center justify-center"
          @click="closeAuthModal"
        >
          ورود | ثبت‌نام
        </NuxtLink>
        <button
          type="button"
          class="btn btn-outline h-10 w-full border-gray-200 text-text-tertiary"
          @click="closeAuthModal"
        >
          انصراف
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type { ApiResponse } from "~/types/api";
import { paths } from "~/routes";

export type BookmarkType =
  | "users"
  | "requests"
  | "companies"
  | "ads"
  | "projects";

const BOOKMARK_SUCCESS_MESSAGES: Record<
  BookmarkType,
  { add: string; remove: string }
> = {
  ads: { add: "آگهی نشان شد", remove: "نشان آگهی حذف شد" },
  projects: { add: "پروژه نشان شد", remove: "نشان پروژه حذف شد" },
  companies: { add: "سازمان نشان شد", remove: "نشان سازمان حذف شد" },
  users: { add: "کارجو نشان شد", remove: "نشان کارجو حذف شد" },
  requests: { add: "رزومه نشان شد", remove: "نشان رزومه حذف شد" },
};

const props = withDefaults(
  defineProps<{
    targetId: string | number;
    type: BookmarkType;
    label?: string;
    initialBookmarked?: boolean;
    iconOnly?: boolean;
  }>(),
  {
    label: "نشان کردن",
    initialBookmarked: false,
    iconOnly: false,
  },
);

const emit = defineEmits<{
  "update:bookmarked": [value: boolean];
}>();

const api = useApi();
const { $toast } = useNuxtApp();
const { isAuthenticated } = useSanctumAuth();

const loading = ref(false);
const bookmarked = ref(Boolean(props.initialBookmarked));
const authDialogRef = ref<HTMLDialogElement | null>(null);

watch(
  () => props.initialBookmarked,
  (value) => {
    bookmarked.value = Boolean(value);
  },
);

function showAuthModal() {
  authDialogRef.value?.showModal();
}

function closeAuthModal() {
  authDialogRef.value?.close();
}

function handleAuthBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeAuthModal();
  }
}

async function toggleBookmark() {
  if (loading.value) return;

  if (!isAuthenticated.value) {
    showAuthModal();
    return;
  }

  loading.value = true;
  try {
    const result = await api.post<ApiResponse<{ bookmarked?: boolean }>>(
      `/bookmarks/toggle/${props.targetId}`,
      {
        type: props.type,
      },
      { skipAuthRedirect: true },
    );

    if (typeof result.data?.bookmarked === "boolean") {
      bookmarked.value = result.data.bookmarked;
    } else {
      bookmarked.value = !bookmarked.value;
    }

    const messages = BOOKMARK_SUCCESS_MESSAGES[props.type];
    $toast.success(bookmarked.value ? messages.add : messages.remove);
    emit("update:bookmarked", bookmarked.value);
  } catch (error: any) {
    if (error?.status === 401) {
      showAuthModal();
      return;
    }
    $toast.error(error?.message || "خطا در نشان‌گذاری");
  } finally {
    loading.value = false;
  }
}
</script>
