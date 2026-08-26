<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>مدت زمان</Titr>

    <div class="mt-6 space-y-6">
      <m-select2
        v-model="selectedTimeMode"
        label="انتخاب زمان:"
        :options="timeModeOptions"
        placeholder="بازه دلخواه"
      />

      <div class="grid gap-6 lg:grid-cols-2">
        <div>
          <m-select2
            v-model="minTimeValue"
            label="حداقل زمان:"
            required
            :options="timeValueOptions"
            placeholder="لطفا انتخاب کنید"
            :error="Boolean(errors.min_time)"
          />
          <p v-if="errors.min_time" class="mt-1 text-xs text-[#EF4035]">
            {{ errors.min_time }}
          </p>
        </div>

        <div>
          <m-select2
            v-model="maxTimeValue"
            label="حداکثر زمان:"
            required
            :options="timeValueOptions"
            placeholder="لطفا انتخاب کنید"
            :error="Boolean(errors.max_time)"
          />
          <p v-if="errors.max_time" class="mt-1 text-xs text-[#EF4035]">
            {{ errors.max_time }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from "~/features/panel/cv/Titr.vue";
import type { ISelectItem } from "~/types/select-item";
import type {
  CreateProjectFormErrors,
  CreateProjectFormModel,
} from "~/types/create-project-form";

const props = defineProps<{
  form: CreateProjectFormModel;
  errors: CreateProjectFormErrors;
}>();

const timeModeOptions: ISelectItem[] = [
  { value: "custom", label: "بازه دلخواه" },
];

const selectedTimeMode = computed({
  get: () => props.form.time_mode || undefined,
  set: (value: string | number | undefined) => {
    props.form.time_mode = value == null ? "custom" : String(value);
  },
});

const timeValueOptions: ISelectItem[] = Array.from({ length: 30 }, (_, i) => {
  const value = i + 1;
  return { value, label: String(value) };
});

const minTimeValue = computed({
  get: () => props.form.min_time_value ?? undefined,
  set: (value: string | number | undefined) => {
    props.form.min_time_value =
      value == null || value === "" ? null : Number(value);
  },
});

const maxTimeValue = computed({
  get: () => props.form.max_time_value ?? undefined,
  set: (value: string | number | undefined) => {
    props.form.max_time_value =
      value == null || value === "" ? null : Number(value);
  },
});
</script>
