<template>
  <div class="mt-1.5 flex flex-wrap items-center justify-start gap-3">
    <div v-if="showResendButton" class="flex items-center">
      <button
        type="button"
        class="btn btn-info btn-soft text-primary-500 h-8"
        @click="resendCode"
      >
        <Icon name="svg:refresh" />
        <span class="mr-1 text-sm">ارسال مجدد کد</span>
      </button>
    </div>
    <div
      v-else-if="showResendCountdown"
      class="text-xs text-[#4A4A4A]"
      aria-live="polite"
    >
      ارسال مجدد کد تا {{ formatted }}
    </div>

    <button
      v-if="showVoiceButton"
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
const { otpVoiceDelaySeconds } = useSettings();

const props = defineProps<{
  loading?: boolean;
  voiceDisabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'resend'): void;
  (e: 'voice'): void;
}>();

// Driven entirely by what the server reported on the last OTP response, so a
// remount or a step change cannot hand the user a fresh minute they have not
// actually earned. A rate-limited send only stretches this countdown; saying so
// is left to the toast.
const { resendRemaining, canResend, sinceSent } = useOtpCountdown();

const voiceRemaining = computed(() =>
  sinceSent.value === null
    ? otpVoiceDelaySeconds.value
    : Math.max(0, otpVoiceDelaySeconds.value - sinceSent.value),
);
// Nothing sent yet means there is no code to read out over the phone.
const voiceAvailable = computed(
  () => sinceSent.value !== null && voiceRemaining.value <= 0,
);
const showVoiceButton = computed(() => voiceAvailable.value || !!props.voiceDisabled);
const isVoiceInactive = computed(
  () => props.loading || props.voiceDisabled || !voiceAvailable.value,
);
const formatted = computed(() => formatOtpClock(resendRemaining.value));
const hasActiveCode = computed(() => sinceSent.value !== null);
const showResendButton = computed(
  () => hasActiveCode.value && canResend.value && !props.loading,
);
const showResendCountdown = computed(
  () => hasActiveCode.value && !canResend.value && !props.loading,
);
const voiceLabel = computed(() => {
  if (props.voiceDisabled) return 'تماس صوتی ارسال شد';
  return 'دریافت کد با تماس';
});

function resendCode() {
  if (!showResendButton.value) return;
  emit('resend');
}
</script>
