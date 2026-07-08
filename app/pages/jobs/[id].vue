<template>
  <div class="bg-surface-50 pb-12">
  <section class="bg-[url('/images/ad-cover-bg.jpg')] bg-cover bg-center bg-no-repeat">
    <div class="custom-pad pt-6 pb-12">
      <nav class="text-sm text-text-passive">
        <NuxtLink to="/" class="transition-colors hover:text-primary-500">
          <Icon name="svg:home" size="16" />
        </NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/jobs" class="transition-colors hover:text-primary-500">
          فرصت‌های شغلی
        </NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-text-tertiary">{{ ad?.title ?? 'آگهی' }}</span>
      </nav>
    </div>

    <div class="custom-pad pb-0">
      <div
        v-if="loading && !ad"
        class="mt-4 animate-pulse rounded-t-2xl bg-surface-50 p-6"
      >
        <div class="h-20 rounded-xl bg-surface-200" />
        <div class="mt-6 h-10 rounded bg-surface-200" />
      </div>

      <div
        v-else-if="ad"
        class="relative z-10 mt-4 rounded-t-2xl bg-surface-50"
      >
        <div class="flex flex-wrap items-start justify-between gap-4 p-5 md:p-6">
          <div class="flex min-w-0 items-start gap-4">
            <div
              class="flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#ECF4D9]"
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
            <div class="min-w-0">
              <p class="text-sm text-text-passive">{{ ad.company_name }}</p>
              <h1 class="mt-1 font-yb-bold text-xl text-text-primay md:text-2xl">
                {{ ad.title }}
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <p v-if="publishDateLabel" class="text-sm text-text-passive">
              تاریخ انتشار:
              <span class="text-text-passive">{{ publishDateLabel }}</span>
            </p>
            
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-lg border-2 cursor-pointer border-gray-default bg-white transition-opacity hover:opacity-80"
              aria-label="اشتراک‌گذاری"
              @click="shareAd"
            >
              <Icon name="material-symbols:share-outline" size="16" />
            </button>
            <BookmarkToggleButton
              v-if="ad?.id"
              :target-id="ad?.id"
              type="ads"
              label="نشان کردن"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

    <div class="custom-pad">
    <p v-if="error" class="mt-8 py-12 text-center text-sm text-error">
      {{ error }}
    </p>

    <template v-else-if="ad">
      <div class="p-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px] bg-surface-50">
        <main class="space-y-4">
          <div class="flex gap-6 border-b border-gray-default px-5 md:px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="flex items-center gap-2 border-b-2 py-3 text-sm font-semibold transition-colors cursor-pointer"
              :class="
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-text-passive hover:text-text-secondary'
              "
              @click="activeTab = tab.id"
            >
              <div class="bg-primary-300 rounded-full p-1 h-7 w-7 flex items-center justify-center" 
              :class="activeTab === tab.id ? 'bg-primary-500 text-white' : 'bg-surface-200 text-text-passive'">
                <Icon :name="tab.icon" size="16" />
              </div>
              {{ tab.label }}
            </button>
          </div>
          <template v-if="activeTab === 'about'">
            <section
              v-if="showQualificationsSection"
              class="rounded-2xl border border-gray-default bg-white p-5 md:p-6"
            >
              <AdSectionTitle title="شرایط احراز:" />

              <div
                v-if="qualificationIntro"
                class="prose prose-sm mt-4 max-w-none text-sm leading-8 text-text-secondary"
                v-html="qualificationIntro"
              />

              <ul v-if="qualificationItems.length" class="mt-4 space-y-2 pr-4">
                <li
                  v-for="(item, index) in qualificationItems"
                  :key="`qualification-${index}`"
                  class="list-disc text-sm font-semibold text-text-secondary marker:text-text-tertiary"
                >
                  {{ item }}
                </li>
              </ul>

              <div
                v-if="requirementStats.length"
                class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AdRequirementStat
                  v-for="item in requirementStats"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                  :icon="item.icon"
                />
              </div>
            </section>

            <section
              v-if="showSkillsSection"
              class="rounded-2xl border border-gray-default bg-white p-5 md:p-6"
            >
              <AdSectionTitle title="مهارت فنی:" />

              <div
                v-if="ad.company_software"
                class="mt-4 flex flex-wrap items-center gap-3 text-sm text-text-secondary"
              >
              <div class="flex items-center gap-2 rounded-lg border border-gray-default bg-surface-50 px-3 py-2">
                  <img
                    v-if="ad.company_logo"
                    :src="ad.company_logo"
                    :alt="ad.company_name"
                    class="h-6 w-6 rounded object-cover"
                  />
                </div>
                <div class="flex flex-col">
                  <span>نرم‌افزار حسابداری مورد استفاده در مجموعه:</span>
                  <span class="font-yb-bold text-text-tertiary">{{ ad.company_software }}</span>
                </div>
                
              </div>

              <div class="my-6 grid gap-x-4 gap-y-12 md:grid-cols-2">
                <AdSkillLevelBar
                  v-for="skill in skillItems"
                  :key="skill.label"
                  :label="skill.label"
                  :level="skill.level"
                  :steps="proficiencySteps"
                  :proficiency-value="skill.value"
                />
              </div>
            </section>

            <section
              v-if="benefitItems.length"
              class="rounded-2xl border border-gray-default bg-white p-5 md:p-6"
            >
              <AdSectionTitle title="مزایای سازمان:" />

              <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div
                  v-for="item in benefitItems"
                  :key="item.label"
                  class="flex items-center justify-start gap-3 rounded-xl px-4 py-3"
                >
                <span
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F0FE] text-primary-500"
                  >
                    <Icon :name="item.icon" size="20" />
                  </span>
                  <span class="text-sm font-semibold text-text-secondary">{{ item.label }}</span>
                </div>
              </div>
            </section>
          </template>

          <template v-else-if="activeTab === 'company'">
            <section class="rounded-2xl border border-gray-default bg-white p-5 md:p-6">
              <AdSectionTitle title="معرفی سازمان" />
              <div
                v-if="ad.company?.intro"
                class="prose prose-sm mt-4 max-w-none text-sm leading-8 text-text-secondary"
                v-html="ad.company.intro"
              />
              <p v-else class="mt-4 text-sm text-text-passive">
                اطلاعاتی برای نمایش ثبت نشده است.
              </p>

              <template v-if="ad.company?.culture">
                <AdSectionTitle class="mt-8" title="فرهنگ سازمانی" />
                <div
                  class="prose prose-sm mt-4 max-w-none text-sm leading-8 text-text-secondary"
                  v-html="ad.company.culture"
                />
              </template>

              <template v-if="ad.company?.advantages">
                <AdSectionTitle class="mt-8" title="مزایای سازمان" />
                <div
                  class="prose prose-sm mt-4 max-w-none text-sm leading-8 text-text-secondary"
                  v-html="ad.company.advantages"
                />
              </template>

              <div
                v-if="ad.company?.slug"
                class="mt-8"
              >
                <NuxtLink
                  :to="`/companies/${ad.company.slug}`"
                  class="btn btn-outline text-primary-500"
                >
                  مشاهده پروفایل کامل شرکت
                </NuxtLink>
              </div>
            </section>
          </template>

          <template v-else>
            <section class="rounded-2xl border border-gray-default bg-white p-5 py-12 md:p-6">
              <p class="mt-2 text-center text-sm text-text-passive">
                پس از ورود به حساب کاربری، سوابق ارسال رزومه در این بخش نمایش داده می‌شود.
              </p>
            </section>
          </template>
        </main>

        <aside class="lg:sticky lg:top-6">
          <div class="overflow-hidden rounded-2xl border border-gray-default bg-white p-5">
            <div class="flex w-full items-center gap-1">
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h2 class="font-yb-bold text-base text-text-primay">بررسی اجمالی شغل</h2>
            </div>

            <dl class="mt-4 space-y-3">
              <div
                v-for="item in overviewItems"
                :key="item.label"
                class="flex items-start justify-between gap-3 py-2 text-sm"
              >
                <dt class="flex items-center gap-2 text-text-passive">
                  <Icon :name="item.icon" size="16" />
                  {{ item.label }}
                </dt>
                <dd class="text-left font-semibold text-text-tertiary">{{ item.value }}</dd>
              </div>
            </dl>

            <button
              type="button"
              class="btn btn-success mt-6 h-11 w-full gap-2"
              @click="showResumeModal"
            >
            <Icon name="material-symbols:chevron-left" size="16" class="text-white"/>
              ارسال رزومه
            </button>
          </div>
          <button
            type="button"
            class="mt-4 p-6 cursor-pointer flex h-11 w-full items-center justify-start gap-2 rounded-2xl border border-gray-default bg-white text-red-500 transition-colors hover:bg-[#F3F3F3]"
            @click="showReportModal"
          >
          <Icon name="solar:document-linear" size="18" class="text-red-500" />
            گزارش مشکل
          </button>
        </aside>
      </div>
      <section class="mt-10">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-1">
            <span
              class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
              aria-hidden="true"
            />
            <h2 class="font-yb-bold text-base text-text-primay">آگهی‌های مشابه</h2>
          </div>
          <NuxtLink
            to="/jobs"
            class="text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80"
          >
            مشاهده بیشتر
          </NuxtLink>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <template v-if="loadingSimilar">
            <ItemBox
              v-for="n in 6"
              :key="`similar-skeleton-${n}`"
              variant="ad"
              loading
            />
          </template>
          <template v-else>
            <ItemBox
              v-for="opportunity in similarAds"
              :key="opportunity.item.id"
              variant="ad"
              :item="opportunity.item"
            />
          </template>
        </div>
      </section>
    </template>
  </div>

  <dialog1 id="ad-resume-login-modal" :title="ad?.title ?? ''" type="warning" :width="420">
    <p class="px-8 text-sm font-normal text-gray-600">
      لطفا برای ارسال رزومه از طریق دکمه زیر وارد حساب کاربری خود شوید
    </p>
    <form method="dialog">
      <NuxtLink to="/account" class="btn btn-primary mt-4 w-full">
        ورود و ثبت‌نام
      </NuxtLink>
    </form>
  </dialog1>
  <ReportIssueModal
    ref="reportIssueModalRef"
    :target-id="ad?.id ?? adId"
    type="ads"
  />
  </div>
