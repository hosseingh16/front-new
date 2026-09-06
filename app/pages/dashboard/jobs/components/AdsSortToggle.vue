<template>
  <div
    class="inline-flex h-8 max-w-full items-center rounded-xl bg-surface-100 p-0.5"
    role="group"
    aria-label="مرتب‌سازی"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="flex h-7 min-w-0 flex-1 items-center justify-center rounded-[10px] px-2 text-xs font-semibold leading-none whitespace-nowrap transition-colors sm:w-26.25 sm:flex-none"
      :class="
        model === option.value
          ? 'bg-white text-text-primary'
          : 'bg-transparent text-text-passive'
      "
      :aria-pressed="model === option.value"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { AdsSort } from '~/utils/ads-filters-query'

const model = defineModel<AdsSort>({ required: true })

const options: Array<{ label: string; value: AdsSort }> = [
  { label: 'جدیدترین‌ها', value: 'newest' },
  { label: 'بیشترین حقوق', value: 'salary' },
]
</script>
