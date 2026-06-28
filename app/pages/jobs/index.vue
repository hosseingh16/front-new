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
        >
          فرصت‌های شغلی حسابداری را پیدا کنید
        </div>
        <h1 class="font-yb-bold text-[23px] lg:text-h1 text-center">
          مشاهده جدیدترین آگهی‌های استخدام حسابداری
        </h1>
        <h2 class="text-center">
          از بین فرصت‌های شغلی تمام‌وقت، نیمه‌وقت و پروژه‌ای، موقعیت مناسب خود را پیدا
          کرده و رزومه خود را برای سازمان‌های معتبر ارسال کنید.
        </h2>
      </div>
    </section>

    <div class="custom-pad grid md:grid-cols-7 gap-4 items-start">
      <JobFiltersSidebar v-model="jobFilters" class="md:col-span-2" />

      <div class="md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <p
          v-if="loading && !ads.length"
          class="col-span-full py-12 text-center text-sm text-text-passive"
        >
          در حال بارگذاری آگهی‌ها...
        </p>

        <p
          v-else-if="error"
          class="col-span-full py-12 text-center text-sm text-error"
        >
          {{ error }}
        </p>

        <NoResult v-else-if="!ads.length" wrapper-class="col-span-full" />

        <ItemBox
          v-for="ad in ads"
          v-else
          :key="ad.id"
          variant="ad"
          :item="ad"
          @bookmark="toggleBookmark"
        />
      </div>
    </div>
    
    <FaqSection class="custom-pad mt-12" :categories="faqCategories" :items="faqs" />

  </div>
</template>

<script setup lang="ts">
import ItemBox from '~/components/Elements/item-box.vue'
import JobFiltersSidebar from '~/components/Elements/JobFiltersSidebar.vue'
import NoResult from '~/components/Elements/NoResult.vue'
import FaqSection from '~/components/Elements/FaqSection.vue'
import type { ApiResponse } from '~/types/api'
import { createEmptyJobFilters } from '~/types/job-filters'

const api = useApi()
const jobFilters = ref(createEmptyJobFilters())
const { ads, loading, error } = useJobAds(jobFilters)

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

</script>
