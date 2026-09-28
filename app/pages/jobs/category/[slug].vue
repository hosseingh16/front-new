<template>
  <JobsListingView :category-slug="slug" />
</template>

<script setup lang="ts">
import JobsListingView from "~/components/Elements/JobsListingView.vue";
import { normalizeJobCategorySlug } from "~/utils/job-category";

const route = useRoute();

const slug = computed(() =>
  normalizeJobCategorySlug(
    typeof route.params.slug === "string" ? route.params.slug : "",
  ),
);

if (!slug.value) {
  await navigateTo("/jobs", { replace: true });
}
</script>
