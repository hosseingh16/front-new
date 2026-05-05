<template>
  <DaisyCard class="w-full min-[560px]:w-140">
    <div class="flex flex-col items-center">
      <NuxtImg src="/images/logo.png" class="w-10 h-10" />
      <p class="font-semibold text-caption">های‌حساب</p>
      <p>خانه حسابداران با تجربه</p>
    </div>
    <p class="mt-12 text-2xl sm:text-h1 font-yb-bold">ورود یا ثبت نام</p>
    <p class="mt-2 text-base">
      برای ورود یا ثبت نام، لطفا شماره تلفن همراه را وارد کنید:
    </p>

    <form @submit="onSubmit">
      <m-form-input name="mobile" placeholder="شماره تلفن همراه را وارد کنید">
        <template #prefix>
          <Icon name="svg:mobile" />
        </template>
      </m-form-input>

      <div class="flex items-center mt-2">
        <Icon name="svg:hint" />
        <p class="mr-1">
          با ورود یا ثبت نام در های‌حساب،
          <span class="text-primary-500">شرایط و قوانین</span> را می پذیرم.
        </p>
      </div>

      <button
        id="btnSendMobile"
        class="mt-2 w-full btn flex justify-center gap-2 h-10"
        :class="{
          'btn-disabled': !meta.valid,
          'btn-primary': meta.valid,
        }"
        type="submit"
      >
        <Icon name="svg:user-1" size="24" />
        <span>ورود یا ثبت‌نام</span>
      </button>
    </form>
  </DaisyCard>
</template>

<script setup lang="ts">
import { isMobile } from '~/libs/utils';
import { useForm } from 'vee-validate';
import * as Yup from 'yup';

// Model
const model = defineModel({ default: '' });

// Emits
const emit = defineEmits<{
  (e: 'onCompleted'): void;
}>();

// Form
const formSchema = Yup.object({
  mobile: Yup.string()
    .required('شماره همراه وارد نشده است')
    .matches(RegExp('^09[0-9]\\d{8}$'), { message: 'شماره همراه معتبر نیست' }),
});
const { handleSubmit, meta, setValues } = useForm<Yup.InferType<typeof formSchema>>({
  validationSchema: formSchema,
});

// ============= Laravel API interaction =============
const config = useRuntimeConfig();
// const client = useSanctumClient();

const onSubmit: any = handleSubmit(async (data: Yup.InferType<typeof formSchema>) => {
  model.value = data.mobile;
  emit('onCompleted');
  // const ok = await sendMobile(data.mobile);
  // if (ok) emit('onCompleted');
});

const sendMobile = async (mobile: string): Promise<boolean> => {
  if (!isMobile(mobile)) {
    alert('شماره موبایل معتبر نیست');
    return false;
  }

  return true;

  // try {
  //   const response = await client("/api/login-register", {
  //     method: "POST",
  //     body: {
  //       cellphone: mobileNo.value,
  //     },
  //   });

  //   return true;
  // } catch (error) {
  //   return false;
  // }
};

//
onMounted(() => {
  if (model.value) setValues({ mobile: model.value });
});
</script>
