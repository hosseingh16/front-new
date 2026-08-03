<template>
  <div class="mt-2">
    <div v-if="showResend" class="flex justify-end items-center">
      <button
        type="button"
        class="btn btn-info btn-soft text-primary-500 h-8"
        :disabled="loading"
        @click="resendCode"
      >
        <span v-if="loading" class="loading loading-spinner loading-xs" />
        <Icon v-else name="svg:refresh" />
        <span class="mr-1 text-sm">ارسال مجدد کد</span>
      </button>
    </div>
    <div v-else class="text-left text-sm text-[#4A4A4A]" aria-live="polite">
      <span>ارسال مجدد کد تا {{ formatted }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const TOTAL_SECONDS = 70; // 1:10

defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'resend'): void;
}>();

const remaining = ref(TOTAL_SECONDS);
const showResend = computed(() => remaining.value <= 0);
const formatted = computed(() => {
  const m = Math.floor(remaining.value / 60);
  const s = remaining.value % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

let timer: ReturnType<typeof setInterval> | null = null;

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startCountdown() {
  clearTimer();
  remaining.value = TOTAL_SECONDS;
  timer = setInterval(() => {
    if (remaining.value <= 1) {
      remaining.value = 0;
      clearTimer();
      return;
    }
    remaining.value--;
  }, 1000);
}

function resendCode() {
  if (showResend.value === false) return;
  emit('resend');
  startCountdown();
}

onMounted(startCountdown);
onUnmounted(clearTimer);

defineExpose({ startCountdown });
</script>
