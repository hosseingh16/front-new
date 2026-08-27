<template>
  <div
    class="grid items-start gap-4 bg-surface-50 p-5 lg:grid-cols-[minmax(0,1fr)_300px]"
  >
    <main class="min-w-0 space-y-4">
      <div
        class="no-scrollbar -mx-1 flex justify-start gap-3 overflow-x-auto overscroll-x-contain border-b border-gray-default sm:gap-4 md:gap-6"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-[1.5px] py-2 text-xs transition-colors sm:gap-2 sm:text-sm"
          :class="
            activeTab === tab.id
              ? 'border-primary-500 font-semibold text-primary-500'
              : 'border-transparent text-text-primary hover:text-text-secondary'
          "
          @click="activeTab = tab.id"
        >
          <div
            class="flex h-5 w-5 items-center justify-center rounded-full p-0.5 sm:h-6 sm:w-6 sm:p-1"
            :class="
              activeTab === tab.id
                ? 'bg-[#4864E114] text-primary-500'
                : 'bg-[#4A4A4A14] text-text-passive'
            "
          >
            <Icon :name="tab.icon" class="size-3.5 sm:size-4" />
          </div>
          {{ tab.label }}
        </button>
      </div>

      <template v-if="activeTab === 'about'">
        <section
          v-if="showQualificationsSection"
          class="rounded-2xl border border-gray-default bg-white p-5 text-right md:p-6"
        >
          <AdSectionTitle title="شرایط احراز:" />

          <div
            v-if="qualificationIntro"
            class="prose prose-sm mt-4 max-w-none text-right text-sm leading-8 text-text-secondary"
            v-html="qualificationIntro"
          ></div>

          <div
            v-if="qualificationItems.length"
            class="mt-4 text-sm leading-8 text-text-secondary"
          >
            <ul
              class="list-inside list-disc space-y-1 marker:text-text-secondary"
            >
              <li
                v-for="item in qualificationItems"
                :key="item"
                v-html="item"
              ></li>
            </ul>
          </div>

          <div
            v-if="requirementStats.length"
            class="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
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
          class="rounded-2xl border border-gray-default bg-white p-5 text-right md:p-6"
        >
          <AdSectionTitle title="مهارت فنی:" />

          <div
            v-if="ad.company_software"
            class="mt-4 flex w-full flex-wrap items-center justify-start gap-3 text-sm text-text-secondary"
          >
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#4864E114] p-2"
            >
              <img
                :src="companyLogoSrc"
                :alt="ad.company_name"
                class="h-full w-full rounded object-cover"
              />
            </div>
            <div class="flex flex-col text-right">
              <span>نرم‌افزار حسابداری مورد استفاده در مجموعه:</span>
              <span class="font-yb-bold text-text-tertiary">{{
                ad.company_software
              }}</span>
            </div>
          </div>

          <div class="mt-5 grid gap-x-8 gap-y-8 md:grid-cols-2">
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
          class="rounded-2xl border border-gray-default bg-white p-5 text-right md:p-6"
        >
          <AdSectionTitle title="مزایای سازمان:" />

          <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="item in benefitItems"
              :key="item.label"
              class="flex w-full items-center justify-start gap-2 rounded-full px-1 py-1"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#4864E114] text-primary-500"
              >
                <Icon :name="item.icon" size="20" />
              </span>
              <span class="text-sm font-semibold text-text-secondary">
                {{ item.label }}
              </span>
            </div>
          </div>
        </section>
      </template>

      <template v-else-if="activeTab === 'company'">
        <AdCompanyProfile :ad="ad" />
      </template>

      <template v-else-if="activeTab === 'history'">
        <AdApplicationHistory :ad="ad" @resume="emit('resume')" />
      </template>

      <template v-else>
        <AdCompanyAds :ad="ad" />
      </template>
    </main>

    <aside class="lg:sticky lg:top-6">
      <div
        class="overflow-hidden rounded-2xl border border-gray-default bg-white p-5"
      >
        <div class="flex w-full items-center justify-start gap-1">
          <span
            class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
            aria-hidden="true"
          />
          <h2 class="font-yb-bold text-base text-text-primay">
            بررسی اجمالی شغل
          </h2>
        </div>

        <dl class="mt-4 space-y-3 text-right">
          <div
            v-for="item in overviewItems"
            :key="item.label"
            class="flex w-full items-center justify-start gap-2 py-1 text-sm"
          >
            <Icon
              :name="item.icon"
              size="20"
              class="shrink-0 text-text-passive"
            />
            <dt class="text-text-passive">{{ item.label }}:</dt>
            <dd
              class="font-semibold"
              :class="item.link ? 'text-primary-500' : 'text-text-secondary'"
            >
              {{ item.value }}
            </dd>
          </div>
        </dl>

        <p
          v-if="ad.has_applied"
          class="mt-6 flex h-11 w-full items-center justify-center gap-2 text-sm font-semibold text-text-primay"
        >
          <Icon name="svg:hint" size="18" />
          قبلا رزومه ارسال کرده‌اید
        </p>
        <button
          v-else
          type="button"
          class="btn btn-success mt-6 h-11 w-full gap-2"
          @click="emit('resume')"
        >
          <Icon
            name="material-symbols:chevron-left"
            size="16"
            class="text-white"
          />
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
  </div>
