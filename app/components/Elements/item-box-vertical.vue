<template>
  <div class="overflow-hidden rounded-xl bg-white">
    <template v-if="loading">
      <div class="p-4 m-2 rounded-xl" :class="highlight ? 'bg-[#FBF7EF]' : 'bg-[#F7F8FF]'">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3">
            <div class="h-11 w-11 rounded-xl bg-surface-200 animate-pulse" />
            <div class="space-y-2">
              <div class="h-5 w-36 rounded bg-surface-200 animate-pulse" />
              <div class="h-4 w-28 rounded bg-surface-200 animate-pulse" />
            </div>
          </div>
          <div class="h-4 w-14 rounded bg-surface-200 animate-pulse" />
        </div>

        <div class="mt-3 flex gap-2">
          <div class="h-8 w-24 rounded-full bg-surface-200 animate-pulse" />
          <div class="h-8 w-28 rounded-full bg-surface-200 animate-pulse" />
          <div class="h-8 w-20 rounded-full bg-surface-200 animate-pulse" />
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-surface-100 bg-white px-4 py-3">
        <div class="h-5 w-32 rounded bg-surface-200 animate-pulse" />
        <div class="h-8 w-20 rounded bg-surface-200 animate-pulse" />
      </div>
    </template>

    <template v-else>
      <div class="p-4 m-2 rounded-xl" :class="highlight ? 'bg-[#FBF7EF]' : 'bg-[#F7F8FF]'">
        <div class="flex items-end justify-between gap-4">
          <div class="flex min-w-0 items-start gap-3">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECF4D9]">
              <img
                v-if="logo"
                :src="logo"
                :alt="title"
                class="h-11 w-11 rounded-xl object-cover"
              />
              <span v-else class="font-yb-bold text-base text-text-tertiary">م</span>
            </div>
            <div class="min-w-0">
              <h3 class="truncate font-yb-bold text-base text-text-tertiary">{{ title }}</h3>
              <p class="mt-0.5 flex items-center gap-1 text-sm text-text-passive">
                <Icon name="svg:buildings-4" size="13" />
                <span>نام شرکت: {{ companyName }}</span>
              </p>
            </div>
          </div>
          <span class="text-sm text-text-passive">{{ age }}</span>
        </div>

        <div class="mt-3 flex flex-wrap gap-2 text-sm text-text-secondary">
          <span class="inline-flex items-center gap-1 rounded-full border border-gray-default bg-white px-2.5 py-1">
            <Icon :name="variant === 'project' ? 'tabler:file-text' : 'ph:suitcase-simple-light'" size="14" />
            {{ type }}
          </span>
          <span class="inline-flex items-center gap-1 rounded-full border border-gray-default bg-white px-2.5 py-1">
            <Icon name="svg:location-4" size="14" />
            {{ location }}
          </span>
          <span class="inline-flex items-center gap-1 rounded-full border border-gray-default bg-white px-2.5 py-1">
            <Icon name="lucide:user" size="14" />
            {{ gender }}
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 bg-white px-4 py-3">
        <div class="text-right">
          <p class="text-sm text-text-secondary">{{ variant === 'project' ? 'پروژه' : employmentType }}</p>
          <p class="font-semibold text-text-tertiary">{{ salary }}</p>
        </div>
        <NuxtLink
          v-if="to"
          :to="to"
          class="inline-flex items-center gap-1 rounded-md bg-[#EBEEFA] px-3 py-1.5 text-sm font-semibold text-primary-500 transition-opacity hover:opacity-90"
        >
          <icons-chevron class="rotate-90" color="#4864e1" />
          مشاهده
        </NuxtLink>
        <NuxtLink
          v-else
          to="#"
          class="pointer-events-none inline-flex items-center gap-1 rounded-md bg-[#EBEEFA] px-3 py-1.5 text-sm font-semibold text-primary-500"
        >
          <icons-chevron class="rotate-90" color="#4864e1" />
          مشاهده
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    companyName?: string
    type: string
    location: string
    gender: string
    employmentType?: string
    salary: string
    age: string
    logo?: string | null
    to?: string
    loading?: boolean
    highlight?: boolean
    variant?: 'ad' | 'project'
  }>(),
  {
    companyName: 'بازرگانی سپهر',
    employmentType: 'تمام وقت',
    logo: null,
    loading: false,
    highlight: false,
    variant: 'ad',
  },
)
</script>
