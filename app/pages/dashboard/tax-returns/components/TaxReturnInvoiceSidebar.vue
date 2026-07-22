<template>
  <aside class="space-y-4 lg:sticky lg:top-24">
    <div class="rounded-2xl border-2 border-[#A0F8D5] bg-[#F5FFFB] p-4">
      <Titr>فاکتور</Titr>

      <div class="mt-6 flex flex-col items-start text-sm">
        <span class="text-text-passive">هزینه قابل پرداخت:</span>
        <span class="my-4 font-yb-bold text-2xl text-[#009F65]">
          {{ formattedPrice }}
        </span>
      </div>

      <div
        class="flex items-start gap-2 rounded-xl border border-[#F5E6C8] bg-[#FFF8EB] p-3 text-xs leading-6 text-text-tertiary"
      >
        <Icon
          name="lucide:info"
          size="16"
          class="mt-0.5 shrink-0 text-[#C9A227]"
        />
        <p>
          این مبلغ بابت بررسی اولیه درخواست و اتصال شما به حسابدار دریافت
          می‌شود. هزینه نهایی خدمات به‌صورت جداگانه با حسابدار توافق خواهد شد.
        </p>
      </div>

      <button
        type="button"
        class="btn btn-success mt-6 h-11 w-full rounded-lg font-yb-bold disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canSubmit || submitting"
        @click="emit('submit')"
      >
        <span v-if="submitting">در حال ثبت...</span>
        <span v-else>پرداخت و ثبت درخواست</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import { TAX_RETURN_PAYABLE_PRICE } from '~/types/tax-return-form'
import { formatPayablePrice } from '~/utils/tax-return-payload'

withDefaults(
  defineProps<{
    submitting?: boolean
    canSubmit?: boolean
  }>(),
  {
    submitting: false,
    canSubmit: false,
  },
)

const emit = defineEmits<{
  submit: []
}>()

const formattedPrice = formatPayablePrice(TAX_RETURN_PAYABLE_PRICE)
</script>