</template>

<script setup lang="ts">
import ItemBox from '~/components/Elements/item-box.vue'
import NoResult from '~/components/Elements/NoResult.vue'
import BookmarkToggleButton from '~/components/Elements/BookmarkToggleButton.vue'
import AdSectionTitle from './components/AdSectionTitle.vue'
import AdRequirementStat from './components/AdRequirementStat.vue'
import AdSkillLevelBar from './components/AdSkillLevelBar.vue'
import ReportIssueModal from './components/ReportIssueModal.vue'
import { getProficiencyLevel, getProficiencySteps, parseAdBenefits } from './utils/ad-benefits'
import { useAd, useSimilarAds } from '~/composables/useAd'
import { useLookups } from '~/composables/useLookups'
import { formatJalaliDate } from '~/utils/format-jalali-date'

type AdTab = 'about' | 'company' | 'history'

const route = useRoute()
const adId = computed(() => String(route.params.id ?? ''))

const { ad, loading, error } = useAd(adId)
const { similarAds, loadingSimilar } = useSimilarAds(adId)
const { items: lookupItems } = useLookups('proficiencies')

const proficiencies = lookupItems('proficiencies')
const proficiencySteps = computed(() => getProficiencySteps(proficiencies.value))

const activeTab = ref<AdTab>('about')
const reportIssueModalRef = ref<InstanceType<typeof ReportIssueModal> | null>(null)

