<template>
  <Field :name="name" v-slot="{ field, errorMessage }">
    <m-text-field
      v-bind="field"
      :default-value="field.value"
      :placeholder="placeholder"
      :error="!!errorMessage"
      :label
      :type
      :required
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix" />
      </template>

      <template v-if="$slots.suffix" #suffix>
        <slot name="suffix" />
      </template>
    </m-text-field>

    <ErrorMessage :name="name" v-slot="{ message }">
      <div class="mt-1 text-xs text-text-passive flex items-center">
        <icons-close color="#EF4035" />
        <span>{{ message }}</span>
      </div>
    </ErrorMessage>
  </Field>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';

// Props
withDefaults(
  defineProps<{
    name: string;
    placeholder?: string;
    label?: string;
    type?: 'text' | 'password';
    required?: boolean;
    hint?: string[];
  }>(),
  { hint: () => [] },
);
</script>
