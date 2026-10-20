<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>دسته بندی پروژه</Titr>

    <div class="mt-6">
      <p class="relative mb-3 w-fit text-base">
        دسته بندی پروژه خود را انتخاب کنید
        <span class="absolute -top-2 text-red-400">*</span>
      </p>

      <div class="grid gap-3 md:grid-cols-3">
        <button
          v-for="option in PROJECT_CATEGORIES"
          :key="option.value"
          type="button"
          class="flex items-center gap-3 rounded-xl border p-4 text-right transition-colors"
          :class="
            form.category === option.value
              ? 'border-primary-500 bg-surface-soft'
              : 'border-gray-default bg-surface-50'
          "
          @click="selectCategory(option.value)"
        >
          <span
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
            :class="
              form.category === option.value
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-gray-default bg-white'
            "
          >
            <Icon
              v-if="form.category === option.value"
              name="lucide:check"
              size="12"
            />
          </span>
          <span class="text-sm font-semibold leading-6 text-text-tertiary">
            {{ option.label }}
          </span>
        </button>
      </div>

      <p v-if="errors.category" class="mt-1 text-xs text-[#EF4035]">
        {{ errors.category }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from "~/features/panel/cv/Titr.vue";
import {
  PROJECT_CATEGORIES,
  type ProjectCategoryId,
} from "~/data/project-types";
import type {
  CreateProjectFormErrors,
  CreateProjectFormModel,
} from "~/types/create-project-form";

const props = defineProps<{
  form: CreateProjectFormModel;
  errors: CreateProjectFormErrors;
}>();

function selectCategory(value: ProjectCategoryId) {
  if (props.form.category === value) return;
  props.form.category = value;
  props.form.type = "";
  props.form.scopes = [];
  props.form.desc = "";
}
</script>
