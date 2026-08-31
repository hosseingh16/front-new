<template>
  <div class="mt-2 flex flex-col items-end gap-2">
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

    <button
      type="button"
      class="btn btn-ghost h-8 px-2"
      :class="
        isVoiceInactive
          ? 'cursor-not-allowed text-text-passive opacity-60'
          : 'text-primary-500'
      "
      :disabled="isVoiceInactive"
      @click="emit('voice')"
    >
      <Icon name="svg:mobile" :class="isVoiceInactive ? 'opacity-50' : 'opacity-70'" />
      <span class="mr-1 text-sm">{{ voiceLabel }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const TOTAL_SECONDS = 70; // 1:10
const VOICE_DELAY_SECONDS = 20;

const props = defineProps<{
  loading?: boolean;
  voiceDisabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'resend'): void;
  (e: 'voice'): void;
}>();

const remaining = ref(TOTAL_SECONDS);
const voiceRemaining = ref(VOICE_DELAY_SECONDS);
const showResend = computed(() => remaining.value <= 0);
const voiceAvailable = computed(() => voiceRemaining.value <= 0);
const isVoiceInactive = computed(
  () => props.loading || props.voiceDisabled || !voiceAvailable.value,
);
const formatted = computed(() => {
  const m = Math.floor(remaining.value / 60);
  const s = remaining.value % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});
const voiceLabel = computed(() => {
  if (props.voiceDisabled) return 'تماس صوتی ارسال شد';
  if (!voiceAvailable.value) {
    return `دریافت کد با تماس تا ${voiceRemaining.value} ثانیه دیگر`;
  }
  return 'دریافت کد با تماس';
});

let timer: ReturnType<typeof setInterval> | null = null;

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function tickCountdowns() {
  if (remaining.value > 0) {
    remaining.value--;
  }

  if (voiceRemaining.value > 0) {
    voiceRemaining.value--;
  }

  if (remaining.value <= 0 && voiceRemaining.value <= 0) {
    clearTimer();
  }
}

function startCountdown() {
  clearTimer();
  remaining.value = TOTAL_SECONDS;
  voiceRemaining.value = VOICE_DELAY_SECONDS;
  timer = setInterval(tickCountdowns, 1000);
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
