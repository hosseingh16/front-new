<template>
  <div class="bg-surface-50">
    <section
      class="bg-[url('/images/bg-6.png')] bg-no-repeat bg-top pb-10 md:bg-[url('/images/bg-5.png')] md:bg-position-[center_-150px]"
    >
      <div class="custom-pad pt-6">
        <nav class="text-sm text-text-passive">
          <NuxtLink to="/" class="hover:text-primary-500 transition-colors">
            <Icon name="svg:home" size="16" />
          </NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink
            to="/tax-return"
            class="hover:text-primary-500 transition-colors"
          >
            اظهارنامه
          </NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-text-tertiary">مشاوران</span>
        </nav>
      </div>

      <div class="custom-pad flex flex-col items-center gap-4 pt-8 md:pt-12">
        <span
          class="inline-flex items-center rounded-xl bg-accent-300 px-4 py-2 text-sm font-semibold text-accent-500"
        >
          از بهترین‌ها مشاوره دریافت کنید
        </span>
        <h1
          class="max-w-4xl text-center font-yb-bold text-[23px] leading-10 text-text-tertiary lg:text-h1"
        >
          مشاوره مالی و مالیاتی بهترین متخصصان کشور
        </h1>
        <p
          class="max-w-3xl text-center text-base font-semibold leading-8 text-text-tertiary"
        >
          از میان بهترین مشاوران تأیید شده های‌حساب مشاور مورد نظر خود را انتخاب
          کنید و صفر تا صد امور مالیاتی را به متخصصان بسپارید.
        </p>
      </div>
    </section>

    <div id="consultants-results" class="custom-pad space-y-4">
      <template v-if="loading">
        <ConsultantListCard
          v-for="n in 6"
          :key="`skeleton-${n}`"
          loading
        />
      </template>

      <p
        v-else-if="error"
        class="py-12 text-center text-sm text-error"
      >
        {{ error }}
      </p>

      <NoResult
        v-else-if="initialized && !consultants.length"
        title="مشاوری یافت نشد"
        description="متاسفانه مشاوری برای نمایش موجود نیست!"
      />

      <template v-else>
        <ConsultantListCard
          v-for="consultant in consultants"
          :key="consultant.id"
          :consultant="consultant"
        />

        <div class="flex justify-center pt-2">
          <Pagination
            :current-page="page"
            :last-page="lastPage"
            @update:current-page="onPageChange"
          />
        </div>
      </template>
    </div>

    <FaqSection
      class="custom-pad mt-12"
      :categories="faqCategories"
      :items="faqs"
    />
  </div>
</template>

<script setup lang="ts">
import FaqSection from '~/components/Elements/FaqSection.vue'
import NoResult from '~/components/Elements/NoResult.vue'
import Pagination from '~/components/Elements/Pagination.vue'
import {
  FAQ_TYPE,
  faqCategoriesByType,
  faqsByType,
} from '~/data/faqs'
import ConsultantListCard from './components/ConsultantListCard.vue'

const route = useRoute()
const router = useRouter()

function parsePageQuery(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value
  const nextPage = Number(raw)
  return Number.isInteger(nextPage) && nextPage > 0 ? nextPage : 1
}

const page = ref(parsePageQuery(route.query.page))

const { consultants, lastPage, loading, initialized, error } =
  useTaxReturnConsultants(page)

watch(
  () => route.query.page,
  (queryPage) => {
    const nextPage = parsePageQuery(queryPage)
    if (nextPage !== page.value) page.value = nextPage
  },
)

watch(page, async (nextPage) => {
  const normalizedPage =
    Number.isInteger(nextPage) && nextPage > 0 ? nextPage : 1
  if (normalizedPage !== nextPage) {
    page.value = normalizedPage
    return
  }

  if (normalizedPage === parsePageQuery(route.query.page)) return

  const query = { ...route.query }
  if (normalizedPage <= 1) {
    delete query.page
  } else {
    query.page = String(normalizedPage)
  }

  await router.replace({ query })
})

function onPageChange(nextPage: number) {
  page.value = nextPage
  nextTick(() => {
    const el = document.getElementById('consultants-results')
    if (!el) return
    const y = el.getBoundingClientRect().top + window.pageYOffset - 100
    window.scrollTo({ top: y, behavior: 'smooth' })
  })
}

const faqCategories = faqCategoriesByType(
  FAQ_TYPE.consulting,
  FAQ_TYPE.general,
)
const faqs = faqsByType(FAQ_TYPE.consulting, FAQ_TYPE.general)

useSeoMeta({
  title: 'مشاوره مالی و مالیاتی بهترین متخصصان کشور | های‌حساب',
  description:
    'از میان بهترین مشاوران تأیید شده های‌حساب مشاور مورد نظر خود را انتخاب کنید و صفر تا صد امور مالیاتی را به متخصصان بسپارید.',
})
</script>
