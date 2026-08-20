<template>
  <aside class="space-y-4 lg:sticky lg:top-24">
    <div class="">
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
          @click="emit('publish')"
        >
          <span v-if="submitting">در حال انتشار...</span>
          <span v-else>{{ publishLabel }}</span>
        </button>
      </div>

      <div v-if="showDraft" class="px-4">
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
  </aside>
</template>

<script setup lang="ts">
import Titr from "~/features/panel/cv/Titr.vue";

const props = withDefaults(
  defineProps<{
    submitting?: boolean;
    savingDraft?: boolean;
    publishLabel?: string;
    showDraft?: boolean;
    payableAmount?: number;
  }>(),
  {
    publishLabel: "انتشار آگهی",
    showDraft: true,
    payableAmount: 0,
  },
);

const emit = defineEmits<{
  publish: [];
  "save-draft": [];
}>();

const formattedPayableAmount = computed(() =>
  props.payableAmount.toLocaleString("en-US"),
);
</script>
