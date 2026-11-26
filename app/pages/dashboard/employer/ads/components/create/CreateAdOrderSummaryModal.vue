<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      class="modal"
      dir="rtl"
      aria-labelledby="ad-order-summary-title"
      @cancel.prevent
      @click="onBackdropClick"
      @close="onDialogClose"
    >
      <div
        class="modal-box relative w-[calc(100%-2rem)] max-w-[440px] overflow-hidden rounded-2xl bg-white p-5 sm:p-6"
        @click.stop
      >
        <div class="relative flex items-start justify-between gap-3">
          <div class="flex items-center gap-2">
            <span
              class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
              aria-hidden="true"
            />
            <h2
              id="ad-order-summary-title"
              class="font-yb-bold text-base text-text-primay"
            >
              خلاصه سفارش
            </h2>
            <Icon name="svg:bag-1" size="22" class="text-primary-500" />
          </div>

          <button
            type="button"
            class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-passive transition-opacity hover:opacity-80"
            aria-label="بستن"
            @click="close"
          >
            <Icon name="material-symbols:close" size="20" />
          </button>
        </div>

        <div class="mt-5 space-y-1.5 text-sm text-text-tertiary">
          <p>
            {{ subjectLabel }}:
            <span class="font-semibold text-text-primary">{{ subjectTitle }}</span>
          </p>
          <p>
            مبلغ {{ subjectLabel }}:
            <span class="font-semibold text-text-primary">
              {{ formatAmount(displayOriginalPrice) }} تومان
            </span>
          </p>
        </div>

        <!-- Coupon input (before apply) -->
        <div v-if="!appliedCoupon" class="mt-6">
          <p class="mb-2 text-sm font-semibold text-text-primary">
            کد تخفیف دارید ؟
          </p>

          <div class="flex items-stretch gap-2">
            <label
              class="input flex min-w-0 flex-1 items-center gap-2 rounded-lg border-gray-default shadow-none"
              :class="
                couponError
                  ? 'border-danger-200'
                  : 'focus-within:border-[#cccccc]'
              "
            >
              <Icon
                name="lucide:ticket"
                size="18"
                class="shrink-0 text-text-passive"
              />
              <input
                v-model="couponCode"
                type="text"
                class="w-full border-0 bg-transparent p-0 text-sm shadow-none outline-none placeholder:text-gray-default"
                placeholder="کد تخفیف خود را وارد کنید"
                :disabled="checkingCoupon || submitting || !itemId"
                @keydown.enter.prevent="applyCoupon"
              />
            </label>

            <button
              type="button"
              class="btn h-auto shrink-0 rounded-lg border-0 bg-surface-200 px-3 text-xs font-semibold text-text-tertiary disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
              :disabled="!canApplyCoupon || checkingCoupon || submitting || !itemId"
              @click="applyCoupon"
            >
              <span v-if="checkingCoupon">در حال بررسی...</span>
              <span v-else>اعمال کد تخفیف</span>
            </button>
          </div>

          <p v-if="couponError" class="mt-1.5 text-xs text-danger-500">
            {{ couponError }}
          </p>
        </div>

        <!-- Applied coupon success state -->
        <div v-else class="mt-6 space-y-4">
          <div
            class="flex items-center justify-between gap-3 rounded-2xl bg-[#E7F7F0] px-3 py-2.5"
          >
            <div class="flex min-w-0 items-center gap-2.5">
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0EA972] text-white"
                aria-hidden="true"
              >
                <Icon name="lucide:check-check" size="16" />
              </span>
              <span class="truncate text-sm font-semibold text-[#0B7A55]">
                کد تخفیف با موفقیت اعمال شد
              </span>
            </div>

            <button
              type="button"
              class="flex shrink-0 items-center gap-1.5 rounded-full bg-[#D8F3E7] px-2.5 py-1 text-xs font-semibold text-[#0B7A55] transition-opacity hover:opacity-80 disabled:opacity-60"
              :disabled="removingCoupon || submitting"
              aria-label="حذف کد تخفیف"
              @click="removeCoupon"
            >
              <Icon
                name="material-symbols:close"
                size="14"
                class="text-[#5B6B73]"
              />
              <span dir="ltr">{{ appliedCoupon }}</span>
            </button>
          </div>

          <div class="space-y-2 text-sm">
            <p class="text-text-tertiary">
              مبلغ {{ subjectLabel }}:
              <span class="font-semibold text-text-primary">
                {{ formatAmount(displayOriginalPrice) }} تومان
              </span>
            </p>
            <p class="font-semibold">
              {{ discountLabel }}:
              <span class="text-[#0EA972]">
                {{ formatAmount(discountAmount) }} تومان
              </span>
            </p>
          </div>
        </div>

        <div
          class="mt-6 rounded-xl px-4 py-3 text-center font-yb-bold text-sm sm:text-base"
          :class="
            appliedCoupon
              ? 'bg-[#E8F8F1] text-[#0EA972]'
              : 'bg-[#4864E114] text-primary-500'
          "
        >
          <template v-if="isFree">مبلغ قابل پرداخت: رایگان</template>
          <template v-else>
            مبلغ قابل پرداخت:
            {{ formatAmount(payableAmount) }} تومان
          </template>
        </div>

        <button
          type="button"
          class="btn btn-primary mt-4 h-12 w-full gap-2 rounded-xl font-yb-bold"
          :disabled="submitting || checkingCoupon || removingCoupon || !paymentId"
          @click="confirm"
        >
          <span v-if="submitting">در حال ثبت...</span>
          <template v-else>
            <span>{{ isFree ? `انتشار ${subjectLabel}` : `پرداخت و انتشار ${subjectLabel}` }}</span>
            <Icon name="lucide:chevron-left" size="18" />
          </template>
        </button>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import type { ApiResponse } from '~/types/api'
