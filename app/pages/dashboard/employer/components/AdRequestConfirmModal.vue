<template>
  <AdRequestActionModalShell
    :open="open"
    title="تایید درخواست کارجو"
    title-id="ad-request-confirm-modal-title"
    :request="request"
    :loading="loading"
    @update:open="emit('update:open', $event)"
  >
    <template #actions>
      <button
        type="button"
        class="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#FDECEB] text-sm font-semibold text-[#EF4035] transition-opacity hover:opacity-90 disabled:opacity-60"
        :disabled="loading"
        @click="emit('update:open', false)"
      >
        <Icon name="material-symbols:close-rounded" size="18" />
        نادیده گرفتن
      </button>

      <button
        type="button"
        class="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#009F65] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        :disabled="loading"
        @click="emit('confirm')"
      >
        <Icon name="lucide:check-check" size="18" />
        تایید درخواست
      </button>
    </template>
  </AdRequestActionModalShell>
</template>

<script setup lang="ts">
import AdRequestActionModalShell from "./AdRequestActionModalShell.vue";
import type { EmployerAdRequest } from "~/types/employer-ad-request";

defineProps<{
  open: boolean;
  request: EmployerAdRequest | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  confirm: [];
}>();
</script>
