<template>
  <aside class="space-y-4 lg:sticky lg:top-24">
    <div>
      <div class="rounded-2xl border-2 border-success-outline bg-success-soft p-4">
        <Titr>فاکتور</Titr>

        <div class="mt-6 flex flex-col items-start justify-between text-sm">
          <span class="text-text-passive">هزینه قابل پرداخت</span>
          <div v-if="payableAmount > 0" class="flex items-center">
            <span class="my-4 font-yb-bold text-lg text-success-500">
              {{ formattedPayableAmount }}
            </span>
            <small class="mx-1 text-success-500">تومان</small>
          </div>
          <span v-else class="my-4 font-yb-bold text-lg text-success-500">
            رایگان
          </span>
        </div>

        <button
          type="button"
          class="btn btn-success mt-6 h-11 w-full rounded-lg font-yb-bold"
          :disabled="submitting"
          @click="onPublishClick"
        >
          <span v-if="submitting">در حال انتشار...</span>
          <span v-else>انتشار پروژه</span>
        </button>
      </div>

      <div class="px-4">
        <button
          type="button"
          class="btn mt-3 h-11 w-full rounded-lg border-2 border-gray-default bg-white font-semibold text-text-tertiary"
          :disabled="savingDraft"
          @click="emit('save-draft')"
        >
          <span v-if="savingDraft">در حال ذخیره...</span>
          <span v-else>ذخیره و پیش‌نویس</span>
        </button>
      </div>
    </div>

    <CreateAdOrderSummaryModal
      ref="orderSummaryModalRef"
      checkout-type="project"
      subject-label="پروژه"
      :ad-title="projectTitle"
      :submitting="submitting"
      @confirm="onOrderConfirm"
    />
  </aside>
</template>

<script setup lang="ts">
import Titr from "~/features/panel/cv/Titr.vue";
import CreateAdOrderSummaryModal from "~/pages/dashboard/employer/ads/components/create/CreateAdOrderSummaryModal.vue";
import type { ProjectCheckoutContext } from "~/composables/useCreateProjectForm";

const props = withDefaults(
  defineProps<{
    submitting?: boolean;
    savingDraft?: boolean;
    payableAmount?: number;
    projectTitle?: string;
    prepareCheckout?: () => Promise<ProjectCheckoutContext | null>;
  }>(),
  {
    payableAmount: 0,
    projectTitle: "پروژه",
  },
);

const emit = defineEmits<{
  publish: [];
  "save-draft": [];
  "go-to-payment": [paymentId: number, free: boolean];
}>();

const orderSummaryModalRef =
  ref<InstanceType<typeof CreateAdOrderSummaryModal> | null>(null);

const formattedPayableAmount = computed(() =>
  props.payableAmount.toLocaleString("en-US"),
);

async function onPublishClick() {
  if (props.submitting) return;

  if (props.payableAmount <= 0) {
    emit("publish");
    return;
  }

  if (!props.prepareCheckout) {
    emit("publish");
    return;
  }

  const checkout = await props.prepareCheckout();
  if (!checkout) return;

  orderSummaryModalRef.value?.open(checkout);
}

function onOrderConfirm(paymentId: number, free = false) {
  emit("go-to-payment", paymentId, free);
}
</script>
