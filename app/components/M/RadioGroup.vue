<template>
  <div>
    <Field :name="name" v-slot="{ value, setValue, errorMessage }">
      <p class="text-base relative mb-3">
        {{ label }}
        <span v-if="required" class="text-red-400 absolute -top-2">*</span>
      </p>

      <div class="flex gap-12" :class="inline ? 'flex-row' : 'flex-col'">
        <slot :model-value="value" :set-value="setValue" />
      </div>

      <ErrorMessage :name="name" v-if="errorMessage">
        <div class="mt-1 text-xs text-text-passive flex items-center">
          <icons-close color="#EF4035" />
          <span>{{ errorMessage }}</span>
        </div>
      </ErrorMessage>
    </Field>
  </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';

// Model
const model = defineModel<string | undefined | null>();

// Props
const props = defineProps({
  name: { type: String, required: true },
  inline: { type: Boolean, default: false },
  label: String,
  required: Boolean,
});

// Emits
const emits = defineEmits(['update:modelValue']);

// Provides
provide(
  'radioModel',
  computed(() => ({
    model: model.value,
    set: (val: any) => (model.value = val),
  })),
);
</script>
