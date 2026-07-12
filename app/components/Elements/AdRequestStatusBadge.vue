<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-semibold"
    :class="meta.className"
  >
    <span
      class="inline-block h-2 w-2 shrink-0 rounded-full"
      :style="{ backgroundColor: meta.dotColor }"
    />
    <span>{{ meta.label }}</span>
  </span>
</template>

<script setup lang="ts">
import type { EmployerAdRequest } from "~/types/employer-ad-request";
import { getAdRequestStatusMeta } from "~/pages/dashboard/employer/utils/employer-ad-request";

const props = defineProps<{
  request: Pick<EmployerAdRequest, "status" | "seen">;
}>();

const meta = computed(() => getAdRequestStatusMeta(props.request));
</script>
