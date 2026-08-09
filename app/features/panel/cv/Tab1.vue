<template>
  <div class="bg-white p-4 rounded-2xl mt-5">
    <Titr :with-icon="editMode" class="mb-8">اطلاعات پایه</Titr>
    <form @submit="onSubmit">
      <div class="mb-8">
        <p class="relative">
          تصویر پروفایل:
          <span
            v-if="editMode"
            class="text-red-400 mb-4 absolute -top-2"
          >*</span>
        </p>
        <Field name="profileImage">
          <m-upload-box
            subtitle="یا تصویر را بکشید و در این محل رها کنید"
            :max-size="10"
            :accept="['png', 'jpg']"
            :preview-url="avatarPreview"
            @update:model-value="handleProfileImage"
            @update:base64="(v) => (imageBase64 = v)"
            @delete="handleProfileImage(null)"
          />
        </Field>
        <ErrorMessage name="profileImage" v-slot="{ message }">
          <div class="mt-1 text-xs text-text-passive flex items-center">
            <icons-close color="#EF4035" />
            <span>{{ message }}</span>
          </div>
        </ErrorMessage>
      </div>

      <div v-show="editMode" class="grid lg:grid-cols-2 gap-x-4 gap-y-8">
        <m-form-input
          name="name"
          label="نام کامل"
          placeholder="نام کامل خود را وارد کنید"
          required
        ></m-form-input>

        <!-- <m-form-field name="jobTitle">
          <m-select2 label="عنوان شغلی" required :options="jobTitles"></m-select2>
        </m-form-field> -->

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
              { title: 'جویای کار', value: '0' },
              { title: 'شاغل', value: '1' },
            ]"
            same-width
          />
        </div>

        <m-form-select2
          name="workExperience"
          label="سابقه کار"
          placeholder="میزان سابقه کار را انتخاب کنید"
          required
          :options="experiences"
        />

        <m-form-select2
          name="desiredSalary"
          label="حقوق درخواستی"
          placeholder="میزان حقوق درخواستی را انتخاب کنید"
          required
          :options="salaries"
        />

        <m-form-select2
          name="birthDate"
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
          name="militaryServiceStatus"
          label="وضعیت خدمت سربازی"
          placeholder="وضعیت خدمت سربازی را انتخاب کنید"
          :required="isMale"
          :disabled="!isMale"
          :options="militaryStatuses"
        />

        <m-radio-group name="maritalStatus" inline label="وضعیت تأهل">
          <template #default="{ modelValue, setValue }">
            <m-radio value="0" :model-value="modelValue" :set-value="setValue">
              مجرد
            </m-radio>
            <m-radio value="1" :model-value="modelValue" :set-value="setValue">
              متأهل
            </m-radio>
          </template>
        </m-radio-group>

        <m-form-select2
          name="province"
          label="استان محل سکونت"
          placeholder="استان محل سکونت را انتخاب کنید"
          required
          search
          :options="provinces"
        />

        <m-form-select2
          name="city"
          label="شهر محل سکونت"
          placeholder="شهر محل سکونت را انتخاب کنید"
          required
          search
          :options="cities"
        />

        <m-form-select2
          name="region"
          label="منطقه محل سکونت"
          placeholder="منطقه محل سکونت را انتخاب کنید"
          required
          search
          :options="regions"
          :disabled="!hasRegions"
        />

        <div class="lg:col-span-2">
          <m-form-input
            name="about"
            multiline
            label="درباره من:"
            placeholder="شرح مختصری درباره خودتان، توانایی‌های شما، علاقه مندی‌ها، سرگرمی‌ها و ... در اینجا بیان کنید."
          ></m-form-input>
        </div>

        <div class="lg:col-span-2 flex justify-end">
          <button
            class="btn btn-ghost"
            type="button"
            @click="changeEditMode(false)"
          >
            <Icon name="svg:close" />
            انصراف
          </button>
          <m-button class="btn-primary" type="submit" :loading>
            <Icon name="svg:check-check" />
            ذخیره
          </m-button>
        </div>
      </div>
      <div v-show="!editMode" class="grid lg:grid-cols-2 gap-x-4 gap-y-8">
        <InfoItem title="نام کامل:" :value="values.name" />
        <InfoItem
          title="عنوان شغلی:"
          :value="jobTitles.find((x) => x.value === values.jobTitle)?.label"
        />
        <InfoItem
          title="وضعیت اشتغال:"
          :value="
            values.jobStatus === '0'
              ? 'جویای کار'
              : values.jobStatus === '1'
              ? 'شاغل'
              : undefined
          "
        />
        <InfoItem
          title="سابقه کار:"
          :value="
            experiences.find((x) => x.value === values.workExperience)?.label
          "
        />
        <InfoItem
          title="حقوق درخواستی:"
          :value="salaries.find((x) => x.value === values.desiredSalary)?.label"
        />
        <InfoItem
          title="سال تولد:"
          :value="years.find((x) => x.value === values.birthDate)?.label"
        />
        <InfoItem
          title="جنسیت:"
          :value="
            values.gender === '1'
              ? 'آقا'
              : values.gender === '2'
              ? 'خانم'
              : undefined
          "
        />
        <InfoItem
          title="وضعیت خدمت سربازی:"
          :value="
            militaryStatuses.find(
              (x) => x.value === values.militaryServiceStatus,
            )?.label
          "
        />
        <InfoItem
          title="وضعیت تأهل:"
          :value="
            values.maritalStatus === '0'
              ? 'مجرد'
              : values.maritalStatus === '1'
              ? 'متأهل'
              : undefined
          "
        />
        <InfoItem
          title="استان محل سکونت:"
          :value="provinces.find((x) => String(x.value) === String(values.province))?.label"
        />
        <InfoItem
          title="شهر محل سکونت:"
          :value="cities.find((x) => String(x.value) === String(values.city))?.label"
        />
        <InfoItem
          title="منطقه محل سکونت:"
          :value="regions.find((x) => String(x.value) === String(values.region))?.label"
        />
        <InfoItem
          title="درباره من:"
          :value="values.about"
          class="lg:col-span-2"
        />
        <div class="lg:col-span-2 text-left mt-2">
          <button
            class="btn text-sm border-none text-primary-500 bg-[#4864E114] max-md:btn-block"
            type="button"
            @click="changeEditMode(true)"
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
import { ErrorMessage, Field, useForm } from "vee-validate";
import Titr from "./Titr.vue";
import * as Yup from "yup";
import InfoItem from "./InfoItem.vue";
import type { ISelectItem } from "~/types/select-item.js";

