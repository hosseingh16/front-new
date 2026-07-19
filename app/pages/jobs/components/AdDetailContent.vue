<template>
  <div class="grid items-start gap-4 bg-surface-50 p-5 lg:grid-cols-[minmax(0,1fr)_300px]">
    <main class="space-y-4">
      <div class="flex gap-6 border-b border-gray-default px-5 md:px-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="flex cursor-pointer items-center gap-2 border-b-2 py-3 text-sm font-semibold transition-colors"
          :class="
            activeTab === tab.id
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-text-passive hover:text-text-secondary'
          "
          @click="activeTab = tab.id"
        >
          <div
            class="flex h-7 w-7 items-center justify-center rounded-full bg-primary-300 p-1"
            :class="activeTab === tab.id ? 'bg-primary-500 text-white' : 'bg-surface-200 text-text-passive'"
          >
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
          <AdSectionTitle title="درباره سازمان" />
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
        </section>

        <section
          v-if="ad.company?.static_map"
          class="rounded-2xl border border-gray-default bg-white p-5 md:p-6"
        >
          <AdSectionTitle title="موقعیت مکانی" />
          <img
            :src="ad.company.static_map"
            alt="موقعیت مکانی"
            class="mt-4 h-full w-full object-cover"
          />
        </section>

        <section
          v-if="ad.company?.gallery?.length"
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
            <button
              v-for="(image, index) in ad.company.gallery"
              :key="`gallery-${index}`"
              type="button"
              class="cursor-pointer overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              @click="openGalleryImage(image, index)"
            >
              <img
                :src="image"
                :alt="`تصویر ${index + 1} ${ad.company?.name}`"
                class="h-28 w-full object-cover transition-opacity hover:opacity-90"
                loading="lazy"
              />
            </button>
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
          @click="emit('resume')"
        >
          <Icon name="material-symbols:chevron-left" size="16" class="text-white" />
          ارسال رزومه
        </button>
      </div>

      <button
        type="button"
        class="mt-4 flex h-11 w-full cursor-pointer items-center justify-start gap-2 rounded-2xl border border-gray-default bg-white p-6 text-red-500 transition-colors hover:bg-[#F3F3F3]"
        @click="emit('report-issue')"
      >
        <Icon name="svg:document-dismiss" size="18" class="text-red-500" />
        گزارش مشکل
      </button>
    </aside>

    <dialog ref="galleryDialogRef" class="modal" @click="handleGalleryBackdropClick">
      <div class="modal-box relative max-w-[min(90vw,720px)] p-3 sm:p-4">
        <button
          type="button"
          class="absolute left-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-text-passive shadow"
          aria-label="بستن"
          @click="closeGalleryImage"
        >
          <Icon name="material-symbols:close" size="18" />
        </button>
        <img
          v-if="selectedGalleryImage"
          :src="selectedGalleryImage"
          :alt="selectedGalleryAlt"
          class="max-h-[80vh] w-full rounded-lg object-contain"
        />
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import type { Ad } from '~/types/ad'
import AdSectionTitle from './AdSectionTitle.vue'
import AdRequirementStat from './AdRequirementStat.vue'
import AdSkillLevelBar from './AdSkillLevelBar.vue'
import { getProficiencyLevel, getProficiencySteps, parseAdBenefits } from '../utils/ad-benefits'
import { useLookups } from '~/composables/useLookups'

type AdTab = 'about' | 'company' | 'history'

type SkillBarItem = {
  label: string
  value: string | boolean | number
  level: number
}

const props = defineProps<{
  ad: Ad
}>()

const emit = defineEmits<{
  resume: []
  'report-issue': []
}>()

const { items: lookupItems } = useLookups('proficiencies')
const proficiencies = lookupItems('proficiencies')
const proficiencySteps = computed(() => getProficiencySteps(proficiencies.value))

const activeTab = ref<AdTab>('about')
const galleryDialogRef = ref<HTMLDialogElement | null>(null)
const selectedGalleryImage = ref<string | null>(null)
const selectedGalleryIndex = ref(0)

