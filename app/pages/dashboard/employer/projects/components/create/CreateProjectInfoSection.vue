<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>اطلاعات پروژه</Titr>

    <div class="mt-6 space-y-6">
      <div>
        <m-select2
          v-model="selectedType"
          label="نوع پروژه:"
          required
          :options="PROJECT_TYPE_OPTIONS"
          placeholder="لطفا انتخاب کنید"
          :error="Boolean(errors.type)"
        />
        <p v-if="errors.type" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.type }}
        </p>
      </div>

      <div>
        <m-select2-multi
          v-model="selectedScopes"
          label="حوزه‌های پروژه:"
          required
          chip-tone="primary"
          :options="areaOptions"
          :disabled="!form.type"
          placeholder="لطفا انتخاب کنید"
          :error="Boolean(errors.scopes)"
        />
        <p
          class="mt-2 flex items-center gap-1 text-xs text-text-passive"
        >
          <Icon name="svg:info" size="14" class="shrink-0" />
          می‌توانید چند مورد انتخاب کنید
        </p>
        <p v-if="errors.scopes" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.scopes }}
        </p>
      </div>

      <div>
        <p class="relative mb-2 w-fit text-base">
          شرح خدمات قابل ارائه:
          <span class="absolute -top-2 text-red-400">*</span>
        </p>
        <textarea
          v-model="form.desc"
          rows="6"
          :maxlength="PROJECT_DESC_MAX_LENGTH"
          class="textarea min-h-32 w-full rounded-lg border bg-white p-3 text-sm leading-7 shadow-none placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/25"
          :class="
            errors.desc ? 'border-danger-200' : 'border-gray-default'
          "
          placeholder="شرح خدمات مورد نیاز پروژه را بنویسید..."
        />
        <div class="mt-1 flex items-start justify-between gap-3">
          <p v-if="errors.desc" class="text-xs text-[#EF4035]">
            {{ errors.desc }}
          </p>
          <p
            class="ms-auto shrink-0 text-xs"
            :class="isOverLimit ? 'text-[#EF4035]' : 'text-text-passive'"
          >
            {{ characterCount.toLocaleString("en-US") }} /
            {{ PROJECT_DESC_MAX_LENGTH.toLocaleString("en-US") }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from "~/features/panel/cv/Titr.vue";
import {
  getProjectAreas,
  PROJECT_TYPE_OPTIONS,
} from "~/data/project-types";
import type {
  CreateProjectFormErrors,
  CreateProjectFormModel,
} from "~/types/create-project-form";
import { PROJECT_DESC_MAX_LENGTH } from "~/types/create-project-form";

const props = defineProps<{
  form: CreateProjectFormModel;
  errors: CreateProjectFormErrors;
}>();

const areaOptions = computed(() => getProjectAreas(props.form.type));

const selectedType = computed({
  get: () => props.form.type || undefined,
  set: (value: string | number | undefined) => {
    props.form.type = value == null ? "" : String(value);
  },
});

const selectedScopes = computed({
  get: () => props.form.scopes as Array<string | number>,
  set: (value: Array<string | number>) => {
    const allowed = new Set(areaOptions.value.map((item) => String(item.value)));
    props.form.scopes = value.map(String).filter((item) => allowed.has(item));
  },
});

const characterCount = computed(() => props.form.desc.length);
const isOverLimit = computed(
  () => characterCount.value > PROJECT_DESC_MAX_LENGTH,
);

watch(
  () => props.form.type,
  (type, previous) => {
    if (type === previous) return;
    props.form.scopes = [];
  },
);
</script>
