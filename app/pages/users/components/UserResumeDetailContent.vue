<template>
  <template v-if="loading && !user">
    <div class="mt-6 h-10 w-48 animate-pulse rounded bg-surface-200" />
    <div class="mt-6 grid items-start gap-4 lg:grid-cols-[272px_minmax(0,1fr)]">
      <div class="h-96 animate-pulse rounded-2xl bg-surface-200" />
      <div class="h-[600px] animate-pulse rounded-2xl bg-surface-200" />
    </div>
  </template>

  <template v-else-if="user">
    <h1 class="mt-6 font-yb-bold text-2xl text-text-tertiary">
      {{ fullName }}
    </h1>

    <div
      class="mt-6 grid items-start gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_300px]"
    >
      <div class="min-w-0 space-y-4">
        <div class="flex items-center gap-6 border-b border-surface-200">
          <button
            type="button"
            class="flex cursor-pointer items-center gap-2 border-b-2 pb-2 text-sm font-semibold transition-colors"
            :class="
              activeTab === 'basic'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-text-passive'
            "
            @click="activeTab = 'basic'"
          >
            <Icon name="lucide:user" size="16" />
            اطلاعات پایه
          </button>
          <button
            type="button"
            class="flex cursor-pointer items-center gap-2 border-b-2 pb-2 text-sm font-semibold transition-colors"
            :class="
              activeTab === 'job'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-text-passive'
            "
            @click="activeTab = 'job'"
          >
            <Icon name="svg:bag-1" size="16" />
            اطلاعات شغلی
          </button>
        </div>

        <main v-if="activeTab === 'basic'" class="space-y-4">
          <section class="rounded-2xl border border-gray-default bg-white p-5">
            <div class="space-y-5">
              <div class="flex w-full items-center gap-1">
                <span
                  class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                  aria-hidden="true"
                />
                <h2 class="font-yb-bold text-base text-text-primay">
                  اطلاعات پایه
                </h2>
              </div>

              <div class="flex justify-center">
                <div
                  class="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-[#ECF4D9] shadow-sm"
                >
                  <img
                    v-if="avatar"
                    :src="avatar"
                    :alt="fullName"
                    class="h-full w-full object-cover"
                  />
                  <div
                    v-else
                    class="flex h-full w-full items-end justify-center bg-linear-to-b from-[#c5dff5] to-[#9ec5e8]"
                  >
                    <span class="pb-4 font-yb-bold text-2xl text-text-tertiary">
                      {{ userInitial }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div
                  v-for="field in basicInfoFields"
                  :key="field.label"
                  class="flex flex-col items-start gap-1"
                >
                  <span class="text-caption text-text-passive">{{
                    field.label
                  }}</span>
                  <span class="font-yb-bold text-base text-text-primay">{{
                    field.value
                  }}</span>
                </div>
              </div>
            </div>
          </section>

          <section
            v-if="aboutMe"
            class="rounded-xl border border-surface-200 bg-white p-5"
          >
            <div class="flex w-full items-center gap-1">
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h2 class="font-yb-bold text-base text-text-primay">درباره من</h2>
            </div>
            <p class="mt-4 text-sm leading-8 text-text-secondary">
              {{ aboutMe }}
            </p>
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

            <div class="mt-10 flex w-full items-center gap-1">
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h3 class="font-yb-bold text-base text-text-primay">
                مشخصات فردی
              </h3>
            </div>
            <div class="mt-4 space-y-2 text-sm text-text-tertiary">
              <div
                v-for="item in personalSidebarItems"
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
              v-if="showContactInfo"
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
              v-if="showContactInfo"
              class="mt-4 space-y-3 text-sm text-text-tertiary"
            >
              <div
                v-for="item in contactSidebarItems"
                :key="item.label"
                v-show="item.value !== '—'"
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

            <div class="mt-10 flex w-full items-center gap-1">
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h3 class="font-yb-bold text-base text-text-primay">
                حقوق و سابقه کاری
              </h3>
            </div>
            <div class="mt-4 space-y-2 text-sm text-text-tertiary">
              <div
                v-for="item in salarySidebarItems"
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
  getResumeBirthYearLabel,
  getResumeEmploymentStatus,
  getResumeFullName,
  getResumeGenderLabel,
  getResumeHighestDegree,
  getResumeJobTitle,
  getResumeLocationLabel,
  getResumePersonal,
  getResumeSalary,
  maskResumeEmail,
  maskResumePhone,
} from "../utils/user-resume";

type UserResumeTab = "basic" | "job";

const props = defineProps<{
  user: UserResume | null;
  loading?: boolean;
}>();

const activeTab = ref<UserResumeTab>("basic");

const personal = computed(() => getResumePersonal(props.user));
const fullName = computed(() => getResumeFullName(props.user));
const jobTitle = computed(() => getResumeJobTitle(props.user));
const avatar = computed(() => props.user?.avatar || null);
const aboutMe = computed(
  () => personal.value?.about?.trim() || props.user?.description?.trim() || "",
);

const userInitial = computed(() => fullName.value.charAt(0) || "ک");

const basicInfoFields = computed(() => [
  { label: "نام کامل:", value: fullName.value },
  { label: "وضعیت اشتغال:", value: getResumeEmploymentStatus(props.user) },
  { label: "حقوق درخواستی:", value: getResumeSalary(props.user) },
  { label: "جنسیت:", value: getResumeGenderLabel(personal.value?.gender) },
  {
    label: "وضعیت تاهل:",
    value: displayResumeValue(personal.value?.marital_status),
  },
  { label: "استان:", value: displayResumeValue(personal.value?.province_name) },
  { label: "شهر:", value: displayResumeValue(personal.value?.city_name) },
  { label: "محله:", value: displayResumeValue(personal.value?.region_name) },
  { label: "عنوان شغلی:", value: jobTitle.value },
  {
    label: "سابقه کار:",
    value: displayResumeValue(personal.value?.work_experience),
  },
  {
    label: "سال تولد / سن:",
    value: `${getResumeBirthYearLabel(
      personal.value?.birthdate,
    )} / ${getResumeAgeLabel(personal.value?.birthdate)}`,
  },
  {
    label: "وضعیت خدمت سربازی:",
    value: displayResumeValue(personal.value?.military_service_status),
  },
]);

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
    value: getResumeHighestDegree(props.user?.resume_educations),
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
    value: displayResumeValue(personal.value?.military_service_status),
    icon: "lucide:shield",
  },
  {
    label: "وضعیت تاهل",
    value: displayResumeValue(personal.value?.marital_status),
    icon: "lucide:heart",
  },
]);

const contactSidebarItems = computed<SidebarItem[]>(() => [
  {
    label: "شماره همراه",
    value: maskResumePhone(personal.value?.cellphone || props.user?.phone),
    icon: "lucide:smartphone",
    ltr: true,
  },
  {
    label: "پست الکترونیکی",
    value: maskResumeEmail(personal.value?.email || props.user?.email),
    icon: "lucide:mail",
    ltr: true,
  },
]);

const salarySidebarItems = computed<SidebarItem[]>(() => [
  {
    label: "وضعیت اشتغال",
    value: getResumeEmploymentStatus(props.user),
    icon: "lucide:file-text",
  },
  {
    label: "حقوق درخواستی",
    value: getResumeSalary(props.user),
    icon: "svg:wallet",
  },
  {
    label: "سابقه کار",
    value: displayResumeValue(personal.value?.work_experience),
    icon: "svg:work-history",
  },
]);

const showContactInfo = computed(
  () =>
    Boolean(personal.value?.cellphone || props.user?.phone) ||
    Boolean(personal.value?.email || props.user?.email),
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
