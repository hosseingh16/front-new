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
      <Titr>افزودن نرم‌افزار حسابداری</Titr>
      <form @submit="onSubmit" class="mt-6">
        <div class="grid md:grid-cols-2 gap-x-4 gap-y-12">
          <m-form-select2
            name="programName"
            label="نام نرم‌افزار حسابداری:"
            class="md:col-span-2"
            required
            :options="programs"
            placeholder="نرم‌افزار حسابداری را انتخاب کنید"
          ></m-form-select2>
          <Slider
            color="#FFA726"
            label="میزان تسلط به زیر سیستم انبار:"
            @update:model-value="(v) => setFieldValue('slider1', v)"
          />
          <Slider
            color="#FFA726"
            label="میزان تسلط به زیر سیستم مالی:"
            @update:model-value="(v) => setFieldValue('slider2', v)"
          />
          <Slider
            color="#FFA726"
            label="میزان تسلط به زیر سیستم حقوق:"
            @update:model-value="(v) => setFieldValue('slider3', v)"
          />
          <Slider
            color="#FFA726"
            label="میزان تسلط به زیر سیستم فروش:"
            @update:model-value="(v) => setFieldValue('slider4', v)"
          />
          <Slider
            color="#FFA726"
            label="میزان تسلط به زیر سیستم نقد و بانک:"
            @update:model-value="(v) => setFieldValue('slider5', v)"
          />
        </div>
        <div class="mt-12">
          <div class="flex justify-end mt-4">
            <button class="btn btn-ghost" type="button" @click="modalRef?.closeModal()">
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
import { Field, useForm } from 'vee-validate';
import * as Yup from 'yup';
import type { ISelectItem } from '~/types/select-item.js';
import Titr from '../Titr.vue';
import Slider from '../Slider.vue';

// Props
const props = withDefaults(
  defineProps<{
    label?: string;
    programs: ISelectItem[];
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
  programName: Yup.string().required('نام نرم‌افزار حسابداری انتخاب نشده است'),
  slider1: Yup.number(),
  slider2: Yup.number(),
  slider3: Yup.number(),
  slider4: Yup.number(),
  slider5: Yup.number(),
});
const { handleSubmit, values, setFieldValue, resetForm, setValues } = useForm<
  Yup.InferType<typeof formSchema>
>({
  validationSchema: formSchema,
  initialValues: {
    programName: '',
    slider1: 0,
    slider2: 0,
    slider3: 0,
    slider4: 0,
    slider5: 0,
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

const onSubmit = handleSubmit((data: Yup.InferType<typeof formSchema>) => {
  console.log(data);
  emits('item', data);
  modalRef.value?.closeModal();
});
</script>
