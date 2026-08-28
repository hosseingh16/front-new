<template>
  <NuxtLink :to="resolvedTo">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { AccountRole } from "~/features/account/types";

const props = defineProps<{
  to: string;
  role?: AccountRole;
  query?: Record<string, string>;
}>();

const { intentLocation } = useIntentNavigation();

const resolvedTo = computed(() =>
  intentLocation({
    to: props.to,
    role: props.role,
    query: props.query,
  }),
);
</script>
