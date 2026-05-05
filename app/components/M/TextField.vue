<template>
  <div>
    <div class="flex items-center justify-between">
      <p class="mt-2 text-base relative">
        {{ label }}
        <span v-if="required" class="text-red-400 mb-4 absolute -top-2">*</span>
      </p>
      <div v-if="hint.length > 0" class="relative group z-1000">
        <Icon
          name="svg:hint"
          size="24"
          class="cursor-pointer"
          @click="showTip = !showTip"
        />
        <div
          class="w-67.5 items-start gap-5 absolute bg-white p-3 border-2 border-[#F2F2F2] rounded-lg"
          :class="!showTip ? 'hidden group-hover:flex -top-25' : '-top-35 max-lg:left-3'"
        >
          <Icon name="svg:hint" size="24" />
          <ul class="list-disc list-inside text-text-passive">
            <li class="text-sm" v-for="item in hint">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
    <label
      class="input w-full rounded-lg shadow-none hover:border-[#cccccc] focus:border-[#cccccc] focus-within:outline-none focus-within:shadow-[0px_0px_0px_2px_#FFFFFF,0px_0px_0px_4px_#4A4A4A14]"
      :class="
        error ? 'border-danger-200' : model ? 'border-[#cccccc]' : 'border-gray-default'
      "
    >
      <slot name="prefix" />
      <input
        v-model="model"
        :type
        :placeholder
        class="pr-0 placeholder:text-gray-default"
      />
      <slot name="suffix" />
    </label>
  </div>
</template>

<script setup lang="ts">
// Model
const model = defineModel({ default: '' });

// Props
const props = withDefaults(
  defineProps<{
    label?: string;
    defaultValue?: string;
    required?: boolean;
    type?: 'text' | 'password';
    placeholder?: string;
    hint?: string[];
    error?: boolean;
  }>(),
  { hint: () => [] },
);

// Variables
const showTip = ref(false);

// Watches
watch(
  () => props.defaultValue,
  () => {
    if (props.defaultValue) model.value = props.defaultValue;
  },
  { immediate: true },
);
</script>
