<template>
  <JobsListingView v-if="ready" :city-slug="slug" />
</template>

<script setup lang="ts">
import JobsListingView from "~/components/Elements/JobsListingView.vue";
import { JOB_FILTERS_LOOKUP_KEYS } from "~/types/job-filters";
import {
  findJobCityProvince,
  normalizeJobCitySlug,
} from "~/utils/job-city";
import {
  getProvinceSlug,
  isFeaturedProvince,
} from "~/utils/province-filter-query";

const route = useRoute();
const { ensure, items } = useLookups(JOB_FILTERS_LOOKUP_KEYS);
const provinces = items("provinces");
const ready = ref(false);

const slug = computed(() =>
  normalizeJobCitySlug(
    typeof route.params.slug === "string" ? route.params.slug : "",
  ),
);

if (!slug.value) {
  await navigateTo("/jobs", { replace: true });
} else {
  await ensure();

  const province = findJobCityProvince(slug.value, provinces.value);
  if (!province || !isFeaturedProvince(province)) {
    await navigateTo(
      {
        path: "/jobs",
        query: province
          ? { ...route.query, province: getProvinceSlug(province) }
          : route.query,
      },
      { replace: true },
    );
  } else {
    const canonicalSlug = normalizeJobCitySlug(getProvinceSlug(province));
    if (canonicalSlug && canonicalSlug !== slug.value) {
      await navigateTo(
        {
          path: `/jobs/city/${canonicalSlug}`,
          query: route.query,
        },
        { replace: true },
      );
    } else {
      ready.value = true;
    }
  }
}
</script>
