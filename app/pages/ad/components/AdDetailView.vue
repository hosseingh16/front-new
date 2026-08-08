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
          <span class="text-text-tertiary">{{ ad.title }}</span>
        </nav>
      </div>

      <div :class="embedded ? 'px-4 pb-0' : 'custom-pad pb-0'">
        <div
          class="relative z-10 rounded-t-2xl bg-surface-50"
          :class="embedded ? '' : 'mt-4'"
        >
          <div class="flex flex-wrap items-start justify-between gap-4 p-5 md:p-6">
            <div class="flex min-w-0 items-center gap-4">
              <div
                class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border-4 border-white bg-[#ECF4D9]"
              >
                <img
                  v-if="ad.company_logo"
                  :src="ad.company_logo"
                  :alt="ad.company_name"
                  class="h-full w-full object-cover"
                />
                <span v-else class="font-yb-bold text-xl text-text-tertiary">
                  {{ companyInitial }}
                </span>
              </div>
              <div class="min-w-0 text-right">
                <p class="text-base text-text-secondary">{{ ad.company_name }}</p>
                <h1 class="mt-1 font-yb-bold text-h1 leading-[1.7] text-text-primary">
                  {{ ad.title }}
                </h1>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <p v-if="publishDateLabel" class="text-caption text-text-passive">
                تاریخ انتشار: {{ publishDateLabel }}
              </p>

              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-default bg-white transition-opacity hover:opacity-80"
                aria-label="اشتراک‌گذاری"
                @click="shareAd"
              >
                <Icon name="material-symbols:share-outline" size="24" />
              </button>

              <BookmarkToggleButton
                :target-id="ad.id"
                type="ads"
                label="نشان کردن"
                :initial-bookmarked="Boolean(ad.is_bookmarked)"
                @update:bookmarked="(value) => emit('bookmark-change', value)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div :class="embedded ? '' : 'custom-pad'">
      <AdDetailContent
        :ad="ad"
        @resume="emit('resume')"
        @report-issue="emit('report-issue')"
      />

      <section class="mt-10">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-1">
            <span
              class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
              aria-hidden="true"
            />
            <h2 class="font-yb-bold text-[21px] text-text-primary">
              آگهی‌های مشابه
            </h2>
          </div>
          <NuxtLink
            :to="adsListPath"
            class="flex h-10 items-center gap-1 rounded-lg bg-[#4864E114] px-4 text-base font-semibold text-primary-500 transition-opacity hover:opacity-80"
          >
            <Icon name="material-symbols:chevron-left" size="24" />
            مشاهده بیشتر
          </NuxtLink>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ItemBox
            v-for="similarAd in similarAds"
            :key="similarAd.id"
            variant="ad"
            :item="similarAd"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ad, AdList } from '~/types/ad'
import ItemBox from '~/components/Elements/item-box.vue'
import BookmarkToggleButton from '~/components/Elements/BookmarkToggleButton.vue'
import AdDetailContent from '~/pages/jobs/components/AdDetailContent.vue'
import { formatJalaliDate } from '~/utils/format-jalali-date'

const props = withDefaults(
  defineProps<{
    ad: Ad
    similarAds: AdList[]
    embedded?: boolean
  }>(),
  {
    embedded: false,
  },
)

const emit = defineEmits<{
  resume: []
  'report-issue': []
  'bookmark-change': [bookmarked: boolean]
}>()

const adsListPath = computed(() =>
  props.embedded ? '/dashboard/ad' : '/ad',
)

const companyInitial = computed(() => props.ad.company_name?.charAt(0) ?? 'ش')

const coverImage = computed(
  () => props.ad.company?.cover || '/images/ad-cover-bg.jpg',
)

const publishDateLabel = computed(() => {
  const date = props.ad.publish_date || props.ad.created_at
  return date ? formatJalaliDate(date, 'jD jMMMM') : ''
})

async function shareAd() {
  if (!import.meta.client) return

  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: props.ad.title ?? 'آگهی شغلی', url })
      return
    } catch {
      // fall through to clipboard
    }
  }

  await navigator.clipboard.writeText(url)
}
</script>