import { getApiErrorMessage } from '~/utils/api-error'
import type { AdCheckoutContext } from '~/composables/useCreateAdForm'

type CheckoutContext = AdCheckoutContext & {
  projectId?: number | string
}

const props = withDefaults(
  defineProps<{
    adTitle?: string
    subjectLabel?: string
    checkoutType?: 'ad' | 'project'
    submitting?: boolean
  }>(),
  {
    adTitle: '',
    subjectLabel: 'آگهی',
    checkoutType: 'ad',
    submitting: false,
  },
)

const subjectTitle = computed(
  () => props.adTitle || (props.checkoutType === 'project' ? 'پروژه' : 'آگهی استخدام'),
)

const emit = defineEmits<{
  confirm: [paymentId: number, free: boolean]
}>()

const api = useApi()
const { $toast } = useNuxtApp()

const dialogRef = ref<HTMLDialogElement | null>(null)
const itemId = ref<number | string | null>(null)
const paymentId = ref<number | null>(null)
const originalPrice = ref(0)
const couponCode = ref('')
const appliedCoupon = ref<string | null>(null)
const couponError = ref('')
const checkingCoupon = ref(false)
const removingCoupon = ref(false)
const discountedPayable = ref<number | null>(null)
const discountAmount = ref(0)
const discountPercent = ref<number | null>(null)

const canApplyCoupon = computed(() => couponCode.value.trim().length > 0)

const displayOriginalPrice = computed(() => originalPrice.value)

const payableAmount = computed(() =>
  discountedPayable.value != null
    ? Math.max(0, discountedPayable.value)
    : originalPrice.value,
)

const isFree = computed(() => payableAmount.value <= 0)

const discountLabel = computed(() => {
  if (discountPercent.value != null && discountPercent.value > 0) {
    return `تخفیف ${discountPercent.value.toLocaleString('fa-IR')}٪`
  }
  return 'تخفیف'
})

function formatAmount(value: number) {
  return value.toLocaleString('fa-IR')
}

function resetCouponState() {
  couponCode.value = ''
  appliedCoupon.value = null
  couponError.value = ''
  discountedPayable.value = null
  discountAmount.value = 0
  discountPercent.value = null
  checkingCoupon.value = false
  removingCoupon.value = false
}

function open(context: CheckoutContext) {
  resetCouponState()
  itemId.value = context.projectId ?? context.adId
  paymentId.value = context.paymentId
  originalPrice.value = context.price
  dialogRef.value?.showModal()
}

function close() {
  if (props.submitting || checkingCoupon.value || removingCoupon.value) return
  dialogRef.value?.close()
}

function onDialogClose() {
  resetCouponState()
  itemId.value = null
  paymentId.value = null
  originalPrice.value = 0
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialogRef.value) event.preventDefault()
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function unwrapPayload(
  result: ApiResponse<Record<string, unknown>> | Record<string, unknown>,
): Record<string, unknown> | null {
  if (!result || typeof result !== 'object') return null
  if ('data' in result) {
    const data = (result as ApiResponse<Record<string, unknown>>).data
    return data && typeof data === 'object'
      ? (data as Record<string, unknown>)
      : null
  }
  return result as Record<string, unknown>
}

