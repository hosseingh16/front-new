<template>
  <div class="overflow-x-auto rounded-2xl bg-surface-100 p-1">
    <div
      class="hidden min-w-[860px] gap-2 px-3 md:grid md:grid-cols-[minmax(140px,220px)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(140px,220px)_minmax(120px,1fr)_minmax(200px,auto)]"
    >
      <div
        v-for="column in columns"
        :key="column.key"
        class="flex w-full items-center justify-start gap-1 p-2 text-right text-sm whitespace-nowrap"
        :class="
          column.key === 'salary' ? 'text-text-primary' : 'text-text-tertiary'
        "
      >
        {{ column.label }}
        <Icon
          v-if="column.sortable"
          name="svg:sort"
          size="20"
          class="size-5 shrink-0 text-text-passive"
        />
      </div>
    </div>

    <div class="rounded-xl bg-white p-3">
      <div v-if="loading" class="space-y-3">
        <div
          v-for="n in 3"
          :key="`skeleton-${n}`"
          class="h-[52px] animate-pulse rounded-lg bg-surface-50"
        />
      </div>

      <div v-else-if="requests.length" class="space-y-3">
        <div
          v-for="request in requests"
          :key="request.id"
          class="flex flex-col gap-3 rounded-lg bg-surface-50 p-2 md:grid md:h-[52px] md:min-w-[860px] md:grid-cols-[minmax(140px,220px)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(140px,220px)_minmax(120px,1fr)_minmax(200px,auto)] md:items-center md:gap-2 md:p-0"
        >
          <div
            class="flex items-center justify-between gap-2 p-2 md:justify-start"
          >
            <span class="text-xs text-text-passive md:hidden">عنوان آگهی</span>
            <p
              class="truncate text-sm font-semibold text-text-primary"
              :title="request.job_title"
            >
              {{ request.job_title }}
            </p>
          </div>

          <div
            class="flex items-center justify-between gap-2 p-2 md:justify-start"
          >
            <span class="text-xs text-text-passive md:hidden">نوع آگهی</span>
            <span
              class="inline-flex h-8 items-center gap-1 rounded-xl px-2 text-sm text-text-secondary"
              :class="employmentTypeMeta(request).className"
            >
              {{ employmentTypeMeta(request).label }}
              <Icon
                :name="employmentTypeMeta(request).icon"
                size="20"
                class="size-5 shrink-0"
              />
            </span>
          </div>

          <div
            class="flex items-center justify-between gap-2 p-2 md:justify-start"
          >
            <span class="text-xs text-text-passive md:hidden">نام شرکت</span>
            <p
              class="truncate text-sm text-text-primary"
              :title="request.company_name"
            >
              {{ request.company_name }}
            </p>
          </div>

          <div
            class="flex items-center justify-between gap-2 p-2 md:justify-start"
          >
            <span class="text-xs text-text-passive md:hidden">وضعیت</span>
            <MyRequestStatusBadge :status="request.status" />
          </div>

          <div
            class="flex items-center justify-between gap-2 p-2 md:justify-start"
          >
            <span class="text-xs text-text-passive md:hidden">قیمت</span>
            <span
              v-if="request.salary"
              class="inline-flex items-center gap-2 text-sm text-text-primary"
            >
              {{ request.salary }}
              <!-- <Icon name="svg:ir" size="20" class="size-5 shrink-0" /> -->
            </span>
            <span v-else class="text-sm text-text-passive">—</span>
          </div>

          <div class="flex items-center justify-end gap-2 p-2">
            <button
              type="button"
              class="inline-flex h-8 items-center gap-1 rounded-md bg-[rgba(72,100,225,0.08)] px-3 text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80"
              @click="emit('details', request)"
            >
              <icons-chevron class="rotate-90" color="#4864e1" />
              جزئیات
            </button>
            <button
              type="button"
              class="inline-flex h-8 items-center gap-1 rounded-md px-3 text-sm font-semibold text-danger-500 transition-opacity hover:opacity-80"
              @click="emit('cancel', request)"
            >
              <Icon name="svg:close" class="size-5 shrink-0" />
              لغو درخواست
            </button>
          </div>
        </div>
      </div>

      <NoResult
        v-else-if="initialized"
        title="درخواستی یافت نشد"
        description="هنوز درخواستی برای فرصت‌های شغلی ارسال نکرده‌اید."
        icon="svg:no-jobs"
        action-label="فرصت‌های شغلی"
        action-icon="svg:jobs"
        action-to="/dashboard/ad"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MyRequestStatusBadge from "~/components/Elements/MyRequestStatusBadge.vue";
import NoResult from "~/components/Elements/NoResult.vue";
import type { MyRequest } from "~/types/my-request";
import { getEmploymentTypeMeta } from "~/pages/dashboard/utils/my-request";

defineProps<{
  requests: MyRequest[];
  loading?: boolean;
  initialized?: boolean;
}>();

const emit = defineEmits<{
  cancel: [request: MyRequest];
  details: [request: MyRequest];
}>();

const columns = [
  { key: "title", label: "عنوان آگهی", sortable: false },
  { key: "type", label: "نوع آگهی", sortable: true },
  { key: "company", label: "نام شرکت", sortable: false },
  { key: "status", label: "وضعیت", sortable: true },
  { key: "salary", label: "قیمت", sortable: true },
  { key: "actions", label: "", sortable: false },
] as const;

function employmentTypeMeta(request: MyRequest) {
  return getEmploymentTypeMeta(request.employment_type || request.ad_type);
}
</script>
