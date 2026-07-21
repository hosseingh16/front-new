<template>
  <article class="rounded-lg border border-base-300 bg-surface-card p-1">
    <div class="rounded-lg bg-surface-soft p-3">
      <div class="flex items-start justify-between">
        <div class="flex min-w-0 flex-1 items-center gap-2">
          <div
            class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-avatar-from"
          >
            <img
              v-if="avatar"
              :src="avatar"
              :alt="name"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-end justify-center bg-linear-to-b from-avatar-from to-avatar-to"
            >
              <div class="h-[85%] w-[70%] rounded-t-full bg-avatar-skin" />
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
                    :initial-bookmarked="Boolean(request.is_bookmarked)"
                    icon-only
                    @update:bookmarked="onBookmarkChange"
                  />
                </div>

                <button
                  type="button"
                  class="flex items-center gap-1.5 text-sm text-text-passive transition-opacity hover:opacity-80 disabled:opacity-60"
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
            class="ma-auto shrink-0 text-text-passive"
          />
          <span class="text-text-tertiary">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <div
      class="mt-2 flex flex-col gap-2 px-2 sm:flex-row sm:items-center sm:justify-between"
    >
      <AdRequestStatusBadge :request="request" />

      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          class="flex h-9 items-center gap-1 px-2 text-sm text-danger-500 transition-opacity hover:opacity-80 disabled:opacity-60"
          :disabled="actionLoading || isRejected"
          @click="emit('reject')"
        >
          <Icon name="material-symbols:close-rounded" size="18" />
          رد کردن
        </button>

        <button
          type="button"
          class="flex h-9 items-center gap-2 rounded-lg bg-success-100 px-4 text-sm text-success-500 transition-opacity hover:bg-success-50 disabled:opacity-60"
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

const { items: lookupItems } = useLookups("job_titles");
const jobTitleOptions = lookupItems("job_titles");

const emit = defineEmits<{
  view: [];
  confirm: [];
  reject: [];
  bookmarkChange: [value: boolean];
}>();

const name = computed(() => props.request.user?.name || "—");
const avatar = computed(() => props.request.user?.avatar || null);
const jobTitle = computed(() =>
  getAdRequestJobTitle(props.request, jobTitleOptions.value),
);
const displayItems = computed(() => getAdRequestDisplayItems(props.request));

const statusKey = computed(() => resolveAdRequestStatusKey(props.request));

const isApproved = computed(() => statusKey.value === "approved");

const isRejected = computed(() => statusKey.value === "rejected");

function onBookmarkChange(value: boolean) {
  props.request.is_bookmarked = value;
  emit("bookmarkChange", value);
}
</script>
