<template>
  <div class="rounded-lg bg-surface-50 p-1">
    <template v-if="loading">
      <div class="bg-[#F6F8FE] rounded-lg p-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div
              class="h-16 w-16 shrink-0 rounded-2xl bg-surface-200 animate-pulse"
            />
            <div class="space-y-2">
              <div class="h-4 w-28 rounded bg-surface-200 animate-pulse" />
              <div class="h-3 w-36 rounded bg-surface-200 animate-pulse" />
            </div>
          </div>
          <div class="h-4 w-10 rounded bg-surface-200 animate-pulse" />
        </div>

        <div class="mt-3 flex gap-2 overflow-hidden">
          <div
            class="h-8 w-24 shrink-0 rounded-full bg-surface-200 animate-pulse"
          />
          <div
            class="h-8 w-20 shrink-0 rounded-full bg-surface-200 animate-pulse"
          />
          <div
            class="h-8 w-28 shrink-0 rounded-full bg-surface-200 animate-pulse"
          />
        </div>
      </div>

      <div class="mt-2 flex items-center justify-between px-2">
        <div class="space-y-2">
          <div class="h-3 w-16 rounded bg-surface-200 animate-pulse" />
          <div class="h-4 w-24 rounded bg-surface-200 animate-pulse" />
        </div>
        <div class="h-8 w-20 rounded bg-surface-200 animate-pulse" />
      </div>
    </template>

    <template v-else>
      <NuxtLink
        :to="itemUrl"
        class="block rounded-lg transition-opacity hover:opacity-95"
      >
        <div
          :class="[
            'rounded-lg p-3',
            variant === 'project' ? 'bg-[#FCF7F3] ' : 'bg-[#F6F8FE]',
          ]"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div
                class="flex justify-center items-center bg-[#ECF4D9] rounded-2xl"
              >
                <img
                  :src="item!.company_logo || ''"
                  alt=""
                  class="w-16 h-16 object-cover rounded-2xl"
                />
              </div>
              <div class="text-sm">
                <p class="font-semibold text-text-tertiary">
                  {{
                    variant === "project" ? `پروژه ${project.type}` : ad.title
                  }}
                </p>
                <div class="flex flex-wrap items-center mt-2">
                  <Icon name="svg:buildings-4" />
                  <p class="text-text-passive">نام شرکت:</p>
                  <p
                    class="mr-1 text-text-tertiary"
                    :title="companyName.length > 24 ? companyName : undefined"
                  >
                    {{ truncatedCompanyName }}
                  </p>
                </div>
              </div>
            </div>
            <div class="text-center">
              <Icon
                name="svg:bookmark"
                class="relative z-10 cursor-pointer"
                @click.stop.prevent="onBookmark"
              />
              <p
                v-if="variant === 'ad' && ad.publish_date"
                class="text-xs text-text-passive"
              >
                {{ formatRelativeDate(ad.publish_date) }}
              </p>
            </div>
          </div>

          <div
            class="flex text-sm mt-3 overflow-x-auto no-scrollbar"
            :class="variant === 'project' ? 'gap-2' : 'gap-1'"
          >
            <div
              v-if="variant === 'project'"
              class="shrink-0 rounded-full border border-gray-default bg-surface-50 py-1 px-3 flex items-center gap-2 text-text-tertiary"
            >
              <Icon name="tabler:file-text" class="ma-auto text-[#B95C04]" />
              پروژه حسابداری
            </div>
            <div
              v-if="item!.company?.activity"
              class="shrink-0 rounded-full border border-gray-default bg-surface-50 py-1 px-3 flex items-center gap-2 text-text-tertiary"
            >
              <Icon name="ph:suitcase-simple-light" class="ma-auto" />
              {{ item!.company.activity }}
            </div>
            <template v-if="variant === 'ad'">
              <div
                v-if="ad.category"
                class="shrink-0 rounded-full border border-gray-default bg-surface-50 py-1 px-3 flex items-center gap-2 text-text-tertiary"
              >
                {{ ad.category }}
              </div>
              <div
                v-if="ad.province_name || ad.city_name"
                class="shrink-0 rounded-full border border-gray-default bg-surface-50 py-1 px-3 flex items-center gap-2 text-text-tertiary"
              >
                <Icon name="svg:location-4" class="ma-auto" />
                {{ ad.province_name }}، {{ ad.city_name }}
              </div>
              <div
                v-if="ad.gender"
                class="shrink-0 rounded-full border border-gray-default bg-surface-50 py-1 px-3 flex items-center gap-2 text-text-tertiary"
              >
                <Icon name="lucide:user" class="ma-auto" />
                {{ ad.gender }}
              </div>
            </template>
          </div>
        </div>

        <div class="flex items-center justify-between mt-2 px-2">
          <div>
            <p class="text-sm text-text-secondary">
              {{ variant === "project" ? "پروژه" : ad.employment_type }}
            </p>
            <p class="font-semibold text-text-tertiary">{{ footerValue }}</p>
          </div>
          <span
            class="btn border-none px-2 h-8 text-sm text-primary-500 bg-[#4864E114]"
          >
            <icons-chevron class="rotate-90" color="#4864e1" />
            مشاهده
          </span>
        </div>
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import moment from "moment-jalaali";
import "moment/locale/fa";
import type { AdList } from "~/types/ad";
import type { ProjectList } from "~/types/project";

moment.updateLocale("fa", {
  relativeTime: {
    past: "%s قبل",
  },
});
moment.locale("fa");

const props = withDefaults(
  defineProps<{
    variant: "ad" | "project";
    item?: AdList | ProjectList;
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const emit = defineEmits<{
  bookmark: [id: number | string, type: string];
}>();

const ad = computed(() => props.item as AdList);
const project = computed(() => props.item as ProjectList);

const companyName = computed(() => props.item?.company_name || "");

const itemUrl = computed(() => {
  if (!props.item?.id) return "#";
  return props.variant === "project"
    ? `/project/${props.item.id}`
    : `/jobs/${props.item.id}`;
});

function onBookmark() {
  emit(
    "bookmark",
    props.item!.id,
    props.variant === "project" ? "Project" : "Ad",
  );
}

const truncatedCompanyName = computed(() => {
  const limit = props.variant === "project" ? 24 : 12;
  return companyName.value.length > limit
    ? `${companyName.value.slice(0, limit)}…`
    : companyName.value;
});

const footerValue = computed(() => {
  if (props.variant === "project") {
    const min = project.value.min_budget ?? "-";
    const max = project.value.max_budget ?? "-";
    return `${min} - ${max}`;
  }

  return ad.value.salary || "-";
});

function formatRelativeDate(date: string) {
  const parsed = /^\d{8}$/.test(date) ? moment(date, "YYYYMMDD") : moment(date);

  return parsed.isValid() ? parsed.locale("fa").fromNow() : "";
}
</script>
