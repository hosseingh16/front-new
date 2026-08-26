<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>نحوه انجام پروژه</Titr>

    <p class="mt-4 flex items-start gap-2 text-sm leading-7 text-text-passive">
      <Icon name="svg:info" size="16" class="mt-0.5 shrink-0" />
      مشخص کنید انجام این پروژه نیازمند حضور فیزیکی حسابدار است یا به‌صورت
      غیرحضوری قابل انجام است.
    </p>

    <div class="mt-6">
      <p class="relative mb-3 w-fit text-base">
        نحوه مدیریت حسابداری در پروژه شما:
        <span class="absolute -top-2 text-red-400">*</span>
      </p>

      <div class="grid gap-4 md:grid-cols-2">
        <button
          v-for="option in presenceOptions"
          :key="option.value"
          type="button"
          class="flex items-center gap-3 rounded-xl border p-4 text-right transition-colors"
          :class="
            form.presence_mode === option.value
              ? 'border-primary-500 bg-surface-soft'
              : 'border-gray-default bg-surface-50'
          "
          @click="form.presence_mode = option.value"
        >
          <span
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
            :class="
              form.presence_mode === option.value
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-gray-default bg-white'
            "
          >
            <Icon
              v-if="form.presence_mode === option.value"
              name="lucide:check"
              size="12"
            />
          </span>
          <span class="text-sm font-semibold text-text-tertiary">
            {{ option.label }}
          </span>
        </button>
      </div>

      <p v-if="errors.presence_mode" class="mt-1 text-xs text-[#EF4035]">
        {{ errors.presence_mode }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from "~/features/panel/cv/Titr.vue";
import type {
  CreateProjectFormErrors,
  CreateProjectFormModel,
  ProjectPresenceMode,
} from "~/types/create-project-form";

defineProps<{
  form: CreateProjectFormModel;
  errors: CreateProjectFormErrors;
}>();

const presenceOptions: Array<{
  value: ProjectPresenceMode;
  label: string;
}> = [
  { value: "required", label: "نیاز به حضور حسابدار" },
  { value: "not_required", label: "بدون نیاز به حضور حسابدار" },
];
</script>
