<template>
  <div class="bg-white p-4 rounded-2xl mt-5">
    <Titr :with-icon="editMode" class="mb-8">اطلاعات پایه</Titr>
    <form @submit="onSubmit">
      <div v-show="editMode" class="grid lg:grid-cols-2 gap-x-4 gap-y-8">
        <div class="lg:col-span-2">
          <div>
            <p class="relative">
              تصویر پروفایل:
              <span class="text-red-400 mb-4 absolute -top-2">*</span>
            </p>
            <Field name="profileImage">
              <m-upload-box
                subtitle="یا تصویر را بکشید و در این محل رها کنید"
                :max-size="10"
                :accept="['png', 'jpg']"
                @update:model-value="(v: any) => setFieldValue('profileImage', v)"
                @update:base64="(v) => (imageBase64 = v)"
              />
            </Field>
          </div>
          <ErrorMessage name="profileImage" v-slot="{ message }">
            <div class="mt-1 text-xs text-text-passive flex items-center">
              <icons-close color="#EF4035" />
              <span>{{ message }}</span>
            </div>
          </ErrorMessage>
        </div>

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
          :options="jobTitles"
        />

        <div>
          <p class="text-base relative mb-2">
            وضعیت اشتغال
            <span class="text-red-400 mb-4 absolute -top-2">*</span>
          </p>
          <m-toggle
            name="jobStatus"
            :items="[
              { title: 'جویای کار', value: '1' },
              { title: 'شاغل', value: '2' },
            ]"
            same-width
          />
        </div>

        <m-form-select2
          name="experience"
          label="سابقه کار"
          placeholder="میزان سابقه کار را انتخاب کنید"
          required
          :options="experiences"
        />

        <m-form-select2
          name="salary"
          label="حقوق درخواستی"
          placeholder="میزان حقوق درخواستی را انتخاب کنید"
          required
          :options="salaries"
        />

        <m-form-select2
          name="birthYear"
          label="سال تولد"
          placeholder="سال تولد را انتخاب کنید"
          required
          :options="years"
        />

        <m-radio-group name="gender" inline label="جنسیت">
          <template #default="{ modelValue, setValue }">
            <m-radio value="1" :model-value="modelValue" :set-value="setValue">
              آقا
            </m-radio>
            <m-radio value="0" :model-value="modelValue" :set-value="setValue">
              خانم
            </m-radio>
          </template>
        </m-radio-group>

        <m-form-select2
          name="militaryStatus"
          label="وضعیت خدمت سربازی"
          placeholder="وضعیت خدمت سربازی را انتخاب کنید"
          :required="isMale"
          :disabled="!isMale"           
          :options="militaryStatuses"
        />

        <m-radio-group name="mariage" inline label="وضعیت تأهل">
          <template #default="{ modelValue, setValue }">
            <m-radio value="1" :model-value="modelValue" :set-value="setValue">
              مجرد
            </m-radio>
            <m-radio value="2" :model-value="modelValue" :set-value="setValue">
              متأهل
            </m-radio>
          </template>
        </m-radio-group>

        <m-form-select2
          name="province"
          label="استان محل سکونت"
          placeholder="استان محل سکونت را انتخاب کنید"
          required
          :options="provinces"
        />

        <m-form-select2
          name="city"
          label="شهر محل سکونت"
          placeholder="شهر محل سکونت را انتخاب کنید"
          required
          :options="cities"
        />

        <m-form-select2
          name="region"
          label="منطقه محل سکونت"
          placeholder="منطقه محل سکونت را انتخاب کنید"
          required
          :options="regions"
           :disabled="!hasRegions"
        />

        <div class="lg:col-span-2">
          <m-form-input
            name="description"
            multiline
            label="درباره من:"
            placeholder="شرح مختصری درباره خودتان، توانایی‌های شما، علاقه مندی‌ها، سرگرمی‌ها و ... در اینجا بیان کنید."
          ></m-form-input>
        </div>

        <div class="lg:col-span-2 flex justify-end">
          <button class="btn btn-ghost" type="button" @click="editMode = false">
            <Icon name="svg:close" />
            انصراف
          </button>
          <button class="btn btn-primary" type="submit">
            <Icon name="svg:check-check" />
            ذخیره
          </button>
        </div>
      </div>
      <div v-show="!editMode" class="grid lg:grid-cols-2 gap-x-4 gap-y-8">
        <div v-if="imageBase64" class="lg:col-span-2">
          <p>تصویر پروفایل:</p>
          <div class="mt-6 flex justify-center">
            <img :src="imageBase64" class="w-24 h-24 rounded-full" />
          </div>
        </div>
        <InfoItem title="نام کامل:" :value="values.fullName" />
        <InfoItem
          title="عنوان شغلی:"
          :value="jobTitles.find((x) => x.value === values.jobTitle)?.label"
        />
        <InfoItem
          title="وضعیت اشتغال:"
          :value="
            values.jobStatus === '1'
              ? 'جویای کار'
              : values.jobStatus === '2'
                ? 'شاغل'
                : undefined
          "
        />
        <InfoItem
          title="سابقه کار:"
          :value="experiences.find((x) => x.value === values.experience)?.label"
        />
        <InfoItem
          title="حقوق درخواستی:"
          :value="salaries.find((x) => x.value === values.salary)?.label"
        />
        <InfoItem
          title="سال تولد:"
          :value="years.find((x) => x.value === values.birthYear)?.label"
        />
        <InfoItem
          title="جنسیت:"
          :value="
            values.gender === '1' ? 'آقا' : values.gender === '2' ? 'خانم' : undefined
          "
        />
        <InfoItem
          title="وضعیت خدمت سربازی:"
          :value="militaryStatuses.find((x) => x.value === values.militaryStatus)?.label"
        />
        <InfoItem
          title="وضعیت تأهل:"
          :value="
            values.mariage === '1' ? 'مجرد' : values.mariage === '2' ? 'متأهل' : undefined
          "
        />
        <InfoItem
          title="استان محل سکونت:"
          :value="provinces.find((x) => x.value === values.province)?.label"
        />
        <InfoItem
          title="شهر محل سکونت:"
          :value="cities.find((x) => x.value === values.city)?.label"
        />
        <InfoItem
          title="منطقه محل سکونت:"
          :value="regions.find((x) => x.value === values.region)?.label"
        />
        <InfoItem title="درباره من:" :value="values.description" class="lg:col-span-2" />
        <div class="lg:col-span-2 text-left mt-2">
          <button
            class="btn text-sm border-none text-primary-500 bg-[#4864E114] max-md:btn-block"
            type="button"
            @click="editMode = true"
          >
            <Icon name="svg:edit" size="24" />
            ویرایش
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ErrorMessage, Field, useForm } from 'vee-validate';
import Titr from './Titr.vue';
import * as Yup from 'yup';
import InfoItem from './InfoItem.vue';
import type { ISelectItem } from '~/types/ISelectItem';

