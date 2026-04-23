<template>
  <div>
    <div class="flex items-center justify-between">
      <p class="mt-2 text-base relative">
        {{ label }}
        <span v-if="required" class="text-red-400 mb-4 absolute -top-2">*</span>
      </p>
      <div v-if="hint.length > 0" class="relative group z-[1000]">
        <Icon
          name="svg:hint"
          size="24"
          class="cursor-pointer"
          @click="showTip = !showTip"
        />
        <div
          class="w-[270px] items-start gap-5 absolute bg-white p-3 border-2 border-[#F2F2F2] rounded-lg"
          :class="
            !showTip
              ? 'hidden group-hover:flex -top-[100px]'
              : '-top-[140px] max-lg:left-3'
          "
        >
          <Icon name="svg:hint" size="24" />
          <ul class="list-disc list-inside text-[#757575]">
            <li class="text-sm" v-for="item in hint">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
    <label
      class="mt-2 input w-full rounded-lg border-gray-default focus-within:outline-none"
    >
      <slot name="prefix" />
      <input
        v-model="model"
        :type
        :placeholder
        class="pr-0 placeholder:text-gray-default focus:border-gray-400"
      />
      <slot name="suffix" />
    </label>
  </div>
</template>

<script setup lang="ts">
// Model
const model = defineModel({ default: '' });

// Props
withDefaults(
  defineProps<{
    label?: string;
    required?: boolean;
    type?: 'text' | 'password';
    placeholder?: string;
    hint?: string[];
  }>(),
  { hint: () => [] },
);

// Variables
const showTip = ref(false);
</script>
