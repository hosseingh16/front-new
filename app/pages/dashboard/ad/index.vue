<template>
  <div class="pb-10">
    <section>
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <h1 class="text-h1 font-yb-bold leading-[1.7] text-text-primary">
            فرصت های شغلی حسابداری
          </h1>
          <div
            v-if="initialized"
            class="rounded-full border border-gray-default px-2 py-0.5 text-base text-text-passive"
          >
            {{ toPersianDigits(totalCount) }} آگهی
          </div>
        </div>

        <AdsSortToggle v-model="sort" />
      </div>
    </section>

    <div class="mt-4 grid items-start gap-4 md:grid-cols-7">
      <JobFiltersSidebar v-model="jobFilters" class="col-span-full md:col-span-2" />

      <div id="ads-results" class="col-span-full md:col-span-5">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <template v-if="loading">
            <ItemBox
              v-for="n in 6"
              :key="`skeleton-${n}`"
              variant="ad"
              loading
            />
          </template>

          <p
            v-else-if="error"
            class="col-span-full py-12 text-center text-sm text-error"
          >
            {{ error }}
          </p>

          <NoResult
            v-else-if="initialized && !paginatedAds.length"
            wrapper-class="col-span-full"
          />

          <ItemBox
            v-for="ad in paginatedAds"
            v-else
            :key="ad.id"
            variant="ad"
            :item="ad"
          />
        </div>

        <div v-if="lastPage > 1" class="mt-4 flex justify-center">
          <Pagination
            :current-page="page"
            :last-page="lastPage"
            @update:current-page="onPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ItemBox from '~/components/Elements/item-box.vue'
import JobFiltersSidebar from '~/components/Elements/JobFiltersSidebar.vue'
import NoResult from '~/components/Elements/NoResult.vue'
import Pagination from '~/components/Elements/Pagination.vue'
import { toPersianDigits } from '~/composables/useCountUp'
import AdsSortToggle from '~/pages/ad/components/AdsSortToggle.vue'
import type { AdList } from '~/types/ad'
import {
  adsFiltersToRouteQuery,
  areRouteQueriesEqual,
  routeQueryToAdsFilters,
  type AdsSort,
} from '~/utils/ads-filters-query'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()

const initialState = routeQueryToAdsFilters(route.query)
const jobFilters = ref(initialState.filters)
const page = ref(initialState.page)
const sort = ref<AdsSort>(initialState.sort)

const { opportunities, lastPage, loading, initialized, error } = useJobAds(
  jobFilters,
  page,
)

let urlSyncTimer: ReturnType<typeof setTimeout> | null = null
let syncingFromRoute = false

const ads = computed(() =>
  opportunities.value
    .filter((opportunity) => opportunity.type === 'ad')
    .map((opportunity) => opportunity.item),
)

const sortedAds = computed(() => {
  const list = [...ads.value]

  if (sort.value === 'salary') {
    return list.sort((a, b) => Number(b.salary) - Number(a.salary))
  }

  return list.sort(
    (a, b) => Number(b.publish_date) - Number(a.publish_date),
  )
})

const paginatedAds = computed<AdList[]>(() => sortedAds.value)
const totalCount = computed(() => sortedAds.value.length)

function syncRouteQuery() {
  if (syncingFromRoute) return

  const nextQuery = adsFiltersToRouteQuery(
    jobFilters.value,
    page.value,
    sort.value,
  )
  if (areRouteQueriesEqual(route.query, nextQuery)) return

  syncingFromRoute = true
  router.replace({ path: route.path, query: nextQuery })
}

function onPageChange(nextPage: number) {
  page.value = nextPage
}

watch(page, () => {
  syncRouteQuery()
  nextTick(() => {
    const el = document.getElementById('ads-results')
    if (!el) return
    const y = el.getBoundingClientRect().top + window.pageYOffset - 100
    window.scrollTo({ top: y, behavior: 'smooth' })
  })
})

watch(sort, () => {
  syncRouteQuery()
})

watch(
  jobFilters,
  (value, oldValue) => {
    if (
      !syncingFromRoute &&
      JSON.stringify(value) !== JSON.stringify(oldValue) &&
      page.value !== 1
    ) {
      page.value = 1
    }

    if (urlSyncTimer) clearTimeout(urlSyncTimer)
    urlSyncTimer = setTimeout(syncRouteQuery, 300)
  },
  { deep: true },
)

watch(
  () => route.query,
  () => {
    if (syncingFromRoute) {
      syncingFromRoute = false
      return
    }

    const next = routeQueryToAdsFilters(route.query)
    const filtersJson = JSON.stringify(next.filters)
    const currentJson = JSON.stringify(jobFilters.value)

    if (
      filtersJson === currentJson &&
      next.page === page.value &&
      next.sort === sort.value
    ) {
      return
    }

    syncingFromRoute = true
    jobFilters.value = next.filters
    page.value = next.page
    sort.value = next.sort
    nextTick(() => {
      syncingFromRoute = false
    })
  },
)

watch(lastPage, (value) => {
  if (page.value > value) page.value = value
})

onUnmounted(() => {
  if (urlSyncTimer) clearTimeout(urlSyncTimer)
})

useSeoMeta({
  title: 'فرصت های شغلی | های‌حساب',
})
</script>
