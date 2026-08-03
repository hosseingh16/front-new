<template>
  <DaisyCard class="w-full min-[560px]:w-140">
    <div class="flex justify-between items-center">
      <Icon name="svg:chevron-right" class="cursor-pointer" @click="goBack" />
      <img src="/images/1-3.png" width="54" />
    </div>

    <p class="mt-4 text-2xl sm:text-h1 font-yb-bold">احراز هویت</p>

    <div class="flex justify-end items-center flex-wrap gap-2">
      <p class="mt-2 text-base">
        تایید شماره همراه
        <span class="font-semibold">{{ displayMobile }}</span>
      </p>
      <OtpButton :loading @resend="onResend" />
    </div>

    <form @submit.prevent="onSubmit">
      <OtpInput v-model="model" @complete="onSubmit" />

      <button
        type="submit"
        class="mt-4 w-full btn flex justify-center gap-2 h-10 max-sm:w-full"
        :class="!buttonEnabled || loading ? 'btn-disabled' : 'btn-primary'"
        :disabled="!buttonEnabled || loading"
      >
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <template v-else>
          <Icon v-if="!buttonEnabled" name="svg:user-plus" size="24" />
          <Icon v-else name="svg:user-plus-white" size="24" />
        </template>
        <span>{{ loading ? "در حال تایید..." : "ادامه" }}</span>
      </button>
    </form>
  </DaisyCard>
</template>

<script setup lang="ts">
import OtpButton from "~/features/account/components/OtpButton.vue";
import OtpInput from "~/features/account/components/OtpInput.vue";
import type { DirectionT } from "../types";
import type { AuthUserStatus } from "~/composables/useAccountAuth";

const model = defineModel({ default: ["", "", "", "", ""] });

const props = defineProps<{
  step: number;
  mobile?: string;
}>();

const emit = defineEmits<{
  (e: "onChangeStep", step: number): void;
  (e: "onChangeDirection", step: DirectionT): void;
  (e: "verified", status: AuthUserStatus): void;
}>();

const { mobile, verifyOtp, requestOtp, loginWithMobile, loading } =
  useAccountAuth();

const displayMobile = computed(() => props.mobile || mobile.value || "—");
const buttonEnabled = computed(() => model.value.every((x) => x !== ""));

function goBack() {
  emit("onChangeDirection", "back");
  emit("onChangeStep", props.step > 3 ? props.step - 1 : 1);
}

async function onResend() {
  const phone = props.mobile || mobile.value;
  if (!phone) return;
  model.value = ["", "", "", "", ""];
  await requestOtp(phone);
}

/** Accepts OTP string from @complete, or reads model on form submit / button click. */
async function onSubmit(otpFromEvent?: string | Event) {
  if (loading.value) return;

  const otp =
    typeof otpFromEvent === "string" && /^\d{5}$/.test(otpFromEvent)
      ? otpFromEvent
      : model.value.join("");

  if (!/^\d{5}$/.test(otp)) return;

  if (typeof otpFromEvent === "string") {
    model.value = otp.split("");
  }

  const res = await verifyOtp(otp);
  await loginWithMobile(undefined, false);

  if (res.status === "existing_user" && res.has_role !== false) {
    navigateTo("/");
    return;
  }

  emit("onChangeDirection", "forward");
  emit("verified", res.status);
  emit("onChangeStep", props.step + 1);
}
</script>