//Import Validation Rules
import { fullNameValidation } from "~/validations/fullName";
import { profileImageValidation } from "~/validations/profileImage";

// Variables
const api = useApi();
const { $toast } = useNuxtApp();
const { applyUserPayload, patchUser, refreshUser, avatar: userAvatar, user } =
  useCurrentUser();
const loading = api.loading;
const hasRegions = ref(false);
const editMode = ref(false);
const imageBase64 = ref<string | null>(null);
/** After local delete, don't fall back to the still-cached server avatar. */
const keepServerPreview = ref(true);
const cities = ref<ISelectItem[]>([]);
const regions = ref<ISelectItem[]>([]);
const { items: lookupItems } = useLookups(
  "job_titles,experience_levels,salary_ranges,birth_years,military_statuses,provinces",
);
const jobTitles = lookupItems("job_titles");
const experiences = lookupItems("experience_levels");
const salaries = lookupItems("salary_ranges");
const years = lookupItems("birth_years");
const militaryStatuses = lookupItems("military_statuses");
const provinces = lookupItems("provinces");

const avatarPreview = computed(() => {
  if (imageBase64.value) return imageBase64.value;
  if (keepServerPreview.value) return userAvatar.value;
  return null;
});

// Form
const formSchema = Yup.object({
  profileImage: profileImageValidation,
  name: fullNameValidation,
  jobTitle: Yup.string().required("عنوان شغلی انتخاب نشده است"),
  jobStatus: Yup.string().required("وضعیت شغلی انتخاب نشده است"),
  workExperience: Yup.string().required("سابقه کار انتخاب نشده است"),
  desiredSalary: Yup.string().required("حقوق درخواستی انتخاب نشده است"),
  birthDate: Yup.number().required("سال تولد انتخاب نشده است"),
  gender: Yup.string().required("جنسیت انتخاب نشده است"),
  militaryServiceStatus: Yup.string().when("gender", {
    is: "1",
    then: (schema) => schema.required("وضعیت خدمت سربازی انتخاب نشده است"),
    otherwise: (schema) => schema.notRequired(),
  }),
  maritalStatus: Yup.string().required("وضعیت تأهل انتخاب نشده است"),
  province: Yup.string().required("استان انتخاب نشده است"),
  city: Yup.string().required("شهر انتخاب نشده است"),
  region: Yup.string().when("city", {
    is: () => hasRegions.value === true,
    then: (schema) => schema.required("منطقه انتخاب نشده است"),
    otherwise: (schema) => schema.notRequired(),
  }),
  about: Yup.string(),
});
const {
  handleSubmit,
  setFieldValue,
  setFieldError,
  setValues,
  values,
} = useForm<Yup.InferType<typeof formSchema>>({
  initialValues: {},

  validationSchema: formSchema,
});

const isMale = computed(() => values.gender === "1");

watch(
  () => values.province,
  async (provinceId, oldValue) => {
    if (!provinceId) {
      cities.value = [];
      setFieldValue("city", ""); // ✔ مهم
      return;
    }

    cities.value = await api.get(`/cities/${provinceId}`);

    //If it's first load dont remove user saved city
    if (oldValue === undefined) return;
    setFieldValue("city", ""); // ✔ مهم‌ترین خط
  },
);

