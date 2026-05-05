<template>
  <div class="">
    <DaisyCard class="max-[560px]:min-w-screen min-[560px]:w-140">
      <Icon
        name="svg:chevron-right"
        class="cursor-pointer"
        @click="router.replace(paths.account.root)"
      />
      <p class="mt-12 text-2xl sm:text-h1 font-yb-bold">ورود به حساب کاربری</p>

      <Form :validation-schema="formSchema" @submit="onSubmit" v-slot="{ meta, values }">
        <div v-if="mode === 'fixedPassword'">
          <m-form-input
            name="password"
            placeholder="رمز عبور را وارد کنید"
            label="رمز عبور:"
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
          </m-form-input>
        </div>
        <SignInOtp v-else v-model="code" />

        <div class="sm:flex justify-between items-center mt-2">
          <PasswordButton :mode class="max-sm:hidden" @on-change-mode="mode = $event" />
          <button
            class="btn flex justify-center gap-2 h-10 max-sm:w-full"
            :class="buttonEnabled(meta.valid)"
            type="submit"
          >
            <Icon name="svg:user-1" size="24" />
            <span>ورود به حساب کاربری</span>
          </button>
        </div>
      </Form>

      <div class="sm:hidden fixed bottom-2 w-full right-0">
        <PasswordButton :mode @on-change-mode="mode = $event" />
      </div>
    </DaisyCard>
  </div>
</template>

<script setup lang="ts">
import { Form, useForm } from 'vee-validate';
import PasswordButton from '~/features/account/components/PasswordButton.vue';
import SignInOtp from '~/features/account/components/SignInOtp.vue';
import type { PasswordButtonT } from '~/features/account/types';
import { paths } from '~/routes';
import * as Yup from 'yup';

definePageMeta({
  layout: 'auth',
});

// Variables
const showPass = ref(false);
const mode = ref<PasswordButtonT>('fixedPassword');
const router = useRouter();
const code = ref(['', '', '', '', '']);

// Form
const formSchema = Yup.object({
  password: Yup.string().required('رمز عبور وارد نشده است'),
});

// Functions
const buttonEnabled = (valid: boolean): string => {
  if (mode.value === 'fixedPassword') {
    if (valid) return 'btn-primary';
    return 'btn-disabled';
  }

  if (code.value.every((x) => x !== '')) return 'btn-primary';
  return 'btn-disabled';
};

const onSubmit: any = async (data: any) => {};
</script>
