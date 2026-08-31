<template>
  <DaisyCard class="w-full min-[560px]:w-140">
    <Icon
      name="svg:chevron-right"
      class="cursor-pointer"
      @click="emits('onChangeStep')"
    />

    <p class="mt-12 text-2xl sm:text-h1 font-yb-bold">ورود به حساب کاربری</p>

    <div v-if="mode === 'fixedPassword'">
      <m-text-field
        v-model="password"
        label="رمز عبور:"
        placeholder="رمز عبور را وارد کنید"
        :type="showPass ? 'text' : 'password'"
      >
        <template #prefix><Icon name="svg:lock" size="24" /></template>
        <template #suffix
          ><Icon
            name="svg:eye"
            size="24"
            class="cursor-pointer"
            @click="showPass = !showPass"
        /></template>
      </m-text-field>
    </div>
    <SignInOtp
      v-else
      v-model="code"
      :mobile
      :loading
      :voice-disabled="voiceDisabled"
      @resend="emits('resend')"
      @voice="emits('voice')"
      @complete="onOtpComplete"
    />

    <div class="sm:flex justify-between items-center mt-2">
      <PasswordButton :mode class="max-sm:hidden" @on-change-mode="mode = $event" />
      <button
        type="button"
        class="btn flex justify-center gap-2 h-10 max-sm:w-full"
        :class="{ 'btn-primary': buttonEnabled && !loading, 'btn-disabled': !buttonEnabled || loading }"
        :disabled="!buttonEnabled || loading"
        @click="onSubmit"
      >
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <Icon v-else name="svg:user-1" size="24" />
        <span>ورود به حساب کاربری</span>
      </button>
    </div>

    <div class="sm:hidden fixed bottom-2 w-full right-0">
      <PasswordButton :mode @on-change-mode="mode = $event" />
    </div>
  </DaisyCard>
</template>

<script setup lang="ts">
import PasswordButton from '~/features/account/components/PasswordButton.vue';
import SignInOtp from '~/features/account/components/SignInOtp.vue';
import type { PasswordButtonT } from '~/features/account/types';

const props = defineProps<{
  mobile?: string;
  loading?: boolean;
  voiceDisabled?: boolean;
}>();

const emits = defineEmits<{
  (e: 'onChangeStep'): void;
  (e: 'submitPassword', password: string): void;
  (e: 'submitOtp', otp: string): void;
  (e: 'resend'): void;
  (e: 'voice'): void;
}>();

const showPass = ref(false);
const mode = ref<PasswordButtonT>('fixedPassword');
const password = ref('');
const code = ref(['', '', '', '', '']);

const buttonEnabled = computed(
  () =>
    (mode.value === 'fixedPassword' && password.value.length > 0) ||
    (mode.value === 'otp' && code.value.every((digit) => digit !== '')),
);

function onSubmit() {
  if (!buttonEnabled.value || props.loading) return;

  if (mode.value === 'fixedPassword') {
    emits('submitPassword', password.value);
    return;
  }

  emits('submitOtp', code.value.join(''));
}

function onOtpComplete(otp: string) {
  if (props.loading) return;
  emits('submitOtp', otp);
}
</script>