watch(
  () => values.city,
  async (cityId, oldValue) => {
    if (!cityId) {
      regions.value = [];
      hasRegions.value = false;
      setFieldValue("region", "");
      return;
    }

    const res = await api.get<ISelectItem[]>(`/regions/${cityId}`);

    regions.value = res;

    hasRegions.value = res.length > 0;

    //If it's first load dont remove user saved region
    if (oldValue === undefined) return;
    setFieldValue("region", "");
  },
);

// Functions
const changeEditMode = async (value: boolean) => {
  editMode.value = value;
  window.scrollTo({ top: 0 });
};

const onSubmit = handleSubmit(async (data) => {
  //let result =  await api.get('/lookups?keys=all');

  // خارج کردن تصویر پروفایل از فرم
  const { profileImage, ...payload } = data;
  //

  // پیدا کردن نام استان و شهر
  const selectedProvince = provinces.value.find(
    (p) => String(p.value) === String(data.province),
  );
  const selectedCity = cities.value.find(
    (c) => String(c.value) === String(data.city),
  );

  // اضافه کردن cityName به داده‌ها
  // const payload = {
  //   ...data,
  //   cityName: selectedCity?.label || null,
  //   cityId: selectedCity?.value || null,
  //   provinceName: selectedProvince?.label || null,
  //   provinceId: selectedProvince?.value || null,
  // };

  try {
    const result = await api.post<{ data?: Record<string, unknown> }>(
      "/cv/save-basics",
      payload,
    );
    applyUserPayload(result);
    patchUser({
      name: data.name,
      resume_personal: {
        ...((user.value?.resume_personal as Record<string, unknown> | undefined) ??
          {}),
        name: data.name,
      },
    });
    editMode.value = false;
    $toast.success("اطلاعات پایه با موفقیت ذخیره شد");
    await refreshUser();
  } catch (e) {
    $toast.error("خطا در ذخیره اطلاعات پایه");
  }

  //   await useSanctumFetch("/api/v1/cv/save-basics", {
  //   method: "POST",
  //   body: { data },
  // })
});

const handleProfileImage = async (file: File | null) => {
  if (!file) {
    try {
      const res = await api.delete<{ data?: { avatar?: string } }>(
        "cv/profile-image",
      );
      setFieldValue("profileImage", undefined);
      imageBase64.value = null;
      keepServerPreview.value = false;
      // Mark as default immediately so resume completion updates before refresh.
      patchUser({
        avatar: res?.data?.avatar ?? "files/default-avatar.png",
      });
      await refreshUser();
      $toast.success("تصویر پروفایل حذف شد");
    } catch {
      setFieldError("profileImage", "خطا در حذف تصویر");
      $toast.error("خطا در حذف تصویر");
    }
    return;
  }

  // clear previous error
  setFieldError("profileImage", undefined);

  // 1. validate type
  const isValidType = file.type === "image/png" || file.type === "image/jpeg";

  if (!isValidType) {
    setFieldError("profileImage", "فقط فرمت png و jpg مجاز است");
    return;
  }

  // 2. validate size (10MB)
  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    setFieldError("profileImage", "حجم تصویر نباید بیشتر از 10MB باشد");
    return;
  }

  try {
    // 3. upload — API returns { filename, url }
    const formData = new FormData();
    formData.append("profile_image", file);

    const res = await api.post<{
      data?: { filename?: string; url?: string };
    }>("cv/upload/profile-image", formData);

    const uploaded = res?.data;
    const filename = uploaded?.filename;
    const url = uploaded?.url;

    if (!filename && !url) {
      setFieldError("profileImage", "خطا در آپلود تصویر");
      return;
    }

    setFieldValue("profileImage", filename ?? url ?? "uploaded");
    keepServerPreview.value = true;
    if (url) {
      imageBase64.value = url;
    }
    await refreshUser();
    $toast.success("تصویر پروفایل با موفقیت آپلود شد");
  } catch (error) {
    setFieldError("profileImage", "خطا در آپلود تصویر");
    $toast.error("خطا در آپلود تصویر");
  }
};

onMounted(async () => {
  const currentUser = useSanctumUser<any>();
  const personal = currentUser.value?.data?.resume_personal;

  setValues({
    name: personal?.name ?? "",
    jobTitle: personal?.job_title ?? "",
    jobStatus: String(personal?.job_status ?? "0"),
    workExperience: personal?.work_experience ?? "",
    desiredSalary: personal?.desired_salary ?? "",
    birthDate: Number(personal?.birthdate ?? ""),
    gender: String(personal?.gender ?? ""),
    militaryServiceStatus: personal?.military_service_status ?? "",
    maritalStatus: String(personal?.marital_status ?? ""),
    province: personal?.province_id ?? "",
    city: personal?.city_id ?? "",
    region: personal?.region_id ?? "",
    about: personal?.about ?? "",
    // Marker so required validation passes when avatar already exists
    profileImage: userAvatar.value ? "existing" : undefined,
  });
});
</script>
