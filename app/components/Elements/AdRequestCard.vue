<template>
  <article class="rounded-lg bg-surface-50 p-1">
    <div class="rounded-lg bg-[#F6F8FE] dark:bg-surface-200 p-3">
      <div class="flex items-start justify-between">
        <div class="flex min-w-0 flex-1 items-center gap-2">
          <div
            class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#c5dff5]"
          >
            <img
              v-if="avatar"
              :src="avatar"
              :alt="name"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-end justify-center bg-gradient-to-b from-[#c5dff5] to-[#9ec5e8]"
            >
              <div class="h-[85%] w-[70%] rounded-t-full bg-[#e8a4a4]" />
            </div>
          </div>

          <div class="w-full text-sm">
            <div class="flex items-center justify-between">
              <p class="truncate font-semibold text-text-tertiary">
                {{ name }}
              </p>

              <div class="flex shrink-0 items-center gap-2">
                <div
                  class="[&_button]:h-auto pl-3 [&_button]:w-auto [&_button]:border-none [&_button]:bg-transparent [&_button]:p-0"
                >
                  <BookmarkToggleButton
                    :target-id="request.id"
                    type="requests"
                    icon-only
                  />
                </div>

                <button
                  type="button"
                  class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 transition-opacity hover:opacity-80 disabled:opacity-60"
                  :disabled="actionLoading"
                  @click="emit('view')"
                >
                  <Icon name="lucide:eye" class="shrink-0" />
                  <span class="text-text-secondary">مشاهده رزومه</span>
                </button>
              </div>
            </div>
            <div
              class="mt-2 flex flex-wrap items-center gap-1 text-text-passive"
            >
              <Icon name="ph:suitcase-simple-light" class="shrink-0" />
              <span class="truncate">عنوان شغلی: {{ jobTitle }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 flex gap-1 overflow-x-auto text-sm no-scrollbar">
        <div
          v-for="item in displayItems"
          :key="item.key"
          class="flex shrink-0 items-center gap-2 rounded-full border border-gray-default bg-surface-50 px-3 py-1"
        >
          <Icon
            :name="item.icon"
            class="ma-auto shrink-0 text-gray-500 dark:text-gray-400"
          />
          <span class="text-text-tertiary">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <div class="mt-2 flex items-center justify-between gap-2 px-2">
      <AdRequestStatusBadge :request="request" />

      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          class="flex h-9 items-center gap-1 px-2 text-sm text-[#dd4a48] dark:text-red-400 transition-opacity hover:opacity-80 disabled:opacity-60"
          :disabled="actionLoading || isRejected"
          @click="emit('reject')"
        >
          <Icon name="material-symbols:close-rounded" size="18" />
          رد کردن
        </button>

        <button
          type="button"
          class="flex h-9 items-center gap-2 rounded-lg bg-[#E6F6F0] dark:bg-[#009F65]/15 px-4 text-sm text-[#009F65] dark:text-[#34d399] transition-opacity hover:bg-[#d8f0e8] dark:hover:bg-[#009F65]/25 disabled:opacity-60"
          :disabled="actionLoading || isApproved"
          @click="emit('confirm')"
        >
          <Icon name="lucide:check-check" size="18" />
          تایید درخواست
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import AdRequestStatusBadge from "~/components/Elements/AdRequestStatusBadge.vue";
import BookmarkToggleButton from "~/components/Elements/BookmarkToggleButton.vue";
import type { EmployerAdRequest } from "~/types/employer-ad-request";
import {
  getAdRequestDisplayItems,
  getAdRequestJobTitle,
  resolveAdRequestStatusKey,
} from "~/pages/dashboard/employer/utils/employer-ad-request";

const props = defineProps<{
  request: EmployerAdRequest;
  actionLoading?: boolean;
}>();

const emit = defineEmits<{
  view: [];
  confirm: [];
  reject: [];
}>();

const name = computed(() => props.request.user?.name || "—");
const avatar = computed(() => props.request.user?.avatar || null);
const jobTitle = computed(() => getAdRequestJobTitle(props.request));
const displayItems = computed(() => getAdRequestDisplayItems(props.request));

const statusKey = computed(() => resolveAdRequestStatusKey(props.request));

const isApproved = computed(() => statusKey.value === "approved");

const isRejected = computed(() => statusKey.value === "rejected");
</script>
