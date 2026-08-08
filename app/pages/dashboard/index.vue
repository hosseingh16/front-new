<template>
  <div class="space-y-8">
    <section>
      <DashboardStatusAlert
        v-if="statusAlert"
        v-bind="statusAlert"
        @dismiss="dismissStatusAlert"
      />

      <h1
        class="font-yb-bold text-xl text-text-tertiary md:text-2xl"
        :class="{ 'mt-4': statusAlert }"
      >
        پیشخوان
      </h1>

      <div class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <EmployerDashboardShortcutCard
          v-for="card in dashboardActionCards"
          :key="card.key"
          :title="card.title"
          :subtitle="card.subtitle"
          :icon="card.icon"
          :to="card.to"
          :disabled="card.disabled"
        />
      </div>

      <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <EmployerDashboardShortcutCard
          class="sm:col-span-2 lg:col-span-2"
          title="اظهارنامه عملکرد"
          :subtitle="performanceSubtitle"
          icon="svg:illust-create-account"
          to="/dashboard/tax-returns"
        />
      </div>
    </section>

    <section>
      <div class="flex items-center justify-between gap-3">
        <h2 class="font-yb-bold text-lg text-text-tertiary md:text-xl">
          آگهی‌های من
        </h2>
        <NuxtLink
          to="/dashboard/employer/ads"
          class="flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80"
        >
          مشاهده همه
          <icons-arrow color="#4864e1" :size="15" class="mr-1" />
        </NuxtLink>
      </div>

      <EmployerDashboardAdsPanel
        class="mt-4"
        :ads="previewAds"
        :loading="loading"
        :initialized="initialized"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import DashboardStatusAlert from "./components/DashboardStatusAlert.vue";
import EmployerDashboardShortcutCard from "./components/EmployerDashboardShortcutCard.vue";
import EmployerDashboardAdsPanel from "./components/EmployerDashboardAdsPanel.vue";
import type { DashboardStatusAlert as StatusAlert } from "~/utils/user-status-alerts";

definePageMeta({
  layout: "dashboard",
});

useSeoMeta({
  title: "پیشخوان کارفرما",
});

const { fetchStatus } = useUserStatus();
const { ads, adGroups, loading, initialized } = useEmployerAds();
const { total: taxReturnTotal, initialized: taxReturnsInitialized } =
  useTaxReturns();
const { dashboardActions, fetchMenu } = usePanelConfig();

const statusAlert = ref<Omit<StatusAlert, "id"> | null>(null);
const statusAlertId = ref<string | null>(null);

onMounted(async () => {
  if (!import.meta.client) return;
  showCompanyBanner.value = localStorage.getItem(BANNER_STORAGE_KEY) !== "1";
  await fetchMenu(true);
});

function dismissStatusAlert() {
  if (statusAlertId.value) {
    localStorage.setItem(
      getDashboardStatusAlertStorageKey(statusAlertId.value),
      "1",
    );
  }

  statusAlert.value = null;
  statusAlertId.value = null;
}

const activeAdsCount = computed(() => adGroups.value.active.length);

const ADS_DASHBOARD_ACTION_KEYS = new Set([
  "dashboard_action_opportunities",
  "dashboard_action_ads",
]);

const dashboardActionCards = computed(() =>
  dashboardActions.value.map((action) => {
    const isAdsAction =
      action.key != null && ADS_DASHBOARD_ACTION_KEYS.has(action.key);

    return {
      key: action.key ?? action.label,
      title: action.label,
      subtitle: resolveDashboardSubtitle(action, isAdsAction),
      icon: action.dashboardIcon ?? action.icon,
      to: isAdsAction ? "/dashboard/ad" : action.disabled ? "" : action.to,
      disabled: isAdsAction ? false : action.disabled,
    };
  }),
);

function resolveDashboardSubtitle(
  action: (typeof dashboardActions.value)[number],
  isAdsAction = false,
) {
  if (isAdsAction) return undefined;

  if (action.disabled) {
    return action.dashboardSubtitle ?? "به زودی";
  }

  if (action.key === "dashboard_action_create_fulltime_ad") {
    return `${toPersianDigits(activeAdsCount.value)} آگهی`;
  }

  if (action.key === "dashboard_action_create_parttime_ad") {
    return "۰ آگهی";
  }

  return action.dashboardSubtitle;
}

const performanceSubtitle = computed(() => {
  if (!taxReturnsInitialized.value) return "۰ ثبت شده";
  return `${toPersianDigits(taxReturnTotal.value)} ثبت شده`;
});

function toPersianDigits(value: number) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]!);
}

const previewAds = computed(() => ads.value.slice(0, 5));
</script>
