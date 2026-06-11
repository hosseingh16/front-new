<template>
  <div>
    <button
      class="btn"
      :class="
        editMode
          ? 'btn bg-white h-8 w-8 p-0 border-2 rounded-lg border-text-muted'
          : 'btn-primary'
      "
      @click="showModal"
    >
      <div v-if="!editMode" class="flex items-center gap-2">
        <Icon name="svg:plus-white" size="16" />
        {{ label }}
      </div>
      <icons-edit v-else color="#4A4A4A" />
    </button>

    <m-dialog ref="experienceModalRef" :width="850">
      <Titr>افزودن سابقه کاری</Titr>
      <form @submit="onSubmit" class="mt-6">
        <div class="grid md:grid-cols-2 gap-4">
          <m-form-select2
            name="jobTitle"
            label="عنوان شغلی:"
            required
            :options="jobTitles"
            placeholder="عنوان شغلی را انتخاب کنید"
          ></m-form-select2>
          <m-form-select2
            name="contractType"
            label="نوع قرارداد:"
            :options="contractTypes"
            placeholder="نوع قرارداد را انتخاب کنید"
          ></m-form-select2>
          <m-form-input
            name="organization"
            label="نام سازمان:"
            placeholder="نام سازمان را وارد کنید"
            required
          ></m-form-input>
          <m-form-select2
            name="actionType"
            label="نوع فعالیت:"
            :options="actionTypes"
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
              required
              :options="years"
              placeholder="سال پایان اشتغال را انتخاب کنید"
            ></m-form-select2>
            <label class="label mt-2 text-sm text-text-primay">
              <input
                name="busy"
                type="checkbox"
                class="checkbox"
                :checked="values.busy"
                @click="setFieldValue('busy', !values.busy)"
              />
              مشغول به کار هستم.
            </label>
          </div>
          <m-form-select2
            name="lastSalary"
            label="آخرین حقوق:"
            :options="years"
            placeholder="آخرین حقوق را انتخاب کنید"
          ></m-form-select2>
          <m-form-select2
            name="reason"
            label="علت ترک کار:"
            required
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
          <div class="flex justify-end mt-4">
            <button
              class="btn btn-ghost"
              type="button"
              @click="experienceModalRef?.closeModal()"
            >
              <Icon name="svg:close" />
              انصراف
            </button>
            <m-button class="btn-primary" :loading>
              <Icon name="svg:plus-white" />
              افزودن
            </m-button>
          </div>
        </div>
      </form>
    </m-dialog>
  </div>
</template>

<script setup lang="ts">
import type Dialog from '~/components/M/Dialog.vue';
import { useForm } from 'vee-validate';
import * as Yup from 'yup';
import type { ISelectItem } from '~/types/ISelectItem';
import Titr from '../Titr.vue';

// Props
const props = withDefaults(
  defineProps<{
    label?: string;
    jobTitles: ISelectItem[];
    contractTypes: ISelectItem[];
    actionTypes: ISelectItem[];
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
  (e: 'item', value: any): void;
}>();

// Variables
const experienceModalRef = ref<InstanceType<typeof Dialog> | null>(null);
const api = useApi();
const loading = api.loading;

// Form
const formSchema = Yup.object({
  jobTitle: Yup.string().required('عنوان شغلی انتخاب نشده است'),
  contractType: Yup.string(),
  organization: Yup.string().required('نام سازمان وارد نشده است'),
  actionType: Yup.string().required('نوع فعالیت انتخاب نشده است'),
  startYear: Yup.string().required('سال شروع انتخاب نشده است'),
  busy: Yup.bool(),
  endYear: Yup.string().when('busy', {
    is: false,
    then: (schema) => schema.required('سال پایان انتخاب نشده است'),
    otherwise: (schema) => schema.optional(),
  }),
  lastSalary: Yup.string(),
  reason: Yup.string().required('علت ترک کار انتخاب نشده است'),
  description: Yup.string(),
});
const { handleSubmit, values, setFieldValue, resetForm, setValues } = useForm<
  Yup.InferType<typeof formSchema>
>({
  validationSchema: formSchema,
  initialValues: {
    busy: false,
  },
});

// Functions
async function showModal() {
  resetForm();
  await nextTick();
  if (props.itemToEdit) {
    setValues(props.itemToEdit);
  }
  experienceModalRef.value?.showModal();
}

const onSubmit = handleSubmit((data: Yup.InferType<typeof formSchema>) => {
  console.log(data);
  emits('item', data);
  experienceModalRef.value?.closeModal();
});
</script>
