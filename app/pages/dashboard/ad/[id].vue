<template>
  <div>
    <div
      v-if="loading && !ad"
      class="animate-pulse space-y-4 py-6"
    >
      <div class="h-40 rounded-2xl bg-surface-200" />
      <div class="h-64 rounded-2xl bg-surface-200" />
    </div>

    <p v-else-if="error" class="py-12 text-center text-sm text-error">
      {{ error }}
    </p>

    <p v-else-if="!ad" class="py-12 text-center text-sm text-error">
      آگهی یافت نشد.
    </p>

    <AdDetailView
      v-else
      embedded
      :ad="ad"
      :similar-ads="similarAds"
      @resume="onResume"
      @report-issue="showReportModal"
      @bookmark-change="(value) => { ad.is_bookmarked = value }"
    />

    <AdResumeSuccessModal ref="resumeSuccessModalRef" />

    <AdResumeIncompleteModal ref="resumeIncompleteModalRef" />

    <ReportIssueModal
      ref="reportIssueModalRef"
      :target-id="ad?.id ?? adId"
      type="ads"
    />
  </div>
</template>

<script setup lang="ts">
import AdDetailView from '~/pages/ad/components/AdDetailView.vue'
import AdResumeIncompleteModal from '~/pages/ad/components/AdResumeIncompleteModal.vue'
import AdResumeSuccessModal from '~/pages/ad/components/AdResumeSuccessModal.vue'
import ReportIssueModal from '~/pages/jobs/components/ReportIssueModal.vue'
import { useAd, useSimilarAds } from '~/composables/useAd'
import { useCurrentUser } from '~/composables/useCurrentUser'
import {
  getApiErrorMessage,
  isResumeBasicInfoComplete,
  isResumeBasicInfoRequiredError,
} from '~/utils/api-error'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const adId = computed(() => String(route.params.id ?? ''))

const { ad, loading, error } = useAd(adId)
const { similarAds: similarOpportunities } = useSimilarAds(adId)

const similarAds = computed(() =>
  similarOpportunities.value
    .filter((opportunity) => opportunity.type === 'ad')
    .map((opportunity) => opportunity.item),
)

const api = useApi()
const { user } = useCurrentUser()
const { $toast } = useNuxtApp()
const reportIssueModalRef = ref<InstanceType<typeof ReportIssueModal> | null>(null)
const resumeSuccessModalRef = ref<InstanceType<typeof AdResumeSuccessModal> | null>(null)
const resumeIncompleteModalRef = ref<InstanceType<typeof AdResumeIncompleteModal> | null>(null)
const submittingResume = ref(false)

function showResumeIncompleteModal() {
  resumeIncompleteModalRef.value?.showModal()
}

async function onResume() {
  if (submittingResume.value || !ad.value?.id) return

  if (!isResumeBasicInfoComplete(user.value)) {
    showResumeIncompleteModal()
    return
  }

  submittingResume.value = true
  try {
    await api.post(`ads/${ad.value.id}/apply`)
    resumeSuccessModalRef.value?.showModal()
  } catch (err) {
    if (isResumeBasicInfoRequiredError(err)) {
      showResumeIncompleteModal()
      return
    }

    $toast.error(getApiErrorMessage(err, 'خطا در ارسال رزومه'))
  } finally {
    submittingResume.value = false
  }
}

function showReportModal() {
  reportIssueModalRef.value?.showModal()
}

useSeoMeta({
  title: () =>
    ad.value?.title
      ? `${ad.value.title} | ${ad.value.company_name}`
      : 'جزئیات آگهی شغلی',
})
</script>
