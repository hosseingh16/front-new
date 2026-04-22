<template>
  <div>
    <Transition
      :name="direction === 'forward' ? 'slide-next' : 'slide-prev'"
      mode="out-in"
    >
      <Account
        v-if="step === 1"
        v-model="mobile"
        @on-completed="
          direction = 'forward';
          step = 3;
        "
      />
      <SignInPassword
        v-else-if="step === 2"
        @on-change-step="
          direction = 'back';
          step = 1;
        "
      />
      <SignUp1
        v-else-if="step === 3"
        v-model="signUp1Data"
        :step
        @on-change-step="onChangeStep($event)"
      />
      <SignUp2
        v-else-if="step === 4"
        v-model="signUp2Data"
        :step
        @on-change-step="onChangeStep($event)"
      />
      <SignUp3
        v-else-if="step === 5"
        :step
        @on-change-step="onChangeStep($event)"
      />
      <SignUp4
        v-else-if="step === 6"
        :step
        @on-change-step="onChangeStep($event)"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Account from "~/features/account/components/Account.vue";
import SignInPassword from "~/features/account/components/SignInPassword.vue";
import SignUp1 from "~/features/account/components/OtpForm.vue";
import SignUp2 from "~/features/account/components/SignUp2.vue";
import SignUp3 from "~/features/account/components/SignUp3.vue";
import SignUp4 from "~/features/account/components/SignUp4.vue";
import type { DirectionT } from "~/features/account/types";

definePageMeta({
  layout: "auth",
});

// Variables
const step = ref(1);
const direction = ref<DirectionT>("forward");
const mobile = ref("");
const signUp1Data = ref("");
const signUp2Data = reactive({
  profile: null as File | null,
  fullName: "",
  password: "",
});

// Functions
function onChangeStep(value: number) {
  direction.value = step.value < value ? "forward" : "back";
  step.value = value;
}

// ============= Laravel API interaction =============
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
