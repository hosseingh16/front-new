<template>
  <div
    class="max-h-[280px] space-y-2 overflow-y-scroll md:overflow-y-auto overflow-x-hidden"
    :class="listClass"
  >
    <label
      v-for="option in options"
      :key="option.value"
      class="flex w-full cursor-pointer items-center gap-2"
      :class="
        variant === 'card'
          ? [
              'max-h-[48px] rounded-xl p-3',
              isSelected(option) ? 'bg-surface-soft' : 'bg-surface-50',
            ]
          : ''
      "
    >
      <input
        v-model="model"
        type="checkbox"
        :value="option.value"
        class="checkbox checkbox-primary p-1.5"
      />
      <slot name="label" :option="option">
        <span class="text-text-tertiary">{{ option.label }}</span>
      </slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import type { ISelectItem } from "~/types/select-item";

withDefaults(
  defineProps<{
    options: ISelectItem[];
    listClass?: string;
    variant?: "plain" | "card";
  }>(),
  {
    listClass: "",
    variant: "plain",
  },
);

const model = defineModel<Array<string | number>>({ default: () => [] });

function isSelected(option: ISelectItem) {
  return model.value.some((value) => String(value) === String(option.value));
}
</script>
