<template>
  <div>
    <button
      :class="editMode ? 'btn-cv-action' : 'btn btn-primary h-10 rounded-lg px-6 text-sm'"
      @click="showModal"
    >
      <div v-if="!editMode" class="flex items-center gap-2">
        <Icon name="svg:plus-white" size="16" />
        {{ label }}
      </div>
      <icons-edit v-else color="#4A4A4A" />
    </button>

    <m-dialog ref="experienceModalRef" :width="850">
      <Titr>{{ modalTitle }}</Titr>
      <form id="cv-experience-form" @submit.prevent="onSubmit" class="mt-6">
        <div class="grid md:grid-cols-2 gap-4">
          <m-form-select2
            name="title"
            label="عنوان شغلی:"
            required
            :options="jobTitles"
            placeholder="عنوان شغلی را انتخاب کنید"
          ></m-form-select2>
          <m-form-select2
            name="employmentType"
            label="نوع قرارداد:"
            :options="employment_types"
            placeholder="نوع قرارداد را انتخاب کنید"
          ></m-form-select2>
          <m-form-input
            name="companyName"
            label="نام سازمان:"
            placeholder="نام سازمان را وارد کنید"
            required
          ></m-form-input>
          <m-form-select2
            name="activityType"
            label="نوع فعالیت:"
            :options="industries"
            placeholder="نوع فعالیت را انتخاب کنید"
            required
          ></m-form-select2>
          <m-form-select2
            name="startYear"
            label="سال شروع اشتغال:"
            :options="years"
            placeholder="سال شروع اشتغال را انتخاب کنید"
            required
          ></m-form-select2>
          <div>
            <m-form-select2
              name="endYear"
              label="سال پایان اشتغال:"
              :required="!values.stillBusy"
              :options="years"
              :disabled="isEndYearDisabled"
              placeholder="سال پایان اشتغال را انتخاب کنید"
            ></m-form-select2>
            <label class="label mt-2 text-sm text-text-primay">
              <input
                name="stillBusy"
                type="checkbox"
                class="checkbox"
                :checked="values.stillBusy"
                @click="toggleStillBusy"
              />
              مشغول به کار هستم.
            </label>
          </div>
          <m-form-select2
            name="lastSalary"
            label="آخرین حقوق:"
            :options="salaries"
            placeholder="آخرین حقوق را انتخاب کنید"
          ></m-form-select2>
          <m-form-select2
            name="leavingReason"
            label="علت ترک کار:"
            :options="reasons"
            placeholder="علت ترک را انتخاب کنید"
          ></m-form-select2>
          <div class="lg:col-span-2">
            <m-form-input
              name="description"
              multiline
              label="توضیحات:"
              placeholder="هرگونه توضیحات مربوط به سابقه شغلی را در اینجا بیان کنید."
            ></m-form-input>
          </div>
        </div>
        <div>
          <div class="mt-6 flex items-center justify-end gap-2">
            <button
              class="btn btn-ghost h-10 rounded-lg text-sm text-text-passive"
              type="button"
              @click="experienceModalRef?.closeModal()"
            >
              <Icon name="svg:close" size="16" />
              انصراف
            </button>
            <m-button
              class="btn-primary h-10 rounded-lg px-6 text-sm"
              type="submit"
              :loading
            >
              <Icon :name="submitIcon" size="18" />
              {{ submitLabel }}
            </m-button>
          </div>
        </div>
      </form>
    </m-dialog>
  </div>
</template>

<script setup lang="ts">
import type Dialog from "~/components/M/Dialog.vue";
import { useForm } from "vee-validate";
import * as Yup from "yup";
import type { ISelectItem } from "~/types/select-item.js";
import Titr from "../Titr.vue";

// Props
const props = withDefaults(
  defineProps<{
    label?: string;
    jobTitles: ISelectItem[];
    employment_types: ISelectItem[];
    industries: ISelectItem[];
    years: ISelectItem[];
    salaries: ISelectItem[];
    reasons: ISelectItem[];
    editMode?: boolean;
    itemToEdit?: any;
  }>(),
  { editMode: false },
);

// Emits
const emits = defineEmits<{
  (e: "item", value: any): void;
}>();

// Variables
const experienceModalRef = ref<InstanceType<typeof Dialog> | null>(null);
const api = useApi();
const loading = api.loading;
const { notifyRequiredFieldsError } = useCvFormValidation();

const nullableString = () => Yup.string().nullable();

// Form
const formSchema = Yup.object({
  title: Yup.string().required("عنوان شغلی انتخاب نشده است"),
  employmentType: nullableString(),
  companyName: Yup.string().required("نام سازمان وارد نشده است"),
  activityType: Yup.string().required("نوع فعالیت انتخاب نشده است"),
  startYear: Yup.string().required("سال شروع انتخاب نشده است"),
  stillBusy: Yup.bool(),
  endYear: nullableString()
    .when("stillBusy", {
      is: false,
      then: (schema) => schema.required("سال پایان انتخاب نشده است"),
      otherwise: (schema) => schema.optional(),
    })
    .test(
      "end-year-after-start",
      "سال پایان نباید از سال شروع کمتر باشد",
      function (endYear) {
        const { startYear, stillBusy } = this.parent;

        if (stillBusy || !startYear || !endYear) return true;

        return Number(endYear) >= Number(startYear);
      },
    ),
  lastSalary: nullableString(),
  leavingReason: nullableString(),
  description: nullableString().max(
    400,
    "توضیحات نباید بیشتر از 400 کاراکتر باشد",
  ),
});
const { handleSubmit, values, setFieldValue, resetForm, setValues } = useForm<
  Yup.InferType<typeof formSchema>
>({
  validationSchema: formSchema,
  initialValues: {
    stillBusy: false,
  },
});

const nullableStringFields = [
  "employmentType",
  "endYear",
  "lastSalary",
  "leavingReason",
  "description",
] as const;

function normalizeFormValues(item: Record<string, unknown>) {
  const normalized = { ...item };

  for (const field of nullableStringFields) {
    if (normalized[field] == null) {
      normalized[field] = "";
    }
  }

  return normalized;
}

// Functions
async function showModal() {
  resetForm();
  await nextTick();
  if (props.itemToEdit) {
    setValues(normalizeFormValues(props.itemToEdit));
  }
  experienceModalRef.value?.showModal();
}

function toggleStillBusy() {
  const nextValue = !values.stillBusy;
  setFieldValue("stillBusy", nextValue);
  if (nextValue) {
    setFieldValue("endYear", "");
  }
}

const isEndYearDisabled = computed(() => values.stillBusy);

const modalTitle = computed(() =>
  props.editMode ? "ویرایش سابقه کاری" : "افزودن سابقه کاری",
);

const submitLabel = computed(() => (props.editMode ? "ذخیره" : "افزودن"));

const submitIcon = computed(() =>
  props.editMode ? "svg:check-check" : "svg:plus-white",
);

const onSubmit = handleSubmit(
  (data: Yup.InferType<typeof formSchema>) => {
    if (props.editMode) {
      emits("item", {
        ...data,
        id: props.itemToEdit.id,
      });
    } else {
      emits("item", data);
    }
    experienceModalRef.value?.closeModal();
  },
  () => {
    notifyRequiredFieldsError("cv-experience-form");
  },
);
</script>
