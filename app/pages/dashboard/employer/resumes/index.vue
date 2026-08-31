<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex min-w-0 items-center gap-2">
        <h1 class="font-yb-bold text-lg text-text-tertiary md:text-xl">
          بانک رزومه
        </h1>
        <span
          v-if="initialized"
          class="shrink-0 rounded-full bg-surface-100 px-3 py-1 text-xs font-semibold text-text-passive"
        >
          {{ toPersianDigits(total) }} کارجو
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn btn-ghost h-10 w-10 p-0"
          aria-label="جستجو"
          @click="showSearch = !showSearch"
        >
          <Icon name="svg:search-1" size="20" />
        </button>

        <div
          class="hidden items-center gap-2 rounded-lg border border-gray-default bg-surface-soft p-1 md:flex"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="rounded-md cursor-pointer px-4 py-2 text-sm font-semibold transition-colors"
            :class="
              activeTab === tab.id
                ? 'border border-gray-default bg-white text-text-tertiary shadow-sm'
                : 'text-text-passive hover:text-text-secondary'
            "
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <button
          type="button"
          class="btn btn-ghost h-10 gap-2 px-3 text-sm font-semibold text-text-tertiary md:hidden"
          @click="openMobileTabModal"
        >
          {{ activeTabLabel }}
          <Icon name="svg:chevron-down" size="12" />
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showMobileTabModal"
        class="fixed inset-0 z-100 md:hidden"
        dir="rtl"
        @keydown.escape="closeMobileTabModal"
      >
        <div
          class="modal-backdrop absolute inset-0"
          @click="closeMobileTabModal"
        />
        <div
          class="absolute inset-x-0 bottom-[72px] flex flex-col rounded-t-2xl bg-white sm:bottom-0"
        >
          <div
            class="flex flex-row-reverse items-center justify-between border-b border-gray-default px-4 py-4"
          >
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary"
              aria-label="بستن"
              @click="closeMobileTabModal"
            >
              <Icon name="svg:close" size="20" />
            </button>
            <h3 class="text-base font-yb-bold text-text-tertiary">
              نحوه نمایش
            </h3>
          </div>

          <div class="px-4 py-5">
            <div
              class="flex items-center gap-2 rounded-lg border border-gray-default bg-surface-soft p-1"
            >
              <button
                v-for="tab in tabs"
                :key="tab.id"
                type="button"
                class="flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors"
                :class="
                  activeTab === tab.id
                    ? 'border border-gray-default bg-white text-text-tertiary shadow-sm'
                    : 'text-text-passive hover:text-text-secondary'
                "
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <div class="border-t border-gray-default p-4">
            <button
              type="button"
              class="btn btn-primary h-11 w-full rounded-lg text-sm font-yb-bold"
              @click="closeMobileTabModal"
            >
              مشاهده نتایج
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <div v-if="showSearch" class="mt-4">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="جستجو در رزومه‌ها..."
        class="h-10 w-full rounded-lg border border-gray-default bg-white px-3 text-sm outline-none focus:border-primary-500"
      />
    </div>

    <div class="mt-4 grid items-start gap-4 md:grid-cols-7">
      <ResumeBankFiltersSidebar
        v-model="resumeFilters"
        class="col-span-full md:col-span-2"
      />

      <div id="resume-bank-results" class="col-span-full md:col-span-5">
        <template v-if="loading">
          <div class="space-y-4">
            <div
              v-for="n in 4"
              :key="`resume-skeleton-${n}`"
              class="h-44 animate-pulse rounded-2xl bg-surface-200"
            />
          </div>
        </template>

        <p v-else-if="error" class="py-12 text-center text-sm text-error">
          {{ error }}
        </p>

        <div v-else-if="filteredUsers.length" class="space-y-4">
          <ResumeBankCard
            v-for="resumeUser in filteredUsers"
            :key="resumeUser.id"
            :user="resumeUser"
            @view="handleViewUser(resumeUser)"
            @bookmark-change="
              (bookmarked) => onUserBookmarkChange(resumeUser.id, bookmarked)
            "
          />

          <div v-if="lastPage > 1" class="mt-4 flex justify-center">
            <Pagination
              :current-page="page"
              :last-page="lastPage"
              @update:current-page="onPageChange"
            />
          </div>
        </div>

        <NoResult
          v-else-if="initialized"
          :title="emptyStateTitle"
          :description="emptyStateDescription"
          icon="svg:no-result"
          :icon-size="180"
        />
      </div>
    </div>

    <ResumeBankUserModal
      v-model:open="showResumeModal"
      :user="activeUser"
      :users="filteredUsers"
      @update:user="activeUser = $event"
      @bookmark-change="onUserBookmarkChange"
    />
  </div>
</template>

<script setup lang="ts">
import NoResult from "~/components/Elements/NoResult.vue";
import Pagination from "~/components/Elements/Pagination.vue";
import ResumeBankCard from "~/components/Elements/ResumeBankCard.vue";
import ResumeBankFiltersSidebar from "~/components/Elements/ResumeBankFiltersSidebar.vue";
import ResumeBankUserModal from "~/pages/users/components/ResumeBankUserModal.vue";
import { toPersianDigits } from "~/composables/useCountUp";
import type { ResumeBankTab, ResumeBankUser } from "~/types/resume-bank";
import {
  areResumeBankRouteQueriesEqual,
  resumeBankFiltersToRouteQuery,
  routeQueryToResumeBankFilters,
} from "~/utils/resume-bank-query";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();

