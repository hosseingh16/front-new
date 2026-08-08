<template>
  <template v-if="loading && !user">
    <div class="mt-6 h-10 w-48 animate-pulse rounded bg-surface-200" />
    <div class="mt-6 grid items-start gap-4 lg:grid-cols-[272px_minmax(0,1fr)]">
      <div class="h-96 animate-pulse rounded-2xl bg-surface-200" />
      <div class="h-[600px] animate-pulse rounded-2xl bg-surface-200" />
    </div>
  </template>

  <template v-else-if="user">
    <div
      v-if="!embedded"
      class="mt-6 flex flex-wrap items-center justify-between gap-3"
    >
      <h1 class="font-yb-bold text-2xl text-text-tertiary">
        {{ fullName }}
      </h1>
      <BookmarkToggleButton
        v-if="user?.id && showBookmark"
        :target-id="user.id"
        type="users"
        label="نشان کردن"
        :initial-bookmarked="Boolean(user.is_bookmarked)"
        @update:bookmarked="
          (value) => {
            if (user) user.is_bookmarked = value;
          }
        "
      />
    </div>

    <div
      class="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_272px]"
      :class="embedded ? 'gap-4' : 'mt-6 p-5'"
    >
      <div class="min-w-0 space-y-4">
        <div class="flex items-center gap-6 border-b border-gray-default px-6">
          <button
            type="button"
            class="flex cursor-pointer items-center gap-2 border-b-2 pb-2 text-sm transition-colors"
            :class="
              activeTab === 'basic'
                ? 'border-primary-500 font-yb-bold text-primary-500'
                : 'border-transparent font-normal text-text-primary'
            "
            @click="activeTab = 'basic'"
          >
            <span
              class="flex h-6 w-6 items-center justify-center rounded-full p-1"
              :class="
                activeTab === 'basic' ? 'bg-primary-500/8' : 'bg-gray-500/8'
              "
            >
              <Icon name="lucide:user" size="16" />
            </span>
            اطلاعات پایه
          </button>
          <button
            type="button"
            class="flex cursor-pointer items-center gap-2 border-b-2 pb-2 text-sm transition-colors"
            :class="
              activeTab === 'job'
                ? 'border-primary-500 font-yb-bold text-primary-500'
                : 'border-transparent font-normal text-text-primary'
            "
            @click="activeTab = 'job'"
          >
            <span
              class="flex h-6 w-6 items-center justify-center rounded-full p-1"
              :class="
                activeTab === 'job' ? 'bg-primary-500/8' : 'bg-gray-500/8'
              "
            >
              <Icon name="svg:bag-1" size="16" />
            </span>
            اطلاعات شغلی
          </button>
        </div>

        <main v-if="activeTab === 'basic'" class="space-y-8">
          <section
            v-if="avatar || visibleBasicInfoFields.length"
            class="rounded-2xl bg-white p-6"
          >
            <div class="flex w-full items-center gap-1">
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h2 class="font-yb-bold text-base text-text-primay">
                اطلاعات پایه
              </h2>
            </div>

            <div
              v-if="avatar"
              class="mt-4 flex flex-col items-center justify-center py-2"
            >
              <div
                class="h-[92px] w-[92px] overflow-hidden rounded-full border-4 border-white bg-[#ECF4D9] shadow-sm"
              >
                <img
                  :src="avatar"
                  :alt="fullName"
                  class="h-full w-full object-cover"
                />
              </div>
              <span class="mt-2 text-base text-text-tertiary">تصویر پروفایل:</span>
            </div>

            <div
              v-if="visibleBasicInfoFields.length"
              class="grid gap-x-4 gap-y-8 sm:grid-cols-2"
              :class="avatar ? 'mt-6' : 'mt-4'"
            >
              <ResumeReadOnlyField
                v-for="field in visibleBasicInfoFields"
                :key="field.label"
                :label="field.label"
                :value="field.value"
                :class="field.fullWidth ? 'sm:col-span-2' : undefined"
              />
            </div>
          </section>
        </main>

        <UserResumeJobTab v-else :user="user" />
      </div>

      <aside class="user-resume-aside">
        <div
          class="relative overflow-hidden rounded-2xl border border-gray-default bg-white"
        >
          <img
            :src="asidePattern"
            alt=""
            class="user-resume-aside-pattern pointer-events-none absolute -top-5 left-0 w-full origin-top scale-[1.3]"
            aria-hidden="true"
          />
          <div class="relative z-10 px-3 pb-3 pt-10">
            <div class="flex justify-center">
              <div
                class="flex h-[74px] w-[74px] items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#ECF4D9]"
              >
                <img
                  v-if="avatar"
                  :src="avatar"
                  :alt="fullName"
                  class="h-full w-full object-cover"
                />
                <span v-else class="font-yb-bold text-xl text-text-tertiary">
                  {{ userInitial }}
                </span>
              </div>
            </div>

            <h2
              class="mt-2 text-center font-yb-bold text-xl text-text-tertiary"
            >
              {{ fullName }}
            </h2>
            <p
              v-if="jobTitle !== '—'"
              class="mt-1 text-center text-sm text-text-passive"
            >
              {{ jobTitle }}
            </p>

            <div
              v-if="visiblePersonalSidebarItems.length"
              class="mt-10 flex w-full items-center gap-1"
            >
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h3 class="font-yb-bold text-base text-text-primay">
                مشخصات فردی
              </h3>
            </div>
            <div
              v-if="visiblePersonalSidebarItems.length"
              class="mt-4 space-y-2 text-sm text-text-tertiary"
            >
              <div
                v-for="item in visiblePersonalSidebarItems"
                :key="item.label"
                class="flex items-center justify-between gap-3 py-2"
              >
                <div class="flex items-center gap-2">
                  <Icon :name="item.icon" size="16" class="text-text-passive" />
                  <span class="shrink-0 text-text-passive">{{
                    item.label
                  }}</span>
                </div>
                <span class="text-left font-semibold">{{ item.value }}</span>
              </div>
            </div>

            <div
              v-if="visibleContactSidebarItems.length"
              class="mt-10 flex w-full items-center gap-1"
            >
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h3 class="font-yb-bold text-base text-text-primay">
                اطلاعات تماس
              </h3>
            </div>
            <div
              v-if="visibleContactSidebarItems.length"
              class="mt-4 space-y-3 text-sm text-text-tertiary"
            >
              <div
                v-for="item in visibleContactSidebarItems"
                :key="item.label"
                class="flex items-center justify-between gap-3 py-2"
              >
                <div class="flex items-center gap-2">
                  <Icon :name="item.icon" size="16" class="text-text-passive" />
                  <span class="shrink-0 text-text-passive">{{
                    item.label
                  }}</span>
                </div>
                <span
                  class="text-left font-semibold"
                  :style="item.ltr ? 'direction: ltr' : undefined"
                >
                  {{ item.value }}
                </span>
              </div>
            </div>

            <div
              v-if="visibleSalarySidebarItems.length"
              class="mt-10 flex w-full items-center gap-1"
            >
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h3 class="font-yb-bold text-base text-text-primay">
                حقوق و سابقه کاری
              </h3>
            </div>
            <div
              v-if="visibleSalarySidebarItems.length"
              class="mt-4 space-y-2 text-sm text-text-tertiary"
            >
              <div
                v-for="item in visibleSalarySidebarItems"
                :key="item.label"
                class="flex items-center justify-between gap-3 py-2"
              >
                <div class="flex items-center gap-2">
                  <Icon :name="item.icon" size="16" class="text-text-passive" />
                  <span class="shrink-0 text-text-passive">{{
                    item.label
                  }}</span>
                </div>
                <span class="text-left font-semibold">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative my-2 overflow-hidden rounded-2xl border border-gray-default bg-white"
        >
          <div class="z-10 px-3 pb-3 pt-3">
            <div class="flex w-full items-center gap-1">
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h3 class="font-yb-bold text-base text-text-primay">
                اشتراک‌گذاری
              </h3>
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
import UserResumeJobTab from "./UserResumeJobTab.vue";
import BookmarkToggleButton from "~/components/Elements/BookmarkToggleButton.vue";
import ResumeReadOnlyField from "~/components/Resume/ReadOnlyField.vue";
import asidePattern from "~/assets/vectors/aside-pattern.svg?url";
import linkIcon from "~/assets/vectors/social/link.svg?url";
import linkedinIcon from "~/assets/vectors/social/linkedin.svg?url";
import telegramIcon from "~/assets/vectors/social/telegram.svg?url";
import twitterIcon from "~/assets/vectors/social/twitter.svg?url";
import whatsappIcon from "~/assets/vectors/social/whatsapp.svg?url";
import type { UserResume } from "~/types/user-resume";
import {
  displayResumeValue,
  getResumeAgeLabel,
  getResumeBirthDateLabel,
  getResumeEmploymentStatus,
  getResumeFullName,
  getResumeGenderLabel,
  hasResumeValue,
  getResumeHighestDegree,
  getResumeJobTitle,
  getResumeLocationLabel,
  getResumeMaritalStatusLabel,
  getResumeMilitaryStatusLabel,
  getResumePersonal,
  getResumeSalary,
  getResumeWorkExperienceLabel,
  maskResumeEmail,
} from "../utils/user-resume";

