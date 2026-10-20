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
        <tbody v-else-if="projects.length">
          <tr
            v-for="project in projects"
            :key="project.id"
            class="border-b border-gray-default last:border-b-0 hover:bg-surface-50"
          >
            <td class="px-4 py-4">
              <NuxtLink
                :to="`/dashboard/employer/projects/${project.id}/requests`"
                class="font-semibold text-text-tertiary transition-colors hover:text-primary-500"
              >
                {{ getEmployerProjectTitle(project) }}
              </NuxtLink>
            </td>
            <td class="px-4 py-4 text-text-secondary">پروژه</td>
            <td class="px-4 py-4">
              <span
                class="inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold"
                :class="getEmployerProjectStatusMeta(project).className"
              >
                {{ getEmployerProjectStatusMeta(project).label }}
              </span>
            </td>
            <td class="px-4 py-4 text-text-secondary">
              {{ getEmployerProjectRequests(project).total }}
            </td>
            <td class="px-4 py-4 text-text-secondary">
              {{ getEmployerProjectRequests(project).unseen }}
            </td>
            <td class="px-4 py-4 text-text-secondary">
              {{ getEmployerProjectRequests(project).confirmed }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <NoResult
      v-if="!loading && initialized && !projects.length"
      title="هیچ پروژه‌ای موجود نیست"
      description="در حال حاضر هیچ پروژه‌ای جهت نمایش نیست."
      icon="svg:projects"
      action-label="پروژه جدید"
      action-icon="svg:projects"
      action-to="/dashboard/employer/projects/create"
    />
  </div>
</template>

<script setup lang="ts">
import NoResult from "~/components/Elements/NoResult.vue";
import type { EmployerProject } from "~/types/employer-project";
import {
  getEmployerProjectRequests,
  getEmployerProjectStatusMeta,
  getEmployerProjectTitle,
} from "~/pages/dashboard/employer/utils/employer-project";

defineProps<{
  projects: EmployerProject[];
  loading?: boolean;
  initialized?: boolean;
}>();

const columns = [
  "عنوان پروژه",
  "نوع",
  "وضعیت",
  "دریافت شده",
  "بررسی نشده",
  "تایید برای مصاحبه",
];
</script>
