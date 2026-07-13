<template>
  <AdRequestActionModalShell
    :open="open"
    title="تعیین علت رد کارجو"
    title-id="ad-request-reject-modal-title"
    :request="request"
    :loading="loading"
    @update:open="handleOpenChange"
  >
    <div class="ad-request-reject-select">
      <m-select2
        v-model="selectedReason"
        label="انتخاب علت رد:"
        :options="rejectReasons"
        placeholder="علت رد این رزومه را انتخاب کنید"
        :disabled="reasonsLoading"
        :error="showReasonError"
      />
    </div>
    <p v-if="showReasonError" class="mt-1 text-xs text-[#EF4035]">
      لطفا علت رد را انتخاب کنید
    </p>

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
        class="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#EF4035] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        :disabled="loading"
        @click="handleReject"
      >
        <Icon name="material-symbols:close-rounded" size="18" />
        رد درخواست
      </button>
    </template>
  </AdRequestActionModalShell>
</template>

<script setup lang="ts">
import AdRequestActionModalShell from "./AdRequestActionModalShell.vue";
import { useAdRequestRejectReasons } from "~/composables/useAdRequestRejectReasons";
import type { EmployerAdRequest } from "~/types/employer-ad-request";

const props = defineProps<{
  open: boolean;
  request: EmployerAdRequest | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  confirm: [reason: string | number];
}>();

const { reasons: rejectReasons, loading: reasonsLoading } =
  useAdRequestRejectReasons();

const selectedReason = ref<string | number | undefined>();
const reasonTouched = ref(false);

const showReasonError = computed(
  () => reasonTouched.value && selectedReason.value == null,
);

function resetForm() {
  selectedReason.value = undefined;
  reasonTouched.value = false;
}

function handleOpenChange(value: boolean) {
  if (!value) resetForm();
  emit("update:open", value);
}

function handleReject() {
  reasonTouched.value = true;
  if (selectedReason.value == null) return;
  emit("confirm", selectedReason.value);
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) resetForm();
  },
);
</script>

<style scoped>
.ad-request-reject-select :deep(.menu) {
  z-index: 50;
  max-height: 12.5rem;
}
</style>
