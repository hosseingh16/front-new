<template>
  <article
    class="relative rounded-xl bg-white p-1"
    :class="to ? 'transition-opacity hover:opacity-95' : undefined"
  >
    <div class="relative rounded-xl bg-success-50 p-4">
      <NuxtLink
        v-if="to && !loading"
        :to="to"
        class="absolute inset-0 rounded-xl"
        :aria-label="consultant.name"
      />

      <template v-if="loading">
        <div class="flex items-start justify-between gap-4">
          <div class="flex min-w-0 items-center gap-3">
            <div
              class="h-14 w-14 shrink-0 rounded-xl bg-surface-200 animate-pulse"
            />
            <div class="space-y-2">
              <div class="h-5 w-36 rounded bg-surface-200 animate-pulse" />
              <div class="h-4 w-44 rounded bg-surface-200 animate-pulse" />
            </div>
          </div>
          <div class="h-4 w-24 rounded bg-surface-200 animate-pulse" />
        </div>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div
            class="h-8 w-32 rounded-full border border-gray-default bg-white animate-pulse"
          />
          <div class="flex items-center gap-3">
            <div class="h-8 w-44 rounded-full bg-success-50 animate-pulse" />
            <div class="h-6 w-px bg-gray-default" />
            <div class="h-8 w-48 rounded-full bg-success-50 animate-pulse" />
          </div>
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
                <span class="truncate"
                  >سمت شغلی: {{ consultant.job_title }}</span
                >
              </div>
            </div>
          </div>

          <NuxtLink
            v-if="to"
            :to="to"
            class="relative z-10 flex shrink-0 items-center gap-1.5 text-sm text-text-passive"
            :aria-label="consultant.name"
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

        <div class="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div
            v-if="consultant.is_tax_return_consultant"
            class="inline-flex items-center gap-1.5 rounded-full border border-gray-default bg-white px-3 py-1.5 text-sm text-text-passive"
          >
            <Icon name="svg:personalcard" size="16" class="shrink-0" />
            <span>اظهارنامه عملکرد</span>
          </div>
          <span v-else />

          <div class="flex flex-wrap items-center justify-center">
            <div
              v-for="(tag, index) in priceTags"
              :key="tag.key"
              class="flex items-center my-2"
            >
              <span
                v-if="index > 0"
                class="mx-3 hidden h-5 w-px bg-text-muted sm:block"
              />
              <div
                class="inline-flex items-center gap-1.5 rounded-xl bg-accent-300 px-3 py-1.5 text-sm text-text-tertiary"
              >
                <Icon
                  name="lucide:coins"
                  size="16"
                  class="shrink-0 text-success-500 [&_path]:fill-current [&_path]:stroke-current"
                />
                <span>{{ tag.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { TaxReturnConsultant } from "~/types/tax-return-consultant";
import { resolveAvatarSrc } from "~/libs/utils";
import { formatTaxReturnConsultantPrice } from "~/utils/tax-return-consultant-price";

const props = withDefaults(
  defineProps<{
    consultant?: TaxReturnConsultant;
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

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

const priceTags = computed(() => [
  {
    key: "consultant-price",
    label: `قیمت انجام مشاوره : ${priceText(
      consultant.value.consultant_price,
    )}`,
  },
  {
    key: "tax-return-price",
    label: `قیمت انجام اظهارنامه : ${priceText(
      consultant.value.tax_return_price,
    )}`,
  },
]);

function priceText(value: number | null | undefined) {
  const formatted = formatTaxReturnConsultantPrice(value);
  return formatted === "قیمت اعلام نشده" ? "اعلام نشده" : formatted;
}
</script>
