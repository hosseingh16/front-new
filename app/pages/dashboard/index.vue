<template>
  <div class="space-y-12">
    <section>
      <DashboardStatusAlert
        v-if="statusAlert && !isWelcomeVisible"
        v-bind="statusAlert"
        @dismiss="dismissStatusAlert"
      />

      <h1
        class="font-yb-bold text-xl text-text-tertiary md:text-2xl"
        :class="{ 'mt-4': statusAlert && !isWelcomeVisible }"
      >
        پیشخوان
      </h1>

      <div
        class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3"
        :class="isEmployer ? '' : 'lg:grid-cols-5'"
      >
        <EmployerDashboardShortcutCard
          v-for="card in dashboardActionCards"
          :key="card.key"
          :title="card.title"
          :subtitle="card.subtitle"
          :icon="card.icon"
          :to="card.to"
          :disabled="card.disabled"
        />

        <EmployerDashboardShortcutCard
          v-if="isEmployer"
          title="اظهارنامه عملکرد"
          :subtitle="performanceSubtitle"
          icon="svg:illust-create-account"
          to="/dashboard/tax-returns"
        />
      </div>
    </section>

    <section v-if="isEmployer">
      <div class="flex items-center justify-between gap-3">
        <h2 class="font-yb-bold text-lg text-text-tertiary md:text-xl">
          آخرین آگهی ها
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
        :loading="adsLoading"
        :initialized="adsInitialized"
      />
    </section>

    <section v-else>
      <div class="flex items-center justify-between gap-3">
        <h2 class="font-yb-bold text-lg text-text-primary md:text-xl">
          آخرین درخواست های شغلی
        </h2>
        <NuxtLink
          to="/dashboard/my-requests"
          class="inline-flex h-8 items-center gap-1 rounded-md bg-[rgba(72,100,225,0.08)] px-3 text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80"
        >
          مشاهده همه
          <Icon
            name="svg:receive-briefcase"
            size="20"
            class="size-5 shrink-0"
          />
        </NuxtLink>
      </div>

      <JobseekerDashboardRequestsPanel
        class="mt-4"
        :requests="previewRequests"
        :loading="requestsLoading"
        :initialized="requestsInitialized"
        @cancel="openCancelDialog"
        @details="openDetailsModal"
      />
    </section>

    <MyRequestDetailModal ref="detailModalRef" :request="selectedRequest" />

    <ConfirmDialog
      ref="confirmDialogRef"
      title="لغو درخواست"
      subtitle="آیا از لغو این درخواست مطمئن هستید؟"
      description="پس از لغو، درخواست شما از لیست حذف می‌شود."
      confirm-text="لغو درخواست"
      cancel-text="نادیده گرفتن"
      icon="svg:delete"
      @confirm="handleCancelConfirm"
      @cancel="pendingCancel = null"
    />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from "~/components/M/ConfirmDialog.vue";
import DashboardStatusAlert from "./components/DashboardStatusAlert.vue";
import EmployerDashboardShortcutCard from "./components/EmployerDashboardShortcutCard.vue";
import EmployerDashboardAdsPanel from "./components/EmployerDashboardAdsPanel.vue";
import JobseekerDashboardRequestsPanel from "./components/JobseekerDashboardRequestsPanel.vue";
import MyRequestDetailModal from "./components/MyRequestDetailModal.vue";
import type { MyRequest } from "~/types/my-request";
import type { DashboardStatusAlert as StatusAlert } from "~/utils/user-status-alerts";

definePageMeta({
  layout: "dashboard",
});

const { isEmployer } = useCurrentUser();

useSeoMeta({
  title: computed(() => (isEmployer.value ? "پیشخوان کارفرما" : "پیشخوان")),
});

const { fetchStatus } = useUserStatus();
const { isWelcomeVisible } = useFirstVisitWelcome();
const {
  ads,
  adGroups,
  loading: adsLoading,
  initialized: adsInitialized,
  fetchAds,
} = useEmployerAds({ immediate: false });
const {
  total: taxReturnTotal,
  initialized: taxReturnsInitialized,
  fetchTaxReturns,
} = useTaxReturns({ immediate: false });
const {
  requests,
  loading: requestsLoading,
  initialized: requestsInitialized,
  fetchRequests,
  cancelRequest,
} = useMyRequests({ immediate: false });
const { dashboardActions, fetchMenu } = usePanelConfig();

const statusAlert = ref<Omit<StatusAlert, "id"> | null>(null);
const statusAlertId = ref<string | null>(null);
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const detailModalRef = ref<InstanceType<typeof MyRequestDetailModal> | null>(
  null,
);
const pendingCancel = ref<MyRequest | null>(null);
const selectedRequest = ref<MyRequest | null>(null);

onMounted(async () => {
  if (!import.meta.client) return;

  await fetchMenu(true);

  if (isEmployer.value) {
    await Promise.all([fetchAds(), fetchTaxReturns()]);
  } else {
    await fetchRequests();
  }

  const status = await fetchStatus();
  if (!status) return;

  const alert = getDashboardStatusAlert(status);
  if (!alert) return;

  if (alert.dismissible) {
    const storageKey = getDashboardStatusAlertStorageKey(alert.id);
    if (localStorage.getItem(storageKey) === "1") return;
  }

  statusAlertId.value = alert.id;
  statusAlert.value = {
    type: alert.type,
    message: alert.message,
    actionLabel: alert.actionLabel,
    actionTo: alert.actionTo,
    actionIcon: alert.actionIcon,
    dismissible: alert.dismissible,
  };
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

  if (action.key === "dashboard_action_create_ad") {
    return `${toPersianDigits(activeAdsCount.value)} آگهی`;
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
const previewRequests = computed(() => requests.value.slice(0, 6));

function openCancelDialog(request: MyRequest) {
  pendingCancel.value = request;
  confirmDialogRef.value?.showModal();
}

function openDetailsModal(request: MyRequest) {
  selectedRequest.value = request;
  nextTick(() => {
    detailModalRef.value?.showModal();
  });
}

async function handleCancelConfirm() {
  if (!pendingCancel.value) return;

  try {
    await cancelRequest(pendingCancel.value.id);
    pendingCancel.value = null;
    confirmDialogRef.value?.closeModal();
  } catch (err: unknown) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message?: string }).message)
        : "خطا در لغو درخواست";
    const { $toast } = useNuxtApp();
    $toast.error(message);
  }
}
</script>
