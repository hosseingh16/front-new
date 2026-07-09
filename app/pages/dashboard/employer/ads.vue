<template>
  <div>
    <template v-if="loading">
      <div class="h-8 w-40 animate-pulse rounded bg-surface-200" />
      <div class="mt-6 space-y-4">
        <div v-for="n in 3" :key="`skeleton-${n}`" class="h-48 animate-pulse rounded-2xl bg-surface-200" />
      </div>
    </template>

    <p v-else-if="error" class="py-12 text-center text-sm text-error">
      {{ error }}
    </p>

    <NoResult
      v-else-if="initialized && !ads.length"
      title="ایجاد آگهی جدید"
      description="در حال حاضر هیچ آگهی جهت نمایش نیست. جهت ثبت اولین آگهی خود کلیک کنید."
      icon="svg:no-jobs"
      action-label="آگهی جدید"
      action-icon="svg:bag-1"
      action-to="/jobs/create"
    />

    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <h1 class="font-yb-bold text-lg text-text-tertiary">آگهی‌های من</h1>
          <span class="rounded-full bg-surface-100 px-3 py-1 text-xs font-semibold text-text-passive">
            {{ ads.length }} آگهی
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="btn btn-ghost h-10 w-10 p-0"
            aria-label="جستجو"
            @click="showSearch = !showSearch"
          >
            <Icon name="svg:search-1" size="20" />
          </button>
          <NuxtLink to="/jobs/create" class="btn btn-success h-10 gap-2 px-4">
            <Icon name="svg:bag-1" size="16" class="text-white" />
            آگهی جدید
          </NuxtLink>
        </div>
      </div>

      <div v-if="showSearch" class="mt-4">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="جستجو در آگهی‌ها..."
          class="h-10 w-full rounded-lg border border-gray-default bg-white px-3 text-sm outline-none focus:border-primary-500"
        />
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-6 border-b border-gray-default">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          type="button"
          class="flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors"
          :class="
            activeFilter === tab.id
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-text-passive hover:text-text-secondary'
          "
          @click="activeFilter = tab.id"
        >
          <Icon v-if="tab.icon" :name="tab.icon" size="16" />
          {{ tab.label }}
          <span
            v-if="tab.count != null && tab.count > 0"
            class="rounded-full bg-surface-100 px-2 py-0.5 text-xs"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <div v-if="filteredAds.length" class="mt-6 space-y-4">
        <EmployerAdCard
          v-for="ad in filteredAds"
          :key="ad.id"
          :ad="ad"
          @edit="editAd"
          @copy="copyAd"
          @delete="confirmDeleteAd"
        />
      </div>

      <NoResult
        v-else
        title="آگهی‌ای یافت نشد"
        description="با فیلتر یا عبارت جستجوی دیگری دوباره امتحان کنید."
        icon="svg:no-result"
        :icon-size="180"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import NoResult from '~/components/Elements/NoResult.vue'
import EmployerAdCard from './components/EmployerAdCard.vue'
import type { EmployerAdFilter } from '~/types/employer-ad'
import {
  countEmployerAdsByFilter,
  getEmployerAdsByFilter,
} from './utils/employer-ad'

definePageMeta({
  layout: 'dashboard',
})

const { adGroups, ads, loading, initialized, error, deleteAd } = useEmployerAds()
const { $toast } = useNuxtApp()

const activeFilter = ref<EmployerAdFilter>('all')
const searchQuery = ref('')
const showSearch = ref(false)

const filterTabs = computed(() => [
  { id: 'all' as const, label: 'همه', icon: '', count: null },
  {
    id: 'active' as const,
    label: 'آگهی‌های فعال',
    icon: 'lucide:briefcase',
    count: countEmployerAdsByFilter(adGroups.value, 'active'),
  },
  {
    id: 'draft' as const,
    label: 'پیش‌نویس',
    icon: 'lucide:briefcase',
    count: countEmployerAdsByFilter(adGroups.value, 'draft'),
  },
  {
    id: 'expired' as const,
    label: 'منقضی شده‌ها',
    icon: 'lucide:pen-line',
    count: countEmployerAdsByFilter(adGroups.value, 'expired'),
  },
])

const filteredAds = computed(() => {
  const byFilter = getEmployerAdsByFilter(adGroups.value, activeFilter.value)
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return byFilter

  return byFilter.filter((ad) => ad.title.toLowerCase().includes(query))
})

function editAd(id: number) {
  navigateTo(`/jobs/create?edit=${id}`)
}

function copyAd(id: number) {
  navigateTo(`/jobs/create?copy=${id}`)
}

async function confirmDeleteAd(id: number) {
  if (!import.meta.client) return
  if (!window.confirm('آیا از حذف این آگهی مطمئن هستید؟')) return

  try {
    await deleteAd(id)
    $toast.success('آگهی با موفقیت حذف شد')
  } catch (err: any) {
    $toast.error(err?.message || 'حذف آگهی با خطا مواجه شد')
  }
}

useSeoMeta({
  title: 'آگهی‌های من',
})
</script>
