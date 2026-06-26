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

    <m-dialog ref="modalRef" :width="850">
      <Titr>افزودن سابقه تحصیلی</Titr>
      <form @submit.prevent="onSubmit" class="mt-6">
        <div class="grid md:grid-cols-2 gap-4">
          <m-form-select2
            name="degree"
            label="مقطع تحصیلی:"
            required
            :options="levels"
            placeholder="مقطع تحصیلی را انتخاب کنید"
          ></m-form-select2>
          <m-form-input
            name="major"
            label="رشته تحصیلی:"
            placeholder="رشته تحصیلی را وارد کنید"
            required
          ></m-form-input>
          <m-form-input
            name="university"
            label="نام آمورشگاه / موسسه آموزشی:"
            placeholder="نام آمورشگاه / موسسه آموزشی را وارد کنید"
            required
          ></m-form-input>
          <div>
            <m-form-select2
              name="enddate"
              label="تاریخ فارغ‌التحصیلی:"
              required
              :options="years"
              :disabled="isGraduationDateDisabled"
              placeholder="تاریخ فارق التحصیلی را انتخاب کنید"
            ></m-form-select2>
            <label class="label mt-2 text-sm text-text-primay">
              <input
                name="stillbusy"
                type="checkbox"
                class="checkbox"
                :checked="values.stillbusy"
                @click="setFieldValue('stillbusy', !values.stillbusy)"
              />
              مشغول به تحصیل هستم.
            </label>
          </div>
          <div class="lg:col-span-2">
            <m-form-input
              name="description"
              multiline
              label="توضیحات:"
              placeholder="هرگونه توضیحات مربوط به سوابق درسی و تحصیلی را در اینجا بیان کنید."
            ></m-form-input>
          </div>
        </div>
        <div>
          <div class="flex justify-end mt-4">
            <button class="btn btn-ghost" type="button" @click="modalRef?.closeModal()">
              <Icon name="svg:close" />
              انصراف
            </button>
            <m-button  type="submit" class="btn-primary" :loading>
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
import type { ISelectItem } from '~/types/select-item.js';
import Titr from '../Titr.vue';

// Props
const props = withDefaults(
  defineProps<{
    label?: string;
    levels: ISelectItem[];
    years: ISelectItem[];
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
const modalRef = ref<InstanceType<typeof Dialog> | null>(null);
const api = useApi();
const loading = api.loading;

// Form
const formSchema = Yup.object({
  degree: Yup.string().required('مقطع تحصیلی انتخاب نشده است'),
  major: Yup.string().required('رشته تحصیلی وارد نشده است'),
  university: Yup.string().required('آموزشگاه وارد نشده است'),
  stillbusy: Yup.bool(),
  enddate: Yup.string().when('stillbusy', {
    is: false,
    then: (schema) => schema.required('تاریخ فارغ‌التحصیلی انتخاب نشده است'),
    otherwise: (schema) => schema.optional(),
  }),
  description: Yup.string(),
});
const { handleSubmit, values, setFieldValue, resetForm, setValues } = useForm<
  Yup.InferType<typeof formSchema>
>({
  validationSchema: formSchema,
  initialValues: {
    degree: '',
    major: '',
    university: '',
    enddate: '',
    description: '',
    stillbusy: false,
  },
});

// Functions
async function showModal() {
  resetForm();
  await nextTick();
  if (props.itemToEdit) {
    setValues(props.itemToEdit);
  }
  modalRef.value?.showModal();
}

const isGraduationDateDisabled = computed(() => values.stillbusy);

const onSubmit = handleSubmit((data: Yup.InferType<typeof formSchema>) => { 
  emits('item', data);
  modalRef.value?.closeModal();
});
</script>