const initialState = routeQueryToResumeBankFilters(route.query);
const resumeFilters = ref(initialState.filters);
const page = ref(initialState.page);
const activeTab = ref<ResumeBankTab>(initialState.tab);
const searchQuery = ref("");
const showSearch = ref(false);
const showMobileTabModal = ref(false);
const showResumeModal = ref(false);
const activeUser = ref<ResumeBankUser | null>(null);

const { users, lastPage, total, loading, initialized, error, refresh } =
  useResumeBank(resumeFilters, page, activeTab);

const tabs = [
  { id: "all" as const, label: "همه کارجویان" },
  { id: "bookmarked" as const, label: "نشان‌شده‌ها" },
];

const activeTabLabel = computed(
  () => tabs.find((tab) => tab.id === activeTab.value)?.label ?? "همه کارجویان",
);

const hasActiveFilters = computed(() => {
  const filters = resumeFilters.value;
  return (
    filters.titleSearch.trim().length > 0 ||
    filters.jobTitles.length > 0 ||
    filters.skills.length > 0 ||
    filters.jobStatuses.length > 0 ||
    filters.experience.length > 0 ||
    filters.salaries.length > 0 ||
    filters.education.length > 0 ||
    filters.provinces.length > 0 ||
    filters.gender != null ||
    searchQuery.value.trim().length > 0
  );
});

const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return users.value;

  return users.value.filter((resumeUser) => {
    const name = resumeUser.name?.toLowerCase() ?? "";
    const phone = resumeUser.phone?.toLowerCase() ?? "";
    const jobTitle = resumeUser.personal?.job_title?.toLowerCase() ?? "";
    const wantedJob = resumeUser.personal?.wanted_job?.toLowerCase() ?? "";

    return (
      name.includes(query) ||
      phone.includes(query) ||
      jobTitle.includes(query) ||
      wantedJob.includes(query)
    );
  });
});

const emptyStateTitle = computed(() =>
  hasActiveFilters.value ? "نتیجه‌ای پیدا نشد" : "رزومه‌ای یافت نشد",
);

const emptyStateDescription = computed(() =>
  hasActiveFilters.value
    ? "تنظیمات فعلی فیلترها هیچ رزومه‌ای را نمایش نمی‌دهد."
    : activeTab.value === "bookmarked"
    ? "هنوز هیچ کارجویی را نشان نکرده‌اید."
    : "در حال حاضر رزومه‌ای برای نمایش موجود نیست.",
);

let urlSyncTimer: ReturnType<typeof setTimeout> | null = null;
let syncingFromRoute = false;
let bodyScrollLockCount = 0;

function syncRouteQuery() {
  if (syncingFromRoute) return;

  const nextQuery = resumeBankFiltersToRouteQuery(
    resumeFilters.value,
    page.value,
    activeTab.value,
  );

  if (areResumeBankRouteQueriesEqual(route.query, nextQuery)) return;

  syncingFromRoute = true;
  router.replace({ path: route.path, query: nextQuery });
}

function openMobileTabModal() {
  showMobileTabModal.value = true;
  lockBodyScroll(true);
}

function closeMobileTabModal() {
  showMobileTabModal.value = false;
  lockBodyScroll(false);
}

function lockBodyScroll(lock: boolean) {
  if (!import.meta.client) return;

  if (lock) {
    bodyScrollLockCount += 1;
    document.body.style.overflow = "hidden";
    return;
  }

  bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);
  if (bodyScrollLockCount === 0) {
    document.body.style.overflow = "";
  }
}

function scrollToResults() {
  if (!import.meta.client) return;

  const el = document.getElementById("resume-bank-results");
  if (!el) return;

  const yOffset = -100;
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function onPageChange(nextPage: number) {
  page.value = nextPage;
  nextTick(scrollToResults);
}

function handleViewUser(resumeUser: ResumeBankUser) {
  activeUser.value = resumeUser;
  showResumeModal.value = true;
}

async function onUserBookmarkChange(userId: number, bookmarked: boolean) {
  const resumeUser = users.value.find((item) => item.id === userId);
  if (resumeUser) resumeUser.is_bookmarked = bookmarked;

  if (activeTab.value === "bookmarked" && !bookmarked) {
    await refresh();
  }
}

watch(page, () => {
  syncRouteQuery();
});

watch(activeTab, () => {
  if (!syncingFromRoute && page.value !== 1) {
    page.value = 1;
  }
  syncRouteQuery();
});

watch(
  resumeFilters,
  (value, oldValue) => {
    if (
      !syncingFromRoute &&
      JSON.stringify(value) !== JSON.stringify(oldValue) &&
      page.value !== 1
    ) {
      page.value = 1;
    }

    if (urlSyncTimer) clearTimeout(urlSyncTimer);
    urlSyncTimer = setTimeout(syncRouteQuery, 300);
  },
  { deep: true },
);

watch(
  () => route.query,
  (query) => {
    if (syncingFromRoute) {
      syncingFromRoute = false;
      return;
    }

    const next = routeQueryToResumeBankFilters(query);
    const filtersJson = JSON.stringify(next.filters);
    const currentJson = JSON.stringify(resumeFilters.value);

    if (
      filtersJson === currentJson &&
      next.page === page.value &&
      next.tab === activeTab.value
    ) {
      return;
    }

    syncingFromRoute = true;
    resumeFilters.value = next.filters;
    page.value = next.page;
    activeTab.value = next.tab;
    nextTick(() => {
      syncingFromRoute = false;
    });
  },
);

onUnmounted(() => {
  if (urlSyncTimer) clearTimeout(urlSyncTimer);
  if (import.meta.client && bodyScrollLockCount === 0) {
    document.body.style.overflow = "";
  }
});

useSeoMeta({
  title: "بانک رزومه",
});
</script>
