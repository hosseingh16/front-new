<template>
  <div class="space-y-4">
    <section class="rounded-2xl border border-gray-default bg-white p-4 md:p-5">
      <div class="flex w-full items-center gap-1">
        <span
          class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
          aria-hidden="true"
        />
        <h2 class="font-yb-bold text-base text-text-primay">اطلاعات تحصیلی</h2>
      </div>

      <NoResult v-if="!educationItems.length" wrapper-class="py-10" />

      <div v-else class="mt-4 space-y-4">
        <div
          v-for="item in educationItems"
          :key="item.id"
          class="space-y-3 pb-4 last:border-b-0 last:pb-0"
        >
          <div
            class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div class="flex min-w-0 items-start gap-3">
              <span
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50"
              >
                <Icon
                  name="svg:edu-item"
                  size="18"
                  class="shrink-0 text-primary-500"
                />
              </span>

              <p class="min-w-0 font-semibold text-sm text-text-tertiary">
                {{ item.title }}
              </p>
            </div>

            <div
              class="flex min-w-0 flex-wrap items-center gap-2 ps-10 sm:shrink-0 sm:justify-end sm:ps-0"
            >
              <p class="text-sm text-text-passive">
                {{ item.university }}
              </p>
              <span class="h-1 w-1 shrink-0 rounded-full bg-surface-200" />
              <p class="text-sm text-text-passive">
                {{ item.period }}
              </p>
            </div>
          </div>

          <p
            v-if="item.description"
            class="ps-10 text-sm leading-7 text-text-passive sm:ps-11"
          >
            {{ item.description }}
          </p>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-gray-default bg-white p-4 md:p-5">
      <div class="flex w-full items-center gap-1">
        <span
          class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
          aria-hidden="true"
        />
        <h2 class="font-yb-bold text-base text-text-primay">سوابق کاری</h2>
      </div>

      <NoResult v-if="!workItems.length" wrapper-class="py-10" />

      <div v-else class="mt-4 space-y-4">
        <div
          v-for="item in workItems"
          :key="item.id"
          class="space-y-3 pb-4 last:border-b-0 last:pb-0"
        >
          <div
            class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div class="flex min-w-0 items-start gap-3">
              <span
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50"
              >
                <Icon
                  name="svg:bag-1"
                  size="18"
                  class="shrink-0 text-primary-500"
                />
              </span>

              <div class="min-w-0">
                <p class="font-semibold text-sm text-text-tertiary">
                  <span>{{ item.title }}</span>
                  <template v-if="item.type && item.type !== '—'">
                    <span class="mx-1 text-text-passive">·</span>
                    <span>{{ item.type }}</span>
                  </template>
                </p>
              </div>
            </div>

            <div
              class="flex min-w-0 flex-wrap items-center gap-2 ps-10 sm:shrink-0 sm:justify-end sm:ps-0"
            >
              <p class="text-sm text-text-passive">
                {{ item.company }}
              </p>
              <span class="h-1 w-1 shrink-0 rounded-full bg-surface-200" />
              <p class="text-sm text-text-passive">
                {{ item.period }}
              </p>
            </div>
          </div>

          <p
            v-if="item.description"
            class="ps-10 text-sm leading-7 text-text-passive sm:ps-11"
          >
            {{ item.description }}
          </p>
        </div>
      </div>
    </section>

    <section
      v-if="softwareItems.length"
      class="rounded-2xl border border-gray-default bg-white p-4 md:p-5"
    >
      <div class="flex w-full items-center gap-1">
        <span
          class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
          aria-hidden="true"
        />
        <h2 class="font-yb-bold text-base text-text-primay">
          نرم‌افزار حسابداری
        </h2>
      </div>

      <div class="mt-4 space-y-5">
        <div
          v-for="software in softwareItems"
          :key="software.id"
          class="border-b border-surface-200 pb-5 last:border-b-0 last:pb-0"
        >
          <div class="flex items-center gap-2">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-xs font-semibold text-primary-500"
            >
              {{ software.initial }}
            </div>
            <span class="font-yb-bold text-base text-text-tertiary">{{
              software.name
            }}</span>
          </div>
          <p class="mt-4 text-sm text-text-passive">
            میزان تسلط به زیرسیستم‌ها:
          </p>
          <div
            class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-text-passive sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-between"
          >
            <span v-for="sub in software.subsystems" :key="sub.label">
              {{ sub.label }}:
              <span class="font-semibold text-text-tertiary">{{
                sub.value
              }}</span>
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-gray-default bg-white p-4 md:p-5">
      <div class="flex w-full items-center gap-1">
        <span
          class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
          aria-hidden="true"
        />
        <h2 class="font-yb-bold text-base text-text-primay">مهارت‌ها</h2>
      </div>

      <div
        class="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 md:gap-y-10"
      >
        <UserResumeSkillMeter
          v-for="skill in skillItems"
          :key="skill.label"
          :label="skill.label"
          :percent="skill.percent"
        />
      </div>
    </section>

    <section class="rounded-2xl border border-gray-default bg-white p-4 md:p-5">
      <div class="flex w-full items-center gap-1">
        <span
          class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
          aria-hidden="true"
        />
        <h2 class="font-yb-bold text-base text-text-primay">
          ارزیابی بیمه‌ای و مالیاتی
        </h2>
      </div>

      <div
        class="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 md:gap-y-10"
      >
        <UserResumeSkillMeter
          v-for="skill in taxSkillItems"
          :key="skill.label"
          :label="skill.label"
          :percent="skill.percent"
        />
      </div>
    </section>

    <section class="rounded-2xl border border-gray-default bg-white p-4 md:p-5">
      <div class="flex w-full items-center gap-1">
        <span
          class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
          aria-hidden="true"
        />
        <h2 class="font-yb-bold text-base text-text-primay">فایل ضمیمه</h2>
      </div>

      <div class="mt-4 flex items-start gap-2">
        <Icon
          name="lucide:check"
          size="18"
          class="mt-0.5 shrink-0 text-[#009F65]"
        />
        <p class="text-sm leading-7 text-text-passive">
          در صورتی که فایل رزومه یا توضیحات جداگانه دارید می‌توانید آن را آپلود
          کنید. این فایل برای کارفرمایان قابل مشاهده است.
        </p>
      </div>

      <div
        v-if="attachment"
        class="mt-4 flex flex-col gap-3 rounded-xl border border-surface-200 bg-surface-50 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex min-w-0 items-center gap-3">
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FDECEB] text-[#EF4035]"
          >
            <Icon name="vscode-icons:file-type-pdf2" size="24" />
          </span>
          <span class="truncate text-sm font-semibold text-text-tertiary">
            {{ attachment.name }}
          </span>
        </div>
        <a
          :href="attachment.url"
          target="_blank"
          rel="noopener noreferrer"
          class="shrink-0 text-sm font-semibold text-primary-500 hover:opacity-80"
        >
          مشاهده فایل
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import NoResult from "~/components/Elements/NoResult.vue";
import UserResumeSkillMeter from "./UserResumeSkillMeter.vue";
import type { UserResume } from "~/types/user-resume";
import {
  getResumeEducationItem,
  getResumePriorItem,
  getResumeSkillItems,
  getResumeSoftwareItems,
  getResumeTaxSkillItems,
  resolveResumeAttachment,
} from "../utils/user-resume";

const props = defineProps<{
  user: UserResume;
}>();

const { items: lookupItems } = useLookups(
  "job_titles,employment_types,education_levels,graduation_years,prior_years",
);
const jobTitles = lookupItems("job_titles");
const employmentTypes = lookupItems("employment_types");
const educationLevels = lookupItems("education_levels");
const graduationYears = lookupItems("graduation_years");
const priorYears = lookupItems("prior_years");

const educationItems = computed(() =>
  (props.user.resume_educations ?? []).map((education) =>
    getResumeEducationItem(education, {
      educationLevels: educationLevels.value,
      graduationYears: graduationYears.value,
    }),
  ),
);

const workItems = computed(() =>
  (props.user.resume_priors ?? []).map((prior) =>
    getResumePriorItem(prior, {
      jobTitles: jobTitles.value,
      employmentTypes: employmentTypes.value,
      years: priorYears.value,
    }),
  ),
);

const softwareItems = computed(() => getResumeSoftwareItems(props.user));
const skillItems = computed(() => getResumeSkillItems(props.user));
const taxSkillItems = computed(() => getResumeTaxSkillItems(props.user));
const attachment = computed(() => resolveResumeAttachment(props.user));
</script>