const tabs: { id: AdTab; label: string; icon: string }[] = [
  { id: 'about', label: 'درباره شغل', icon: 'lucide:briefcase' },
  { id: 'company', label: 'پروفایل سازمان', icon: 'mdi:office-building-outline' },
  { id: 'history', label: 'سوابق ارسال', icon: 'lucide:history' },
]

const companyInitial = computed(() => ad.value?.company_name?.charAt(0) ?? 'ش')

const publishDateLabel = computed(() => {
  const date = ad.value?.publish_date || ad.value?.created_at
  console.log(date);
  return date ? formatJalaliDate(date) : ''
})

const salaryLabel = computed(() => {
  const current = ad.value
  if (!current) return '—'
  return displayValue(current.salary ?? current.salary_range)
})

const workExperienceLabel = computed(() => {
  const value = ad.value?.minimum_work_experience
  if (value == null || value === '') return '—'
  const normalized = String(value).trim()
  return normalized.includes('سال') ? normalized : `${normalized} سال`
})

const genderLabel = computed(() => displayValue(ad.value?.gender, 'مهم نیست'))

function displayValue(
  value: string | number | null | undefined,
  fallback = '—',
) {
  const normalized = value == null ? '' : String(value).trim()
  return normalized || fallback
}

const locationLabel = computed(() => {
  const province = ad.value?.province_name
  const city = ad.value?.city_name
  if (province && city) return `${province}، ${city}`
  return province || city || '—'
})

