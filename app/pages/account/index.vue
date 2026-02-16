<template>
  <div>
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

      <m-text-field v-model="mobile" placeholder="شماره تلفن همراه را وارد کنید">
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
        class="mt-2 btn flex justify-center gap-2 h-10"
        :class="{ 'btn-disabled': !isMobile(mobile), 'btn-primary': isMobile(mobile) }"
        @click="router.push(paths.account.signUp)"
      >
        <Icon name="svg:user-1" size="24" />
        <span>ورود یا ثبت‌نام</span>
      </button>
    </DaisyCard>
  </div>
</template>

<script setup lang="ts">
import { isMobile } from '~/libs/utils';
import { paths } from '~/routes';

definePageMeta({
  layout: 'auth',
});

// Parameters
const mobile = ref('');
const router = useRouter();
</script>
