<template>
  <div>
    <Field :name="name" v-slot="{ field, value, errorMessage }">
      <m-select2
        v-bind="{ ...$props, ...field }"
        :default-value="field.value"
        :error="!!errorMessage"
        :model-value="value"
      >
        <template v-if="$slots.prefix" #prefix>
          <slot name="prefix" />
        </template>

        <template v-if="$slots.suffix" #suffix>
          <slot name="suffix" />
        </template>
      </m-select2>

      <ErrorMessage :name="name" v-slot="{ message }">
        <div class="mt-1 text-xs text-text-passive flex items-center">
          <icons-close color="#EF4035" />
          <span>{{ message }}</span>
        </div>
      </ErrorMessage>
    </Field>
  </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';
import type { ISelectItem } from '~/types/select-item';

// Props
const props = withDefaults(
  defineProps<{
    name: string;
    options: ISelectItem[];
    placeholder?: string;
    label?: string;
    required?: boolean;
    multiline?: boolean;
    disabled?: boolean;
    hint?: string[];
  }>(),
  { options: () => [], hint: () => [] },
);
</script>
