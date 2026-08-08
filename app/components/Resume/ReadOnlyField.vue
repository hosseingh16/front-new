<template>
  <div v-if="hasValue" class="flex flex-col items-start gap-2">
    <span class="text-base text-text-tertiary">{{ label }}</span>
    <span class="font-yb-bold text-base text-text-primay">
      {{ value }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { hasResumeValue } from "~/pages/users/utils/user-resume";

const props = defineProps<{
  label: string;
  value?: string | null;
}>();

const hasValue = computed(() => hasResumeValue(props.value));
</script>
