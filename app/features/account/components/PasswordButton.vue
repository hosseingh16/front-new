<template>
  <button
    type="button"
    class="btn btn-ghost h-10 flex items-center gap-1"
    @click="changeMode"
  >
    <Icon name="svg:lock-blue" />
    <span class="text-primary-500">{{
      mode === 'otp' ? 'رمز ثابت' : 'رمز یک بار مصرف'
    }}</span>
  </button>
</template>

<script setup lang="ts">
import type { PasswordButtonT } from '../types';

const props = defineProps<{
  mode: PasswordButtonT;
}>();

const emits = defineEmits<{
  (e: 'onChangeMode', mode: PasswordButtonT): void;
}>();

function changeMode() {
  emits('onChangeMode', props.mode === 'fixedPassword' ? 'otp' : 'fixedPassword');
}
</script>
