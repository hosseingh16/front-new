<template>
  <DaisyCard class="w-full min-[560px]:w-[560px]">
    <div class="flex justify-between items-center">
      <Icon name="svg:chevron-right" class="cursor-pointer" @click="goBack" />
      <img :src="`/images/1-3.png`" width="54" />
    </div>

    <p class="mt-4 text-2xl sm:text-h1 font-yb-bold">احراز هویت</p>

    <div class="flex justify-end items-center flex-wrap gap-2">
      <p class="mt-2 text-base">
        تایید شماره همراه <span class="font-semibold">09020124020</span>
      </p>
      <OtpButton />
    </div>

    <OtpInput :code-prop="model" @code="model = $event" />

    <button
      class="mt-4 w-full btn flex justify-center gap-2 h-10 max-sm:w-full"
      :class="!buttonEnabled ? 'btn-disabled' : 'btn-primary'"
      @click="onNext"
    >
      <Icon v-if="!buttonEnabled" name="svg:user-plus" size="24" />
      <Icon v-else name="svg:user-plus-white" size="24" />
      <span>ثبت‌نام</span>
    </button>
  </DaisyCard>
</template>

<script setup lang="ts">
import OtpButton from "~/features/account/components/OtpButton.vue";
import OtpInput from "~/features/account/components/OtpInput.vue";
import type { DirectionT } from "../types";

// Model
const model = defineModel({ default: "" });

// Props
const props = defineProps<{
  step: number;
}>();

// Emits
const emit = defineEmits<{
  (e: "onChangeStep", step: number): void;
  (e: "onChangeDirection", step: DirectionT): void;
}>();

// Computeds
const buttonEnabled = computed(
  () => model.value !== "" && model.value.length === 6,
);

// Functions
function goBack() {
  emit("onChangeDirection", "back");
  emit("onChangeStep", props.step > 3 ? props.step - 1 : 1);
}

function onNext() {
  emit("onChangeDirection", "forward");
  emit("onChangeStep", props.step + 1);
}
</script>
