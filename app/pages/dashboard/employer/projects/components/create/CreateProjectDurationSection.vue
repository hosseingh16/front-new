<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>مدت زمان</Titr>

    <div class="mt-6 space-y-6">
      <div>
        <m-select2
          v-model="selectedTimeMode"
          label="انتخاب زمان:"
          required
          :options="PROJECT_TIME_OPTIONS"
          placeholder="زمان مناسب را انتخاب کنید"
          :error="Boolean(errors.time)"
          @update:model-value="onTimeModeChange"
        />
        <p v-if="errors.time" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.time }}
        </p>
      </div>

      <div
        v-if="form.time_mode === 'custom'"
        class="grid gap-6 lg:grid-cols-2"
      >
        <div>
          <m-select2
            v-model="minTimeValue"
            label="حداقل زمان:"
            required
            :options="PROJECT_TIME_VALUE_OPTIONS"
            placeholder="حداقل زمان را انتخاب کنید"
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
            :options="PROJECT_TIME_VALUE_OPTIONS"
            placeholder="حداکثر زمان را انتخاب کنید"
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
import {
  getProjectTimePreset,
  PROJECT_TIME_OPTIONS,
  PROJECT_TIME_VALUE_OPTIONS,
} from "~/data/project-types";
import type {
  CreateProjectFormErrors,
  CreateProjectFormModel,
} from "~/types/create-project-form";

const props = defineProps<{
  form: CreateProjectFormModel;
  errors: CreateProjectFormErrors;
}>();

const selectedTimeMode = computed({
  get: () => props.form.time_mode || undefined,
  set: (value: string | number | undefined) => {
    props.form.time_mode = value == null ? "" : String(value);
  },
});

const minTimeValue = computed({
  get: () =>
    props.form.min_time_value == null
      ? undefined
      : String(props.form.min_time_value),
  set: (value: string | number | undefined) => {
    props.form.min_time_value =
      value == null || value === "" ? null : Number(value);
  },
});

const maxTimeValue = computed({
  get: () =>
    props.form.max_time_value == null
      ? undefined
      : String(props.form.max_time_value),
  set: (value: string | number | undefined) => {
    props.form.max_time_value =
      value == null || value === "" ? null : Number(value);
  },
});

function onTimeModeChange(value: string | number | undefined) {
  const preset = getProjectTimePreset(value == null ? "" : String(value));
  if (!preset || preset.value === "custom") {
    props.form.min_time_value = null;
    props.form.max_time_value = null;
    return;
  }

  props.form.min_time_value = preset.min ?? null;
  props.form.max_time_value = preset.max ?? null;
}
</script>
