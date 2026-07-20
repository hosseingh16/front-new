<template>
  <nav
    v-if="lastPage > 1"
    dir="rtl"
    class="flex items-center justify-center gap-2"
    aria-label="صفحه‌بندی"
  >
    <button
      type="button"
      class="flex cursor-pointer h-10 w-10 items-center justify-center rounded-lg border border-surface-200 bg-surface-50 text-sm text-text-tertiary transition-colors hover:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="currentPage <= 1"
      aria-label="صفحه قبل"
      @click="emit('update:currentPage', currentPage - 1)"
    >
      <Icon name="svg:chevron-right" size="16" />
    </button>

    <template v-for="(item, index) in pages" :key="`${item}-${index}`">
      <span
        v-if="item === 'ellipsis'"
        class="pointer-events-none flex cursor-pointer h-10 w-10 items-center justify-center rounded-lg border border-surface-200 bg-surface-50 text-sm text-text-passive"
        aria-hidden="true"
      >
        ⋮
      </span>
      <button
        v-else
        type="button"
        class="flex h-10 w-10 items-center cursor-pointer justify-center rounded-lg border text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        :class="
          item === currentPage
            ? 'border-text-tertiary bg-text-tertiary text-white'
            : 'border-surface-200 bg-surface-50 text-text-tertiary hover:bg-surface-100'
        "
        :aria-current="item === currentPage ? 'page' : undefined"
        @click="emit('update:currentPage', item)"
      >
        {{ item }}
      </button>
    </template>

    <button
      type="button"
      class="flex h-10 w-10 items-center cursor-pointer justify-center rounded-lg border border-surface-200 bg-surface-50 text-sm text-text-tertiary transition-colors hover:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="currentPage >= lastPage"
      aria-label="صفحه بعد"
      @click="emit('update:currentPage', currentPage + 1)"
    >
      <Icon name="svg:chevron-left" size="16" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { getPaginationPages } from '~/utils/pagination-pages'

const props = defineProps<{
  currentPage: number
  lastPage: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const pages = computed(() =>
  getPaginationPages(props.currentPage, props.lastPage),
)
</script>
