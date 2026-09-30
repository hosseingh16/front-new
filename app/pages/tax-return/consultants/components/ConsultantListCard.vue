<template>
  <article
    class="relative rounded-xl border border-gray-default bg-success-50 p-4"
    :class="
      !loading
        ? 'cursor-pointer transition-opacity hover:opacity-95'
        : undefined
    "
    @click="onCardClick"
  >
    <template v-if="loading">
      <div class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 items-center gap-3">
          <div
            class="h-14 w-14 shrink-0 rounded-xl bg-surface-200 animate-pulse"
          />
          <div class="space-y-2">
            <div class="h-5 w-36 rounded bg-surface-200 animate-pulse" />
            <div class="h-4 w-44 rounded bg-surface-200 animate-pulse" />
            <div class="h-4 w-28 rounded bg-surface-200 animate-pulse" />
          </div>
        </div>
        <div class="h-4 w-24 rounded bg-surface-200 animate-pulse" />
      </div>
      <div class="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div
          class="h-8 w-32 rounded-full border border-gray-default bg-white animate-pulse"
        />
        <div class="h-16 w-56 rounded-xl bg-white animate-pulse" />
      </div>
    </template>

    <template v-else>
      <div class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 items-center gap-3">
          <div
            class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#8EA0B5]"
          >
            <img
              :src="avatarSrc"
              :alt="consultant.name"
              class="h-full w-full object-cover"
            />
          </div>

          <div class="min-w-0">
            <p class="truncate font-yb-bold text-base text-text-tertiary">
              {{ consultant.name }}
            </p>
            <div
              v-if="consultant.job_title"
              class="mt-1 flex items-center gap-1.5 text-sm text-text-passive"
            >
              <Icon name="svg:people" size="16" class="shrink-0" />
              <span class="truncate">سمت شغلی: {{ consultant.job_title }}</span>
              <span class="truncate"> - {{ locationText }}</span>
            </div>
          </div>
        </div>

        <NuxtLink
          v-if="to"
          :to="to"
          class="relative z-10 flex shrink-0 items-center gap-1.5 text-sm text-text-passive"
          @click.stop
        >
          <Icon name="lucide:eye" size="16" class="shrink-0" />
          <span>مشاهده رزومه</span>
        </NuxtLink>
        <div
          v-else
          class="relative z-10 flex shrink-0 items-center gap-1.5 text-sm text-text-passive"
        >
          <Icon name="lucide:eye" size="16" class="shrink-0" />
          <span>مشاهده رزومه</span>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div
          v-if="consultant.is_tax_return_consultant"
          class="inline-flex items-center gap-1.5 rounded-full border border-gray-default bg-white px-3 py-1.5 text-sm text-text-passive"
        >
          <Icon name="svg:personalcard" size="16" class="shrink-0" />
          <span>اظهارنامه عملکرد</span>
        </div>
        <span v-else />

        <div
          class="relative z-10 min-w-0 rounded-xl border border-gray-default bg-white px-3 py-2.5"
        >
          <div class="flex items-center gap-1.5 text-sm text-text-passive">
            <Icon
              name="lucide:coins"
              size="16"
              class="shrink-0 text-success-500 [&_path]:fill-current [&_path]:stroke-current"
            />
            <span>نرخ انجام اظهارنامه:</span>
          </div>
          <p class="mt-1 font-yb-bold text-sm text-text-tertiary">
            {{ taxReturnPriceRange }}
          </p>
        </div>
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
import type { TaxReturnConsultant } from "~/types/tax-return-consultant";
import { resolveAvatarSrc } from "~/libs/utils";
import { formatTaxReturnConsultantPriceRange } from "~/utils/tax-return-consultant-price";

const props = withDefaults(
  defineProps<{
    consultant?: TaxReturnConsultant;
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const emit = defineEmits<{
  select: [consultant: TaxReturnConsultant];
}>();

const config = useRuntimeConfig();

const consultant = computed(
  (): TaxReturnConsultant =>
    props.consultant ?? {
      id: 0,
      name: "",
    },
);

const avatarSrc = computed(() =>
  resolveAvatarSrc(consultant.value.avatar, config.public.baseUrl as string),
);

const to = computed(() => {
  const slug = consultant.value.cv_slug?.trim();
  return slug ? `/cv/${slug}` : undefined;
});

const locationText = computed(() => {
  const city = consultant.value.city_name?.trim();
  const province = consultant.value.province_name?.trim();
  if (city && province) return `${city}، ${province}`;
  return city || province || "";
});

const taxReturnPriceRange = computed(() =>
  formatTaxReturnConsultantPriceRange(
    consultant.value.tax_return_price_min,
    consultant.value.tax_return_price_max,
  ),
);

function onCardClick() {
  if (props.loading || !props.consultant) return;
  emit("select", props.consultant);
}
</script>
