<template>
  <div class="">
    <DaisyCard class="max-[560px]:min-w-screen min-[560px]:w-140">
      <Icon
        name="svg:chevron-right"
        class="cursor-pointer"
        @click="router.replace(paths.account.root)"
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
      <SignInOtp v-else v-model="code" />

      <div class="sm:flex justify-between items-center mt-2">
        <PasswordButton :mode class="max-sm:hidden" @on-change-mode="mode = $event" />
        <button
          class="btn flex justify-center gap-2 h-10 max-sm:w-full"
          :class="{ 'btn-primary': buttonEnabled, 'btn-disabled': !buttonEnabled }"
        >
          <Icon name="svg:user-1" size="24" />
          <span>ورود به حساب کاربری</span>
        </button>
      </div>

      <div class="sm:hidden fixed bottom-2 w-full right-0">
        <PasswordButton :mode @on-change-mode="mode = $event" />
      </div>
    </DaisyCard>
  </div>
</template>

<script setup lang="ts">
import PasswordButton from '~/features/account/components/PasswordButton.vue';
import SignInOtp from '~/features/account/components/SignInOtp.vue';
import type { PasswordButtonT } from '~/features/account/types';
import { paths } from '~/routes';

definePageMeta({
  layout: 'auth',
});

// Variables
const showPass = ref(false);
const mode = ref<PasswordButtonT>('fixedPassword');
const router = useRouter();
const password = ref('');
const code = ref('');

// Computeds
const buttonEnabled = computed(
  () =>
    (mode.value === 'fixedPassword' && password.value.length > 0) ||
    (mode.value === 'otp' && code.value.length === 6),
);
</script>
