<template>
  <div class="flex justify-between items-center">
    <p class="text-sm text-text-passive">{{ label }}</p>
    <div class="h-1 mx-10 flex-1 overflow-hidden rounded-full bg-surface-200 hidden md:block">
      <!-- <div
        class="h-full rounded-full transition-all"
        :class="barClass"
        :style="{ width: `${percent}%` }"
      /> -->
    </div>
    <span
      class="shrink-0 text-center text-xs font-semibold p-2 rounded-xl"
      :class="badgeClass"
    >
      {{ persianPercent }}٪
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: { type: String, required: true },
  percent: { type: Number, required: true },
  color: { type: String as () => 'primary' | 'accent', default: 'primary' },
});

const persianPercent = computed(() =>
  String(props.percent).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]),
);

const badgeClass = computed(() =>
  props.color === 'accent'
    ? 'bg-accent-400 text-accent-500'
    : 'bg-primary-50 text-primary-500',
);

const barClass = computed(() =>
  props.color === 'accent' ? 'bg-accent-500' : 'bg-primary-300',
);
</script>