</template>

<script setup lang="ts">
import type { Ad } from "~/types/ad";
import ItemBoxVertical from "~/components/Elements/item-box-vertical.vue";
import NoResult from "~/components/Elements/NoResult.vue";
import AdSectionTitle from "./AdSectionTitle.vue";
import AdRequirementStat from "./AdRequirementStat.vue";
import AdSkillLevelBar from "./AdSkillLevelBar.vue";
import AdCompanyProfile from "./AdCompanyProfile.vue";
import AdApplicationHistory from "./AdApplicationHistory.vue";
import AdCompanyAds from "./AdCompanyAds.vue";
import {
  DEFAULT_PROFICIENCY_STEPS,
  getProficiencyLevel,
  getProficiencySteps,
  parseAdBenefits,
} from "../utils/ad-benefits";
import { useCompanyAds } from "~/composables/useAd";
import { useLookups } from "~/composables/useLookups";
import { formatJalaliDate } from "~/utils/format-jalali-date";
import { formatRelativeDate } from "~/utils/format-relative-date";
import { resolveCompanyLogoDisplaySrc } from "~/utils/company-basic-info";

type AdTab = "about" | "company" | "history" | "ads";

type SkillBarItem = {
  label: string;
  value: string | boolean | number;
  level: number;
};

const props = defineProps<{
  ad: Ad;
}>();

const emit = defineEmits<{
  resume: [];
  "report-issue": [];
}>();

const companyLogoSrc = computed(() =>
  resolveCompanyLogoDisplaySrc(props.ad.company_logo),
);

const { items: lookupItems } = useLookups("proficiencies");
const proficiencies = lookupItems("proficiencies");
const proficiencySteps = computed(() => {
  const steps = getProficiencySteps(proficiencies.value);
  return steps.length ? steps : DEFAULT_PROFICIENCY_STEPS;
});

const { isAuthenticated } = useSanctumAuth();

const activeTab = ref<AdTab>("about");

const allTabs: { id: AdTab; label: string; icon: string }[] = [
  { id: "about", label: "جزئیات شغل", icon: "lucide:briefcase" },
  {
    id: "company",
    label: "پروفایل سازمان",
    icon: "mdi:office-building-outline",
  },
  { id: "history", label: "سوابق ارسال", icon: "lucide:history" },
  { id: "ads", label: "آگهی‌ها", icon: "lucide:layout-grid" },
];

const tabs = computed(() =>
  isAuthenticated.value
    ? allTabs
    : allTabs.filter((tab) => tab.id !== "history"),
);

watch(isAuthenticated, (authenticated) => {
  if (!authenticated && activeTab.value === "history") {
    activeTab.value = "about";
  }
});

function displayValue(
  value: string | number | null | undefined,
  fallback = "—",
) {
  const normalized = value == null ? "" : String(value).trim();
  return normalized || fallback;
}

const salaryLabel = computed(() =>
  displayValue(props.ad.salary ?? props.ad.salary_range),
);

const workExperienceLabel = computed(() => {
  const value = props.ad.minimum_work_experience;
  if (value == null || value === "") return "—";
  const normalized = String(value).trim();
  return normalized.includes("سال") ? normalized : `${normalized} سال`;
});

const genderLabel = computed(() => displayValue(props.ad.gender, "مهم نیست"));

const locationLabel = computed(() => {
  const province = props.ad.province_name;
  const city = props.ad.city_name;
  if (province && city) return `${province}، ${city}`;
  return province || city || "—";
});

