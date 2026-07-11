<template>
  <article class="rounded-2xl border border-gray-default bg-white p-4">
    <div class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 flex-1 items-start gap-3">
        <div class="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#c5dff5]">
          <img
            v-if="avatar"
            :src="avatar"
            :alt="name"
            class="h-full w-full object-cover"
          />
          <div
            v-else
            class="flex h-full w-full items-end justify-center bg-gradient-to-b from-[#c5dff5] to-[#9ec5e8]"
          >
            <div class="h-[85%] w-[70%] rounded-t-full bg-[#e8a4a4]" />
          </div>
        </div>

        <div class="min-w-0">
          <h3 class="truncate font-yb-bold text-base text-text-tertiary">{{ name }}</h3>
          <div class="mt-1 flex items-center gap-1 text-sm text-text-passive">
            <Icon name="ph:suitcase-simple-light" size="14" class="shrink-0" />
            <span class="truncate">عنوان شغلی: {{ jobTitle }}</span>
          </div>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <button
          type="button"
          class="flex h-9 items-center gap-1 rounded-lg border border-gray-default bg-white px-3 text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80 disabled:opacity-60 max-md:h-8 max-md:w-8 max-md:justify-center max-md:p-0"
          :disabled="actionLoading"
          @click="emit('view')"
        >
          <Icon name="svg:eye" size="16" />
          <span class="max-md:hidden">مشاهده رزومه</span>
        </button>

        <BookmarkToggleButton
          :target-id="request.id"
          type="requests"
          icon-only
        />
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-1.5 md:hidden">
      <div
        v-for="item in mobileTags"
        :key="item.key"
        class="flex items-center gap-2 rounded-full border border-gray-default bg-[#F6F8FE] px-3 py-1.5 text-sm text-text-tertiary"
      >
        <Icon :name="item.icon" size="14" class="shrink-0 text-text-passive" />
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div
      class="mt-4 hidden gap-3 md:grid"
      :class="desktopGridClass"
    >
      <div
        v-for="item in displayItems"
        :key="`desktop-${item.key}`"
        class="flex items-center gap-2 text-sm text-text-tertiary"
      >
        <Icon :name="item.icon" size="16" class="shrink-0 text-text-passive" />
        <span class="truncate">{{ item.label }}</span>
      </div>
    </div>

    <div class="mt-4 flex items-center gap-2">
      <button
        type="button"
        class="btn h-10 flex-1 gap-2 border-2 border-[#009F65] bg-[#E6F6F0] text-sm font-semibold text-[#009F65] hover:bg-[#d8f0e8] max-md:btn-success max-md:border-none max-md:text-white"
        :disabled="actionLoading || isApproved"
        @click="emit('confirm')"
      >
        <Icon name="material-symbols:check-circle-outline" size="18" />
        تایید درخواست
      </button>

      <button
        type="button"
        class="btn btn-ghost h-10 min-h-10 gap-1 px-3 text-sm font-semibold text-[#dd4a48] hover:bg-[#fdeceb] max-md:h-10 max-md:w-10 max-md:rounded-lg max-md:border max-md:border-gray-default max-md:p-0"
        :disabled="actionLoading || isRejected"
        aria-label="رد کردن"
        @click="emit('reject')"
      >
        <Icon name="svg:close" size="18" class="max-md:text-[#dd4a48]" />
        <span class="max-md:hidden">رد کردن</span>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import BookmarkToggleButton from '~/components/Elements/BookmarkToggleButton.vue'
import type { EmployerAdRequest } from '~/types/employer-ad-request'
import {
  getAdRequestDisplayItems,
  getAdRequestJobTitle,
  getAdRequestMobileTags,
} from '~/pages/dashboard/employer/utils/employer-ad-request'

const props = defineProps<{
  request: EmployerAdRequest
  actionLoading?: boolean
}>()

const emit = defineEmits<{
  view: []
  confirm: []
  reject: []
}>()

const name = computed(() => props.request.user?.name || '—')
const avatar = computed(() => props.request.user?.avatar || null)
const jobTitle = computed(() => getAdRequestJobTitle(props.request))
const displayItems = computed(() => getAdRequestDisplayItems(props.request))
const mobileTags = computed(() => getAdRequestMobileTags(props.request))

const desktopGridClass = computed(() => {
  const count = displayItems.value.length
  if (count <= 3) return 'grid-cols-3'
  if (count <= 4) return 'grid-cols-4'
  if (count <= 5) return 'grid-cols-5'
  return 'grid-cols-6'
})

const isApproved = computed(() =>
  (props.request.status ?? '').includes('تایید'),
)

const isRejected = computed(() =>
  (props.request.status ?? '').includes('رد'),
)
</script>
