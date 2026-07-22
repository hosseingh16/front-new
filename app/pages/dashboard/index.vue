<template>
  <div class="space-y-8">
    <EmployerDashboardBanner
      v-if="showCompanyBanner"
      @dismiss="dismissCompanyBanner"
    />

    <section>
      <h1 class="font-yb-bold text-xl text-text-tertiary md:text-2xl">
        پیشخوان
      </h1>

      <div class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <EmployerDashboardShortcutCard
          v-for="card in shortcutCards"
          :key="card.id"
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
import EmployerDashboardBanner from "./components/EmployerDashboardBanner.vue";
import EmployerDashboardShortcutCard from "./components/EmployerDashboardShortcutCard.vue";
import EmployerDashboardAdsPanel from "./components/EmployerDashboardAdsPanel.vue";

definePageMeta({
  layout: "dashboard",
});

useSeoMeta({
  title: "پیشخوان کارفرما",
});

const BANNER_STORAGE_KEY = "employer-dashboard-company-banner-dismissed";

const { ads, adGroups, loading, initialized } = useEmployerAds();
const { total: taxReturnTotal, initialized: taxReturnsInitialized } =
  useTaxReturns();

const showCompanyBanner = ref(true);

onMounted(() => {
  if (!import.meta.client) return;
  showCompanyBanner.value = localStorage.getItem(BANNER_STORAGE_KEY) !== "1";
});

function dismissCompanyBanner() {
  showCompanyBanner.value = false;
  if (import.meta.client) {
    localStorage.setItem(BANNER_STORAGE_KEY, "1");
  }
}

const activeAdsCount = computed(() => adGroups.value.active.length);

const shortcutCards = computed(() => [
  {
    id: "opportunities",
    title: "فرصت‌های شغلی",
    subtitle: "به زودی",
    icon: "svg:illust-job-user",
    to: "",
    disabled: true,
  },
  {
    id: "fulltime",
    title: "آگهی تمام‌وقت",
    subtitle: `${toPersianDigits(activeAdsCount.value)} آگهی`,
    icon: "svg:illust-create-job",
    to: "/dashboard/employer/ads/create",
    disabled: false,
  },
  {
    id: "parttime",
    title: "آگهی نیمه‌وقت",
    subtitle: "۰ آگهی",
    icon: "svg:illust-create-bag",
    to: "/dashboard/employer/ads/create",
    disabled: false,
  },
  {
    id: "project",
    title: "پروژه حسابداری",
    subtitle: "به زودی",
    icon: "svg:illust-project-user",
    to: "",
    disabled: true,
  },
  {
    id: "consulting",
    title: "نوبت مشاوره",
    subtitle: "به زودی",
    icon: "svg:illust-consulting-user",
    to: "",
    disabled: true,
  },
]);

const performanceSubtitle = computed(() => {
  if (!taxReturnsInitialized.value) return "۰ ثبت شده";
  return `${toPersianDigits(taxReturnTotal.value)} ثبت شده`;
});

function toPersianDigits(value: number) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]!);
}

const previewAds = computed(() => ads.value.slice(0, 5));
</script>
