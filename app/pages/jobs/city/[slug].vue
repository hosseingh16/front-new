<template>
  <JobsListingView :city-slug="slug" />
</template>

<script setup lang="ts">
import JobsListingView from "~/components/Elements/JobsListingView.vue";
import { normalizeJobCitySlug } from "~/utils/job-city";

const route = useRoute();

const slug = computed(() =>
  normalizeJobCitySlug(
    typeof route.params.slug === "string" ? route.params.slug : "",
  ),
);

if (!slug.value) {
  await navigateTo("/jobs", { replace: true });
}
</script>