const overviewItems = computed(() => {
  const current = ad.value
  if (!current) return []

  return [
    { label: 'نوع آگهی', value: 'شغلی', icon: 'svg:bag-1' },
    { label: 'نوع همکاری', value: displayValue(current.employment_type), icon: 'ph:suitcase-simple-light' },
    { label: 'گروه شغلی', value: displayValue(current.category), icon: 'svg:bag-4' },
    { label: 'موقعیت مکانی', value: locationLabel.value, icon: 'svg:location-4' },
    { label: 'سابقه کار', value: workExperienceLabel.value, icon: 'svg:work-history' },
    { label: 'حقوق', value: salaryLabel.value, icon: 'svg:wallet' },
    { label: 'جنسیت', value: genderLabel.value, icon: 'lucide:user' },
  ]
})

const requirementStats = computed(() => {
  const current = ad.value
  if (!current) return []

  return [
    {
      label: 'نوع آگهی:',
      value: displayValue(current.type ?? current.category, 'استخدامی'),
      icon: 'svg:user-search-2',
    },
    {
      label: 'نوع قرارداد:',
      value: displayValue(current.employment_type),
      icon: 'tabler:file-text',
    },
    {
      label: 'حقوق:',
      value: salaryLabel.value,
      icon: 'svg:wallet',
    },
    {
      label: 'سابقه کار:',
      value: workExperienceLabel.value,
      icon: 'svg:work-history',
    },
    {
      label: 'مدرک تحصیلی:',
      value: displayValue(current.minimum_degree),
      icon: 'svg:edu-item',
    },
    {
      label: 'جنسیت:',
      value: genderLabel.value,
      icon: 'lucide:user',
    },
  ].filter((item) => item.value !== '—')
})

const qualificationIntro = computed(() => ad.value?.job_description?.trim() || '')

const qualificationItems = computed(() => {
  const current = ad.value
  if (!current?.resume_terms?.trim()) return []

  return current.resume_terms
    .split(/\n|،|,/)
    .map((item) => item.trim())
    .filter(Boolean)
})

const showQualificationsSection = computed(
  () =>
    Boolean(qualificationIntro.value)
    || qualificationItems.value.length > 0
    || requirementStats.value.length > 0,
)

const benefitItems = computed(() => parseAdBenefits(ad.value?.company_advantages))

type SkillBarItem = {
  label: string
  value: string | boolean | number
  level: number
}

const skillItems = computed<SkillBarItem[]>(() => {
  const current = ad.value
  if (!current) return []

  const skills: SkillBarItem[] = []
  const candidates = [
    {
      label: 'بیمه',
      value: current.bimeh_skill,
      level: getProficiencyLevel(current.bimeh_skill, proficiencies.value),
    },
    {
      label: 'اکسل',
      value: current.excel_skill,
      level: getProficiencyLevel(current.excel_skill, proficiencies.value),
    },
    {
      label: 'مالیات',
      value: current.maliat_skill,
      level: getProficiencyLevel(current.maliat_skill, proficiencies.value),
    },
    {
      label: 'بهای تمام شده',
      value: current.baha_skill,
      level: getProficiencyLevel(current.baha_skill, proficiencies.value),
    },
  ]

  for (const skill of candidates) {
    if (skill.level != null && skill.value != null && skill.value !== false) {
      skills.push({
        label: skill.label,
        value: skill.value,
        level: skill.level,
      })
    }
  }

  return skills
})

const showSkillsSection = computed(
  () => Boolean(ad.value?.company_software) || skillItems.value.length > 0,
)

function showResumeModal() {
  if (!import.meta.client) return
  const modal = document.getElementById('ad-resume-login-modal') as HTMLDialogElement | null
  modal?.showModal()
}

function showReportModal() {
  reportIssueModalRef.value?.showModal()
}

async function shareAd() {
  if (!import.meta.client) return

  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: ad.value?.title ?? 'آگهی شغلی', url })
      return
    } catch {
      // fall through to clipboard
    }
  }

  await navigator.clipboard.writeText(url)
}

useSeoMeta({
  title: () =>
    ad.value?.title
      ? `${ad.value.title} | ${ad.value.company_name}`
      : 'جزئیات آگهی شغلی',
  description: () =>
    ad.value?.job_description
      ? ad.value.job_description.replace(/<[^>]+>/g, '').slice(0, 160)
      : 'جزئیات آگهی استخدام حسابدار',
})
</script>
