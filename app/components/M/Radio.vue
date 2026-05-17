<template>
  <div class="flex items-center cursor-pointer mb-3" @click="setValue(value)">
    <input
      type="radio"
      class="radio radio-primary ml-2"
      :checked="modelValue === value"
    />

    <p><slot /></p>
  </div>
</template>

<script setup lang="ts">
//Props
defineProps<{
  bgColor?: string;
  value: any;
  modelValue: any;
  setValue: (val: any) => void;
}>();

// Emits
const emits = defineEmits(['update', 'update:modelValue']);

// Injects
const radioModel = inject<any>('radioModel');
</script>
