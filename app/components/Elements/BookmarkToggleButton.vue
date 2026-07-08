<template>
  <button
    type="button"
    class="flex cursor-pointer h-9 items-center justify-center gap-1 rounded-lg border-2 border-gray-default bg-white px-4 text-sm text-text-tertiary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
    :disabled="loading"
    :aria-label="bookmarked ? 'حذف نشان' : 'نشان کردن'"
    @click="toggleBookmark"
  >
    <Icon
      :name="bookmarked ? 'material-symbols:bookmark' : 'material-symbols:bookmark-outline'"
      size="16"
      :class="bookmarked ? 'text-primary-500' : ''"
    />
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import type { ApiResponse } from '~/types/api'

export type BookmarkType = 'users' | 'requests' | 'companies' | 'ads'

const props = withDefaults(
  defineProps<{
    targetId: string | number
    type: BookmarkType
    label?: string
    initialBookmarked?: boolean
  }>(),
  {
    label: 'نشان کردن',
    initialBookmarked: false,
  },
)

const api = useApi()
const { $toast } = useNuxtApp()

const loading = ref(false)
const bookmarked = ref(props.initialBookmarked)

watch(
  () => props.initialBookmarked,
  (value) => {
    bookmarked.value = value
  },
)

async function toggleBookmark() {
  if (loading.value) return

  loading.value = true
  try {
    const result = await api.post<ApiResponse<{ bookmarked?: boolean }>>(
      `/bookmarks/toggle/${props.targetId}`,
      {
        type: props.type,
      },
    )

    if (typeof result.data?.bookmarked === 'boolean') {
      bookmarked.value = result.data.bookmarked
    } else {
      bookmarked.value = !bookmarked.value
    }

    $toast.success(bookmarked.value ? 'آگهی نشان شد' : 'نشان حذف شد')
  } catch (error: any) {
    if (error?.status !== 401) {
      $toast.error(error?.message || 'خطا در نشان‌گذاری')
    }
  } finally {
    loading.value = false
  }
}
</script>
