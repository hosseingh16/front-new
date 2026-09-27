<template>
  <section class="rounded-2xl border border-gray-default bg-white p-5 md:p-6">
    <AdSectionTitle title="وضعیت درخواست‌ها و پیام‌ها" />

    <div v-if="!isAuthenticated" class="py-12 text-center">
      <p class="text-sm leading-7 text-text-passive">
        پس از ورود به حساب کاربری، سوابق ارسال رزومه در این بخش نمایش داده
        می‌شود.
      </p>
    </div>

    <div v-else-if="loading" class="mt-4 space-y-4">
      <div
        v-for="n in 3"
        :key="`history-skeleton-${n}`"
        class="flex items-start gap-2"
      >
        <div
          class="size-8 shrink-0 animate-pulse rounded-full bg-surface-200"
        />
        <div class="min-w-0 flex-1 space-y-2">
          <div class="h-4 w-28 animate-pulse rounded bg-surface-200" />
          <div class="h-5 w-40 animate-pulse rounded bg-surface-200" />
          <div class="h-4 w-full animate-pulse rounded bg-surface-200" />
        </div>
      </div>
    </div>

    <p v-else-if="error" class="mt-6 py-8 text-center text-sm text-error">
      {{ error }}
    </p>

    <div v-else-if="request" class="mt-4">
      <MyRequestTimeline :request="request" />
    </div>

    <div
      v-else-if="isEmployer"
      class="mt-4 flex items-start gap-3 rounded-xl border border-primary-200 bg-primary-50 p-5"
    >
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white"
        aria-hidden="true"
      >
        <Icon name="lucide:info" size="20" class="text-primary-500" />
      </div>
      <p class="text-sm leading-7 text-text-secondary">
        ارسال رزومه برای کارفرمایان امکان‌پذیر نیست.
      </p>
    </div>

    <div
      v-else-if="isPublicAd"
      class="mt-4 flex items-start gap-3 rounded-xl border border-primary-200 bg-primary-50 p-5"
    >
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white"
        aria-hidden="true"
      >
        <Icon name="lucide:info" size="20" class="text-primary-500" />
      </div>
      <p class="text-sm leading-7 text-text-secondary">
        برای ارسال رزومه با شماره تماس موجود درآگهی تماس بگیرید
      </p>
    </div>

    <NoResult
      v-else
      title="سابقه‌ای ثبت نشده است"
      description="هنوز رزومه‌ای برای این آگهی ارسال نکرده‌اید. با ارسال رزومه می‌توانید وضعیت بررسی را اینجا دنبال کنید."
      :icon-src="noResumeIllustration"
      :icon-size="180"
      action-label="ارسال رزومه"
      action-icon="svg:breifcase-recieve"
      action-icon-size="18"
      wrapper-class="py-6"
      @action="emit('resume')"
    />
  </section>
</template>

<script setup lang="ts">
import type { Ad } from "~/types/ad";
import type { ApiResponse } from "~/types/api";
import type { MyRequest } from "~/types/my-request";
import AdSectionTitle from "./AdSectionTitle.vue";
import MyRequestTimeline from "~/components/Elements/MyRequestTimeline.vue";
import NoResult from "~/components/Elements/NoResult.vue";
import {
  mapJobSeekerAdsRequestToMyRequest,
  type JobSeekerAdsRequestApi,
} from "~/pages/dashboard/utils/map-my-request";
import noResumeIllustration from "~/assets/vectors/illustrations/no-resume.svg?url";

const props = defineProps<{
  ad: Ad;
}>();

const emit = defineEmits<{
  resume: [];
}>();

const { isAuthenticated } = useSanctumAuth();
const { isEmployer } = useCurrentUser();
const api = useApi();

const isPublicAd = computed(() => props.ad.company?.id == 1);

const loadError = ref<string | null>(null);

function fallbackRequest(): MyRequest | null {
  if (!props.ad.has_applied) return null;

  return {
    id: 0,
    ad_id: props.ad.id,
    job_title: props.ad.title,
    company_name: props.ad.company_name,
    company_logo: props.ad.company_logo,
    status: "sent",
    created_at: props.ad.created_at || props.ad.publish_date || "",
  };
}

function readRequestItems(result: ApiResponse<JobSeekerAdsRequestApi[]>) {
  const payload = result.data as
    | JobSeekerAdsRequestApi[]
    | { data?: JobSeekerAdsRequestApi[] }
    | undefined;

  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

const { data, pending } = useCachedAsyncData(
  () => `ad-application-history-${props.ad.id}`,
  async () => {
    loadError.value = null;

    // Guests and employers must not hit the job-seeker endpoint.
    // A 401 from that call clears the Sanctum session.
    if (!isAuthenticated.value || isEmployer.value) return null;

    try {
      const result = await api.get<ApiResponse<JobSeekerAdsRequestApi[]>>(
        "/ads/requests",
        { query: { count: 100 }, skipAuthRedirect: true },
      );

      const items = readRequestItems(result).map(
        mapJobSeekerAdsRequestToMyRequest,
      );
      const adId = Number(props.ad.id);
      const match = items.find((item) => Number(item.ad_id) === adId) ?? null;
      return match ?? fallbackRequest();
    } catch {
      loadError.value = "خطا در دریافت سوابق ارسال";
      return null;
    }
  },
  {
    watch: [() => props.ad.id, isAuthenticated, isEmployer],
  },
);

const request = computed(() => data.value ?? null);
const loading = computed(
  () =>
    pending.value && isAuthenticated.value && !isEmployer.value,
);
const error = computed(() => loadError.value);
</script>
