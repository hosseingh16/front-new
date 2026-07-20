<template>
  <button
    type="button"
    class="flex cursor-pointer items-center justify-center gap-1 rounded-lg border-2 border-gray-default bg-surface-50 text-sm text-text-tertiary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
    :class="iconOnly ? 'h-8 w-8 p-0' : 'h-9 px-4'"
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
      size="18"
      :class="bookmarked ? 'text-primary-500' : ''"
    />
    <span v-if="!iconOnly">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import type { ApiResponse } from "~/types/api";

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

const loading = ref(false);
const bookmarked = ref(Boolean(props.initialBookmarked));

watch(
  () => props.initialBookmarked,
  (value) => {
    bookmarked.value = Boolean(value);
  },
);

async function toggleBookmark() {
  if (loading.value) return;

  loading.value = true;
  try {
    const result = await api.post<ApiResponse<{ bookmarked?: boolean }>>(
      `/bookmarks/toggle/${props.targetId}`,
      {
        type: props.type,
      },
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
    if (error?.status !== 401) {
      $toast.error(error?.message || "خطا در نشان‌گذاری");
    }
  } finally {
    loading.value = false;
  }
}
</script>
