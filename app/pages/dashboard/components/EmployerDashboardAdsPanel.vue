<template>
  <div class="overflow-hidden rounded-2xl border border-gray-default bg-white">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr
            class="border-b border-gray-default bg-surface-50 text-text-passive"
          >
            <th
              v-for="column in columns"
              :key="column"
              class="px-4 py-3 text-right font-semibold whitespace-nowrap"
            >
              {{ column }}
            </th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr v-for="n in 3" :key="`skeleton-${n}`">
            <td v-for="col in columns.length" :key="col" class="px-4 py-4">
              <div class="h-4 animate-pulse rounded bg-surface-200" />
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="ads.length">
          <tr
            v-for="ad in ads"
            :key="ad.id"
            class="border-b border-gray-default last:border-b-0 hover:bg-surface-50"
          >
            <td class="px-4 py-4">
              <NuxtLink
                :to="`/dashboard/employer/ads/${ad.id}/resumes`"
                class="font-semibold text-text-tertiary transition-colors hover:text-primary-500"
              >
                {{ ad.title }}
              </NuxtLink>
            </td>
            <td class="px-4 py-4 text-text-secondary">شغلی</td>
            <td class="px-4 py-4">
              <span
                class="inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold"
                :class="getEmployerAdStatusMeta(ad).className"
              >
                {{ getEmployerAdStatusMeta(ad).label }}
              </span>
            </td>
            <td class="px-4 py-4 text-text-secondary">
              {{ ad.requests?.total ?? 0 }}
            </td>
            <td class="px-4 py-4 text-text-secondary">
              {{ ad.requests?.unseen ?? 0 }}
            </td>
            <td class="px-4 py-4 text-text-secondary">
              {{ ad.requests?.confirmed ?? 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <NoResult
      v-if="!loading && initialized && !ads.length"
      title="هیچ آگهی موجود نیست"
      description="در حال حاضر هیچ آگهی جهت نمایش نیست."
      icon="svg:no-jobs"
      action-label="آگهی جدید"
      action-icon="svg:bag-1"
      action-to="/dashboard/employer/ads/create"
    />
  </div>
</template>

<script setup lang="ts">
import NoResult from "~/components/Elements/NoResult.vue";
import type { EmployerAd } from "~/types/employer-ad";
import { getEmployerAdStatusMeta } from "~/pages/dashboard/employer/utils/employer-ad";

defineProps<{
  ads: EmployerAd[];
  loading?: boolean;
  initialized?: boolean;
}>();

const columns = [
  "عنوان آگهی",
  "نوع آگهی",
  "وضعیت",
  "دریافت شده",
  "بررسی نشده",
  "تایید برای مصاحبه",
];
</script>
