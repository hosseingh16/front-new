<template>
  <div>
    <div class="mb-3">
      <Circle :percent="totalPercent" />
    </div>

    <div
      v-for="item in completionItems"
      :key="item.label"
      class="flex justify-between items-center mt-3"
    >
      <div class="flex items-center">
        <icons-chevron class="rotate-90" />
        <span class="text-text-passive text-sm">{{ item.label }}</span>
      </div>
      <div
        class="flex justify-center items-center h-6 w-8 rounded-lg shrink-0"
        :class="
          item.complete
            ? 'bg-success/10 text-[#009F65]'
            : 'bg-[#EF403514] text-danger-500'
        "
      >
        <Icon
          v-if="item.complete"
          name="lucide:check-check"
          size="16"
        />
        <Icon v-else name="lucide:x" size="16" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Circle from "./Circle.vue";

const props = defineProps<{
  user: Record<string, unknown> | null;
}>();

const { completionItems, totalPercent } = useCvCompletion(
  () => props.user,
);
</script>