type UserResumeTab = "basic" | "job";

const props = defineProps<{
  user: UserResume | null;
  loading?: boolean;
  embedded?: boolean;
  showBookmark?: boolean;
  showFullContact?: boolean;
}>();

const activeTab = ref<UserResumeTab>("basic");

const { items: lookupItems } = useLookups(
  "job_titles,experience_levels,salary_ranges,military_statuses,education_levels,birth_years",
);
const jobTitles = lookupItems("job_titles");
const experienceLevels = lookupItems("experience_levels");
const salaryRanges = lookupItems("salary_ranges");
const militaryStatuses = lookupItems("military_statuses");
const educationLevels = lookupItems("education_levels");
const birthYears = lookupItems("birth_years");

const personal = computed(() => getResumePersonal(props.user));
const fullName = computed(() => getResumeFullName(props.user));
const jobTitle = computed(() =>
  getResumeJobTitle(props.user, jobTitles.value),
);
const avatar = computed(() => props.user?.avatar || null);
const aboutMe = computed(
  () => personal.value?.about?.trim() || props.user?.description?.trim() || "",
);

const userInitial = computed(() => fullName.value.charAt(0) || "ک");

const basicInfoFields = computed(() => [
  { label: "نام کامل:", value: fullName.value },
  { label: "عنوان شغلی:", value: jobTitle.value },
  { label: "وضعیت اشتغال:", value: getResumeEmploymentStatus(props.user) },
  {
    label: "سابقه کار:",
    value: getResumeWorkExperienceLabel(
      personal.value?.work_experience,
      experienceLevels.value,
    ),
  },
  {
    label: "حقوق درخواستی:",
    value: getResumeSalary(props.user, salaryRanges.value),
  },
  {
    label: "سال تولد:",
    value: getResumeBirthDateLabel(
      personal.value?.birthdate,
      birthYears.value,
    ),
  },
  { label: "جنسیت:", value: getResumeGenderLabel(personal.value?.gender) },
  {
    label: "وضعیت خدمت سربازی:",
    value: getResumeMilitaryStatusLabel(
      personal.value?.military_service_status,
      militaryStatuses.value,
    ),
  },
  {
    label: "وضعیت تاهل:",
    value: getResumeMaritalStatusLabel(personal.value?.marital_status),
  },
  {
    label: "استان محل سکونت:",
    value: displayResumeValue(personal.value?.province_name),
  },
  {
    label: "شهر محل سکونت:",
    value: displayResumeValue(personal.value?.city_name),
  },
  {
    label: "منطقه محل سکونت:",
    value: displayResumeValue(personal.value?.region_name),
  },
  { label: "درباره من:", value: aboutMe.value, fullWidth: true },
]);

