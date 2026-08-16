<template>
  <article class="rounded-lg bg-white p-1">
    <div class="rounded-md border-2 border-primary-50 bg-primary-50 p-2">
      <div class="flex items-center gap-1">
        <div
          class="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#ECF4D9]"
        >
          <img
            :src="companyLogoSrc"
            :alt="request.company_name"
            class="size-14 rounded-2xl object-cover"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <h2 class="truncate text-lg font-semibold text-text-primary">
              {{ request.job_title }}
            </h2>
            <BookmarkToggleButton
              :target-id="request.ad_id"
              type="ads"
              :initial-bookmarked="Boolean(request.is_bookmarked)"
              icon-only
              class="h-8! w-8! shrink-0 border-none! bg-transparent! p-1.5!"
              @update:bookmarked="onBookmarkChange"
            />
          </div>

          <div class="mt-1 flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-1 text-sm">
              <Icon
                name="svg:buildings-4"
                size="20"
                class="shrink-0 text-text-passive"
              />
              <span class="text-text-passive">نام شرکت:</span>
              <span class="truncate text-text-tertiary">{{
                request.company_name
              }}</span>
            </div>
            <p class="shrink-0 text-caption text-text-passive">
              {{ relativeDate }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-2 flex flex-wrap items-center justify-start gap-2">
        <span
          v-if="request.employment_type"
          class="inline-flex h-8 items-center gap-1 rounded-full border border-gray-default bg-white px-2 text-sm text-text-secondary"
        >
          <Icon name="svg:user-search-3" size="20" />
          {{ request.employment_type }}
        </span>
        <span
          v-if="request.salary"
          class="inline-flex h-8 items-center gap-1 rounded-full border border-gray-default bg-white px-2 text-sm text-text-secondary"
        >
          <Icon name="svg:wallet" size="20" />
          {{ request.salary }}
        </span>
        <span
          v-if="request.category"
          class="inline-flex h-8 items-center gap-1 rounded-full border border-gray-default bg-white px-2 text-sm text-text-secondary"
        >
          <Icon name="svg:bag-1" size="20" />
          {{ request.category }}
        </span>
        <span
          v-if="locationLabel"
          class="inline-flex h-8 items-center gap-1 rounded-full border border-gray-default bg-white px-2 text-sm text-text-secondary"
        >
          <Icon name="svg:location-4" size="20" />
          {{ locationLabel }}
        </span>
        <span
          v-if="request.gender"
          class="inline-flex h-8 items-center gap-1 rounded-full border border-gray-default bg-white px-2 text-sm text-text-secondary"
        >
          <Icon name="svg:user-2" size="20" />
          {{ request.gender }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between p-2">
      <MyRequestStatusBadge :status="request.status" />

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-8 items-center gap-1 rounded-md bg-[#4864E114] px-3 text-sm font-semibold text-primary-500"
          @click="emit('details', request)"
        >
          <icons-chevron class="rotate-90" color="#4864e1" />
          جزئیات
        </button>
        <button
          type="button"
          class="inline-flex h-8 items-center gap-1 px-3 text-sm font-semibold text-danger-500"
          @click="emit('cancel', request)"
        >
          <Icon name="svg:close" />
          لغو درخواست
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import BookmarkToggleButton from "~/components/Elements/BookmarkToggleButton.vue";
import MyRequestStatusBadge from "~/components/Elements/MyRequestStatusBadge.vue";
import type { MyRequest } from "~/types/my-request";
import { formatRelativeDate } from "~/utils/format-relative-date";
import { resolveCompanyLogoDisplaySrc } from "~/utils/company-basic-info";

const props = defineProps<{
  request: MyRequest;
}>();

const emit = defineEmits<{
  cancel: [request: MyRequest];
  details: [request: MyRequest];
  bookmarkChange: [request: MyRequest, bookmarked: boolean];
}>();

const relativeDate = computed(() =>
  formatRelativeDate(props.request.created_at),
);
const companyLogoSrc = computed(() =>
  resolveCompanyLogoDisplaySrc(props.request.company_logo),
);

const locationLabel = computed(() => {
  const parts = [props.request.province_name, props.request.city_name].filter(
    Boolean,
  );
  return parts.join("، ");
});

function onBookmarkChange(bookmarked: boolean) {
  emit("bookmarkChange", props.request, bookmarked);
}
</script>
