<template>
  <div class="mb-1 flex items-center justify-between gap-3 px-1 py-2">
    <div class="flex min-w-0 items-center gap-2 text-sm font-semibold text-text-tertiary">
      <Icon v-if="icon" :name="icon" size="16" class="shrink-0 text-text-passive" />
      <span>{{ title }}</span>
    </div>

    <NuxtLink
      v-if="viewAllUrl"
      :to="viewAllUrl"
      class="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80"
      @click="emit('view-all')"
    >
      مشاهده همه
      <icons-arrow color="#4864e1" :size="14" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  icon?: string
  viewAllUrl: string
}>()

const emit = defineEmits<{
  'view-all': []
}>()
</script>
