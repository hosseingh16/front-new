<template>
  <div>
    <nav class="mb-4 hidden text-sm text-text-passive md:block">
      <NuxtLink to="/" class="transition-colors hover:text-primary-500">
        <Icon name="svg:home" size="16" />
      </NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink
        to="/dashboard/employer/ads"
        class="transition-colors hover:text-primary-500"
      >
        آگهی‌های من
      </NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-text-tertiary">{{ adTitle }}</span>
    </nav>

    <p v-if="!adId" class="py-12 text-center text-sm text-error">
      شناسه آگهی نامعتبر است.
    </p>

    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex min-w-0 items-center gap-2">
          <h1
            class="truncate font-yb-bold text-lg text-text-tertiary md:text-xl"
          >
            {{ adTitle }}
          </h1>
          <span
            class="shrink-0 rounded-full bg-surface-100 px-3 py-1 text-xs font-semibold text-text-passive"
          >
            {{ toPersianDigits(total) }} رزومه
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
          <div class="hidden items-center justify-between gap-4 md:flex">
            <div
              class="flex items-center gap-2 rounded-lg border border-gray-default bg-[#F6F8FE] p-1"
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
            class="absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl bg-white"
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
                class="flex items-center gap-2 rounded-lg border border-gray-default bg-[#F6F8FE] p-1"
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
        <AdRequestFiltersSidebar
          v-model="requestFilters"
          class="col-span-full md:col-span-2"
        />

        <div
          id="ad-requests-results"
          class="col-span-full md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <template v-if="loading">
            <div class="space-y-4 col-span-full">
              <div
                v-for="n in 4"
                :key="`request-skeleton-${n}`"
                class="h-44 animate-pulse rounded-2xl bg-surface-200"
              />
            </div>
          </template>

          <p v-else-if="error" class="py-12 text-center text-sm text-error">
            {{ error }}
          </p>

          <div
            v-else-if="filteredRequests.length"
            class="space-y-4 col-span-full"
          >
            <AdRequestCard
              v-for="request in filteredRequests"
              :key="request.id"
              :request="request"
              :action-loading="actionLoadingId === request.id"
              @view="handleViewRequest(request)"
              @confirm="handleConfirmRequest(request.id)"
              @reject="handleRejectRequest(request.id)"
            />

            <div class="mt-4 flex justify-center col-span-full">
              <Pagination
                :current-page="page"
                :last-page="lastPage"
                @update:current-page="onPageChange"
              />
            </div>
          </div>

          <NoResult
            v-else-if="initialized"
            class="col-span-full"
            :title="emptyStateTitle"
            :description="emptyStateDescription"
            icon="svg:no-result"
            :icon-size="180"
          />
        </div>
      </div>
    </template>

    <UserResumeModal
      v-model:open="showResumeModal"
      :request="activeRequest"
      :requests="filteredRequests"
      :action-loading="activeRequest ? actionLoadingId === activeRequest.id : false"
      @update:request="handleModalRequestChange"
      @confirm="handleConfirmRequest"
      @reject="handleRejectRequest"
    />
  </div>
</template>

<script setup lang="ts">
import NoResult from "~/components/Elements/NoResult.vue";
import Pagination from "~/components/Elements/Pagination.vue";
import AdRequestCard from "~/components/Elements/AdRequestCard.vue";
import AdRequestFiltersSidebar from "~/components/Elements/AdRequestFiltersSidebar.vue";
import UserResumeModal from "~/pages/users/components/UserResumeModal.vue";
import { toPersianDigits } from "~/composables/useCountUp";
import {
  DEFAULT_AD_REQUEST_STATUS_VALUES,
  type EmployerAdRequest,
  type EmployerAdRequestTab,
} from "~/types/employer-ad-request";
import {
  areAdRequestRouteQueriesEqual,
  employerAdRequestFiltersToRouteQuery,
  routeQueryToEmployerAdRequestFilters,
} from "~/utils/employer-ad-request-filters-query";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();

const adId = computed(() => {
  const value = Number(route.params.id);
  return Number.isFinite(value) && value > 0 ? value : 0;
});
const initialState = routeQueryToEmployerAdRequestFilters(route.query);

const requestFilters = ref(initialState.filters);
const page = ref(initialState.page);
const activeTab = ref<EmployerAdRequestTab>(initialState.tab);
const searchQuery = ref("");
const showSearch = ref(false);
const showMobileTabModal = ref(false);
const showResumeModal = ref(false);
const activeRequest = ref<EmployerAdRequest | null>(null);
const actionLoadingId = ref<number | null>(null);

const { adGroups } = useEmployerAds();
const {
  requests,
  lastPage,
  total,
  loading,
  initialized,
  error,
  confirmRequest,
  rejectRequest,
  markRequestSeen,
} = useEmployerAdRequests(adId, requestFilters, page, activeTab);

const tabs = [
  { id: "requests" as const, label: "درخواست‌ها" },
  { id: "bookmarked" as const, label: "نشان‌گذاری شده‌ها" },
];

const activeTabLabel = computed(
  () => tabs.find((tab) => tab.id === activeTab.value)?.label ?? "درخواست‌ها",
);

