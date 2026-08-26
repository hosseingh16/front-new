<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr :with-icon="false">پیش‌نمایش کارت</Titr>

    <div class="mt-6 rounded-lg bg-white p-1 shadow-sm">
      <div class="rounded-lg bg-[#FCF7F3] p-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECF4D9]"
            >
              <img
                :src="companyLogoSrc"
                alt=""
                class="h-full w-full rounded-2xl object-cover"
              />
            </div>
            <div class="text-sm">
              <p class="font-semibold text-text-tertiary">
                {{ titleLabel }}
              </p>
              <div
                class="mt-2 flex flex-wrap items-center gap-1 text-text-passive"
              >
                <Icon name="svg:buildings-4" />
                <span>نام شرکت:</span>
                <span class="mr-1">{{ companyName }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-3 flex flex-wrap gap-2 overflow-x-auto text-sm no-scrollbar"
        >
          <div
            class="flex shrink-0 items-center gap-2 rounded-full border border-gray-default bg-surface-50 px-3 py-1 text-text-tertiary"
          >
            <Icon name="lucide:file-text" class="text-[#B95C04]" />
            پروژه حسابداری
          </div>
          <div
            v-if="locationLabel"
            class="flex shrink-0 items-center gap-2 rounded-full border border-gray-default bg-surface-50 px-3 py-1 text-text-tertiary"
          >
            <Icon name="svg:location-4" class="shrink-0" />
            <span>{{ locationLabel }}</span>
          </div>
        </div>
      </div>

      <div class="mt-2 flex items-center justify-between px-2 pb-2">
        <div>
          <p class="text-sm text-text-secondary">پروژه</p>
          <p class="font-semibold text-text-tertiary">
            {{ budgetLabel || "بودجه توافقی" }}
          </p>
        </div>
        <button
          type="button"
          class="btn btn-outline h-8 px-2 text-primary-500"
          disabled
        >
          <span class="text-sm">مشاهده</span>
          <Icon name="svg:arrow-left-circle" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from "~/features/panel/cv/Titr.vue";
import type { CreateProjectFormModel } from "~/types/create-project-form";
import { resolveCompanyLogoDisplaySrc } from "~/utils/company-basic-info";
import { formatBudgetRange } from "~/utils/create-project-payload";

const props = defineProps<{
  form: CreateProjectFormModel;
  companyName: string;
  companyLogo: string;
  companyProvince: string;
  companyCity: string;
}>();

const companyLogoSrc = computed(() =>
  resolveCompanyLogoDisplaySrc(props.companyLogo || null),
);

const titleLabel = computed(() =>
  props.form.type ? `پروژه ${props.form.type}` : "پروژه حسابداری",
);

const locationLabel = computed(() => {
  if (props.companyProvince && props.companyCity) {
    return `${props.companyProvince}، ${props.companyCity}`;
  }
  return props.companyCity || props.companyProvince || "";
});

const budgetLabel = computed(() =>
  formatBudgetRange(props.form.min_budget, props.form.max_budget),
);
</script>
