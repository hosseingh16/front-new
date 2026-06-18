<template>
  <Field :name v-slot="{ field, value, errorMessage }">
    <slot />
    <ErrorMessage :name="name" v-slot="{ message }">
      <div class="mt-1 text-xs text-text-passive flex items-center">
        <icons-close color="#EF4035" />
        <span>{{ message }}</span>
      </div>
    </ErrorMessage>
  </Field>
</template>

<script setup lang="ts">
import { ErrorMessage, Field } from 'vee-validate';

defineProps<{
  name: string;
}>();
</script>
