<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>اطلاعات پروژه</Titr>

    <div class="mt-6 space-y-6">
      <div>
        <m-select2
          v-model="selectedType"
          label="نوع پروژه:"
          required
          :options="typeOptions"
          :disabled="!form.category"
          placeholder="دسته پروژه را انتخاب کنید"
          :error="Boolean(errors.type)"
        />
        <p v-if="errors.type" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.type }}
        </p>
      </div>

      <div v-if="form.type">
        <p class="relative mb-3 w-fit text-base">
          لطفا حوزه‌های کاری پروژه را انتخاب کنید
          <span class="absolute -top-2 text-red-400">*</span>
        </p>
        <p class="mb-4 flex items-center gap-1 text-xs text-text-passive">
          <Icon name="svg:info" size="14" class="shrink-0" />
          می‌توانید چند مورد انتخاب کنید
        </p>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="option in areaOptions"
            :key="String(option.value)"
            type="button"
            class="flex items-center gap-3 rounded-xl border p-3 text-right transition-colors"
            :class="
              isScopeSelected(option.value)
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-default bg-surface-50'
            "
            @click="toggleScope(option.value)"
          >
            <span
              class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
              :class="
                isScopeSelected(option.value)
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-gray-default bg-white'
              "
            >
              <Icon
                v-if="isScopeSelected(option.value)"
                name="lucide:check"
                size="12"
              />
            </span>
            <span class="text-sm leading-6 text-text-tertiary">
              {{ option.label }}
            </span>
          </button>
        </div>

        <p v-if="errors.scopes" class="mt-2 text-xs text-[#EF4035]">
          {{ errors.scopes }}
        </p>
      </div>

      <div v-if="form.type">
        <p class="relative mb-2 w-fit text-base">
          شرح خدمات قابل ارائه:
          <span class="absolute -top-2 text-red-400">*</span>
        </p>
        <textarea
          v-model="form.desc"
          rows="6"
          :maxlength="PROJECT_DESC_MAX_LENGTH"
          class="textarea min-h-32 w-full rounded-lg border bg-white p-3 text-sm leading-7 shadow-none placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/25"
          :class="errors.desc ? 'border-danger-200' : 'border-gray-default'"
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
  getProjectTypesByCategory,
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

const typeOptions = computed(() =>
  getProjectTypesByCategory(props.form.category),
);

const areaOptions = computed(() => getProjectAreas(props.form.type));

const selectedType = computed({
  get: () => props.form.type || undefined,
  set: (value: string | number | undefined) => {
    props.form.type = value == null ? "" : String(value);
  },
});

const characterCount = computed(() => props.form.desc.length);
const isOverLimit = computed(
  () => characterCount.value > PROJECT_DESC_MAX_LENGTH,
);

function isScopeSelected(value: string | number) {
  return props.form.scopes.includes(String(value));
}

function toggleScope(value: string | number) {
  const key = String(value);
  if (props.form.scopes.includes(key)) {
    props.form.scopes = props.form.scopes.filter((item) => item !== key);
    return;
  }
  props.form.scopes = [...props.form.scopes, key];
}

watch(
  () => props.form.type,
  (type, previous) => {
    if (type === previous) return;
    props.form.scopes = [];
  },
);
</script>
