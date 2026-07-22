<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="font-yb-bold text-lg text-text-tertiary md:text-xl">
        درخواست‌های اظهارنامه
      </h1>

      <NuxtLink
        to="/dashboard/tax-returns/create"
        class="inline-flex h-10 items-center gap-2 rounded-xl bg-[#EEF1FC] px-4 text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80"
      >
        <Icon name="lucide:briefcase" size="16" />
        ثبت درخواست جدید
      </NuxtLink>
    </div>

    <p v-if="error" class="mt-6 py-12 text-center text-sm text-error">
      {{ error }}
    </p>

    <template v-else>
      <TaxReturnListTable
        class="mt-6"
        :items="items"
        :loading="loading"
        :initialized="initialized"
        @cancel="openCancelDialog"
        @detail="openDetailModal"
      />

      <Pagination
        v-if="initialized && lastPage > 1"
        class="mt-6"
        :current-page="currentPage"
        :last-page="lastPage"
        @update:current-page="goToPage"
      />
    </template>

    <ConfirmDialog
      ref="confirmDialogRef"
      title="لغو درخواست"
      subtitle="آیا از لغو این درخواست مطمئن هستید؟"
      description="پس از لغو، وضعیت درخواست به لغو شده تغییر می‌کند."
      confirm-text="لغو درخواست"
      cancel-text="انصراف"
      icon="svg:delete"
      @confirm="handleCancelConfirm"
      @cancel="pendingCancel = null"
    />

    <TaxReturnDetailModal ref="detailModalRef" />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from '~/components/M/ConfirmDialog.vue'
import Pagination from '~/components/Elements/Pagination.vue'
import type { TaxReturnListItem } from '~/types/tax-return'
import TaxReturnDetailModal from './components/TaxReturnDetailModal.vue'
import TaxReturnListTable from './components/TaxReturnListTable.vue'

definePageMeta({
  layout: 'dashboard',
})

useSeoMeta({
  title: 'درخواست‌های اظهارنامه',
})

const { $toast } = useNuxtApp()

const {
  items,
  loading,
  error,
  initialized,
  currentPage,
  lastPage,
  goToPage,
} = useTaxReturns()

const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null)
const detailModalRef = ref<InstanceType<typeof TaxReturnDetailModal> | null>(
  null,
)
const pendingCancel = ref<TaxReturnListItem | null>(null)

function openCancelDialog(item: TaxReturnListItem) {
  pendingCancel.value = item
  confirmDialogRef.value?.showModal()
}

function openDetailModal(item: TaxReturnListItem) {
  detailModalRef.value?.open(item.id)
}

function handleCancelConfirm() {
  pendingCancel.value = null
  confirmDialogRef.value?.closeModal()
  $toast.error('لغو درخواست در حال حاضر در دسترس نیست')
}
</script>
