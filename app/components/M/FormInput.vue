<template>
  <div :data-field="name">
    <Field :name="name" v-slot="{ field, value, errorMessage }">
      <m-text-field
        v-bind="{ ...textFieldProps, ...wrapField(field) }"
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
      </m-text-field>

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
import { toEnglishDigits } from '~/utils/digits';

type FieldBinds = Record<string, unknown> & {
  onInput?: (value: unknown) => void;
  onChange?: (value: unknown) => void;
};

// Props
const props = withDefaults(
  defineProps<{
    name: string;
    placeholder?: string;
    label?: string;
    type?: 'text' | 'password';
    required?: boolean;
    multiline?: boolean;
    hint?: string[];
    englishDigits?: boolean;
    autocomplete?: string;
  }>(),
  { hint: () => [] },
);

const textFieldProps = computed(() => {
  const { englishDigits: _englishDigits, ...rest } = props;
  return rest;
});

function rawInputValue(event: unknown) {
  if (event && typeof event === 'object' && 'target' in event) {
    return String((event as { target: { value?: unknown } }).target?.value ?? '');
  }
  return String(event ?? '');
}

function wrapField(field: FieldBinds) {
  if (!props.englishDigits) return field;

  const withEnglishDigits = (handler?: (value: unknown) => void) => {
    return (event: unknown) => handler?.(toEnglishDigits(rawInputValue(event)));
  };

  return {
    ...field,
    onInput: withEnglishDigits(field.onInput),
    onChange: withEnglishDigits(field.onChange),
  };
}
</script>
