<template>
  <div>
    <Titr v-if="showTitle">میزان تکمیل رزومه</Titr>

    <div class="mt-4 flex justify-center">
      <div class="relative h-48 w-48">
        <svg viewBox="0 0 120 120" class="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#F2F2F2"
            stroke-width="12"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            :stroke="totalPercent >= 100 ? '#009F65' : '#4864E1'"
            stroke-width="12"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            class="transition-all duration-500"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="font-yb-bold text-2xl text-text-tertiary"
            >٪{{ totalPercent }}</span
          >
          <span class="text-xs text-text-passive">میزان کامل شدن</span>
        </div>
      </div>
    </div>

    <ul class="mt-4 space-y-1">
      <li v-for="item in completionItems" :key="item.key">
        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-50"
          @click="emit('select', item)"
        >
          <span>{{ item.label }}</span>
          <Icon
            :name="
              item.complete ? 'lucide:circle-check' : 'lucide:circle-alert'
            "
            size="18"
            :class="item.complete ? 'text-[#009F65]' : 'text-[#F59E0B]'"
          />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Titr from "./Titr.vue";
import type { CvCompletionItem } from "~/composables/useCvCompletion";

const props = withDefaults(
  defineProps<{
    user: Record<string, unknown> | null;
    showTitle?: boolean;
  }>(),
  { showTitle: true },
);

const emit = defineEmits<{
  select: [item: CvCompletionItem];
}>();

const { completionItems, totalPercent } = useCvCompletion(() => props.user);

const circumference = 2 * Math.PI * 52;

const dashOffset = computed(
  () => circumference * (1 - Math.min(totalPercent.value, 100) / 100),
);
</script>
