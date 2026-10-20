<template>
  <div
    class="grid items-start gap-4 bg-surface-50 sm:p-5 lg:grid-cols-[minmax(0,1fr)_300px]"
  >
    <main class="min-w-0 space-y-4">
      <div
        class="no-scrollbar -mx-1 flex justify-start gap-3 overflow-x-auto overscroll-x-contain border-b border-gray-default sm:gap-4 md:gap-6 px-2"
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
          v-if="descriptionHtml || scopeLabels.length"
          class="rounded-2xl border border-gray-default bg-white p-5 text-right md:p-6"
        >
          <AdSectionTitle title="جزئیات پروژه:" />

          <div
            v-if="descriptionHtml"
            class="prose prose-sm mt-4 max-w-none text-right text-sm leading-8 text-text-secondary prose-p:my-0 prose-ul:my-2 prose-li:my-0"
            v-html="descriptionHtml"
          />

          <div v-if="scopeLabels.length" class="mt-5">
            <p class="mb-3 text-sm font-semibold text-text-tertiary">
              حوزه‌های کاری:
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="scope in scopeLabels"
                :key="scope"
                class="rounded-full border border-gray-default bg-surface-50 px-3 py-1 text-sm text-text-tertiary"
              >
                {{ scope }}
              </span>
            </div>
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
          v-else
          class="rounded-2xl border border-gray-default bg-white p-5 text-right md:p-6"
        >
          <AdSectionTitle title="جزئیات پروژه:" />
          <p class="mt-4 text-sm text-text-passive">
            جزئیات بیشتری برای این پروژه ثبت نشده است.
          </p>
        </section>
      </template>

      <template v-else-if="activeTab === 'company'">
        <AdCompanyProfile :company="project.company" />
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
            بررسی اجمالی پروژه
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
            <dd class="font-semibold text-text-secondary">
              {{ item.value }}
            </dd>
          </div>
        </dl>

        <div
          v-if="project.has_applied"
          class="mt-6 flex items-start gap-3 rounded-xl border border-success-200 bg-success-50 p-4"
        >
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white"
            aria-hidden="true"
          >
            <Icon
              name="lucide:circle-check"
              size="20"
              class="text-success-500"
            />
          </div>
          <p class="text-sm font-semibold leading-7 text-text-secondary">
            قبلا درخواست ارسال کرده‌اید
          </p>
        </div>
        <div
          v-else-if="isEmployer"
          class="mt-6 flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4"
        >
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white"
            aria-hidden="true"
          >
            <Icon name="lucide:info" size="20" class="text-primary-500" />
          </div>
          <p class="text-sm leading-7 text-text-secondary">
            ارسال درخواست برای کارفرمایان امکان‌پذیر نیست.
          </p>
        </div>
        <button
          v-else
          type="button"
          class="btn btn-success mt-6 h-11 w-full gap-2"
          @click="emit('apply')"
        >
          <Icon
            name="material-symbols:chevron-left"
            size="16"
            class="text-white"
          />
          ارسال درخواست
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
import type { Project } from "~/types/project";
import AdSectionTitle from "~/pages/jobs/components/AdSectionTitle.vue";
import AdRequirementStat from "~/pages/jobs/components/AdRequirementStat.vue";
import AdCompanyProfile from "~/pages/jobs/components/AdCompanyProfile.vue";
import {
  formatProjectBudgetLabel,
  formatProjectTimeRange,
  getProjectCategoryLabel,
  getProjectPresenceLabel,
  getProjectScopeLabels,
} from "~/utils/project-display";

type ProjectTab = "about" | "company";

const props = defineProps<{
  project: Project;
}>();

const emit = defineEmits<{
  apply: [];
  "report-issue": [];
}>();

const { isEmployer } = useCurrentUser();

const activeTab = ref<ProjectTab>("about");

const tabs: { id: ProjectTab; label: string; icon: string }[] = [
  { id: "about", label: "جزئیات پروژه", icon: "lucide:briefcase" },
  {
    id: "company",
    label: "پروفایل سازمان",
    icon: "mdi:office-building-outline",
  },
];

function displayValue(
  value: string | number | null | undefined,
  fallback = "—",
) {
  const normalized = value == null ? "" : String(value).trim();
  return normalized || fallback;
}

const scopeLabels = computed(() => getProjectScopeLabels(props.project.scopes));

const descriptionHtml = computed(() => {
  const desc = props.project.desc?.trim();
  if (!desc) return "";
  if (/<[a-z][\s\S]*>/i.test(desc)) return desc;
  return desc.replace(/\n/g, "<br />");
});

const budgetLabel = computed(() => formatProjectBudgetLabel(props.project));

const categoryLabel = computed(() =>
  getProjectCategoryLabel(props.project.category),
);

const timeLabel = computed(() =>
  formatProjectTimeRange(props.project.min_time, props.project.max_time),
);

const presenceLabel = computed(() =>
  getProjectPresenceLabel(props.project.needs_presence),
);

const locationLabel = computed(() => {
  const province =
    props.project.company?.province_name ||
    (props.project as { province_name?: string }).province_name;
  const city =
    props.project.company?.city_name ||
    (props.project as { city_name?: string }).city_name;
  if (province && city) return `${province}، ${city}`;
  return province || city || "";
});

const overviewItems = computed(() =>
  [
    {
      label: "دسته‌بندی",
      value: displayValue(categoryLabel.value),
      icon: "svg:bag-4",
    },
    {
      label: "نوع پروژه",
      value: displayValue(props.project.type),
      icon: "tabler:file-text",
    },
    {
      label: "بودجه",
      value: budgetLabel.value,
      icon: "svg:wallet",
    },
    {
      label: "مدت زمان",
      value: displayValue(timeLabel.value),
      icon: "lucide:calendar-clock",
    },
    {
      label: "نحوه انجام",
      value: displayValue(presenceLabel.value),
      icon: "lucide:map-pin",
    },
    {
      label: "موقعیت مکانی",
      value: displayValue(locationLabel.value),
      icon: "svg:location-4",
    },
  ].filter((item) => item.value !== "—"),
);

const requirementStats = computed(() =>
  [
    {
      label: "دسته‌بندی:",
      value: displayValue(categoryLabel.value),
      icon: "svg:ad-req-file-text",
    },
    {
      label: "بودجه:",
      value: budgetLabel.value,
      icon: "svg:ad-req-wallet",
    },
    {
      label: "مدت زمان:",
      value: displayValue(timeLabel.value),
      icon: "svg:ad-req-work-history",
    },
    {
      label: "نحوه انجام:",
      value: displayValue(presenceLabel.value),
      icon: "svg:ad-req-user-search",
    },
  ].filter((item) => item.value !== "—"),
);
</script>
