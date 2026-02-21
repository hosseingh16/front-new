<template>
  <DaisyCard class="w-full min-[560px]:w-[560px]">
    <div class="flex flex-col items-center">
      <NuxtImg src="/images/logo.png" class="w-10 h-10" />
      <p class="font-semibold text-caption">های‌حساب</p>
      <p>خانه حسابداران با تجربه</p>
    </div>
    <p class="mt-12 text-2xl sm:text-h1 font-yb-bold">ورود یا ثبت نام</p>
    <p class="mt-2 text-base">
      برای ورود یا ثبت نام، لطفا شماره تلفن همراه را وارد کنید:
    </p>

    <m-text-field
      v-model="mobileNo"
      placeholder="شماره تلفن همراه را وارد کنید"
    >
      <template #prefix><Icon name="svg:mobile" /></template>
    </m-text-field>

    <div class="flex items-center mt-2">
      <Icon name="svg:hint" />
      <p class="mr-1">
        با ورود یا ثبت نام در های‌حساب،
        <span class="text-primary-900">شرایط و قوانین</span> را می پذیرم.
      </p>
    </div>

    <button
      id="btnSendMobile"
      class="mt-2 w-full btn flex justify-center gap-2 h-10"
      :class="{
        'btn-disabled': !isMobile(mobileNo),
        'btn-primary': isMobile(mobileNo),
      }"
      @click="onSubmit"
    >
      <Icon name="svg:user-1" size="24" />
      <span>ورود یا ثبت‌نام</span>
    </button>
  </DaisyCard>
</template>

<script setup lang="ts">
import { isMobile } from "~/libs/utils";

// Model
const mobileNo = defineModel({ default: "" });

// Emits
const emit = defineEmits<{
  (e: "onCompleted"): void;
}>();

// Functions
// function onSubmit() {

// }

// ============= Laravel API interaction =============
const config = useRuntimeConfig();
const client = useSanctumClient();

async function onSubmit() {
  const ok = await sendMobile();
  if (ok) emit("onCompleted");
}

const sendMobile = async (): Promise<boolean> => {
  if (!isMobile(mobileNo.value)) {
    alert("شماره موبایل معتبر نیست");
    return false;
  }

  try {
    const response = await client("/api/test", {
      method: "POST",
      credentials: "include",
      body: {
        mobile: mobileNo.value,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
};

onMounted(() => {});
</script>
