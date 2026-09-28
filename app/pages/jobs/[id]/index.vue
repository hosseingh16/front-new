<script setup lang="ts">
import { useAd } from "~/composables/useAd";
import { jobDetailPath } from "~/utils/job-detail-path";

const route = useRoute();
const adId = computed(() => String(route.params.id ?? ""));

if (!/^\d+$/.test(adId.value)) {
  throw createError({ statusCode: 404, statusMessage: "آگهی یافت نشد" });
}

const { ad, loading, error } = useAd(adId);

watch(
  [ad, loading, error],
  async ([value, isLoading, fetchError]) => {
    if (isLoading) return;

    if (value?.id) {
      await navigateTo(jobDetailPath(value), { replace: true });
      return;
    }

    if (fetchError) {
      throw createError({
        statusCode: 404,
        statusMessage: "آگهی یافت نشد",
      });
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="custom-pad py-16">
    <div class="mx-auto h-10 w-48 animate-pulse rounded bg-surface-200" />
  </div>
</template>