const visibleBasicInfoFields = computed(() =>
  basicInfoFields.value.filter((field) => hasResumeValue(field.value)),
);

type SidebarItem = {
  label: string;
  value: string;
  icon: string;
  ltr?: boolean;
};

const personalSidebarItems = computed<SidebarItem[]>(() => [
  {
    label: "عنوان شغلی",
    value: jobTitle.value,
    icon: "ph:suitcase-simple-light",
  },
  {
    label: "مدرک تحصیلی",
    value: getResumeHighestDegree(
      props.user?.resume_educations,
      educationLevels.value,
    ),
    icon: "svg:edu-item",
  },
  {
    label: "موقعیت مکانی",
    value: getResumeLocationLabel(personal.value),
    icon: "svg:location-4",
  },
  {
    label: "سن",
    value: getResumeAgeLabel(personal.value?.birthdate),
    icon: "svg:timer",
  },
  {
    label: "جنسیت",
    value: getResumeGenderLabel(personal.value?.gender),
    icon: "lucide:user",
  },
  {
    label: "وضعیت خدمت",
    value: getResumeMilitaryStatusLabel(
      personal.value?.military_service_status,
      militaryStatuses.value,
    ),
    icon: "lucide:shield",
  },
  {
    label: "وضعیت تاهل",
    value: getResumeMaritalStatusLabel(personal.value?.marital_status),
    icon: "lucide:heart",
  },
]);

