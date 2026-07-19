<template>
  <aside class="space-y-4 lg:sticky lg:top-24">
    <div class="">
      <div class="rounded-2xl border-2 border-[#A0F8D5] bg-[#F5FFFB] p-4">
        <Titr>فاکتور</Titr>

        <div class="mt-6 flex flex-col items-start justify-between text-sm">
          <span class="text-text-passive">هزینه قابل پرداخت</span>
          <span class="my-4 font-yb-bold text-lg text-[#009F65]">رایگان</span>
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

withDefaults(
  defineProps<{
    submitting?: boolean;
    savingDraft?: boolean;
    publishLabel?: string;
    showDraft?: boolean;
  }>(),
  {
    publishLabel: "انتشار آگهی",
    showDraft: true,
  },
);

const emit = defineEmits<{
  publish: [];
  "save-draft": [];
}>();
</script>
