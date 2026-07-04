<template>
  <div class="bg-surface-50 pb-12">
    <div class="custom-pad mx-auto max-w-7xl pt-6">
      <nav class="text-sm text-text-passive">
        <NuxtLink to="/" class="hover:text-primary-500 transition-colors">
          <Icon name="svg:home" size="16" />
        </NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/companies" class="hover:text-primary-500 transition-colors">
          شرکت‌ها
        </NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-text-tertiary">بازرگانی سپهر</span>
      </nav>

      <div class="mt-6 flex items-center gap-6 border-b border-surface-200">
        <button
          type="button"
          class="border-b-2 pb-2 text-sm font-semibold transition-colors cursor-pointer"
          :class="activeTab === 'about' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-passive'"
          @click="activeTab = 'about'"
        >
          اطلاعات شرکت
        </button>
        <button
          type="button"
          class="border-b-2 pb-2 text-sm font-semibold transition-colors cursor-pointer"
          :class="activeTab === 'ads' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-passive'"
          @click="activeTab = 'ads'"
        >
          آگهی‌ها
        </button>
      </div>

      <div dir="ltr" class="mt-6 grid items-start gap-4 lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside
          dir="rtl"
          class="company-aside relative overflow-hidden rounded-2xl border border-gray-default bg-white"
        >
          <img
            :src="asidePattern"
            alt=""
            class="company-aside-pattern pointer-events-none absolute -top-5 left-0 w-full origin-top scale-[1.3]"
            aria-hidden="true"
          />
          <div class="relative z-10 px-3 pb-3 pt-10">
            <div class="flex justify-center">
              <div class="flex h-[74px] w-[74px] items-center justify-center rounded-2xl border-4 border-white bg-[#ECF4D9]">
                <span class="font-yb-bold text-xl text-text-tertiary">م</span>
              </div>
            </div>

            <h1 class="mt-2 text-center font-yb-bold text-xl text-text-tertiary">بازرگانی سپهر</h1>
            <p class="mt-1 text-center text-sm text-text-passive">توسعه‌دهنده وب</p>

            <div class="flex w-full items-center gap-1 mt-10">
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h2 class="font-yb-bold text-base text-text-primay">اطلاعات پایه</h2>
            </div>
            <div class="mt-4 space-y-2 pt-4 text-sm text-text-tertiary">
              <div class="flex items-center justify-between">
                <span class="text-text-passive">تعداد پرسنل</span>
                <span class="font-semibold">۳۰ تا ۵۰ نفر</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text-passive">استان</span>
                <span class="font-semibold">تهران</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text-passive">شهر</span>
                <span class="font-semibold">تهران</span>
              </div>
            </div>

            <div class="mt-4 border-t border-surface-200 pt-4">
              <h2 class="text-sm font-semibold text-text-tertiary">اطلاعات تماس</h2>
              <p class="mt-2 text-sm text-text-passive">support@hihesabtest.com</p>
            </div>

            <div class="mt-4 pt-4">
              <div class="flex w-full items-center gap-1">
                  <span
                    class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                    aria-hidden="true"
                  />
                  <h2 class="font-yb-bold text-base text-text-primay">اشتراک‌گذاری</h2>
                </div>
              <div class="mt-4 flex items-center justify-around gap-2">
                <button
                  v-for="item in socialLinks"
                  :key="item.id"
                  type="button"
                  class="transition-opacity hover:opacity-80"
                  :aria-label="item.label"
                  @click="item.onClick()"
                >
                  <img
                    :src="item.icon"
                    :alt="item.label"
                    width="32"
                    height="32"
                    class="h-6 w-6 cursor-pointer"
                  />
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main v-if="activeTab === 'about'" dir="rtl" class="space-y-4">
          <section class="rounded-2xl border border-gray-default bg-white p-5">
            <div class="">
              <div class="space-y-3">
                <div class="flex w-full items-center gap-1">
                  <span
                    class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                    aria-hidden="true"
                  />
                  <h2 class="font-yb-bold text-base text-text-primay">اطلاعات پایه</h2>
                </div>

                <div class="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  <div
                    v-for="field in basicInfoFields"
                    :key="field.label"
                    class="flex flex-col items-start gap-1"
                  >
                    <span class="text-caption text-text-passive">{{ field.label }}</span>
                    <span class="font-yb-bold text-base text-text-primay">{{ field.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-xl border border-surface-200 bg-white p-5">
            <h2 class="font-yb-bold text-lg text-text-tertiary">معرفی سازمان</h2>
            <p class="mt-4 text-sm leading-8 text-text-secondary">
              گروه بازرگانی سپهر با تکیه بر تیم مالی و حسابداری متخصص، در حوزه خدمات مالی، مشاوره مالیاتی و راهکارهای
              مدیریت منابع انسانی فعالیت می‌کند. هدف ما ایجاد محیطی حرفه‌ای برای رشد نیروهای متخصص و همکاری بلندمدت با
              سازمان‌های پیشرو است.
            </p>
            <ul class="mt-4 list-disc space-y-1 pr-5 text-sm leading-8 text-text-secondary">
              <li>فعال در حوزه خدمات مالی و حسابداری شرکتی</li>
              <li>فرصت رشد شغلی و برنامه آموزشی مستمر</li>
              <li>محیط کاری حرفه‌ای و تیمی</li>
              <li>همکاری با مجموعه‌های معتبر داخلی</li>
            </ul>
          </section>

          <section class="rounded-xl border border-surface-200 bg-white p-5">
            <h2 class="font-yb-bold text-lg text-text-tertiary">موقعیت مکانی</h2>
            <div class="mt-4 overflow-hidden rounded-lg border border-surface-200">
              <div
                class="flex h-[260px] items-center justify-center bg-linear-to-br from-[#EAF0FF] to-[#D7E1FF] text-sm text-primary-500"
              >
                تصویر نمونه نقشه
              </div>
            </div>
          </section>

          <section class="rounded-xl border border-surface-200 bg-white p-5">
            <h2 class="font-yb-bold text-lg text-text-tertiary">گالری تصاویر</h2>
            <div class="mt-4 grid gap-3 sm:grid-cols-3">
              <div class="h-28 rounded-lg bg-[#DDE5F8]" />
              <div class="h-28 rounded-lg bg-[#D6EBDD]" />
              <div class="h-28 rounded-lg bg-[#F3E5D9]" />
            </div>
          </section>
        </main>

        <main v-else dir="rtl" class="space-y-3">
          <ItemBoxVertical
            v-for="ad in ads"
            :key="ad.id"
            :title="ad.title"
            :type="ad.type"
            :location="ad.location"
            :gender="ad.gender"
            :salary="ad.salary"
            :age="ad.age"
            :highlight="ad.highlight"
            :variant="ad.variant"
            :employment-type="ad.employmentType"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ItemBoxVertical from '~/components/Elements/item-box-vertical.vue'
import asidePattern from '~/assets/vectors/aside-pattern.svg?url'
import linkIcon from '~/assets/vectors/social/link.svg?url'
import linkedinIcon from '~/assets/vectors/social/linkedin.svg?url'
import telegramIcon from '~/assets/vectors/social/telegram.svg?url'
import twitterIcon from '~/assets/vectors/social/twitter.svg?url'
import whatsappIcon from '~/assets/vectors/social/whatsapp.svg?url'

type CompanyTab = 'about' | 'ads'
type CompanyAdPreview = {
  id: number
  title: string
  age: string
  type: string
  location: string
  gender: string
  employmentType: string
  salary: string
  highlight: boolean
  variant: 'ad' | 'project'
}

const activeTab = ref<CompanyTab>('about')

const basicInfoFields = [
  { label: 'نام شرکت:', value: 'بازرگانی سپهر' },
  { label: 'سال تاسیس:', value: '۱۳۹۸' },
  { label: 'نوع فعالیت:', value: 'خدمات مالی' },
  { label: 'اندازه شرکت:', value: '۳۰ تا ۵۰ نفر' },
  { label: 'استان:', value: 'تهران' },
  { label: 'شهر:', value: 'تهران' },
]

function getShareUrl() {
  if (!import.meta.client) return ''
  return window.location.href
}

function openShare(url: string) {
  if (!import.meta.client) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

function shareOnLinkedIn() {
  openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`)
}

function shareOnTwitter() {
  openShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}`)
}

function shareOnTelegram() {
  openShare(`https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}`)
}

function shareOnWhatsapp() {
  openShare(`https://wa.me/?text=${encodeURIComponent(getShareUrl())}`)
}

async function copyShareLink() {
  if (!import.meta.client) return
  await navigator.clipboard.writeText(getShareUrl())
}

const socialLinks = [
  { id: 'linkedin', icon: linkedinIcon, label: 'اشتراک در لینکدین', onClick: shareOnLinkedIn },
  { id: 'twitter', icon: twitterIcon, label: 'اشتراک در توییتر', onClick: shareOnTwitter },
  { id: 'telegram', icon: telegramIcon, label: 'اشتراک در تلگرام', onClick: shareOnTelegram },
  { id: 'whatsapp', icon: whatsappIcon, label: 'اشتراک در واتساپ', onClick: shareOnWhatsapp },
  { id: 'link', icon: linkIcon, label: 'کپی لینک', onClick: copyShareLink },
]

const ads: CompanyAdPreview[] = [
  {
    id: 1,
    title: 'استخدام حسابدار',
    age: '۳ روز قبل',
    type: 'فروش آهن آلات',
    location: 'مشهد، وکیل آباد',
    gender: 'خانم',
    employmentType: 'تمام وقت',
    salary: 'تمام وقت | ۲۵ میلیون تومان',
    highlight: false,
    variant: 'ad',
  },
  {
    id: 2,
    title: 'پروژه مرتبط با حقوق و دستمزد',
    age: '۳ روز قبل',
    type: 'پروژه حسابداری',
    location: 'فروش آهن آلات',
    gender: 'خانم',
    employmentType: 'پروژه',
    salary: 'پروژه | ۵ تا ۸ میلیون تومان',
    highlight: true,
    variant: 'project',
  },
  {
    id: 3,
    title: 'استخدام حسابدار',
    age: '۳ روز قبل',
    type: 'فروش آهن آلات',
    location: 'مشهد، وکیل آباد',
    gender: 'خانم',
    employmentType: 'تمام وقت',
    salary: 'تمام وقت | ۲۵ میلیون تومان',
    highlight: false,
    variant: 'ad',
  },
]

useSeoMeta({
  title: 'پروفایل شرکت | بازرگانی سپهر',
  description: 'جزئیات شرکت، اطلاعات پایه، موقعیت مکانی و گالری تصاویر',
})
</script>

<style scoped>
.company-aside-pattern {
  -webkit-mask-image: linear-gradient(
    to top,
    transparent 40%,
    rgb(0 0 0 / 40%) 8%,
    rgb(0 0 0 / 75%) 70%,
    #000 54%,
    #000 74%,
    rgb(0 0 0 / 90%) 99%,
    rgb(0 0 0 / 60%) 100%
  );
  mask-image: linear-gradient(
    to top,
    transparent 40%,
    rgb(0 0 0 / 40%) 8%,
    rgb(0 0 0 / 75%) 70%,
    #000 54%,
    #000 74%,
    rgb(0 0 0 / 90%) 99%,
    rgb(0 0 0 / 60%) 100%
  );
}
</style>