const visiblePersonalSidebarItems = computed(() =>
  personalSidebarItems.value.filter((item) => hasResumeValue(item.value)),
);

const contactSidebarItems = computed<SidebarItem[]>(() => {
  const phone = displayResumeValue(
    personal.value?.cellphone || props.user?.phone,
  );
  const email = props.showFullContact
    ? displayResumeValue(personal.value?.email || props.user?.email)
    : maskResumeEmail(personal.value?.email || props.user?.email);

  return [
    {
      label: "شماره همراه",
      value: phone,
      icon: "lucide:smartphone",
      ltr: true,
    },
    {
      label: "پست الکترونیکی",
      value: email,
      icon: "lucide:mail",
      ltr: true,
    },
  ];
});

const visibleContactSidebarItems = computed(() =>
  contactSidebarItems.value.filter((item) => hasResumeValue(item.value)),
);

const salarySidebarItems = computed<SidebarItem[]>(() => [
  {
    label: "وضعیت اشتغال",
    value: getResumeEmploymentStatus(props.user),
    icon: "lucide:file-text",
  },
  {
    label: "حقوق درخواستی",
    value: getResumeSalary(props.user, salaryRanges.value),
    icon: "svg:wallet",
  },
  {
    label: "سابقه کار",
    value: getResumeWorkExperienceLabel(
      personal.value?.work_experience,
      experienceLevels.value,
    ),
    icon: "svg:work-history",
  },
]);

const visibleSalarySidebarItems = computed(() =>
  salarySidebarItems.value.filter((item) => hasResumeValue(item.value)),
);

function getShareUrl() {
  if (!import.meta.client) return "";
  return window.location.href;
}

function openShare(url: string) {
  if (!import.meta.client) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function shareOnLinkedIn() {
  openShare(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      getShareUrl(),
    )}`,
  );
}

function shareOnTwitter() {
  openShare(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}`,
  );
}

function shareOnTelegram() {
  openShare(`https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}`);
}

function shareOnWhatsapp() {
  openShare(`https://wa.me/?text=${encodeURIComponent(getShareUrl())}`);
}

async function copyShareLink() {
  if (!import.meta.client) return;
  await navigator.clipboard.writeText(getShareUrl());
}

const socialLinks = [
  {
    id: "linkedin",
    icon: linkedinIcon,
    label: "اشتراک در لینکدین",
    onClick: shareOnLinkedIn,
  },
  {
    id: "twitter",
    icon: twitterIcon,
    label: "اشتراک در توییتر",
    onClick: shareOnTwitter,
  },
  {
    id: "telegram",
    icon: telegramIcon,
    label: "اشتراک در تلگرام",
    onClick: shareOnTelegram,
  },
  {
    id: "whatsapp",
    icon: whatsappIcon,
    label: "اشتراک در واتساپ",
    onClick: shareOnWhatsapp,
  },
  { id: "link", icon: linkIcon, label: "کپی لینک", onClick: copyShareLink },
];
</script>

<style scoped>
.user-resume-aside-pattern {
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
