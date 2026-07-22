<template>
  <div class="overflow-hidden rounded-2xl border border-gray-default bg-white">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr class="border-b border-gray-default bg-surface-50 text-text-passive">
            <th class="px-4 py-3 text-right font-semibold whitespace-nowrap">
              نوع فعالیت
            </th>
            <th class="px-4 py-3 text-right font-semibold whitespace-nowrap">
              وضعیت
            </th>
            <th class="px-4 py-3 text-left font-semibold whitespace-nowrap" />
          </tr>
        </thead>

        <tbody v-if="loading">
          <tr v-for="n in 3" :key="`skeleton-${n}`">
            <td class="px-4 py-4">
              <div class="h-4 w-24 animate-pulse rounded bg-surface-200" />
            </td>
            <td class="px-4 py-4">
              <div class="h-7 w-20 animate-pulse rounded-lg bg-surface-200" />
            </td>
            <td class="px-4 py-4">
              <div class="ms-auto h-9 w-40 animate-pulse rounded-lg bg-surface-200" />
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="items.length">
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-b border-gray-default last:border-b-0 hover:bg-surface-50"
          >
            <td class="px-4 py-4 font-semibold text-text-tertiary">
              {{ item.activity_type || '—' }}
            </td>
            <td class="px-4 py-4">
              <TaxReturnStatusBadge :status="item.status" />
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center justify-end gap-3">
                <button
                  v-if="canCancelTaxReturn(item.status)"
                  type="button"
                  class="flex items-center gap-1 text-sm font-semibold text-[#EF4035] transition-opacity hover:opacity-80"
                  @click="emit('cancel', item)"
                >
                  <Icon name="lucide:x" size="16" />
                  لغو درخواست
                </button>

                <NuxtLink
                  :to="`/dashboard/tax-returns/${item.id}`"
                  class="inline-flex h-9 items-center gap-1 rounded-lg bg-[#EEF1FC] px-3 text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80"
                >
                  جزئیات
                  <Icon name="lucide:chevron-left" size="16" />
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <NoResult
      v-if="!loading && initialized && !items.length"
      title="درخواستی ثبت نشده است"
      description="در حال حاضر هیچ درخواست اظهارنامه‌ای برای نمایش وجود ندارد."
      icon="svg:no-result"
      :icon-size="180"
      action-label="ثبت درخواست جدید"
      action-icon="lucide:file-plus-corner"
      action-to="/dashboard/tax-returns/create"
    />
  </div>
</template>

<script setup lang="ts">
import NoResult from '~/components/Elements/NoResult.vue'
import type { TaxReturnListItem } from '~/types/tax-return'
import { canCancelTaxReturn } from '../utils/tax-return-status'
import TaxReturnStatusBadge from './TaxReturnStatusBadge.vue'

defineProps<{
  items: TaxReturnListItem[]
  loading?: boolean
  initialized?: boolean
}>()

const emit = defineEmits<{
  cancel: [item: TaxReturnListItem]
}>()
</script>
