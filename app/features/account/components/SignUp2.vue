<template>
  <DaisyCard class="w-full min-[560px]:w-140">
    <div class="flex items-center">
      <AuthBackButton
        v-if="!inline"
        label="بازگشت به ابتدا"
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

    <p class="mt-3 text-xl font-yb-bold">تکمیل حساب کاربری</p>

    <form autocomplete="off" @submit="onSubmit">
      <div class="mt-3">
        <m-form-input
          name="fullName"
          label="نام کامل:"
          placeholder="نام کامل خود را وارد کنید"
          required
        ></m-form-input>
        <m-form-input
          name="password"
          label="رمز عبور: (اختیاری)"
          placeholder="حداقل ۶ کاراکتر"
          class="mt-3"
          :type="showPass ? 'text' : 'password'"
          autocomplete="new-password"
          english-digits
        >
          <template #prefix><Icon name="svg:lock" size="24" /></template>
          <template #suffix>
            <Icon
              :name="showPass ? 'lucide:eye-off' : 'lucide:eye'"
              size="24"
              class="cursor-pointer text-gray"
              @click="showPass = !showPass"
            />
          </template>
        </m-form-input>
      </div>

      <button
        class="mt-3 w-full btn flex justify-center gap-2 h-10 max-sm:w-full"
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
import AuthBackButton from "~/features/account/components/AuthBackButton.vue";
import type { DirectionT } from "../types";
import { useForm } from "vee-validate";
import * as Yup from "yup";
import { firstQueryString } from "~/utils/entering-route";
import { paths } from "~/routes";
import { optionalUserPasswordSchema } from "~/utils/user-password";

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
  (e: "onChangeStep", step: number): void;
  (e: "onChangeDirection", step: DirectionT): void;
  (e: "completed"): void;
}>();

// Auth
const route = useRoute();
const { completeProfile, loading } = useAccountAuth();

// Variables
const showPass = ref(false);

// Form — name required; password optional (at least 6 characters)
const formSchema = Yup.object({
  fullName: Yup.string().required("نام وارد نشده است"),
  password: optionalUserPasswordSchema(),
});
const { handleSubmit, values, setValues } = useForm<
  Yup.InferType<typeof formSchema>
>({
  validationSchema: formSchema,
});

const buttonEnabled = computed(() => {
  return !!values.fullName && !loading.value;
});

// Functions
function goBack() {
  emits("onChangeDirection", "back");
  emits("onChangeStep", 1);
}

const onSubmit = handleSubmit(async (data) => {
  if (loading.value) return;

  const password = data.password?.trim() || undefined;

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

  emits("onChangeDirection", "forward");
  emits("completed");

  if (props.inline) return;

  const nextQuery: Record<string, string> = { step: "5" };
  for (const [key, value] of Object.entries(route.query)) {
    if (key === "step") continue;
    const str = firstQueryString(value);
    if (str) nextQuery[key] = str;
  }

  await navigateTo({ path: paths.login, query: nextQuery }, { replace: true });
});

onMounted(() => {
  if (model.value.fullName)
    setValues({
      fullName: model.value.fullName,
      password: "",
    });
});
</script>
