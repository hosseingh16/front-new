<template>
  <DaisyCard class="w-full">
    <SignUpStepper :current="3" class="hidden min-[560px]:flex flex-1" />
    <div class="flex items-center">
      <Icon
        v-if="!inline"
        name="svg:chevron-right"
        class="shrink-0 cursor-pointer"
        @click="goBack"
      />
      <span v-else class="hidden min-[560px]:block w-6 shrink-0" />
      <img
        :src="`/images/2-3.png`"
        width="54"
        class="ms-auto min-[560px]:hidden"
      />
      <span class="hidden min-[560px]:block w-6 shrink-0" />
    </div>

    <p class="mt-4 text-2xl sm:text-h1 font-yb-bold">تکمیل حساب کاربری</p>

    <p class="mt-4 text-base">تصویر پروفایل:</p>

    <input
      type="file"
      class="hidden"
      ref="imageInputRef"
      accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
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
          <span class="text-sm text-text-muted">(اختیاری)</span>
        </div>
        <p class="mt-1 text-sm text-text-muted">
          حداکثر سایز فایل: 2MB، پسوند‌های مجاز: jpg و png.
        </p>
      </div>
    </div>
    <div v-else class="mt-6 flex justify-center" @click="imageInputRef.click()">
      <img :src="imageBase64" class="w-24 h-24 rounded-full" />
    </div>

    <form @submit="onSubmit">
      <div class="mt-4">
        <m-form-input
          name="fullName"
          label="نام کامل:"
          placeholder="نام کامل خود را وارد کنید"
          required
        ></m-form-input>
        <m-form-input
          name="password"
          label="رمز عبور: (اختیاری)"
          placeholder="رمز عبور را وارد کنید"
          class="mt-4"
          :type="showPass ? 'text' : 'password'"
          :hint="
            values.password
              ? [
                  'شامل عدد',
                  'حداقل ۸ حرف',
                  'شامل علامت (!@#$%&*^)',
                  'شامل یک حرف بزرگ و کوچک',
                ]
              : []
          "
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

        <div v-if="values.password" class="grid grid-cols-4 gap-1 mt-2">
          <div
            v-for="i in 4"
            class="h-1 rounded-lg"
            :class="i <= strength ? 'bg-info-500' : 'bg-[#F2F2F2]'"
          ></div>
        </div>
      </div>

      <button
        class="mt-4 w-full btn flex justify-center gap-2 h-10 max-sm:w-full"
        :class="!buttonEnabled || loading ? 'btn-disabled' : 'btn-primary'"
        type="submit"
        :disabled="!buttonEnabled || loading"
      >
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <template v-else>
          <Icon v-if="!buttonEnabled" name="svg:user-plus" size="24" />
          <Icon v-else name="svg:user-plus-white" size="24" />
        </template>
        <span>ثبت‌نام</span>
      </button>
    </form>
  </DaisyCard>
</template>

<script setup lang="ts">
import { convertImageToBase64 } from "~/libs/utils";
import SignUpStepper from "~/features/account/components/SignUpStepper.vue";
import type { DirectionT } from "../types";
import { useForm } from "vee-validate";
import * as Yup from "yup";
import { isEnteringRoleRedirect } from "~/utils/entering-route";

// Model
const model = defineModel({
  default: {
    profile: null as File | null,
    fullName: "",
    password: "",
  },
});

// Props
const props = defineProps<{
  step: number;
  /** When true, emit completed instead of navigating after profile submit. */
  inline?: boolean;
}>();

// Emits
const emits = defineEmits<{
  (e: "passwordStrength", value: number): void;
  (e: "onChangeStep", step: number): void;
  (e: "onChangeDirection", step: DirectionT): void;
  (e: "completed"): void;
}>();

// Auth
const route = useRoute();
const { completeProfile, loading } = useAccountAuth();
const { $toast } = useNuxtApp();

// Variables
const showPass = ref(false);
const imageInputRef = ref<any>(null);
const imageBase64 = ref<any>(null);
const passwordStrength = ref(0);
const maxAvatarBytes = 2 * 1024 * 1024;

// Form — name required; avatar & password optional
const formSchema = Yup.object({
  fullName: Yup.string().required("نام وارد نشده است"),
  password: Yup.string().optional().nullable(),
});
const { handleSubmit, values, setValues } = useForm<
  Yup.InferType<typeof formSchema>
>({
  validationSchema: formSchema,
});

// Computeds
const strength = computed(() => {
  const password = values.password || "";
  let score = 0;
  if (password.length >= 8) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%&*^]/.test(password)) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  passwordStrength.value = score;
  return score;
});
const buttonEnabled = computed(() => {
  return !!values.fullName && !loading.value;
});

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
  emits("onChangeDirection", "back");
  emits("onChangeStep", props.step > 3 ? props.step - 1 : 1);
}

const onSubmit = handleSubmit(async (data) => {
  if (loading.value) return;

  const password = data.password?.trim() || undefined;
  if (password && passwordStrength.value < 4) {
    $toast.error("رمز عبور به اندازه کافی قوی نیست");
    return;
  }

  model.value = {
    ...data,
    profile: model.value.profile,
    password: password || "",
  };

  await completeProfile({
    name: data.fullName,
    password,
    avatar: model.value.profile || null,
  });

  emits("passwordStrength", passwordStrength.value);
  emits("onChangeDirection", "forward");
  emits("completed");

  if (props.inline) return;

  if (isEnteringRoleRedirect(route.query.redirect)) {
    await navigateTo(route.query.redirect, { replace: true });
    return;
  }

  // Next: role selection (SignUp3)
  emits("onChangeStep", props.step + 1);
});

async function onSelectImage(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0]!;

    if (file.size > maxAvatarBytes) {
      $toast.error("حجم تصویر نباید بیشتر از 2MB باشد");
      target.value = "";
      return;
    }

    model.value.profile = file;
    imageBase64.value = await convertImageToBase64(file);
  }
}

onMounted(() => {
  if (model.value.fullName || model.value.password)
    setValues({
      fullName: model.value.fullName,
      password: model.value.password,
    });
});
</script>
