<template>
  <aside class="space-y-4 lg:sticky lg:top-24">
    <div class="rounded-2xl border-2 border-gray-default bg-white p-4">
      <p class="font-yb-bold text-xl">
        <span class="text-primary-500">-</span> فاکتور
      </p>

      <div class="mt-6 flex items-center justify-between text-sm">
        <span class="text-text-passive">هزینه قابل پرداخت</span>
        <span class="font-yb-bold text-lg text-[#009F65]">رایگان</span>
      </div>

      <button
        type="button"
        class="btn btn-success mt-6 h-11 w-full rounded-lg font-yb-bold"
        :disabled="submitting"
        @click="emit('publish')"
      >
        <span v-if="submitting">در حال انتشار...</span>
        <span v-else>انتشار آگهی</span>
      </button>

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
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  submitting?: boolean
  savingDraft?: boolean
}>()

const emit = defineEmits<{
  publish: []
  'save-draft': []
}>()
</script>
