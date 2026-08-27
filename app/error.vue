<template>
  <NuxtLayout name="default">
    <div
      class="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-5 py-16 md:py-24"
    >
      <div
        class="relative z-10 flex w-full max-w-lg flex-col items-center text-center"
      >
        <div class="relative flex w-full items-center justify-center">
          <img
            :src="patternSrc"
            alt=""
            class="pointer-events-none absolute left-1/2 top-1/2 w-[min(100%,28rem)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none opacity-90"
            draggable="false"
            aria-hidden="true"
          />
          <img
            :src="illustrationSrc"
            alt=""
            class="relative z-10 h-auto w-[min(100%,18rem)] object-contain md:w-88"
            width="453"
            height="630"
            draggable="false"
          />
        </div>

        <h1 class="-mt-20 font-yb-bold text-xl text-text-tertiary md:text-2xl">
          {{ title }}
        </h1>
        <p
          class="mt-3 max-w-md text-sm leading-7 text-text-passive md:text-base"
        >
          {{ description }}
        </p>

        <button
          type="button"
          class="btn btn-ghost-primary mt-8 h-11 rounded-xl px-6"
          @click="handleGoHome"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";
import illustrationSrc from "~/assets/vectors/404-illustration.svg";
import patternSrc from "~/assets/vectors/pattern.png";

const props = defineProps<{
  error: NuxtError;
}>();

const isNotFound = computed(
  () => props.error.statusCode === 404 || props.error.status === 404,
);

const title = computed(() =>
  isNotFound.value ? "این یکی توی حساب‌وکتاب ما نبود!" : "مشکلی پیش آمده است",
);

const description = computed(() =>
  isNotFound.value
    ? "صفحه‌ای که دنبالش هستید پیدا نشد یا ممکن است آدرس آن تغییر کرده باشد."
    : props.error.statusMessage ||
      "لطفاً دوباره تلاش کنید یا به صفحه اصلی بازگردید.",
);

useSeoMeta({
  title: () => (isNotFound.value ? "صفحه پیدا نشد" : "خطا"),
});

function handleGoHome() {
  clearError({ redirect: "/" });
}
</script>
