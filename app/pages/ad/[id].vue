<template>
  <div>
    <AdDetailView
      v-if="ad"
      :ad="ad"
      :similar-ads="similarAds"
      @resume="showResumeModal"
      @report-issue="showReportModal"
      @bookmark-change="
        (value) => {
          if (ad) ad.is_bookmarked = value;
        }
      "
    />

    <dialog1
      id="ad-resume-login-modal"
      :title="ad?.title ?? ''"
      type="warning"
      :width="420"
    >
      <p class="px-8 text-sm font-normal text-gray-600">
        لطفا برای ارسال رزومه از طریق دکمه زیر وارد حساب کاربری خود شوید
      </p>
      <form method="dialog">
        <NuxtLink to="/account" class="btn btn-primary mt-4 w-full">
          ورود و ثبdddت‌نام
        </NuxtLink>
      </form>
    </dialog1>

    <ReportIssueModal
      ref="reportIssueModalRef"
      :target-id="ad?.id ?? adId"
      type="ads"
    />
  </div>
</template>

<script setup lang="ts">
import AdDetailView from "./components/AdDetailView.vue";
import ReportIssueModal from "~/pages/jobs/components/ReportIssueModal.vue";
import { STATIC_ADS } from "./data/static-ads";
import { getStaticAdDetail } from "./data/static-ad-details";
import { getAdDetailSeoMeta } from "~/utils/ad-seo";

const route = useRoute();
const adId = computed(() => String(route.params.id ?? ""));
const user = useSanctumUser();

if (user.value) {
  await navigateTo(`/jobs/${adId.value}`, { replace: true });
}

watch(user, (value) => {
  if (value) {
    navigateTo(`/jobs/${adId.value}`, { replace: true });
  }
});

const ad = computed(() => getStaticAdDetail(adId.value));

if (import.meta.server && !user.value && !ad.value) {
  throw createError({ statusCode: 404, statusMessage: "آگهی یافت نشد" });
}

const similarAds = computed(() =>
  STATIC_ADS.filter((item) => String(item.id) !== adId.value).slice(0, 6),
);

const reportIssueModalRef = ref<InstanceType<typeof ReportIssueModal> | null>(
  null,
);

function showResumeModal() {
  if (!import.meta.client) return;
  const modal = document.getElementById(
    "ad-resume-login-modal",
  ) as HTMLDialogElement | null;
  modal?.showModal();
}

function showReportModal() {
  reportIssueModalRef.value?.showModal();
}

const adSeo = computed(() => getAdDetailSeoMeta(ad.value));

useSeoMeta({
  title: () => adSeo.value.title,
  description: () => adSeo.value.description,
});
</script>
