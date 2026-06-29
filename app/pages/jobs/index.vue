<template>
  <div class="bg-surface-50">
    <section
      class="bg-[url('/images/bg-6.png')] md:bg-[url('/images/bg-5.png')] bg-no-repeat bg-top md:bg-position-[center_-150px] pb-10"
    >
    <div class="custom-pad pt-6">
      <nav class="text-sm text-text-passive">
        <NuxtLink to="/" class="hover:text-primary-500 transition-colors">
          <Icon name="svg:home" size="16" />
        </NuxtLink>
        <span class="mx-2">/</span>
        <span>خدمات</span>
        <span class="mx-2">/</span>
        <span class="text-text-tertiary">فرصت های شغلی</span>
      </nav>
    </div>
      <div class="custom-pad flex flex-col items-center gap-4 pt-8 md:pt-12">
        <div
          class="text-primary-500 font-semibold text-sm flex justify-center items-center p-2 bg-[#4864E114] rounded-xl"
        >فرصت های شغلی حسابداری
        </div>
        <h1 class="font-yb-bold text-[23px] lg:text-h1 text-center">
          جدیدترین فرصت های شغلی حسابداری
        </h1>
        <h2 class="text-center">پروژه های مالی و آگهی های استخدام حسابدار را مشاهده کنید و رزومه خود را برای شرکت ها ارسال کنید
        </h2>
      </div>
    </section>

    <div class="custom-pad grid md:grid-cols-7 gap-4 items-start">
      <JobFiltersSidebar v-model="jobFilters" class="col-span-full md:col-span-2" />

      <div id="jobs-results" class="col-span-full md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <template v-if="loading">
          <ItemBox
            v-for="n in 12"
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

        <NoResult v-else-if="initialized && !ads.length" wrapper-class="col-span-full" />

        <template v-else>
          <ItemBox
            v-for="ad in ads"
            :key="ad.id"
            variant="ad"
            :item="ad"
            @bookmark="toggleBookmark"
          />

          <div class="col-span-full mt-4 flex justify-center">
            <Pagination
              :current-page="page"
              :last-page="lastPage"
              @update:current-page="onPageChange"
            />
          </div>
        </template>
      </div>
    </div>
    
    <FaqSection class="custom-pad mt-12" :categories="faqCategories" :items="faqs" />

  </div>
</template>

<script setup lang="ts">
import ItemBox from '~/components/Elements/item-box.vue'
import JobFiltersSidebar from '~/components/Elements/JobFiltersSidebar.vue'
import NoResult from '~/components/Elements/NoResult.vue'
import Pagination from '~/components/Elements/Pagination.vue'
import FaqSection from '~/components/Elements/FaqSection.vue'
import type { ApiResponse } from '~/types/api'
import {
  areRouteQueriesEqual,
  jobFiltersToRouteQuery,
  routeQueryToJobFilters,
} from '~/utils/job-filters-query'

const route = useRoute()
const router = useRouter()

const initialState = routeQueryToJobFilters(route.query)
const jobFilters = ref(initialState.filters)
const page = ref(initialState.page)
const { ads, lastPage, loading, initialized, error } = useJobAds(jobFilters, page)

let urlSyncTimer: ReturnType<typeof setTimeout> | null = null
let syncingFromRoute = false

function syncRouteQuery() {
  if (syncingFromRoute) return

  const nextQuery = jobFiltersToRouteQuery(jobFilters.value, page.value)
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
    const el = document.getElementById('jobs-results')
    if (el) {
      const yOffset = -100 // scroll 32px above the element (adjust as needed)
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  })
})

watch(
  jobFilters,
  (value, oldValue) => {
    if (!syncingFromRoute && JSON.stringify(value) !== JSON.stringify(oldValue) && page.value !== 1) {
      page.value = 1
    }

    if (urlSyncTimer) clearTimeout(urlSyncTimer)
    urlSyncTimer = setTimeout(syncRouteQuery, 300)
  },
  { deep: true },
)

watch(
  () => route.query,
  (query) => {
    if (syncingFromRoute) {
      syncingFromRoute = false
      return
    }

    const next = routeQueryToJobFilters(query)
    const filtersJson = JSON.stringify(next.filters)
    const currentJson = JSON.stringify(jobFilters.value)

    if (filtersJson === currentJson && next.page === page.value) return

    syncingFromRoute = true
    jobFilters.value = next.filters
    page.value = next.page
    nextTick(() => {
      syncingFromRoute = false
    })
  },
)

onUnmounted(() => {
  if (urlSyncTimer) clearTimeout(urlSyncTimer)
})

const api = useApi()

const toggleBookmark = async (id: string | number, type: string) => {
  await api.post<ApiResponse>('/bookmarks/toggle/' + id, {
    query: { type },
  })
}

const faqCategories = [
  { id: 1, label: 'کارفرمایان' },
  { id: 2, label: 'حسابداران' },
]

const faqs = [
  {
    type: 1,
    question: 'چگونه می‌توانم پروژه حسابداری ثبت کنم؟',
    answer:
      'پس از ثبت‌نام به‌عنوان کارفرما، از بخش داشبورد می‌توانید پروژه جدید ایجاد کنید و نوع نیاز، بودجه و زمان‌بندی مورد نظر را مشخص نمایید.',
  },
  {
    type: 1,
    question: 'چقدر طول می‌کشد تا پیشنهاد همکاری دریافت کنم؟',
    answer:
      'معمولاً پس از انتشار پروژه، پیشنهادهای مرتبط در همان روزهای اول ارسال می‌شوند. سرعت وابسته به نوع پروژه و شرایط بازار است.',
  },
  {
    type: 1,
    question: 'هزینه ثبت پروژه چقدر است؟',
    answer:
      'هزینه‌ها بر اساس نوع پروژه و خدمات انتخابی متفاوت است. جزئیات قیمت‌گذاری در بخش ثبت پروژه نمایش داده می‌شود.',
  },
  {
    type: 1,
    question: 'آیا می‌توانم حسابدار را قبل از شروع همکاری بررسی کنم؟',
    answer:
      'بله. می‌توانید رزومه، سوابق و پیشنهادهای ارسال‌شده را مقایسه کنید و پس از اطمینان، همکاری را آغاز نمایید.',
  },
  {
    type: 2,
    question: 'چگونه به پروژه‌های حسابداری دسترسی پیدا کنم؟',
    answer:
      'پس از تکمیل رزومه و ثبت‌نام، می‌توانید پروژه‌های منتشرشده را مشاهده، فیلتر و برای آن‌ها پیشنهاد همکاری ارسال کنید.',
  },
  {
    type: 2,
    question: 'برای ارسال پیشنهاد چه اطلاعاتی لازم است؟',
    answer:
      'معمولاً شرح کوتاه تجربه مرتبط، زمان‌بندی پیشنهادی و مبلغ پیشنهادی کافی است. جزئیات بیشتر در فرم ارسال پیشنهاد نمایش داده می‌شود.',
  },
]

useSeoMeta({
  title: 'فرصت های شغلی حسابداری | آگهی استخدام حسابدار در شرکت‌های معتبر | های‌حساب',
  description:
    'جدیدترین فرصت های شغلی حسابداری و آگهی‌های استخدام حسابدار تمام‌وقت، پاره‌وقت و پروژه‌ای را در های‌حساب ببینید و سریع‌تر موقعیت شغلی مناسب خود را پیدا کنید.',
})
</script>
