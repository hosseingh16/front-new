<template>
  <div class="w-80 max-w-[calc(100vw-2rem)] bg-surface-50 rounded-lg">
    <div
      class="flex items-center justify-between gap-3 border-b border-gray-default px-4 py-3"
    >
      <h3 class="text-sm font-semibold text-text-tertiary">اعلان‌ها</h3>
      <button
        v-if="unreadCount > 0"
        type="button"
        class="text-caption text-primary-500 transition-opacity hover:opacity-80 disabled:opacity-50"
        :disabled="marking"
        @click="onMarkAll"
      >
        خواندن همه
      </button>
    </div>

    <div class="max-h-96 overflow-y-auto">
      <div v-if="loading && !initialized" class="space-y-3 p-4">
        <div
          v-for="n in 3"
          :key="n"
          class="h-14 animate-pulse rounded-lg bg-surface-100"
        />
      </div>

      <div
        v-else-if="error && !items.length"
        class="px-4 py-8 text-center text-sm text-danger-500"
      >
        {{ error }}
        <button
          type="button"
          class="mt-3 block w-full text-primary-500"
          @click="fetchNotifications"
        >
          تلاش مجدد
        </button>
      </div>

      <div
        v-else-if="!items.length"
        class="flex flex-col items-center gap-2 px-4 py-10 text-center"
      >
        <Icon
          name="svg:illust-bell"
          size="250"
          class="mx-auto block object-contain"
        />
        <p class="text-sm text-text-passive -mt-17.5">اعلانی وجود ندارد</p>
      </div>

      <ul v-else class="divide-y divide-gray-default">
        <li v-for="item in items" :key="item.id">
          <button
            type="button"
            class="flex w-full items-start gap-3 px-4 py-3 text-right transition-colors hover:bg-surface-100"
            :class="[
              !item.read_at ? 'bg-primary-50/60' : '',
              getNotificationLink(item) ? 'cursor-pointer' : 'cursor-default',
            ]"
            @click="onSelect(item)"
          >
            <span
              class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              :class="item.read_at ? 'bg-transparent' : 'bg-primary-500'"
              aria-hidden="true"
            />
            <span class="min-w-0 flex-1">
              <span
                class="block text-sm text-text-secondary"
                :class="{ 'font-semibold text-text-tertiary': !item.read_at }"
              >
                {{ getNotificationTitle(item) }}
              </span>
              <span
                v-if="getNotificationMessage(item)"
                class="mt-1 block line-clamp-2 text-sm text-justify font-normal text-text-passive"
              >
                {{ getNotificationMessage(item) }}
              </span>
              <span
                v-if="formatDate(item.created_at)"
                class="mt-2 block text-xs font-normal text-text-passive"
              >
                {{ formatDate(item.created_at) }}
              </span>
            </span>
            <Icon
              v-if="getNotificationLink(item)"
              name="svg:open-link"
              size="16"
              class="mt-0.5 shrink-0 text-text-passive"
            />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getNotificationLink,
  getNotificationMessage,
  getNotificationTitle,
  isExternalNotificationLink,
  type AppNotification,
} from "~/types/notification";
import { formatJalaliDate } from "~/utils/format-jalali-date";

const {
  items,
  loading,
  marking,
  error,
  initialized,
  unreadCount,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} = useNotifications();

function formatDate(value: string) {
  return formatJalaliDate(value, "jD jMMMM jYYYY - HH:mm");
}

async function onMarkAll() {
  try {
    await markAllAsRead();
  } catch {
    // error state is already set in the composable
  }
}

async function onSelect(item: AppNotification) {
  const link = getNotificationLink(item);

  if (!item.read_at) {
    try {
      await markAsRead(item.id);
    } catch {
      // keep going so the user can still open the link
    }
  }

  if (!link) return;

  // Close daisyUI dropdown before navigating
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  // If the link is a relative path (like /dashboard/employer/company), navigate internally
  if (isExternalNotificationLink(link)) {
    await navigateTo(link, { external: true });
    return;
  }

  // Ensures internal navigation for links like /dashboard/employer/company
  await navigateTo(link, { replace: false });
}
</script>
