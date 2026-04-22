<template>
  <buttn class="btn btn-ghost h-10 flex items-center gap-1" @click="changeMode">
    <Icon name="svg:lock-blue" />
    <span class="text-primary-500">{{
      mode === 'otp' ? 'رمز ثابت' : 'رمز یک بار مصرف'
    }}</span>
  </buttn>
</template>

<script setup lang="ts">
import type { PasswordButtonT } from '../types';

// Props
const props = defineProps({
  mode: { type: Object as () => PasswordButtonT, required: true },
});
const emits = defineEmits<{
  (e: 'onChangeMode', mode: PasswordButtonT): void;
}>();

// Functions
function changeMode() {
  emits('onChangeMode', props.mode === 'fixedPassword' ? 'otp' : 'fixedPassword');
}
</script>
