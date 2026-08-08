<template>
  <div class="flex min-h-[calc(100vh-12rem)] flex-col gap-4">
    <template v-if="loading">
      <div class="flex items-center justify-between gap-4">
        <div class="h-10 w-32 animate-pulse rounded bg-surface-200" />
        <div class="h-9 w-56 animate-pulse rounded bg-surface-200" />
      </div>
      <div class="mt-2 flex gap-6 border-b border-gray-default pb-3">
        <div
          v-for="n in 5"
          :key="`tab-skeleton-${n}`"
          class="h-5 w-24 animate-pulse rounded bg-surface-200"
        />
      </div>
      <div class="space-y-4">
        <div
          v-for="n in 3"
          :key="`card-skeleton-${n}`"
          class="h-48 animate-pulse rounded-2xl bg-surface-200"
        />
      </div>
    </template>

    <p
      v-else-if="error"
      class="flex flex-1 items-center justify-center py-12 text-center text-sm text-error"
    >
      {{ error }}
    </p>

    <div
      v-else-if="initialized && !requests.length"
      class="flex flex-1 flex-col gap-4"
    >
      <div class="w-full text-right">
        <h1 class="text-h1 font-yb-bold leading-[1.7] text-text-primary">
          درخواست‌های شغلی
        </h1>
      </div>

      <div class="flex flex-1 flex-col items-center justify-center">
        <NoResult
          title="فرصت شغلی موجود نیست"
          description="متاسفانه هیچ فرصت شغلی جهت نمایش موجود نیست!!!"
          :icon-src="noJobIllustration"
          :icon-size="240"
          action-label="فرصت‌های شغلی"
          action-icon="svg:jobs"
          action-to="/dashboard/ad"
          action-icon-size="24"
          wrapper-class="py-0"
        />
      </div>
    </div>

    <template v-else-if="initialized && requests.length">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <span
            class="rounded-full border border-gray-default px-2 py-0.5 text-base text-text-passive"
          >
            {{ toPersianDigits(totalCount) }} درخواست
          </span>
          <h1 class="text-h1 font-yb-bold leading-[1.7] text-text-primary">
            درخواست‌های شغلی
          </h1>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="btn btn-ghost h-10 w-10 p-0"
            aria-label="جستجو"
            @click="showSearch = !showSearch"
          >
            <Icon name="svg:search-1" size="24" />
          </button>
          <NuxtLink
            to="/dashboard/ad"
            class="btn btn-success h-10 gap-2 px-4"
          >
            فرصت‌های شغلی
            <Icon name="svg:jobs" size="24" class="shrink-0 brightness-0 invert" />
          </NuxtLink>
        </div>
      </div>

      <div v-if="showSearch" class="mt-1">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="جستجو در درخواست‌ها..."
          class="h-10 w-full rounded-lg border border-gray-default bg-white px-3 text-sm outline-none focus:border-primary-500"
        />
      </div>

      <div
        class="flex flex-wrap items-center gap-6 border-b border-gray-default px-0 lg:px-6"
      >
        <button
          v-for="tab in MY_REQUEST_TABS"
          :key="tab.id"
          type="button"
          class="flex cursor-pointer items-center gap-2 border-b-2 pb-3 text-sm transition-colors"
          :class="
            activeTab === tab.id
              ? 'border-primary-500 font-semibold text-primary-500'
              : 'border-transparent font-normal text-text-primary hover:text-text-secondary'
          "
          @click="activeTab = tab.id"
        >
          <span
            v-if="tab.countBadgeClass && getMyRequestTabCount(requests, tab.id) > 0"
            class="inline-flex size-6 items-center justify-center rounded-lg text-caption font-semibold"
            :class="tab.countBadgeClass"
          >
            {{ toPersianDigits(getMyRequestTabCount(requests, tab.id)) }}
          </span>
          {{ tab.label }}
          <span
            v-if="tab.icon"
            class="inline-flex rounded-full bg-[rgba(74,74,74,0.08)] p-1"
          >
            <Icon :name="tab.icon" size="16" />
          </span>
        </button>
      </div>

      <div v-if="paginatedRequests.length" class="space-y-4">
        <MyRequestCard
          v-for="request in paginatedRequests"
          :key="request.id"
          :request="request"
          @cancel="openCancelDialog"
          @details="openDetailsModal"
          @bookmark-change="onBookmarkChange"
        />
      </div>

      <NoResult
        v-else
        title="درخواستی یافت نشد"
        description="با فیلتر یا عبارت جستجوی دیگری دوباره امتحان کنید."
        icon="svg:no-result"
        :icon-size="180"
      />

      <Pagination
        v-if="lastPage > 1"
        class="mt-2"
        :current-page="currentPage"
        :last-page="lastPage"
        @update:current-page="goToPage"
      />
    </template>

    <MyRequestDetailModal
      ref="detailModalRef"
      :request="selectedRequest"
    />

    <ConfirmDialog
      ref="confirmDialogRef"
      title="لغو درخواست"
      subtitle="آیا از لغو این درخواست مطمئن هستید؟"
      description="پس از لغو، درخواست شما از لیست حذف می‌شود."
      confirm-text="لغو درخواست"
      cancel-text="نادیده گرفتن"
      icon="svg:delete"
      @confirm="handleCancelConfirm"
      @cancel="pendingCancel = null"
    />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from '~/components/M/ConfirmDialog.vue'
import MyRequestCard from '~/components/Elements/MyRequestCard.vue'
import NoResult from '~/components/Elements/NoResult.vue'
import Pagination from '~/components/Elements/Pagination.vue'
import MyRequestDetailModal from '~/pages/dashboard/components/MyRequestDetailModal.vue'
import { toPersianDigits } from '~/composables/useCountUp'
import type { MyRequest } from '~/types/my-request'
import {
  MY_REQUEST_TABS,
  getMyRequestTabCount,
} from '~/pages/dashboard/utils/my-request'
import noJobIllustration from '~/assets/vectors/illustrations/no-job-2.svg?url'

definePageMeta({
  layout: 'dashboard',
})

useSeoMeta({
  title: 'درخواست‌های شغلی | های‌حساب',
})

const {
  requests,
  loading,
  error,
  initialized,
  activeTab,
  searchQuery,
  showSearch,
  currentPage,
  totalCount,
  paginatedRequests,
  lastPage,
  goToPage,
  cancelRequest,
  updateBookmark,
} = useMyRequests()

const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null)
const detailModalRef = ref<InstanceType<typeof MyRequestDetailModal> | null>(null)
const pendingCancel = ref<MyRequest | null>(null)
const selectedRequest = ref<MyRequest | null>(null)

function openCancelDialog(request: MyRequest) {
  pendingCancel.value = request
  confirmDialogRef.value?.showModal()
}

function openDetailsModal(request: MyRequest) {
  selectedRequest.value = request
  nextTick(() => {
    detailModalRef.value?.showModal()
  })
}

async function handleCancelConfirm() {
  if (!pendingCancel.value) return

  const requestId = pendingCancel.value.id
  try {
    await cancelRequest(requestId)
    pendingCancel.value = null
    confirmDialogRef.value?.closeModal()
  } catch (err: unknown) {
    const message =
      err && typeof err === 'object' && 'message' in err
        ? String((err as { message?: string }).message)
        : 'خطا در لغو درخواست'
    const { $toast } = useNuxtApp()
    $toast.error(message)
  }
}

function onBookmarkChange(request: MyRequest, bookmarked: boolean) {
  updateBookmark(request.id, bookmarked)
}
</script>