const selectedGalleryAlt = computed(
  () => `تصویر ${selectedGalleryIndex.value + 1} ${props.ad.company?.name ?? ''}`,
)

function openGalleryImage(image: string, index: number) {
  selectedGalleryImage.value = image
  selectedGalleryIndex.value = index
  galleryDialogRef.value?.showModal()
}

function closeGalleryImage() {
  galleryDialogRef.value?.close()
}

function handleGalleryBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeGalleryImage()
  }
}

const tabs: { id: AdTab; label: string; icon: string }[] = [
  { id: 'about', label: 'درباره شغل', icon: 'lucide:briefcase' },
  { id: 'company', label: 'پروفایل سازمان', icon: 'mdi:office-building-outline' },
  { id: 'history', label: 'سوابق ارسال', icon: 'lucide:history' },
]

function displayValue(
  value: string | number | null | undefined,
  fallback = '—',
) {
  const normalized = value == null ? '' : String(value).trim()
  return normalized || fallback
}

const salaryLabel = computed(() => displayValue(props.ad.salary ?? props.ad.salary_range))

const workExperienceLabel = computed(() => {
  const value = props.ad.minimum_work_experience
  if (value == null || value === '') return '—'
  const normalized = String(value).trim()
  return normalized.includes('سال') ? normalized : `${normalized} سال`
})

const genderLabel = computed(() => displayValue(props.ad.gender, 'مهم نیست'))

const locationLabel = computed(() => {
  const province = props.ad.province_name
  const city = props.ad.city_name
  if (province && city) return `${province}، ${city}`
  return province || city || '—'
})

const overviewItems = computed(() => [
  { label: 'نوع آگهی', value: 'شغلی', icon: 'svg:bag-1' },
  { label: 'نوع همکاری', value: displayValue(props.ad.employment_type), icon: 'ph:suitcase-simple-light' },
  { label: 'گروه شغلی', value: displayValue(props.ad.category), icon: 'svg:bag-4' },
  { label: 'موقعیت مکانی', value: locationLabel.value, icon: 'svg:location-4' },
  { label: 'سابقه کار', value: workExperienceLabel.value, icon: 'svg:work-history' },
  { label: 'حقوق', value: salaryLabel.value, icon: 'svg:wallet' },
  { label: 'جنسیت', value: genderLabel.value, icon: 'lucide:user' },
])

const requirementStats = computed(() =>
  [
    {
      label: 'نوع آگهی:',
      value: displayValue(props.ad.type ?? props.ad.category, 'استخدامی'),
      icon: 'svg:user-search-2',
    },
    {
      label: 'نوع قرارداد:',
      value: displayValue(props.ad.employment_type),
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
      value: displayValue(props.ad.minimum_degree),
      icon: 'svg:edu-item',
    },
    {
      label: 'جنسیت:',
      value: genderLabel.value,
      icon: 'lucide:user',
    },
  ].filter((item) => item.value !== '—'),
)

const qualificationIntro = computed(() => props.ad.job_description?.trim() || '')

const qualificationItems = computed(() => {
  if (!props.ad.resume_terms?.trim()) return []

  return props.ad.resume_terms
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

const benefitItems = computed(() => parseAdBenefits(props.ad.company_advantages))

const skillItems = computed<SkillBarItem[]>(() => {
  const skills: SkillBarItem[] = []
  const candidates = [
    {
      label: 'بیمه',
      value: props.ad.bimeh_skill,
      level: getProficiencyLevel(props.ad.bimeh_skill, proficiencies.value),
    },
    {
      label: 'اکسل',
      value: props.ad.excel_skill,
      level: getProficiencyLevel(props.ad.excel_skill, proficiencies.value),
    },
    {
      label: 'مالیات',
      value: props.ad.maliat_skill,
      level: getProficiencyLevel(props.ad.maliat_skill, proficiencies.value),
    },
    {
      label: 'بهای تمام شده',
      value: props.ad.baha_skill,
      level: getProficiencyLevel(props.ad.baha_skill, proficiencies.value),
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
  () => Boolean(props.ad.company_software) || skillItems.value.length > 0,
)
</script>
