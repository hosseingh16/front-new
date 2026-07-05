<template>
  <div
    class="relative rounded-xl border border-surface-200 bg-[#F6F8FE] p-4"
    :class="to && !loading ? 'transition-colors hover:border-primary-300' : undefined"
  >
    <NuxtLink
      v-if="to && !loading"
      :to="to"
      class="absolute inset-0 rounded-xl"
      :aria-label="name"
    />
    <template v-if="loading">
      <div v-if="layout === 'horizontal'" class="space-y-3">
        <div class="flex items-start justify-between gap-4">
          <div class="flex flex-1 items-start gap-3">
            <div class="h-16 w-16 shrink-0 rounded-2xl bg-surface-200 animate-pulse" />
            <div class="flex-1 space-y-2">
              <div class="h-5 w-32 rounded bg-surface-200 animate-pulse" />
              <div class="h-4 w-48 rounded bg-surface-200 animate-pulse" />
            </div>
          </div>
          <div class="h-4 w-24 rounded bg-surface-200 animate-pulse" />
        </div>
        <div class="flex gap-2">
          <div class="h-8 w-28 rounded-full bg-surface-200 animate-pulse" />
          <div class="h-8 w-32 rounded-full bg-surface-200 animate-pulse" />
          <div class="h-8 w-24 rounded-full bg-surface-200 animate-pulse" />
        </div>
      </div>
      <template v-else>
        <div class="flex flex-col items-center">
          <div class="h-16 w-16 rounded-2xl bg-surface-200 animate-pulse" />
          <div class="mt-3 h-5 w-32 rounded bg-surface-200 animate-pulse" />
          <div class="mt-2 h-4 w-44 rounded bg-surface-200 animate-pulse" />
        </div>
        <div class="mt-4 space-y-2">
          <div class="h-8 w-full rounded-full bg-surface-200 animate-pulse" />
          <div class="h-8 w-full rounded-full bg-surface-200 animate-pulse" />
          <div class="h-8 w-full rounded-full bg-surface-200 animate-pulse" />
        </div>
        <div class="mt-4 flex justify-center">
          <div class="h-4 w-24 rounded bg-surface-200 animate-pulse" />
        </div>
      </template>
    </template>

    <template v-else-if="layout === 'horizontal'">
      <div class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 flex-1 items-start gap-3">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ECF4D9]">
            <img
              v-if="logo"
              :src="logo"
              :alt="name"
              class="h-16 w-16 rounded-2xl object-cover"
            />
            <span v-else class="font-yb-bold text-lg text-text-tertiary">
              {{ name.charAt(0) }}
            </span>
          </div>

          <div class="min-w-0 flex-1">
            <p class="font-yb-bold text-base text-text-tertiary">{{ name }}</p>
            <div
              v-if="activity"
              class="mt-1 flex items-center gap-1 text-sm text-text-passive"
            >
              <Icon name="ph:suitcase-simple-light" class="shrink-0" />
              <span>نوع فعالیت: {{ activity }}</span>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
              <div
                v-if="size"
                class="flex items-center gap-2 rounded-full border border-gray-default bg-white px-3 py-1.5 text-sm text-text-tertiary"
              >
                <Icon name="svg:users-1" class="shrink-0" />
                <span>{{ size }}</span>
              </div>

              <div
                v-if="location"
                class="flex items-center gap-2 rounded-full border border-gray-default bg-white px-3 py-1.5 text-sm text-text-tertiary"
              >
                <Icon name="svg:location-4" class="shrink-0" />
                <span>{{ location }}</span>
              </div>

              <div
                v-if="activeAds != null"
                class="flex items-center gap-2 rounded-full border border-gray-default bg-white px-3 py-1.5 text-sm text-text-tertiary"
              >
                <Icon name="ph:suitcase-simple-light" class="shrink-0" />
                <span>{{ persianActiveAds }} آگهی فعال</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-500">
          <Icon name="svg:eye" class="shrink-0" />
          <span>مشاهده پروفایل</span>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-center text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECF4D9]">
          <img
            v-if="logo"
            :src="logo"
            :alt="name"
            class="h-16 w-16 rounded-2xl object-cover"
          />
          <span v-else class="font-yb-bold text-lg text-text-tertiary">
            {{ name.charAt(0) }}
          </span>
        </div>

        <p class="mt-3 font-yb-bold text-base text-text-tertiary">{{ name }}</p>

        <div
          v-if="activity"
          class="mt-2 flex items-center gap-1 text-sm text-text-passive"
        >
          <Icon name="ph:suitcase-simple-light" class="shrink-0" />
          <span>نوع فعالیت: {{ activity }}</span>
        </div>
      </div>

      <div class="mt-4 flex flex-col gap-2">
        <div
          v-if="size"
          class="flex items-center gap-2 rounded-full border border-gray-default bg-white px-3 py-1.5 text-sm text-text-tertiary"
        >
          <Icon name="svg:users-1" class="shrink-0" />
          <span>{{ size }}</span>
        </div>

        <div
          v-if="location"
          class="flex items-center gap-2 rounded-full border border-gray-default bg-white px-3 py-1.5 text-sm text-text-tertiary"
        >
          <Icon name="svg:location-4" class="shrink-0" />
          <span>{{ location }}</span>
        </div>

        <div
          v-if="activeAds != null"
          class="flex items-center gap-2 rounded-full border border-gray-default bg-white px-3 py-1.5 text-sm text-text-tertiary"
        >
          <Icon name="ph:suitcase-simple-light" class="shrink-0" />
          <span>{{ persianActiveAds }} آگهی فعال</span>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary-500">
        <Icon name="svg:eye" class="shrink-0" />
        <span>مشاهده رزومه</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CompanyList } from '~/types/company'

const props = withDefaults(
  defineProps<{
    company?: CompanyList
    name?: string
    logo?: string | null
    activity?: string
    size?: string
    provinceName?: string
    cityName?: string
    activeAds?: number
    to?: string
    loading?: boolean
    layout?: 'vertical' | 'horizontal'
  }>(),
  {
    loading: false,
    layout: 'vertical',
  },
)

const name = computed(() => props.company?.name ?? props.name ?? 'شرکت')
const logo = computed(() => props.company?.logo ?? props.logo ?? null)
const activity = computed(() => props.company?.activity ?? props.activity ?? '')
const size = computed(() => props.company?.size ?? props.size ?? '')

const location = computed(() => {
  const province = props.company?.province_name ?? props.provinceName
  const city = props.company?.city_name ?? props.cityName

  if (province && city) return `${province}، ${city}`
  return province || city || ''
})

const persianActiveAds = computed(() => {
  if (props.activeAds == null) return ''
  return String(props.activeAds).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!)
})
</script>
