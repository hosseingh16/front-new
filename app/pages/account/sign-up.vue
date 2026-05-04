<template>
  <DaisyCard
    class="transition-all duration-300 mx-auto w-full"
    :class="step < 3 ? 'max-w-140' : 'max-w-263'"
  >
    <div class="flex justify-between items-center">
      <Icon name="svg:chevron-right" class="cursor-pointer" @click="goBack" />
      <img :src="`/images/${step < 3 ? step : '3'}-3.png`" width="54" />
    </div>

    <SignUp1 v-if="step === 1" v-model="code" :step />
    <SignUp2
      v-else-if="step === 2"
      v-model="step2Data"
      :step
      @password-strength="passwordStrength = $event"
    />
    <SignUp3 v-else-if="step === 3" :step @on-change-step="step = $event" />
    <SignUp4 v-else-if="step === 4" :step />

    <button
      v-if="step < 3"
      class="mt-4 btn flex justify-center gap-2 h-10 max-sm:w-full"
      :class="!buttonEnabled ? 'btn-disabled' : 'btn-primary'"
      @click="onSubmit"
    >
      <Icon v-if="!buttonEnabled" name="svg:user-plus" size="24" />
      <Icon v-else name="svg:user-plus-white" size="24" />
      <span>ثبت‌نام</span>
    </button>
  </DaisyCard>
</template>

<script setup lang="ts">
import SignUp1 from '~/features/account/components/SignUp1.vue';
import SignUp2 from '~/features/account/components/SignUp2.vue';
import SignUp3 from '~/features/account/components/SignUp3.vue';
import SignUp4 from '~/features/account/components/SignUp4.vue';
import { paths } from '~/routes';

definePageMeta({
  layout: 'auth',
});

// Variables
const router = useRouter();
const direction = ref<'forward' | 'back'>('forward');
const step = ref(1);
const code = ref('');
const step2Data = reactive({
  profile: null as File | null,
  fullName: '',
  password: '',
});
const passwordStrength = ref(0);

// Computeds
const buttonEnabled = computed(() => {
  switch (step.value) {
    case 1:
      return code.value !== '' && code.value.length === 6;
    case 2:
      return step2Data.fullName && step2Data.password && passwordStrength.value === 4;
  }
});

// Functions
function goBack() {
  direction.value = 'back';
  if (step.value === 1) router.replace(paths.account.root);
  else step.value--;
}

function onSubmit() {
  direction.value = 'forward';
  step.value++;
}
</script>
