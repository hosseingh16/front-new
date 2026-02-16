<template>
  <div class="mt-2">
    <div v-if="showResend" class="flex justify-end items-center">
      <button class="btn btn-info btn-soft text-primary-900 h-8" @click="resendCode">
        <Icon name="svg:refresh" />
        <span class="mr-1 text-sm">ارسال مجدد کد</span>
      </button>
    </div>
    <div v-else class="text-left text-sm text-[#4A4A4A]">
      <span
        >ارسال مجدد کد {{ time.m.toString().padStart(2, '0') }}:{{
          time.s.toString().padStart(2, '0')
        }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
// Parameters
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