const adTitle = computed(() => {
  const fromAds = adGroups.value.total.find(
    (ad) => ad.id === adId.value,
  )?.title;
  if (fromAds) return fromAds;

  const fromRequest = requests.value[0]?.requested_job_title;
  if (fromRequest) return fromRequest;

  return "درخواست‌های شغلی";
});

const hasActiveFilters = computed(() => {
  const allStatuses = DEFAULT_AD_REQUEST_STATUS_VALUES;
  const selectedStatuses = requestFilters.value.statuses;

  return (
    selectedStatuses.length !== allStatuses.length ||
    requestFilters.value.experience.length > 0 ||
    requestFilters.value.gender != null ||
    activeTab.value === "bookmarked" ||
    searchQuery.value.trim().length > 0
  );
});

const filteredRequests = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return requests.value;

  return requests.value.filter((request) => {
    const name = request.user?.name?.toLowerCase() ?? "";
    const phone = request.user?.phone?.toLowerCase() ?? "";
    const jobTitle = request.requested_job_title?.toLowerCase() ?? "";
    const personalTitle =
      request.user?.personal?.job_title?.toLowerCase() ?? "";

    return (
      name.includes(query) ||
      phone.includes(query) ||
      jobTitle.includes(query) ||
      personalTitle.includes(query)
    );
  });
});

const emptyStateTitle = computed(() =>
  hasActiveFilters.value ? "نتیجه‌ای پیدا نشد" : "رزومه‌ای دریافت نشده",
);

const emptyStateDescription = computed(() =>
  hasActiveFilters.value
    ? "تنظیمات فعلی فیلترها هیچ رزومه‌ای را نمایش نمی‌دهد."
    : "هنوز هیچ درخواستی برای این آگهی ثبت نشده است.",
);

const emptyStateActionLabel = computed(() =>
  hasActiveFilters.value || activeTab.value === "requests" ? "" : "",
);

let urlSyncTimer: ReturnType<typeof setTimeout> | null = null;
let syncingFromRoute = false;

function syncRouteQuery() {
  if (syncingFromRoute) return;

  const nextQuery = employerAdRequestFiltersToRouteQuery(
    requestFilters.value,
    page.value,
    activeTab.value,
  );

  if (areAdRequestRouteQueriesEqual(route.query, nextQuery)) return;

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
  document.body.style.overflow = lock ? "hidden" : "";
}

function scrollToResults() {
  if (!import.meta.client) return;

  const el = document.getElementById("ad-requests-results");
  if (!el) return;

  const yOffset = -100;
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function onPageChange(nextPage: number) {
  page.value = nextPage;
  nextTick(scrollToResults);
}

async function handleViewRequest(request: EmployerAdRequest) {
  if (!request.user?.id) {
    $toast.error("شناسه کاربر یافت نشد");
    return;
  }

  activeRequest.value = request;
  showResumeModal.value = true;
  await markRequestSeenIfNeeded(request.id);
}

async function handleModalRequestChange(request: EmployerAdRequest) {
  activeRequest.value = request;
  await markRequestSeenIfNeeded(request.id);
}

async function markRequestSeenIfNeeded(requestId: number) {
  actionLoadingId.value = requestId;
  try {
    await markRequestSeen(requestId);
  } catch (err: any) {
    $toast.error(err?.message || "خطا در مشاهده رزومه");
  } finally {
    actionLoadingId.value = null;
  }
}

async function handleConfirmRequest(requestId: number) {
  actionLoadingId.value = requestId;
  try {
    await confirmRequest(requestId);
    $toast.success("درخواست با موفقیت تایید شد");
  } catch (err: any) {
    $toast.error(err?.message || "تایید درخواست با خطا مواجه شد");
  } finally {
    actionLoadingId.value = null;
  }
}

async function handleRejectRequest(requestId: number) {
  actionLoadingId.value = requestId;
  try {
    await rejectRequest(requestId);
    $toast.success("درخواست رد شد");
  } catch (err: any) {
    $toast.error(err?.message || "رد درخواست با خطا مواجه شد");
  } finally {
    actionLoadingId.value = null;
  }
}

watch(filteredRequests, (list) => {
  if (!activeRequest.value) return;

  const updated = list.find((item) => item.id === activeRequest.value?.id);
  if (updated) activeRequest.value = updated;
});

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
  requestFilters,
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

    const next = routeQueryToEmployerAdRequestFilters(query);
    const filtersJson = JSON.stringify(next.filters);
    const currentJson = JSON.stringify(requestFilters.value);

    if (
      filtersJson === currentJson &&
      next.page === page.value &&
      next.tab === activeTab.value
    ) {
      return;
    }

    syncingFromRoute = true;
    requestFilters.value = next.filters;
    page.value = next.page;
    activeTab.value = next.tab;
    nextTick(() => {
      syncingFromRoute = false;
    });
  },
);

onUnmounted(() => {
  if (urlSyncTimer) clearTimeout(urlSyncTimer);
  lockBodyScroll(false);
  if (import.meta.client) {
    document.body.style.overflow = "";
  }
});

useSeoMeta({
  title: () => `${adTitle.value} | درخواست‌های شغلی`,
});
</script>
