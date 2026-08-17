<template>
  <div>
    <Transition
      :name="direction === 'forward' ? 'slide-next' : 'slide-prev'"
      mode="out-in"
    >
      <Account
        v-if="step === 1"
        key="account"
        v-model="mobile"
        @on-completed="goToOtp"
      />
      <SignInPassword
        v-else-if="step === 2"
        key="sign-in"
        :mobile
        :loading
        @on-change-step="onChangeStep(1)"
        @resend="resendOtp"
        @submit-password="onPasswordLogin"
        @submit-otp="onOtpLogin"
      />
      <SignUp1
        v-else-if="step === 3"
        key="sign-up-1"
        v-model="otpCode"
        :step
        :mobile
        @on-change-step="onChangeStep($event)"
      />
      <SignUp2
        v-else-if="step === 4"
        key="sign-up-2"
        v-model="signUp2Data"
        :step
        @on-change-step="onChangeStep($event)"
      />
      <SignUp3
        v-else-if="step === 5"
        key="sign-up-3"
        :step
        @on-change-step="onChangeStep($event)"
      />
      <SignUp4
        v-else-if="step === 6"
        key="sign-up-4"
        :step
        @on-change-step="onChangeStep($event)"
      />
    </Transition>
    <NuxtLink
      to="/"
      class="flex justify-center items-center mt-4 cursor-pointer"
    >
      <span class="text-sm text-gray-500">بازگشت به صفحه اصلی</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import Account from "~/features/account/components/Account.vue";
import SignInPassword from "~/features/account/components/SignInPassword.vue";
import SignUp1 from "~/features/account/components/SignUp1.vue";
import SignUp2 from "~/features/account/components/SignUp2.vue";
import SignUp3 from "~/features/account/components/SignUp3.vue";
import SignUp4 from "~/features/account/components/SignUp4.vue";
import type { DirectionT, SignUpProfile } from "~/features/account/types";

definePageMeta({
  layout: "auth",
  // middleware: 'sanctum:guest',
});

const {
  mobile: authMobile,
  loading,
  requestOtp,
  verifyOtp,
  loginWithMobile,
} = useAccountAuth();

const step = ref(1);
const direction = ref<DirectionT>("forward");
const mobile = ref("");
const otpCode = ref(["", "", "", "", ""]);
const signUp2Data = reactive<SignUpProfile>({
  profile: null,
  fullName: "",
  password: "",
});

function onChangeStep(value: number) {
  direction.value = step.value < value ? "forward" : "back";
  step.value = value;
}

function goToOtp() {
  mobile.value = authMobile.value || mobile.value;
  onChangeStep(3);
}

async function resendOtp() {
  if (!mobile.value) return;
  await requestOtp(mobile.value);
}

async function onPasswordLogin() {
  await loginWithMobile(mobile.value || authMobile.value, true);
}

async function onOtpLogin(otp: string) {
  const res = await verifyOtp(otp);

  if (res.status === "existing_user" && res.has_role !== false) {
    await loginWithMobile(mobile.value || authMobile.value, true);
    return;
  }

  // New user, or existing user without role → complete profile, then login
  onChangeStep(4);
}

watch(
  authMobile,
  (value) => {
    if (value) mobile.value = value;
  },
  { immediate: true },
);
</script>

<style>
.slide-next-enter-from {
  transform: translateX(40px);
  opacity: 0;
}
.slide-next-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(-40px);
  opacity: 0;
}
.slide-prev-leave-to {
  transform: translateX(40px);
  opacity: 0;
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.3s ease;
}
</style>
