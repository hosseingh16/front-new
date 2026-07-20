<template>
  <div>
    <template v-if="loading">
      <div class="h-8 w-40 animate-pulse rounded bg-surface-200" />
      <div class="mt-6 flex gap-6 border-b border-gray-default pb-3">
        <div
          v-for="n in 5"
          :key="`tab-skeleton-${n}`"
          class="h-5 w-20 animate-pulse rounded bg-surface-200"
        />
      </div>
      <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ItemBox
          v-for="n in 6"
          :key="`bookmark-skeleton-${n}`"
          variant="ad"
          loading
        />
      </div>
    </template>

    <p v-else-if="error" class="py-12 text-center text-sm text-error">
      {{ error }}
    </p>

    <NoResult
      v-else-if="initialized && totalCount === 0"
      title="هنوز چیزی نشان نکرده‌اید"
      description="آگهی‌ها، پروژه‌ها و سازمان‌هایی که نشان می‌کنید اینجا نمایش داده می‌شوند."
      icon="svg:no-result"
      :icon-size="180"
      action-label="مشاهده فرصت‌های شغلی"
      action-to="/jobs"
    />

    <template v-else>
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="font-yb-bold text-lg text-text-tertiary">نشان شده‌ها</h1>
        <span
          class="rounded-full bg-surface-100 px-3 py-1 text-xs font-semibold text-text-passive"
        >
          {{ toPersianDigits(totalCount) }} مورد
        </span>
      </div>

      <div
        class="mt-6 flex flex-wrap items-center gap-6 border-b border-gray-default"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="flex cursor-pointer items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors"
          :class="
            activeTab === tab.id
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-text-passive hover:text-text-secondary'
          "
          @click="activeTab = tab.id"
        >
          <Icon v-if="tab.icon" :name="tab.icon" size="16" />
          {{ tab.label }}
        </button>
      </div>

      <div v-if="activeTab === 'ad'" class="mt-6">
        <div
          v-if="groups.ad.length"
          class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <ItemBox
            v-for="entry in groups.ad"
            :key="`ad-${entry.model.id}`"
            variant="ad"
            :item="entry.model"
            @bookmark="(id) => removeBookmark(id, 'ad')"
          />
        </div>
        <NoResult
          v-else
          title="آگهی نشان‌شده‌ای نیست"
          description="هنوز هیچ آگهی‌ای را نشان نکرده‌اید."
          icon="svg:no-result"
          :icon-size="180"
        />
      </div>

      <div v-else-if="activeTab === 'project'" class="mt-6">
        <div
          v-if="groups.project.length"
          class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <ItemBox
            v-for="entry in groups.project"
            :key="`project-${entry.model.id}`"
            variant="project"
            :item="entry.model"
            @bookmark="(id) => removeBookmark(id, 'project')"
          />
        </div>
        <NoResult
          v-else
          title="پروژه نشان‌شده‌ای نیست"
          description="هنوز هیچ پروژه‌ای را نشان نکرده‌اید."
          icon="svg:no-result"
          :icon-size="180"
        />
      </div>

      <div v-else-if="activeTab === 'company'" class="mt-6">
        <div
          v-if="groups.company.length"
          class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <CompanyBox
            v-for="(entry, index) in groups.company"
            :key="`company-${entry.model.id ?? entry.model.slug ?? index}`"
            :company="entry.model"
            :active-ads="entry.model.active_ads"
            :to="
              entry.model.slug ? `/companies/${entry.model.slug}` : undefined
            "
          />
        </div>
        <NoResult
          v-else
          title="سازمان نشان‌شده‌ای نیست"
          description="هنوز هیچ سازمانی را نشان نکرده‌اید."
          icon="svg:no-result"
          :icon-size="180"
        />
      </div>

      <div v-else-if="activeTab === 'user'" class="mt-6">
        <div
          v-if="groups.user.length"
          class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <PersonBox
            v-for="entry in groups.user"
            :key="`user-${entry.model.id}`"
            :name="entry.model.name"
            :avatar="entry.model.avatar"
            :job-title="entry.model.job_title || entry.model.wanted_job"
            :employment-type="entry.model.employment_type"
            :salary="entry.model.salary_range || entry.model.desired_salary"
            :experience="entry.model.work_experience"
            :age="entry.model.age != null ? String(entry.model.age) : undefined"
            :province-name="entry.model.province_name"
            :city-name="entry.model.city_name"
            :to="`/users/${entry.model.id}`"
          />
        </div>
        <NoResult
          v-else
          title="کارجوی نشان‌شده‌ای نیست"
          description="هنوز هیچ کارجویی را نشان نکرده‌اید."
          icon="svg:no-result"
          :icon-size="180"
        />
      </div>

      <div v-else class="mt-6">
        <div
          v-if="groups.consultant.length"
          class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <PersonBox
            v-for="entry in groups.consultant"
            :key="`consultant-${entry.model.id}`"
            :name="entry.model.name"
            :avatar="entry.model.avatar"
            :job-title="entry.model.job_title || entry.model.wanted_job"
            :employment-type="entry.model.employment_type"
            :salary="entry.model.salary_range || entry.model.desired_salary"
            :experience="entry.model.work_experience"
            :age="entry.model.age != null ? String(entry.model.age) : undefined"
            :province-name="entry.model.province_name"
            :city-name="entry.model.city_name"
            :to="`/users/${entry.model.id}`"
          />
        </div>
        <NoResult
          v-else
          title="مشاور نشان‌شده‌ای نیست"
          description="هنوز هیچ مشاوری را نشان نکرده‌اید."
          icon="svg:no-result"
          :icon-size="180"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import CompanyBox from "~/components/Elements/company-box.vue";
import ItemBox from "~/components/Elements/item-box.vue";
import NoResult from "~/components/Elements/NoResult.vue";
import PersonBox from "~/components/Elements/person-box.vue";
import { toPersianDigits } from "~/composables/useCountUp";
import type { ApiResponse } from "~/types/api";
import type { BookmarkTab } from "~/types/bookmark";
import { countBookmarks } from "~/types/bookmark";

definePageMeta({
  layout: "dashboard",
});

const api = useApi();
const { $toast } = useNuxtApp();
const { groups, loading, initialized, error, fetchBookmarks } = useBookmarks();

const activeTab = ref<BookmarkTab>("ad");

const tabs = [
  { id: "ad" as const, label: "آگهی‌ها", icon: "lucide:briefcase" },
  { id: "project" as const, label: "پروژه‌ها", icon: "lucide:folder" },
  { id: "company" as const, label: "سازمان‌ها", icon: "svg:buildings-5" },
  { id: "user" as const, label: "کارجویان", icon: "svg:users-1" },
  // { id: 'consultant' as const, label: 'مشاوران', icon: 'mdi:headset' },
];

const totalCount = computed(() => countBookmarks(groups.value));

/** Map UI tab → API toggle `type` body value. */
const toggleTypeByTab: Record<BookmarkTab, string> = {
  ad: "ads",
  project: "projects",
  company: "companies",
  user: "users",
  consultant: "users",
};

async function removeBookmark(id: number | string, tab: BookmarkTab) {
  try {
    await api.post<ApiResponse>(`/bookmarks/toggle/${id}`, {
      type: toggleTypeByTab[tab],
    });
    await fetchBookmarks();
    $toast.success("نشان حذف شد");
  } catch (err: any) {
    if (err?.status !== 401) {
      $toast.error(err?.message || "خطا در حذف نشان");
    }
  }
}

useSeoMeta({
  title: "نشان شده‌ها",
});
</script>
