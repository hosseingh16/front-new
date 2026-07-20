<template>
  <div class="bg-surface-50 pb-12">
  <section
    class="bg-cover bg-center bg-no-repeat"
    :style="{ backgroundImage: `url('${coverImage}')` }"
  >
    <div class="custom-pad pt-6 pb-12">
      <nav class="text-sm text-text-passive">
        <NuxtLink to="/" class="transition-colors hover:text-primary-500">
          <Icon name="svg:home" size="16" />
        </NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/jobs" class="transition-colors hover:text-primary-500">
          فرصت‌های شغلی
        </NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-text-tertiary">{{ ad?.title ?? 'آگهی' }}</span>
      </nav>
    </div>

    <div class="custom-pad pb-0">
      <div
        v-if="loading && !ad"
        class="mt-4 animate-pulse rounded-t-2xl bg-surface-50 p-6"
      >
        <div class="h-20 rounded-xl bg-surface-200" />
        <div class="mt-6 h-10 rounded bg-surface-200" />
      </div>

      <div
        v-else-if="ad"
        class="relative z-10 mt-4 rounded-t-2xl bg-surface-50"
      >
        <div class="flex flex-wrap items-start justify-between gap-4 p-5 md:p-6">
          <div class="flex min-w-0 items-center gap-4">
            <div
              class="flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#ECF4D9]"
            >
              <NuxtLink
                v-if="ad.company_logo && ad.company?.slug"
                :to="`/companies/${ad.company.slug}`"
                class="block h-full w-full"
                tabindex="-1"
                aria-label="نمایه شرکت"
              >
                <img
                  :src="ad.company_logo"
                  :alt="ad.company_name"
                  class="h-full w-full object-cover"
                />
              </NuxtLink>
              <img
                v-else-if="ad.company_logo"
                :src="ad.company_logo"
                :alt="ad.company_name"
                class="h-full w-full object-cover"
              />
     
              <span v-else class="font-yb-bold text-xl text-text-tertiary">
                {{ companyInitial }}
              </span>
            </div>
            <div class="min-w-0">
              <p class="text-sm text-text-passive">{{ ad.company_name }}</p>
              <h1 class="mt-1 font-yb-bold text-xl text-text-primay md:text-2xl">
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
              class="flex h-9 w-9 items-center justify-center rounded-lg border-2 cursor-pointer border-gray-default bg-white transition-opacity hover:opacity-80"
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
              :initial-bookmarked="Boolean(ad.is_bookmarked)"
              @update:bookmarked="(value) => { if (ad) ad.is_bookmarked = value }"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

    <div class="custom-pad">
    <p v-if="error" class="mt-8 py-12 text-center text-sm text-error">
      {{ error }}
    </p>

    <template v-else-if="ad">
      <AdDetailContent
        :ad="ad"
        @resume="showResumeModal"
        @report-issue="showReportModal"
      />
      <section class="mt-10">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-1">
            <span
              class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
              aria-hidden="true"
            />
            <h2 class="font-yb-bold text-base text-text-primay">آگهی‌های مشابه</h2>
          </div>
          <NuxtLink
            to="/jobs"
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

  <dialog1 id="ad-resume-login-modal" :title="ad?.title ?? ''" type="warning" :width="420">
    <p class="px-8 text-sm font-normal text-gray-600">
      لطفا برای ارسال رزومه از طریق دکمه زیر وارد حساب کاربری خود شوید
    </p>
    <form method="dialog">
      <NuxtLink to="/account" class="btn btn-primary mt-4 w-full">
        ورود و ثبت‌نام
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
import ItemBox from '~/components/Elements/item-box.vue'
import BookmarkToggleButton from '~/components/Elements/BookmarkToggleButton.vue'
import AdDetailContent from './components/AdDetailContent.vue'
import ReportIssueModal from './components/ReportIssueModal.vue'
import { useAd, useSimilarAds } from '~/composables/useAd'
import { formatJalaliDate } from '~/utils/format-jalali-date'

const route = useRoute()
const adId = computed(() => String(route.params.id ?? ''))

const { ad, loading, error } = useAd(adId)
const { similarAds, loadingSimilar } = useSimilarAds(adId)
const reportIssueModalRef = ref<InstanceType<typeof ReportIssueModal> | null>(null)

const companyInitial = computed(() => ad.value?.company_name?.charAt(0) ?? 'ش')

const coverImage = computed(
  () => ad.value?.company?.cover || '/images/ad-cover-bg.jpg',
)

const publishDateLabel = computed(() => {
  const date = ad.value?.publish_date || ad.value?.created_at
  console.log(date);
  return date ? formatJalaliDate(date) : ''
})

function showResumeModal() {
  if (!import.meta.client) return
  const modal = document.getElementById('ad-resume-login-modal') as HTMLDialogElement | null
  modal?.showModal()
}

function showReportModal() {
  reportIssueModalRef.value?.showModal()
}

async function shareAd() {
  if (!import.meta.client) return

  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: ad.value?.title ?? 'آگهی شغلی', url })
      return
    } catch {
      // fall through to clipboard
    }
  }

  await navigator.clipboard.writeText(url)
}

useSeoMeta({
  title: () =>
    ad.value?.title
      ? `${ad.value.title} | ${ad.value.company_name}`
      : 'جزئیات آگهی شغلی',
  description: () =>
    ad.value?.job_description
      ? ad.value.job_description.replace(/<[^>]+>/g, '').slice(0, 160)
      : 'جزئیات آگهی استخدام حسابدار',
})
</script>
