<template>
  <div class="space-y-3">
    <template v-if="loading">
      <ItemBoxVertical v-for="n in 3" :key="`company-ad-skeleton-${n}`" loading />
    </template>

    <p
      v-else-if="error"
      class="rounded-2xl border border-gray-default bg-white p-5 py-12 text-center text-sm text-error md:p-6"
    >
      {{ error }}
    </p>

    <template v-else-if="companyAds.length">
      <ItemBoxVertical
        v-for="item in companyAds"
        :key="item.id"
        :title="item.title"
        :company-name="item.companyName"
        :type="item.type"
        :location="item.location"
        :gender="item.gender"
        :salary="item.salary"
        :age="item.age"
        :logo="item.logo"
        :to="item.to"
        :highlight="item.highlight"
        :variant="item.variant"
        :employment-type="item.employmentType"
      />
    </template>

    <section
      v-else
      class="rounded-2xl border border-gray-default bg-white p-5 py-12 md:p-6"
    >
      <p class="mt-2 text-center text-sm text-text-passive">
        در حال حاضر آگهی دیگری از این سازمان وجود ندارد.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Ad } from "~/types/ad";
import type { ApiResponse } from "~/types/api";
import type { Company } from "~/types/company";
import ItemBoxVertical from "~/components/Elements/item-box-vertical.vue";
import { formatRelativeDate } from "~/utils/format-relative-date";

const props = defineProps<{
  ad: Ad;
}>();

const api = useApi();
const loading = ref(false);
const error = ref<string | null>(null);
const company = ref<Company | null>(null);

const locationFallback = computed(() => {
  const province = props.ad.company?.province_name ?? props.ad.province_name;
  const city = props.ad.company?.city_name ?? props.ad.city_name;
  if (province && city) return `${province}، ${city}`;
  return province || city || "";
});

const companyAds = computed(() => {
  const c = company.value;
  if (!c?.ads?.length) return [];

  return c.ads
    .filter((item) => item.id !== props.ad.id)
    .map((item, index) => ({
      id: item.id,
      title: item.title,
      companyName: c.name || props.ad.company_name,
      type: item.category || c.activity || "—",
      location:
        [item.province_name, item.city_name].filter(Boolean).join("، ") ||
        locationFallback.value ||
        "—",
      gender: item.gender || "—",
      employmentType: item.employment_type || "—",
      salary: String(item.salary_range ?? item.salary ?? "—"),
      age: formatRelativeDate(item.publish_date),
      logo: item.company_logo || c.logo || props.ad.company_logo,
      highlight: index % 2 === 1,
      variant: "ad" as const,
      to: `/jobs/${item.id}`,
    }));
});

async function fetchCompanyAds() {
  const slug = props.ad.company?.slug?.trim();
  if (!slug) {
    company.value = null;
    error.value = null;
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const result = await api.get<ApiResponse<Company>>(`/companies/${slug}`);
    company.value = result.data ?? null;
  } catch {
    error.value = "خطا در دریافت آگهی‌های سازمان";
    company.value = null;
  } finally {
    loading.value = false;
  }
}

watch(
  () => [props.ad.id, props.ad.company?.slug] as const,
  () => {
    fetchCompanyAds();
  },
  { immediate: true },
);
</script>
