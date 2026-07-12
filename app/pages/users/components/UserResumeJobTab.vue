<template>
  <div class="space-y-4">
    <section class="rounded-2xl border border-gray-default bg-white p-5">
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
          class="items-start justify-between gap-4 pb-4 last:pb-0"
        >
          <div class="flex min-w-0 flex-1 items-start gap-4">
            <div class="flex min-w-0 flex-1 items-start gap-4">
              <span
                class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50"
              >
                <Icon
                  name="svg:edu-item"
                  size="18"
                  class="shrink-0 text-primary-500"
                />
              </span>

              <div class="min-w-0 space-y-2">
                <p class="font-semibold text-sm text-text-tertiary">
                  {{ item.title }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-center gap-2">
              <p class="text-sm text-text-passive">
                {{ item.university }}
              </p>
              <span class="h-1 w-1 rounded-full bg-surface-200" />
              <p class="shrink-0 text-sm text-text-passive">
                {{ item.period }}
              </p>
            </div>
          </div>
          <p
            v-if="item.description"
            class="p-2 px-12 text-sm leading-7 text-text-passive"
          >
            {{ item.description }}
          </p>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-gray-default bg-white p-5">
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
          class="items-start justify-between gap-4 pb-4 last:pb-0"
        >
          <div class="flex min-w-0 flex-1 items-start gap-4">
            <div class="flex min-w-0 flex-1 items-start gap-4">
              <span
                class="h-7 w-7 rounded-lg bg-primary-50 flex justify-center items-center"
              >
                <Icon
                  name="svg:bag-1"
                  size="18"
                  class="shrink-0 text-primary-500"
                />
              </span>

              <div class="min-w-0 flex items-center gap-2">
                <p class="font-semibold text-sm text-text-tertiary">
                  {{ item.title }}
                </p>

                <span class="h-1 w-1 rounded-full bg-surface-200"></span>

                <p class="font-semibold text-sm text-text-tertiary">
                  {{ item.type }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 justify-center">
              <p class="text-sm text-text-passive">
                {{ item.company }}
              </p>
              <span class="h-1 w-1 rounded-full bg-surface-200"></span>
              <p class="shrink-0 text-sm text-text-passive">
                {{ item.period }}
              </p>
            </div>
          </div>
          <p
            v-if="item.description"
            class="text-sm leading-7 text-text-passive p-2 px-12"
          >
            {{ item.description }}
          </p>
        </div>
      </div>
    </section>

    <section
      v-if="softwareItems.length"
      class="rounded-2xl border border-gray-default bg-white p-5"
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
            class="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-2 text-sm text-text-passive"
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

    <section class="rounded-2xl border border-gray-default bg-white p-5">
      <div class="flex w-full items-center gap-1">
        <span
          class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
          aria-hidden="true"
        />
        <h2 class="font-yb-bold text-base text-text-primay">مهارت‌ها</h2>
      </div>

      <div class="mt-4 grid gap-x-4 gap-y-10 md:grid-cols-2">
        <UserResumeSkillMeter
          v-for="skill in skillItems"
          :key="skill.label"
          :label="skill.label"
          :percent="skill.percent"
        />
      </div>
    </section>

    <section class="rounded-2xl border border-gray-default bg-white p-5">
      <div class="flex w-full items-center gap-1">
        <span
          class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
          aria-hidden="true"
        />
        <h2 class="font-yb-bold text-base text-text-primay">
          ارزیابی بیمه‌ای و مالیاتی
        </h2>
      </div>

      <div class="mt-4 grid gap-x-4 gap-y-10 md:grid-cols-2">
        <UserResumeSkillMeter
          v-for="skill in taxSkillItems"
          :key="skill.label"
          :label="skill.label"
          :percent="skill.percent"
        />
      </div>
    </section>

    <section class="rounded-2xl border border-gray-default bg-white p-5">
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
        class="mt-4 flex items-center justify-between gap-4 rounded-xl border border-surface-200 bg-surface-50 p-4"
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

const educationItems = computed(() =>
  (props.user.resume_educations ?? []).map(getResumeEducationItem),
);

const workItems = computed(() =>
  (props.user.resume_priors ?? []).map(getResumePriorItem),
);

const softwareItems = computed(() => getResumeSoftwareItems(props.user));
const skillItems = computed(() => getResumeSkillItems(props.user));
const taxSkillItems = computed(() => getResumeTaxSkillItems(props.user));
const attachment = computed(() => resolveResumeAttachment(props.user));
</script>
