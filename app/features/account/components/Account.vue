<template>
  <DaisyCard class="w-full min-[560px]:w-140">
    <div class="flex flex-col items-center">
      <NuxtImg src="/images/logo.png" class="w-10 h-10" />
      <p class="font-semibold text-caption">های‌حساب</p>
    </div>
    <p class="mt-6 text-2xl font-yb-bold">ورود یا ثبت نام</p>

    <form class="mt-3" @submit="onSubmit">
      <p class="mb-2 text-base font-medium text-text-primary">
        شماره تلفن همراه:
      </p>
      <div class="phone-input">
        <m-form-input
          name="mobile"
          placeholder="مثال: 09123456789"
          english-digits
        />
      </div>

      <button
        id="btnSendMobile"
        class="mt-3 w-full btn flex justify-center gap-2 h-12"
        :class="{
          'btn-disabled': !meta.valid || loading,
          'btn-primary': meta.valid && !loading,
        }"
        type="submit"
        :disabled="loading"
      >
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <Icon v-else name="lucide:message-square" size="24" />
        <span>دریافت کد تائید</span>
      </button>
    </form>

    <p class="mt-3 text-center text-xs text-gray-400">
      ورود شما به معنای پذیرش
      <NuxtLink to="/terms" class="text-primary-500">شرایط های‌حساب</NuxtLink>
      و
      <NuxtLink to="/privacy" class="text-primary-500"
        >قوانین حریم‌خصوصی</NuxtLink
      >
      است
    </p>
  </DaisyCard>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import * as Yup from "yup";
import { iranMobileSchema } from "~/utils/iran-mobile";

const model = defineModel({ default: "" });

const emit = defineEmits<{
  (e: "onCompleted"): void;
}>();

const { requestOtp, loading } = useAccountAuth();

const formSchema = Yup.object({
  mobile: iranMobileSchema(),
});

const { handleSubmit, meta, setValues } = useForm<
  Yup.InferType<typeof formSchema>
>({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (data) => {
  await requestOtp(data.mobile);
  model.value = data.mobile;
  emit("onCompleted");
});

onMounted(() => {
  if (model.value) setValues({ mobile: model.value });
});
</script>

<style scoped>
.phone-input :deep(label.input) {
  height: 52px;
  min-height: 52px;
  border-radius: 12px;
  border: 1px solid var(--color-gray-300);
  background: #fff;
  padding-inline: 16px;
  padding-block: 12px;
  box-shadow: none;
}
.phone-input :deep(label.input:hover),
.phone-input :deep(label.input:focus-within) {
  border-color: var(--color-gray-300);
  outline: none;
  box-shadow: none;
}
.phone-input :deep(input) {
  padding: 0;
  font-size: 16px;
}
.phone-input :deep(input::placeholder) {
  color: var(--color-gray);
  font-size: 16px;
}
</style>