const expireDateLabel = computed(() => {
  const expireDate = (props.ad as { expire_date?: string }).expire_date;
  if (!expireDate) return "—";
  return formatJalaliDate(expireDate, "jD jMMMM");
});

const overviewItems = computed(() => {
  const website = props.ad.company?.website;
  const items = [
    {
      label: "نوع آگهی",
      value: displayValue(props.ad.type, "استخدامی"),
      icon: "svg:user-search-2",
    },
    {
      label: "نوع قرارداد",
      value: displayValue(props.ad.employment_type),
      icon: "tabler:file-text",
    },
    {
      label: "گروه شغلی",
      value: displayValue(props.ad.category),
      icon: "svg:bag-4",
    },
    ...(website
      ? [
          {
            label: "وبسایت",
            value: website,
            icon: "lucide:laptop-minimal",
            link: true,
          },
        ]
      : []),
    {
      label: "موقعیت مکانی",
      value: locationLabel.value,
      icon: "svg:location-4",
    },
    { label: "حقوق", value: salaryLabel.value, icon: "svg:wallet" },
    {
      label: "سابقه کار",
      value: workExperienceLabel.value,
      icon: "svg:work-history",
    },
    {
      label: "مدرک تحصیلی",
      value: displayValue(props.ad.minimum_degree),
      icon: "svg:edu-item",
    },
    { label: "جنسیت", value: genderLabel.value, icon: "lucide:user" },
    {
      label: "تاریخ انقضا",
      value: expireDateLabel.value,
      icon: "lucide:calendar-clock",
    },
  ];

  return items.filter((item) => item.value !== "—");
});

const requirementStats = computed(() =>
  [
    {
      label: "نوع آگهی:",
      value: displayValue(props.ad.type ?? props.ad.category, "استخدامی"),
      icon: "svg:ad-req-user-search",
    },
    {
      label: "نوع قرارداد:",
      value: displayValue(props.ad.employment_type),
      icon: "svg:ad-req-file-text",
    },
    {
      label: "حقوق:",
      value: salaryLabel.value,
      icon: "svg:ad-req-wallet",
    },
    {
      label: "سابقه کار:",
      value: workExperienceLabel.value,
      icon: "svg:ad-req-work-history",
    },
    {
      label: "مدرک تحصیلی:",
      value: displayValue(props.ad.minimum_degree),
      icon: "svg:ad-req-certificate",
    },
    {
      label: "جنسیت:",
      value: genderLabel.value,
      icon: "svg:ad-req-user",
    },
  ].filter((item) => item.value !== "—"),
);

const qualificationIntro = computed(
  () => props.ad.job_description?.trim() || "",
);

const qualificationItems = computed(() => {
  if (!props.ad.resume_terms?.trim()) return [];

  return props.ad.resume_terms
    .split(/\n|،|,/)
    .map((item) => item.trim())
    .filter(Boolean);
});

const showQualificationsSection = computed(
  () =>
    Boolean(qualificationIntro.value) ||
    qualificationItems.value.length > 0 ||
    requirementStats.value.length > 0,
);

const benefitItems = computed(() =>
  parseAdBenefits(props.ad.company_advantages),
);

const skillItems = computed<SkillBarItem[]>(() => {
  const skills: SkillBarItem[] = [];
  const candidates = [
    {
      name: "بیمه",
      value: props.ad.bimeh_skill,
      level: getProficiencyLevel(props.ad.bimeh_skill, proficiencies.value),
    },
    {
      name: "اکسل",
      value: props.ad.excel_skill,
      level: getProficiencyLevel(props.ad.excel_skill, proficiencies.value),
    },
    {
      name: "مالیات",
      value: props.ad.maliat_skill,
      level: getProficiencyLevel(props.ad.maliat_skill, proficiencies.value),
    },
    {
      name: "بهای تمام شده",
      value: props.ad.baha_skill,
      level: getProficiencyLevel(props.ad.baha_skill, proficiencies.value),
    },
  ];

  for (const skill of candidates) {
    if (skill.level != null && skill.value != null && skill.value !== false) {
      skills.push({
        label: `سطح مورد نیاز به آشنایی با ${skill.name}:`,
        value: skill.value,
        level: skill.level,
      });
    }
  }

  return skills;
});

const showSkillsSection = computed(
  () => Boolean(props.ad.company_software) || skillItems.value.length > 0,
);
</script>
