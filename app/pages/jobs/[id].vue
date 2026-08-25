<template>
  <div :class="embedded ? 'pb-10' : 'bg-surface-50 pb-12'">
    <section
      class="bg-cover bg-center bg-no-repeat"
      :class="embedded ? 'overflow-hidden rounded-2xl' : ''"
      :style="{ backgroundImage: `url('${coverImage}')` }"
    >
      <div :class="embedded ? 'px-4 pt-4 pb-10' : 'custom-pad pt-6 pb-12'">
        <nav class="text-sm text-text-passive">
          <NuxtLink
            :to="embedded ? '/dashboard' : '/'"
            class="transition-colors hover:text-primary-500"
          >
            <Icon name="svg:home" size="16" />
          </NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink
            :to="adsListPath"
            class="transition-colors hover:text-primary-500"
          >
            فرصت‌های شغلی
          </NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-text-tertiary">{{ ad?.title ?? "آگهی" }}</span>
        </nav>
      </div>

      <div :class="embedded ? 'px-4 pb-0' : 'custom-pad pb-0'">
        <div
          v-if="loading && !ad"
          class="animate-pulse rounded-t-2xl bg-surface-50 p-6"
          :class="embedded ? '' : 'mt-4'"
        >
          <div class="h-20 rounded-xl bg-surface-200" />
          <div class="mt-6 h-10 rounded bg-surface-200" />
        </div>

        <div
          v-else-if="ad"
          class="relative z-10 rounded-t-2xl bg-surface-50"
          :class="embedded ? '' : 'mt-4'"
        >
          <div
            class="flex flex-wrap items-start justify-between gap-4 p-5 md:p-6"
          >
            <div class="flex min-w-0 items-center gap-4">
              <div
                class="flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#ECF4D9]"
              >
                <NuxtLink
                  v-if="ad.company?.slug"
                  :to="`/companies/${ad.company.slug}`"
                  class="block h-full w-full"
                  tabindex="-1"
                  aria-label="نمایه شرکت"
                >
                  <img
                    :src="companyLogoSrc"
                    :alt="ad.company_name"
                    class="h-full w-full object-cover"
                  />
                </NuxtLink>
                <img
                  v-else
                  :src="companyLogoSrc"
                  :alt="ad.company_name"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="min-w-0">
                <p class="text-sm text-text-passive">{{ ad.company_name }}</p>
                <h1
                  class="mt-1 font-yb-bold text-xl text-text-primay md:text-2xl"
                >
                  {{ ad.title }}
                </h1>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <p v-if="publishDateLabel" class="text-sm text-text-passive">
                تاریخ انتشار:
                <span class="text-text-passive">{{ publishDateLabel }}</span>
              </p>

              <button
                type="button"
                class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-default bg-white transition-opacity hover:opacity-80"
                aria-label="اشتراک‌گذاری"
                @click="shareAd"
              >
                <Icon name="material-symbols:share-outline" size="16" />
              </button>
              <BookmarkToggleButton
                v-if="ad?.id"
                :target-id="ad.id"
                type="ads"
                label="نشان کردن"
                :icon-only="isMobile"
                :initial-bookmarked="Boolean(ad.is_bookmarked)"
                @update:bookmarked="
                  (value) => {
                    if (ad) ad.is_bookmarked = value;
                  }
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div :class="embedded ? '' : 'custom-pad'">
      <p v-if="error" class="mt-8 py-12 text-center text-sm text-error">
        {{ error }}
      </p>

      <template v-else-if="ad">
        <AdDetailContent
          :ad="ad"
          @resume="showResumeModal"
          @report-issue="showReportModal"
        />
        <section
          v-if="loadingSimilar || similarAds.length"
          class="mt-10"
        >
          <div class="mb-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-1">
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h2 class="font-yb-bold text-base text-text-primay">
                آگهی‌های مشابه
              </h2>
            </div>
            <NuxtLink
              :to="adsListPath"
              class="text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80"
            >
              مشاهده بیشتر
            </NuxtLink>
          </div>

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <template v-if="loadingSimilar">
              <ItemBox
                v-for="n in 6"
                :key="`similar-skeleton-${n}`"
                variant="ad"
                loading
              />
            </template>
            <template v-else>
              <ItemBox
                v-for="opportunity in similarAds"
                :key="opportunity.item.id"
                variant="ad"
                :item="opportunity.item"
              />
            </template>
          </div>
        </section>
      </template>
    </div>

    <FastLoginModal
      ref="fastLoginRef"
      :ad-id="ad?.id ?? adId"
      @applied="showSuccessModal"
      @apply-failed="onApplyFailedAfterLogin"
    />

    <dialog
      ref="successDialogRef"
      id="ad-resume-success-modal"
      class="modal"
      @close="markApplied"
      @click="handleSuccessBackdropClick"
    >
      <div
        class="modal-box relative w-full max-w-105 rounded-2xl p-6 pt-10 text-center"
        @click.stop
      >
        <button
          type="button"
          class="absolute left-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center text-text-passive transition-opacity hover:opacity-70"
          aria-label="بستن"
          @click="closeSuccessModal"
        >
          <icons-close color="#667085" class="h-7 w-7" />
        </button>

        <img :src="createAccountIllust" alt="" class="mx-auto h-45 w-auto" />

        <h2 class="mt-2 font-yb-bold text-xl text-text-primay md:text-2xl">
          رزومه شما با موفقیت ارسال شد
        </h2>
        <p class="mt-3 text-sm leading-7 text-text-passive">
          رزومه شما با موفقیت به فرصت شغلی موردنظر ارسال شد. می‌توانید وضعیت
          بررسی رزومه خود را در داشبورد دنبال کنید.
        </p>

        <button
          type="button"
          class="btn btn-primary mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-xl"
          @click="goToJobRequests"
        >
          <Icon name="svg:breifcase-recieve" size="18" />
          <span>درخواست‌های شغلی</span>
        </button>
      </div>
    </dialog>

    <ReportIssueModal
      ref="reportIssueModalRef"
      :target-id="ad?.id ?? adId"
      type="ads"
    />
  </div>
