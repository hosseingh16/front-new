<template>
  <template v-if="loading && !company">
    <div class="mt-6 h-10 w-48 animate-pulse rounded bg-surface-200" />
    <div class="mt-6 grid items-start gap-4 lg:grid-cols-[272px_minmax(0,1fr)]">
      <div class="h-96 animate-pulse rounded-2xl bg-surface-200" />
      <div class="h-[600px] animate-pulse rounded-2xl bg-surface-200" />
    </div>
  </template>

  <template v-else-if="company">
    <div class="mt-6 flex items-center gap-6 border-b border-surface-200">
      <button
        type="button"
        class="cursor-pointer border-b-2 pb-2 text-sm font-semibold transition-colors"
        :class="activeTab === 'about' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-passive'"
        @click="activeTab = 'about'"
      >
        اطلاعات شرکت
      </button>
      <button
        type="button"
        class="cursor-pointer border-b-2 pb-2 text-sm font-semibold transition-colors"
        :class="activeTab === 'ads' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-passive'"
        @click="activeTab = 'ads'"
      >
        آگهی‌ها
      </button>
    </div>

    <div class="mt-6 grid items-start gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <main v-if="activeTab === 'about'" class="space-y-4">
        <section class="rounded-2xl border border-gray-default bg-white p-5">
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
        </section>

        <section
          v-if="company.intro || company.culture || company.advantages"
          class="rounded-xl border border-surface-200 bg-white p-5"
        >
          <div class="flex w-full items-center gap-1">
            <span
              class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
              aria-hidden="true"
            />
            <h2 class="font-yb-bold text-base text-text-primay">معرفی سازمان</h2>
          </div>
          <div
            v-if="company.intro"
            class="prose prose-sm mt-4 max-w-none text-sm leading-8 text-text-secondary"
            v-html="company.intro"
          />
          <div
            v-if="company.culture"
            class="prose prose-sm mt-4 max-w-none text-sm leading-8 text-text-secondary"
            v-html="company.culture"
          />
          <div
            v-if="company.advantages"
            class="prose prose-sm mt-4 max-w-none text-sm leading-8 text-text-secondary"
            v-html="company.advantages"
          />
        </section>

        <section
          v-if="company.address || mapImageUrl"
          class="rounded-xl border border-surface-200 bg-white p-5"
        >
          <div class="flex w-full items-center gap-1">
            <span
              class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
              aria-hidden="true"
            />
            <h2 class="font-yb-bold text-base text-text-primay">موقعیت مکانی</h2>
          </div>
          <p v-if="company.address" class="mt-4 text-sm leading-7 text-text-secondary">
            {{ company.address }}
          </p>
          <div class="mt-4 overflow-hidden rounded-lg border border-surface-200">
            <img
              v-if="mapImageUrl"
              :src="mapImageUrl"
              alt="موقعیت مکانی شرکت"
              class="h-auto w-full object-cover"
              width="368"
              height="250"
              loading="lazy"
            />
            <div
              v-else
              class="flex h-[260px] items-center justify-center bg-surface-100 text-sm text-text-passive"
            >
              موقعیت مکانی ثبت نشده است
            </div>
          </div>
        </section>

        <section
          v-if="company.gallery?.length"
          class="rounded-xl border border-surface-200 bg-white p-5"
        >
          <div class="flex w-full items-center gap-1">
            <span
              class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
              aria-hidden="true"
            />
            <h2 class="font-yb-bold text-base text-text-primay">گالری تصاویر</h2>
          </div>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <img
              v-for="(image, index) in company.gallery"
              :key="`gallery-${index}`"
              :src="image"
              :alt="`تصویر ${index + 1} ${company.name}`"
              class="h-28 w-full rounded-lg object-cover"
              loading="lazy"
            />
          </div>
        </section>
      </main>

      <main v-else class="space-y-3">
        <NoResult v-if="!companyAds.length" wrapper-class="py-12" />

        <ItemBoxVertical
          v-for="ad in companyAds"
          :key="ad.id"
          :title="ad.title"
          :company-name="ad.companyName"
          :type="ad.type"
          :location="ad.location"
          :gender="ad.gender"
          :salary="ad.salary"
          :age="ad.age"
          :logo="ad.logo"
          :to="ad.to"
          :highlight="ad.highlight"
          :variant="ad.variant"
          :employment-type="ad.employmentType"
        />
      </main>

      <aside class="company-aside">
        <div class="relative overflow-hidden rounded-2xl border border-gray-default bg-white">
          <img
            :src="asidePattern"
            alt=""
            class="company-aside-pattern pointer-events-none absolute -top-5 left-0 w-full origin-top scale-[1.3]"
            aria-hidden="true"
          />
          <div class="relative z-10 px-3 pb-3 pt-10">
            <div class="flex justify-center">
              <div class="flex h-[74px] w-[74px] items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#ECF4D9]">
                <img
                  v-if="company.logo"
                  :src="company.logo"
                  :alt="company.name"
                  class="h-full w-full object-cover"
                />
                <span v-else class="font-yb-bold text-xl text-text-tertiary">
                  {{ companyInitial }}
                </span>
              </div>
            </div>

            <h1 class="mt-2 text-center font-yb-bold text-xl text-text-tertiary">
              {{ company.name }}
            </h1>
            <p v-if="company.activity" class="mt-1 text-center text-sm text-text-passive">
              {{ company.activity }}
            </p>

            <div class="mt-10 flex w-full items-center gap-1">
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h2 class="font-yb-bold text-base text-text-primay">اطلاعات پایه</h2>
            </div>
            <div class="mt-4 space-y-2 text-sm text-text-tertiary">
              <div v-if="company.activity" class="flex items-center justify-between py-2">
                <span class="text-text-passive">نوع فعالیت</span>
                <span class="font-semibold">{{ company.activity }}</span>
              </div>
              <div v-if="company.size" class="flex items-center justify-between py-2">
                <span class="text-text-passive">تعداد پرسنل</span>
                <span class="font-semibold">{{ company.size }}</span>
              </div>
              <div v-if="locationLabel" class="flex items-center justify-between py-2">
                <span class="text-text-passive">موقعیت مکانی</span>
                <span class="font-semibold">{{ locationLabel }}</span>
              </div>
              <div v-if="company.website" class="flex items-center justify-between py-2">
                <span class="text-text-passive">وبسایت</span>
                <a
                  :href="websiteUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-primary-500 hover:opacity-80"
                >
                  {{ company.website }}
                </a>
              </div>
            </div>

            <div v-if="showContactInfo" class="mt-10 flex w-full items-center gap-1">
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h2 class="font-yb-bold text-base text-text-primay">اطلاعات تماس</h2>
            </div>
            <div v-if="showContactInfo" class="mt-4 space-y-2 text-sm text-text-tertiary">
              <div v-if="company.tel && isTelPublic" class="flex items-center justify-between py-2">
                <span class="text-text-passive">تلفن</span>
                <span class="font-semibold">{{ company.tel }}</span>
              </div>
              <div v-if="company.address" class="flex items-center justify-between gap-3 py-2">
                <span class="shrink-0 text-text-passive">آدرس</span>
                <span class="text-left font-semibold">{{ company.address }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="relative my-2 overflow-hidden rounded-2xl border border-gray-default bg-white">
          <div class="z-10 px-3 pb-3 pt-3">
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
    </div>
  </template>
</template>

<script setup lang="ts">
import ItemBoxVertical from '~/components/Elements/item-box-vertical.vue'
import NoResult from '~/components/Elements/NoResult.vue'
import asidePattern from '~/assets/vectors/aside-pattern.svg?url'
import linkIcon from '~/assets/vectors/social/link.svg?url'
import linkedinIcon from '~/assets/vectors/social/linkedin.svg?url'
import telegramIcon from '~/assets/vectors/social/telegram.svg?url'
import twitterIcon from '~/assets/vectors/social/twitter.svg?url'
import whatsappIcon from '~/assets/vectors/social/whatsapp.svg?url'
import { buildYandexStaticMapUrl } from '~/utils/yandex-static-map'
import type { YandexMapPoint } from '~/utils/yandex-static-map'
import { formatRelativeDate } from '~/utils/format-relative-date'
import type { Company } from '~/types/company'

type CompanyTab = 'about' | 'ads'

const props = defineProps<{
  company: Company | null
  loading?: boolean
}>()

const activeTab = ref<CompanyTab>('about')

function displayValue(value: string | null | undefined) {
  return value?.trim() ? value : '—'
}

const companyInitial = computed(() => props.company?.name?.charAt(0) ?? 'ش')

const locationLabel = computed(() => {
  const province = props.company?.province_name
  const city = props.company?.city_name
  if (province && city) return `${province}، ${city}`
  return province || city || ''
})

const isTelPublic = computed(() => Boolean(props.company?.is_tell_public))

const showContactInfo = computed(
  () => (props.company?.tel && isTelPublic.value) || props.company?.address,
)

const websiteUrl = computed(() => {
  const website = props.company?.website
  if (!website) return ''
  return website.startsWith('http') ? website : `https://${website}`
})

const basicInfoFields = computed(() => {
  const c = props.company
  if (!c) return []

  return [
    { label: 'نام شرکت:', value: displayValue(c.name) },
    { label: 'نوع فعالیت:', value: displayValue(c.activity) },
    { label: 'اندازه شرکت:', value: displayValue(c.size) },
    { label: 'استان:', value: displayValue(c.province_name) },
    { label: 'شهر:', value: displayValue(c.city_name) },
    { label: 'آدرس:', value: displayValue(c.address) },
    { label: 'وبسایت:', value: displayValue(c.website) },
  ]
})

const companyMapPoints = computed<YandexMapPoint[]>(() => {
  const c = props.company
  if (c?.lat == null || c?.long == null) return []

  return [{ longitude: c.long, latitude: c.lat, marker: 'round' }]
})

const mapImageUrl = computed(() => {
  const c = props.company
  if (!c?.lat || !c?.long) return null

  return buildYandexStaticMapUrl({
    points: companyMapPoints.value,
    center: { longitude: c.long, latitude: c.lat },
    width: 368,
    height: 250,
    zoom: 15,
    lang: 'fa_IR',
  })
})

const companyAds = computed(() => {
  const c = props.company
  if (!c?.ads?.length) return []

  return c.ads.map((ad, index) => ({
    id: ad.id,
    title: ad.title,
    companyName: c.name,
    type: ad.category || c.activity || '—',
    location: [ad.province_name, ad.city_name].filter(Boolean).join('، ') || locationLabel.value || '—',
    gender: ad.gender || '—',
    employmentType: ad.employment_type || '—',
    salary: String(ad.salary_range ?? ad.salary ?? '—'),
    age: formatRelativeDate(ad.publish_date),
    logo: ad.company_logo || c.logo,
    highlight: index % 2 === 1,
    variant: 'ad' as const,
    to: `/jobs/${ad.id}`,
  }))
})

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
</script>

<style scoped>
.company-aside-pattern {
  mask-image: linear-gradient(
    to top,
    transparent 0%,
    rgb(0 0 0 / 40%) 50%,
    rgb(0 0 0 / 85%) 56%,
    #000 60%,
    #000 90%,
    rgb(0 0 0 / 60%) 97%,
    transparent 100%
  );

  -webkit-mask-image: linear-gradient(
    to top,
    transparent 0%,
    rgb(0 0 0 / 40%) 50%,
    rgb(0 0 0 / 85%) 56%,
    #000 60%,
    #000 90%,
    rgb(0 0 0 / 60%) 97%,
    transparent 100%
  );
}
</style>
