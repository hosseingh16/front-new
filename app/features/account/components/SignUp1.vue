<template>
  <div>
    <p class="mt-4 text-2xl sm:text-h1 font-yb-bold">احراز هویت</p>

    <div class="flex justify-end items-center flex-wrap gap-2">
      <p class="mt-2 text-base">
        تایید شماره همراه <span class="font-semibold">09020124020</span>
      </p>
      <OtpButton />
    </div>

    <OtpInput :code-prop="model" @code="model = $event" />
  </div>
</template>

<script setup lang="ts">
import OtpButton from '~/features/account/components/OtpButton.vue';
import OtpInput from '~/features/account/components/OtpInput.vue';

// Model
const model = defineModel({ default: '' });
</script>