function paymentFromPayload(payload: Record<string, unknown> | null) {
  if (!payload) return null
  if (payload.payment && typeof payload.payment === 'object') {
    return payload.payment as Record<string, unknown>
  }
  return payload
}

function resolveDiscountedPayable(payment: Record<string, unknown> | null) {
  if (!payment) return null
  return (
    readNumber(payment.payable_price) ??
    readNumber(payment.price) ??
    readNumber(payment.final_price) ??
    readNumber(payment.amount)
  )
}

function resolveDiscountMeta(
  payload: Record<string, unknown> | null,
  payment: Record<string, unknown> | null,
  nextPayable: number,
) {
  const original =
    readNumber(payment?.original_price) ??
    originalPrice.value

  const discount =
    readNumber(payment?.discount) ??
    Math.max(0, original - nextPayable)

  const coupon =
    payload?.coupon && typeof payload.coupon === 'object'
      ? (payload.coupon as Record<string, unknown>)
      : null

  const percentFromCoupon =
    readNumber(coupon?.percentage) ?? readNumber(coupon?.percent)

  const percent =
    percentFromCoupon ??
    (original > 0 ? Math.round((discount / original) * 100) : null)

  return {
    original,
    discount,
    percent: percent != null && percent > 0 ? percent : null,
  }
}

async function applyCoupon() {
  const code = couponCode.value.trim()
  if (!code || checkingCoupon.value || itemId.value == null) return

  checkingCoupon.value = true
  couponError.value = ''
  appliedCoupon.value = null
  discountedPayable.value = null
  discountAmount.value = 0
  discountPercent.value = null

  try {
    const result = await api.post<
      ApiResponse<Record<string, unknown>> | Record<string, unknown>
    >(`/coupons-check/${encodeURIComponent(code)}`, {
      type: props.checkoutType,
      id: Number(itemId.value),
      payment_id: paymentId.value ?? undefined,
    })

    const payload = unwrapPayload(result)
    const payment = paymentFromPayload(payload)
    const nextPayable = resolveDiscountedPayable(payment)

    if (nextPayable == null) {
      couponError.value = 'کد تخفیف معتبر نیست'
      return
    }

    const meta = resolveDiscountMeta(payload, payment, nextPayable)
    if (meta.original > 0) originalPrice.value = meta.original

    discountedPayable.value = nextPayable
    discountAmount.value = meta.discount
    discountPercent.value = meta.percent
    appliedCoupon.value =
      (payload?.coupon &&
      typeof payload.coupon === 'object' &&
      typeof (payload.coupon as { code?: unknown }).code === 'string'
        ? (payload.coupon as { code: string }).code
        : code)

    const nextPaymentId = readNumber(
      payment?.payment_id ?? payment?.id ?? payload?.payment_id,
    )
    if (nextPaymentId != null) paymentId.value = nextPaymentId
  } catch (err: unknown) {
    couponError.value = getApiErrorMessage(err, 'کد تخفیف معتبر نیست')
  } finally {
    checkingCoupon.value = false
  }
}

async function removeCoupon() {
  if (!appliedCoupon.value || removingCoupon.value || paymentId.value == null) {
    return
  }

  removingCoupon.value = true
  try {
    await api.post(
      `/coupons-check/${encodeURIComponent(appliedCoupon.value)}`,
      {
        type: props.checkoutType,
        id: itemId.value != null ? Number(itemId.value) : undefined,
        payment_id: paymentId.value,
        remove: true,
      },
    )

    couponCode.value = ''
    appliedCoupon.value = null
    discountedPayable.value = null
    discountAmount.value = 0
    discountPercent.value = null
    couponError.value = ''
  } catch (err: unknown) {
    $toast.error(getApiErrorMessage(err, 'حذف کد تخفیف با خطا مواجه شد'))
  } finally {
    removingCoupon.value = false
  }
}

function confirm() {
  if (
    props.submitting ||
    checkingCoupon.value ||
    removingCoupon.value ||
    paymentId.value == null
  ) {
    return
  }
  emit('confirm', paymentId.value, isFree.value)
}

defineExpose({ open })
</script>
