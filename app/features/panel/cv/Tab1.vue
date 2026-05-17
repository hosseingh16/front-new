<template>
  <div class="bg-white p-4 rounded-2xl mt-5">
    <Titr :with-icon="editMode">اطلاعات پایه</Titr>
    <p class="relative mt-6 mb-2">
      تصویر پروفایل:
      <span class="text-red-400 mb-4 absolute -top-2">*</span>
    </p>

    <m-upload-box
      subtitle="یا تصویر را بکشید و در این محل رها کنید"
      :max-size="10"
      :accept="['png', 'jpg']"
    />

    <form class="mt-8 grid lg:grid-cols-2 gap-x-4 gap-y-8" @submit="onSubmit">
      <m-form-input
        name="fullName"
        label="نام کامل"
        placeholder="نام کامل خود را وارد کنید"
        required
      ></m-form-input>

      <m-form-select2
        name="jobTitle"
        label="عنوان شغلی"
        required
        :options="['حسابدار ارشد']"
      />

      <div>
        <p class="text-base relative mb-2">
          وضعیت اشتغال
          <span class="text-red-400 mb-4 absolute -top-2">*</span>
        </p>
        <m-toggle
          name="jobStatus"
          :items="[
            { title: 'جویای کار', value: 1 },
            { title: 'شاغل', value: 2 },
          ]"
          same-width
        />
      </div>

      <m-select2
        label="سابقه کار"
        placeholder="میزان سابقه کار را انتخاب کنید"
        required
        :options="['1 سال', '2 سال']"
      />

      <m-select2
        label="حقوق درخواستی"
        placeholder="میزان حقوق درخواستی را انتخاب کنید"
        required
        :options="['10،000،000']"
      />

      <m-select2
        label="سال تولد"
        placeholder="سال تولد را انتخاب کنید"
        required
        :options="['1400']"
      />

      <m-radio-group name="gender" inline label="جنسیت">
        <template #default="{ modelValue, setValue }">
          <m-radio :value="'male'" :model-value="modelValue" :set-value="setValue">
            آقا
          </m-radio>
          <m-radio :value="'female'" :model-value="modelValue" :set-value="setValue">
            خانم
          </m-radio>
        </template>
      </m-radio-group>

      <m-select2
        label="وضعیت خدمت سربازی"
        placeholder="وضعیت خدمت سربازی را انتخاب کنید"
        required
        :options="['1400']"
      />

      <m-radio-group name="mariage" inline label="وضعیت تأهل">
        <template #default="{ modelValue, setValue }">
          <m-radio :value="'1'" :model-value="modelValue" :set-value="setValue">
            مجرد
          </m-radio>
          <m-radio :value="'2'" :model-value="modelValue" :set-value="setValue">
            متأهل
          </m-radio>
        </template>
      </m-radio-group>

      <m-select2
        label="استان محل سکونت"
        placeholder="استان محل سکونت را انتخاب کنید"
        required
      />

      <m-select2
        label="شهر محل سکونت"
        placeholder="شهر محل سکونت را انتخاب کنید"
        required
      />

      <m-select2
        label="منطقه محل سکونت"
        placeholder="منطقه محل سکونت را انتخاب کنید"
        required
      />

      <div class="lg:col-span-2">
        <m-form-input
          v-model="model.description"
          name="description"
          multiline
          label="درباره من:"
          placeholder="شرح مختصری درباره خودتان، توانایی‌های شما، علاقه مندی‌ها، سرگرمی‌ها و ... در اینجا بیان کنید."
        ></m-form-input>
      </div>

      <div class="lg:col-span-2 flex justify-end">
        <button class="btn btn-ghost" type="button">
          <Icon name="svg:close" />
          انصراف
        </button>
        <button class="btn btn-primary" type="submit">
          <Icon name="svg:check-check" />
          ذخیره
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import Titr from './Titr.vue';
import * as Yup from 'yup';

// Variables
const editMode = ref(true);
const model = reactive({
  fullName: '',
  jobTitle: '',
  jobStatus: 0,
  gender: null,
  mariage: null,
  description: '',
});

// Form
const formSchema = Yup.object({
  fullName: Yup.string().required('نام وارد نشده است'),
  jobTitle: Yup.string().required('عنوان شغلی انتخاب نشده است'),
  jobStatus: Yup.number(),
  gender: Yup.string().required('جنسیت انتخاب نشده است'),
  mariage: Yup.number().required('وضعیت تأهل انتخاب نشده است'),
});
const { handleSubmit } = useForm({
  initialValues: { jobStatus: 1 },
  validationSchema: formSchema,
});

// Functions
const onSubmit = handleSubmit((data: any) => {
  console.log(data);
});
</script>