//Import Feeders
import { provinces } from '~/feeders/provinces';

//Import Validation Rules
import { fullNameValidation } from '~/validations/fullName';
import { profileImageValidation } from '~/validations/profileImage';

const api = useApi()
const hasRegions = ref(false);

// Variables
const editMode = ref(false);
const imageBase64 = ref<string | null>(null);
const jobTitles = ref<ISelectItem[]>([{ label: 'حسابدار ارشد', value: '1' }]);
const experiences = ref<ISelectItem[]>([{ label: '1 سال', value: '1' }]);
const salaries = ref<ISelectItem[]>([{ label: '10،000،000 تومان', value: '1' }]);
const years = ref<ISelectItem[]>([{ label: '1400', value: '1' }]);
const militaryStatuses = ref<ISelectItem[]>([{ label: 'پایان خدمت', value: '1' }]);
const cities = ref<ISelectItem[]>([]);
const regions = ref<ISelectItem[]>([]);

// Form
const formSchema = Yup.object({
  profileImage: profileImageValidation,
  fullName: fullNameValidation,
  jobTitle: Yup.string().required('عنوان شغلی انتخاب نشده است'),
  jobStatus: Yup.string().required('وضعیت شغلی انتخاب نشده است'),
  experience: Yup.string().required('سابقه کار انتخاب نشده است'),
  salary: Yup.string().required('حقوق درخواستی انتخاب نشده است'),
  birthYear: Yup.string().required('سال تولد انتخاب نشده است'),
  gender: Yup.string().required('جنسیت انتخاب نشده است'),
militaryStatus: Yup.string().when('gender', {
  is: '1',
  then: (schema) =>
    schema.required('وضعیت خدمت سربازی انتخاب نشده است'),
  otherwise: (schema) => schema.notRequired(),
}),
  mariage: Yup.string().required('وضعیت تأهل انتخاب نشده است'),
  province: Yup.string().required('استان انتخاب نشده است'),
  city: Yup.string().required('شهر انتخاب نشده است'),
  region: Yup.string().when('city', {
  is: () => hasRegions.value === true,
  then: (schema) => schema.required('منطقه انتخاب نشده است'),
  otherwise: (schema) => schema.notRequired(),
}),
  description: Yup.string(),
});
const { handleSubmit, setFieldValue, values } = useForm<Yup.InferType<typeof formSchema>>(
  {
    initialValues: {},
    
    validationSchema: formSchema,
  },
);

const isMale = computed(() => values.gender === '1');

watch(() => values.province, async (provinceId) => {
  if (!provinceId) {
    cities.value = [];
    setFieldValue('city', ''); // ✔ مهم
    return;
  }

  cities.value = await api.get(`/cities/${provinceId}`);

  setFieldValue('city', ''); // ✔ مهم‌ترین خط
});

watch(() => values.city, async (cityId) => {
  if (!cityId) {
    regions.value = [];
    hasRegions.value = false;
    setFieldValue('region', ''); 
    return;
  }

  const res = await api.get<ISelectItem[]>(`/regions/${cityId}`);

  regions.value = res;

  hasRegions.value = res.length > 0;

  setFieldValue('region', '');
});

// Functions
const onSubmit = handleSubmit((data: any) => {
  console.log(data);
  editMode.value = false;
});
</script>
