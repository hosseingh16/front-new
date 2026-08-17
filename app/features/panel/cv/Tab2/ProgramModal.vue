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

    <m-dialog ref="modalRef" :width="850">
      <Titr>{{ modalTitle }}</Titr>
      <form @submit.prevent="onSubmit" class="mt-6">
        <div class="grid md:grid-cols-2 gap-x-4 gap-y-12">
          <m-form-select2
            name="programName"
            label="نام نرم‌افزار حسابداری:"
            class="md:col-span-2"
            required
            search
            :options="programs"
            placeholder="نرم‌افزار حسابداری را انتخاب کنید"
          ></m-form-select2>

          <template v-if="hasSubsystems">
            <Slider
              :model-value="values.slider1 ?? 0"
              label="میزان تسلط به زیر سیستم انبار:"
              @update:model-value="(v) => setFieldValue('slider1', v)"
            />
            <Slider
              :model-value="values.slider2 ?? 0"
              label="میزان تسلط به زیر سیستم مالی:"
              @update:model-value="(v) => setFieldValue('slider2', v)"
            />
            <Slider
              :model-value="values.slider3 ?? 0"
              label="میزان تسلط به زیر سیستم حقوق:"
              @update:model-value="(v) => setFieldValue('slider3', v)"
            />
            <Slider
              :model-value="values.slider4 ?? 0"
              label="میزان تسلط به زیر سیستم فروش:"
              @update:model-value="(v) => setFieldValue('slider4', v)"
            />
            <Slider
              :model-value="values.slider5 ?? 0"
              label="میزان تسلط به زیر سیستم نقد و بانک:"
              @update:model-value="(v) => setFieldValue('slider5', v)"
            />
          </template>

          <template v-else-if="selectedProgram">
            <div class="md:col-span-2 md:flex md:justify-start">
              <div class="w-full md:w-1/2">
                <Slider
                  :model-value="values.generalSkill ?? 0"
                  :label="generalSkillLabel"
                  @update:model-value="(v) => setFieldValue('generalSkill', v)"
                />
              </div>
            </div>
          </template>
        </div>
        <div class="mt-12">
          <div class="mt-6 flex items-center justify-end gap-2">
            <button
              class="btn btn-ghost h-10 rounded-lg text-sm text-text-passive"
              type="button"
              @click="modalRef?.closeModal()"
            >
              <Icon name="svg:close" size="16" />
              انصراف
            </button>
            <m-button
              class="btn-primary h-10 rounded-lg px-6 text-sm"
              type="submit"
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
import type Dialog from '~/components/M/Dialog.vue';
import { useForm } from 'vee-validate';
import * as Yup from 'yup';
import type { ISelectItem } from '~/types/select-item.js';
import Titr from '../Titr.vue';
import Slider from '../Slider.vue';

type ProgramFormValues = {
  id?: number;
  programName: string | number;
  programType: 0 | 1;
  generalSkill: number;
  slider1: number;
  slider2: number;
  slider3: number;
  slider4: number;
  slider5: number;
};

// Props
const props = withDefaults(
  defineProps<{
    label?: string;
    programs: ISelectItem[];
    editMode?: boolean;
    itemToEdit?: Partial<ProgramFormValues>;
  }>(),
  { editMode: false },
);

// Emits
const emits = defineEmits<{
  (e: 'item', value: ProgramFormValues): void;
}>();

// Variables
const modalRef = ref<InstanceType<typeof Dialog> | null>(null);
const skipProgramWatch = ref(false);

function resolveProgramType(program?: ISelectItem): 0 | 1 {
  return program?.type === 0 ? 0 : 1;
}

function findProgram(programName?: string | number) {
  if (programName == null || programName === '') return undefined;
  return props.programs.find(
    (program) => String(program.value) === String(programName),
  );
}

function resetSkillFields(type: 0 | 1) {
  setFieldValue('programType', type);
  setFieldValue('generalSkill', 0);
  setFieldValue('slider1', 0);
  setFieldValue('slider2', 0);
  setFieldValue('slider3', 0);
  setFieldValue('slider4', 0);
  setFieldValue('slider5', 0);
}

// Form
const formSchema = Yup.object({
  programName: Yup.mixed<string | number>()
    .test(
      'required',
      'نام نرم‌افزار حسابداری انتخاب نشده است',
      (value) => value != null && value !== '',
    ),
  programType: Yup.number(),
  generalSkill: Yup.number(),
  slider1: Yup.number(),
  slider2: Yup.number(),
  slider3: Yup.number(),
  slider4: Yup.number(),
  slider5: Yup.number(),
});

const { handleSubmit, values, setFieldValue, resetForm, setValues } =
  useForm<ProgramFormValues>({
    validationSchema: formSchema,
    initialValues: {
      programName: '',
      programType: 1,
      generalSkill: 0,
      slider1: 0,
      slider2: 0,
      slider3: 0,
      slider4: 0,
      slider5: 0,
    },
  });

const selectedProgram = computed(() => findProgram(values.programName));

const hasSubsystems = computed(
  () => resolveProgramType(selectedProgram.value) === 1,
);

const generalSkillLabel = computed(() => {
  const label = selectedProgram.value?.label;
  return label
    ? `میزان تسلط به نرم افزار ${label}:`
    : 'میزان تسلط به نرم افزار:';
});

const modalTitle = computed(() =>
  props.editMode ? 'ویرایش نرم افزار حسابداری' : 'افزودن نرم‌افزار حسابداری',
);

const submitLabel = computed(() => (props.editMode ? 'ذخیره' : 'افزودن'));

const submitIcon = computed(() =>
  props.editMode ? 'svg:check-check' : 'svg:plus-white',
);

watch(
  () => values.programName,
  (programName, previous) => {
    if (skipProgramWatch.value || !programName || programName === previous) {
      return;
    }

    resetSkillFields(resolveProgramType(findProgram(programName)));
  },
);

// Functions
async function showModal() {
  skipProgramWatch.value = true;
  resetForm();
  await nextTick();

  if (props.itemToEdit) {
    const program = findProgram(props.itemToEdit.programName);
    const programType =
      props.itemToEdit.programType ?? resolveProgramType(program);

    setValues({
      programName: '',
      generalSkill: 0,
      slider1: 0,
      slider2: 0,
      slider3: 0,
      slider4: 0,
      slider5: 0,
      ...props.itemToEdit,
      programType,
    });
  }

  await nextTick();
  skipProgramWatch.value = false;
  modalRef.value?.showModal();
}

const onSubmit = handleSubmit((data: ProgramFormValues) => {
  const programType = resolveProgramType(findProgram(data.programName));

  emits('item', {
    ...data,
    programType,
    ...(props.editMode && props.itemToEdit?.id != null
      ? { id: props.itemToEdit.id }
      : {}),
  });
  modalRef.value?.closeModal();
});
</script>
