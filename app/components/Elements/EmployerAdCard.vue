<template>
  <article class="rounded-2xl border border-gray-default bg-white p-1">
    <div class="rounded-lg p-3 bg-[#F6F8FE]">
      <div class="flex items-start justify-between gap-4">
        <h2 class="font-yb-bold text-base text-text-tertiary">{{ ad.title }}</h2>
        <span v-if="publishedLabel" class="shrink-0 text-sm text-text-passive">
          {{ publishedLabel }}
        </span>
      </div>

      <div class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div
          v-for="item in statItems"
          :key="item.label"
          class="flex flex-col items-center gap-2"
        >
          <div class="min-w-0">
            <p class="font-yb-bold text-sm text-text-tertiary">{{ item.value }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              :style="{ backgroundColor: item.iconBgColor }"
            >
              <Icon :name="item.icon" size="18" :style="{ color: item.iconColor }" />
            </span>
            <p class="text-sm text-text-passive">{{ item.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="my-2 flex flex-wrap items-center justify-between gap-3 px-2">
      <span
        class="rounded-lg px-3 py-1 text-sm font-semibold flex justify-center"
        :class="statusMeta.className"
      >
        <span class="inline-block h-2 w-2 ml-1 my-auto bg-[#2E7D32] rounded-full"></span>
        {{ statusMeta.label }}
      </span>

      <div class="flex flex-wrap items-center gap-2">
        <MDropdown hover>
          <template #btn>
            <button type="button" class="btn btn-ghost text-primary-500  h-9 min-h-9 gap-2 px-4 text-sm hover:bg-primary-500 hover:text-white">
              <Icon name="material-symbols:more-vert" size="16" />
              <span class="hidden md:block">مدیریت آگهی</span>
            </button>
          </template>
          <template #content>
            <ul class="min-w-56">
              <li>
                <button
                  type="button"
                  class="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-50"
                  @click="emit('edit', ad.id)"
                >
                  <Icon name="material-symbols:edit-outline" size="16" />
                  ویرایش
                </button>
              </li>
              <li>
                <NuxtLink
                  :to="`/jobs/${ad.id}`"
                  target="_blank"
                  class="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-50"
                >
                  <Icon name="material-symbols:visibility-outline" size="16" />
                  مشاهده آگهی در سایت
                </NuxtLink>
              </li>
              <li>
                <button
                  type="button"
                  class="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-50"
                  @click="emit('copy', ad.id)"
                >
                  <Icon name="material-symbols:content-copy-outline" size="16" />
                  کپی در آگهی جدید
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-surface-50"
                  @click="emit('delete', ad.id)"
                >
                  <Icon name="material-symbols:delete-outline" size="16" />
                  حذف آگهی
                </button>
              </li>
            </ul>
          </template>
        </MDropdown>

        <NuxtLink
          :to="`/dashboard/employer/ads/${ad.id}/resumes`"
          class="group btn btn-ghost h-9 min-h-9 gap-2 px-4 text-sm text-primary-500 hover:bg-primary-500 hover:text-white"
        >
          <icons-search-briefcase class="text-current" />
          رزومه‌ها
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { EmployerAd } from '~/types/employer-ad'
import { formatRelativeDate } from '~/utils/format-relative-date'
import MDropdown from '~/components/M/Dropdown.vue'
import {
  getEmployerAdStatItems,
  getEmployerAdStatusMeta,
} from '~/pages/dashboard/employer/utils/employer-ad'

const props = defineProps<{
  ad: EmployerAd
}>()

const emit = defineEmits<{
  edit: [id: number]
  copy: [id: number]
  delete: [id: number]
}>()

const publishedLabel = computed(() =>
  formatRelativeDate(props.ad.publish_date || props.ad.created_at),
)

const statItems = computed(() => getEmployerAdStatItems(props.ad))

const statusMeta = computed(() => getEmployerAdStatusMeta(props.ad))
</script>
