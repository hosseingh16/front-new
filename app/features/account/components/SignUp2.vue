<template>
  <DaisyCard class="w-full min-[560px]:w-140">
    <div class="flex justify-between items-center">
      <Icon name="svg:chevron-right" class="cursor-pointer" @click="goBack" />
      <img :src="`/images/2-3.png`" width="54" />
    </div>

    <p class="mt-4 text-2xl sm:text-h1 font-yb-bold">تکیمل حساب کاربری</p>

    <p class="mt-4 text-base">تصویر پروفایل:</p>

    <input
      type="file"
      class="hidden"
      ref="imageInputRef"
      @change="onSelectImage($event)"
    />
    <div
      v-if="!imageBase64"
      class="mt-2 rounded-lg border-2 border-dashed border-gray-default bg-[repeating-linear-gradient(60deg,#FCFCFC_0px,#FCFCFC_35px,white_6px,white_70px)] flex items-center gap-3 p-6 cursor-pointer"
      @click="imageInputRef.click()"
    >
      <div
        class="w-12.5 h-12.5 bg-linear-to-b from-[#3D39FF] to-white rounded-full"
      ></div>
      <div>
        <div class="flex items-center gap-1 flex-wrap">
          <Icon name="svg:upload" />
          <span class="font-semibold text-sm text-primary-500"
            >برای آپلود تصویر کلید کنید</span
          >
        </div>
        <p class="mt-1 text-sm text-text-muted">
          حداکثر سایز فایل: 10MB، پسوند‌های مجاز: jpg. و png.
        </p>
      </div>
    </div>
    <div v-else class="mt-6 flex justify-center" @click="imageInputRef.click()">
      <img :src="imageBase64" class="w-24 h-24 rounded-full" />
    </div>

    <div class="mt-4">
      <m-text-field
        v-model="model.fullName"
        label="نام کامل:"
        required
        placeholder="نام کامل خود را وارد کنید"
      />
      <m-text-field
        v-model="model.password"
        label="رمز عبور:"
        required
        placeholder="رمز عبور را وارد کنید"
        class="mt-4"
        :type="showPass ? 'text' : 'password'"
        :hint="[
          'شامل عدد',
          'حداقل ۸ حرف',
          'شامل علامت (!@#$%&*^)',
          'شامل یک حرف بزرگ و کوچک',
        ]"
      >
        <template #prefix><Icon name="svg:lock" size="24" /></template>
        <template #suffix
          ><Icon
            name="svg:eye"
            size="24"
            class="cursor-pointer"
            @click="showPass = !showPass"
        /></template>
      </m-text-field>

      <div class="grid grid-cols-4 gap-1 mt-2">
        <div
          v-for="i in 4"
          class="h-1 rounded-lg"
          :class="i <= strength ? 'bg-info-500' : 'bg-[#F2F2F2]'"
        ></div>
      </div>
    </div>

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
import { convertImageToBase64 } from '~/libs/utils';
import type { DirectionT } from '../types';

// Model
const model = defineModel({
  default: {
    profile: null as File | null,
    fullName: '',
    password: '',
  },
});

// Props
const props = defineProps<{
  step: number;
}>();

// Emits
const emits = defineEmits<{
  (e: 'passwordStrength', value: number): void;
  (e: 'onChangeStep', step: number): void;
  (e: 'onChangeDirection', step: DirectionT): void;
}>();

// Variables
const showPass = ref(false);
const imageInputRef = ref<any>(null);
const imageBase64 = ref<any>(null);
const passwordStrength = ref(0);

// Computeds
const strength = computed(() => {
  let score = 0;
  if (model.value.password.length >= 8) score++;
  if (/\d/.test(model.value.password)) score++;
  if (/[!@#$%&*^]/.test(model.value.password)) score++;
  if (/[A-Z]/.test(model.value.password) && /[a-z]/.test(model.value.password)) score++;
  passwordStrength.value = score;
  return score;
});

// Computeds
const buttonEnabled = computed(
  () => model.value.fullName && model.value.password && passwordStrength.value === 4,
);

// Watches
watch(
  () => model.value,
  async () => {
    if (model.value.profile)
      imageBase64.value = await convertImageToBase64(model.value.profile);
  },
  { immediate: true },
);

// Functions
function goBack() {
  emits('onChangeDirection', 'back');
  emits('onChangeStep', props.step > 3 ? props.step - 1 : 1);
}

function onNext() {
  emits('onChangeDirection', 'forward');
  emits('onChangeStep', props.step + 1);
}

async function onSelectImage(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    model.value.profile = file!;
    imageBase64.value = await convertImageToBase64(file!);
  }
}
</script>
