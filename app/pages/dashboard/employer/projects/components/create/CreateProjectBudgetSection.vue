<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>مبلغ بودجه</Titr>

    <div class="mt-6 space-y-6">
      <m-select2
        v-model="selectedBudgetMode"
        label="انتخاب بودجه:"
        :options="budgetModeOptions"
        placeholder="بودجه دلخواه"
      />

      <div
        class="flex items-start gap-2 text-sm text-[#B95C04]"
      >
        <Icon
          name="lucide:triangle-alert"
          class="mt-0.5 shrink-0"
          size="18"
        />
        <span>
          حداقل بودجه پروژه {{ formattedMinBudget }} تومان است.
        </span>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <div>
          <m-text-field
            :model-value="minBudgetDisplay"
            label="حداقل بودجه (تومان):"
            required
            placeholder="10,000,000"
            :error="Boolean(errors.min_budget)"
            @update:model-value="onMinBudgetInput"
          >
            <template #suffix>
              <span class="text-sm text-text-passive">تومان</span>
            </template>
          </m-text-field>
          <p v-if="errors.min_budget" class="mt-1 text-xs text-[#EF4035]">
            {{ errors.min_budget }}
          </p>
        </div>

        <div>
          <m-text-field
            :model-value="maxBudgetDisplay"
            label="حداکثر بودجه (تومان):"
            required
            placeholder="25,000,000"
            :error="Boolean(errors.max_budget)"
            @update:model-value="onMaxBudgetInput"
          >
            <template #suffix>
              <span class="text-sm text-text-passive">تومان</span>
            </template>
          </m-text-field>
          <p v-if="errors.max_budget" class="mt-1 text-xs text-[#EF4035]">
            {{ errors.max_budget }}
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
import { PROJECT_MIN_BUDGET } from "~/types/create-project-form";
import {
  formatBudgetInput,
  parseBudgetInput,
} from "~/utils/create-project-payload";

const props = defineProps<{
  form: CreateProjectFormModel;
  errors: CreateProjectFormErrors;
}>();

const budgetModeOptions: ISelectItem[] = [
  { value: "custom", label: "بودجه دلخواه" },
];

const selectedBudgetMode = computed({
  get: () => props.form.budget_mode || undefined,
  set: (value: string | number | undefined) => {
    props.form.budget_mode = value == null ? "custom" : String(value);
  },
});

const formattedMinBudget = computed(() =>
  formatBudgetInput(PROJECT_MIN_BUDGET),
);

const minBudgetDisplay = computed(() =>
  formatBudgetInput(props.form.min_budget),
);
const maxBudgetDisplay = computed(() =>
  formatBudgetInput(props.form.max_budget),
);

function onMinBudgetInput(value: string) {
  props.form.min_budget = parseBudgetInput(value);
}

function onMaxBudgetInput(value: string) {
  props.form.max_budget = parseBudgetInput(value);
}
</script>
