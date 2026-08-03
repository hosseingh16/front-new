<template>
  <div>
    <p class="mt-2 text-base">
      تایید شماره همراه
      <span class="font-semibold">{{ mobile || '—' }}</span>
    </p>

    <OtpInput v-model="model" @complete="emit('complete', $event)" />

    <OtpButton :loading="loading" @resend="emit('resend')" />
  </div>
</template>

<script setup lang="ts">
import OtpButton from './OtpButton.vue';
import OtpInput from './OtpInput.vue';

const model = defineModel({ default: ['', '', '', '', ''] });

defineProps<{
  mobile?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'resend'): void;
  (e: 'complete', otp: string): void;
}>();
</script>
