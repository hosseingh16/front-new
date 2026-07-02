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
          <span class="text-text-tertiary">شرکت‌ها</span>
        </nav>
      </div>

      <div class="custom-pad flex flex-col items-center gap-4 pt-8 md:pt-12">
        <span
          class="inline-flex items-center rounded-xl bg-[#4864E114] px-4 py-2 text-sm font-semibold text-primary-500"
        >
          همکاری با سازمان‌های برتر
        </span>
        <h1 class="max-w-4xl text-center font-yb-bold text-[23px] leading-10 text-text-tertiary lg:text-h1">
          همکاری با شرکت‌های معتبر حوزه حسابداری
        </h1>
        <p class="max-w-3xl text-center text-base font-semibold leading-8 text-text-tertiary">
          شرکت‌های فعال در حوزه حسابداری و مالی را بررسی کنید و با سازمان‌های معتبر برای همکاری و استخدام ارتباط بگیرید.
        </p>
      </div>
    </section>

    <div class="custom-pad grid items-start gap-4 md:grid-cols-7">
      <CompanyFiltersSidebar
        v-model="companyFilters"
        class="col-span-full md:col-span-2"
      />

      <div id="companies-results" class="col-span-full space-y-4 md:col-span-5">
        <template v-if="loading">
          <CompanyBox
            v-for="n in 12"
            :key="`skeleton-${n}`"
            layout="horizontal"
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
          v-else-if="initialized && !companies.length"
          wrapper-class="py-12"
        />

        <template v-else>
          <CompanyBox
            v-for="(company, index) in companies"
            :key="`company-${page}-${index}-${company.logo ?? 'no-logo'}`"
            layout="horizontal"
            :company="company"
            to="/company"
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
    </div>

    <FaqSection
      class="custom-pad mt-12"
      :categories="faqCategories"
      :items="faqs"
    />
  </div>
</template>

<script setup lang="ts">
import CompanyBox from '~/components/Elements/company-box.vue'
import CompanyFiltersSidebar from '~/components/Elements/CompanyFiltersSidebar.vue'
import FaqSection from '~/components/Elements/FaqSection.vue'
import NoResult from '~/components/Elements/NoResult.vue'
import Pagination from '~/components/Elements/Pagination.vue'
import { createEmptyCompanyFilters } from '~/types/company-filters'

const route = useRoute()
const router = useRouter()

function parsePageQuery(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number(raw)
  return Number.isInteger(page) && page > 0 ? page : 1
}

const companyFilters = ref(createEmptyCompanyFilters())
const page = ref(parsePageQuery(route.query.page))

const { companies, lastPage, loading, initialized, error } = useCompanies(
  companyFilters,
  page,
)

watch(
  () => route.query.page,
  (queryPage) => {
    const nextPage = parsePageQuery(queryPage)
    if (nextPage !== page.value) page.value = nextPage
  },
)

watch(page, async (nextPage) => {
  const normalizedPage = Number.isInteger(nextPage) && nextPage > 0 ? nextPage : 1
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

watch(
  companyFilters,
  () => {
    if (page.value !== 1) page.value = 1
  },
  { deep: true },
)

function onPageChange(nextPage: number) {
  page.value = nextPage
  nextTick(() => {
    const el = document.getElementById('companies-results')
    if (!el) return
    const y = el.getBoundingClientRect().top + window.pageYOffset - 100
    window.scrollTo({ top: y, behavior: 'smooth' })
  })
}

const faqCategories = [
  { id: 1, label: 'کارفرمایان' },
  { id: 2, label: 'حسابداران' },
]

const faqs = [
  {
    type: 1,
    question: 'چگونه می‌توانم با شرکت‌های موجود در های‌حساب همکاری کنم؟',
    answer:
      'پس از ثبت‌نام به‌عنوان کارفرما، می‌توانید پروفایل شرکت‌های فعال را مشاهده کنید و برای همکاری یا استخدام با آن‌ها ارتباط برقرار نمایید.',
  },
  {
    type: 1,
    question: 'آیا اطلاعات شرکت‌ها به‌روز است؟',
    answer:
      'اطلاعات نمایش‌داده‌شده بر اساس داده‌های ثبت‌شده توسط شرکت‌ها و آگهی‌های فعال آن‌ها ارائه می‌شود و به‌صورت دوره‌ای به‌روزرسانی می‌گردد.',
  },
  {
    type: 1,
    question: 'چگونه شرکت من در این فهرست نمایش داده می‌شود؟',
    answer:
      'پس از تکمیل پروفایل شرکت و ثبت آگهی فعال، اطلاعات سازمان شما در فهرست شرکت‌های حوزه حسابداری قابل مشاهده خواهد بود.',
  },
  {
    type: 1,
    question: 'آیا می‌توانم شرکت‌ها را بر اساس موقعیت مکانی فیلتر کنم؟',
    answer:
      'بله. از بخش فیلترها می‌توانید استان، شهر و سایر معیارها را انتخاب کنید تا نتایج متناسب با نیاز شما نمایش داده شود.',
  },
  {
    type: 2,
    question: 'چگونه می‌توانم رزومه خود را برای شرکت‌ها ارسال کنم؟',
    answer:
      'پس از تکمیل رزومه در های‌حساب، می‌توانید از طریق آگهی‌های فعال هر شرکت درخواست همکاری ارسال کنید.',
  },
  {
    type: 2,
    question: 'آیا مشاهده پروفایل شرکت‌ها برای حسابداران رایگان است؟',
    answer:
      'بله. حسابداران می‌توانند اطلاعات عمومی شرکت‌ها و آگهی‌های فعال را بدون هزینه مشاهده کنند.',
  },
]

useSeoMeta({
  title: 'شرکت‌های معتبر حوزه حسابداری | همکاری با سازمان‌های برتر | های‌حساب',
  description:
    'فهرست شرکت‌های فعال در حوزه حسابداری و مالی. همکاری با سازمان‌های معتبر، مشاهده آگهی‌های فعال و ارتباط با کارفرمایان در های‌حساب.',
})
</script>