</template>

<script setup lang="ts">
import ItemBox from "~/components/Elements/item-box.vue";
import BookmarkToggleButton from "~/components/Elements/BookmarkToggleButton.vue";
import FastLoginModal from "~/components/FastLoginModal.vue";
import AdDetailContent from "./components/AdDetailContent.vue";
import ReportIssueModal from "./components/ReportIssueModal.vue";
import { useAd, useSimilarAds } from "~/composables/useAd";
import { formatJalaliDate } from "~/utils/format-jalali-date";
import { resolveCompanyLogoDisplaySrc } from "~/utils/company-basic-info";
import { getAdDetailSeoMeta } from "~/utils/ad-seo";
import createAccountIllust from "~/assets/vectors/illustrations/create-account.svg";
import { paths } from "~/routes";

const route = useRoute();
const adId = computed(() => String(route.params.id ?? ""));

const { isAuthenticated } = useSanctumAuth();
const { needsRoleSelection, ensureRoleForAction } = useRoleGate();
const { applyToAd, loading: applyLoading } = useApplyToAd();
const { ad, loading, error, setHasApplied, refresh: refreshAd } = useAd(adId);
const { similarAds, loadingSimilar } = useSimilarAds(adId);
const reportIssueModalRef = ref<InstanceType<typeof ReportIssueModal> | null>(
  null,
);
const fastLoginRef = ref<InstanceType<typeof FastLoginModal> | null>(null);
const successDialogRef = ref<HTMLDialogElement | null>(null);
const applying = ref(false);
const isMobile = ref(false);

/** Dashboard chrome only when the user has completed role selection. */
const embedded = computed(
  () => isAuthenticated.value && !needsRoleSelection.value,
);
const adsListPath = computed(() =>
  embedded.value ? "/dashboard/ad" : paths.jobs.root,
);

function syncLayout(useDashboard: boolean) {
  setPageLayout(useDashboard ? "dashboard" : "default");
}

syncLayout(embedded.value);
watch(embedded, (useDashboard) => syncLayout(useDashboard));

onMounted(() => {
  const mediaQuery = window.matchMedia("(max-width: 767px)");
  const syncIsMobile = () => {
    isMobile.value = mediaQuery.matches;
  };

  syncIsMobile();
  mediaQuery.addEventListener("change", syncIsMobile);
  onUnmounted(() => mediaQuery.removeEventListener("change", syncIsMobile));
});

const companyLogoSrc = computed(() =>
  resolveCompanyLogoDisplaySrc(ad.value?.company_logo),
);

const coverImage = computed(
  () => ad.value?.company?.cover || "/images/ad-cover-bg.jpg",
);

const publishDateLabel = computed(() => {
  const date = ad.value?.publish_date || ad.value?.created_at;
  return date ? formatJalaliDate(date) : "";
});

function markApplied() {
  setHasApplied(true);
}

function showSuccessModal() {
  if (!import.meta.client) return;
  successDialogRef.value?.showModal();
}

function closeSuccessModal() {
  successDialogRef.value?.close();
}

function handleSuccessBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeSuccessModal();
  }
}

function goToJobRequests() {
  closeSuccessModal();
  navigateTo("/dashboard/my-requests");
}

/** Login ok but apply failed — re-fetch ad; button updates only if has_applied is true. */
async function onApplyFailedAfterLogin() {
  await refreshAd();
}

async function sendRequest() {
  const id = ad.value?.id ?? adId.value;
  if (!id || ad.value?.has_applied) return;

  applying.value = true;
  try {
    const assigned = await ensureRoleForAction("job_seeker");
    if (!assigned) return;

    await applyToAd(id);
    showSuccessModal();
  } catch {
    // toasted in composable
  } finally {
    applying.value = false;
  }
}

async function showResumeModal() {
  if (!import.meta.client || applyLoading.value || applying.value) return;
  if (ad.value?.has_applied) return;

  if (isAuthenticated.value) {
    await sendRequest();
    return;
  }

  fastLoginRef.value?.showModal();
}

function showReportModal() {
  reportIssueModalRef.value?.showModal();
}

async function shareAd() {
  if (!import.meta.client) return;

  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: ad.value?.title ?? "آگهی شغلی", url });
      return;
    } catch {
      // fall through to clipboard
    }
  }

  await navigator.clipboard.writeText(url);
}

const adSeo = computed(() => getAdDetailSeoMeta(ad.value));

useSeoMeta({
  title: () => adSeo.value.title,
  description: () => adSeo.value.description,
});
</script>
