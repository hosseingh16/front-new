<template>
  <div>
    <p class="mt-2 text-base">
      تایید شماره همراه <span class="font-semibold">09020124020</span>
    </p>

    <OtpInput v-model="model" />

    <OtpButton />
  </div>
</template>

<script setup lang="ts">
import OtpButton from './OtpButton.vue';
import OtpInput from './OtpInput.vue';

definePageMeta({
  layout: 'auth',
});

// Model
const model = defineModel({ default: ['', '', '', '', ''] });

// Variables
const showResend = ref(false);
const interval = ref<any>(null);
const time = reactive({
  m: 1,
  s: 10,
});

// Functions
function setCountDownTimer() {
  time.m = 1;
  time.s = 10;
  interval.value = setInterval(() => {
    showResend.value = false;
    if (time.m >= 0 && time.s >= 0) {
      if (time.s > 0) {
        time.s--;
      } else {
        if (time.m === 0 && time.s === 0) {
          showResend.value = true;
          clearInterval(interval.value);
        } else {
          time.s = 10;
          time.m--;
        }
      }
    }
  }, 1000);
}

function resendCode() {
  setCountDownTimer();
}

//
onMounted(() => {
  setCountDownTimer();
});

onUnmounted(() => {
  clearInterval(interval.value);
});
</script>
