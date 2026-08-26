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
        <div class="size-8 shrink-0 animate-pulse rounded-full bg-surface-200" />
        <div class="min-w-0 flex-1 space-y-2">
          <div class="h-4 w-28 animate-pulse rounded bg-surface-200" />
          <div class="h-5 w-40 animate-pulse rounded bg-surface-200" />
          <div class="h-4 w-full animate-pulse rounded bg-surface-200" />
        </div>
      </div>
    </div>

    <p
      v-else-if="error"
      class="mt-6 py-8 text-center text-sm text-error"
    >
      {{ error }}
    </p>

    <div v-else-if="request" class="mt-4">
      <MyRequestTimeline :request="request" />
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
const api = useApi();

const loading = ref(false);
const error = ref<string | null>(null);
const request = ref<MyRequest | null>(null);

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

async function fetchRequest() {
  if (!isAuthenticated.value) {
    request.value = null;
    error.value = null;
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const result = await api.get<ApiResponse<JobSeekerAdsRequestApi[]>>(
      "/ads/requests",
      { query: { count: 100 } },
    );

    const items = (
      Array.isArray(result.data)
        ? result.data
        : Array.isArray((result.data as { data?: JobSeekerAdsRequestApi[] } | undefined)?.data)
          ? (result.data as { data: JobSeekerAdsRequestApi[] }).data
          : []
    ).map(mapJobSeekerAdsRequestToMyRequest);

    const adId = Number(props.ad.id);
    const match =
      items.find((item) => Number(item.ad_id) === adId) ?? null;
    request.value = match ?? fallbackRequest();
  } catch {
    error.value = "خطا در دریافت سوابق ارسال";
    request.value = fallbackRequest();
  } finally {
    loading.value = false;
  }
}

watch(
  () => [isAuthenticated.value, props.ad.id, props.ad.has_applied] as const,
  () => {
    fetchRequest();
  },
  { immediate: true },
);
</script>
