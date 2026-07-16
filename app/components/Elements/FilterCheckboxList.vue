<template>
  <div
    class="max-h-[280px] space-y-2 overflow-y-scroll md:overflow-y-auto overflow-x-hidden"
    :class="listClass"
  >
    <component
      :is="variant === 'card' ? 'label' : 'div'"
      v-for="option in options"
      :key="option.value"
      class="flex items-center gap-2"
      :class="
        variant === 'card'
          ? [
              'max-h-[48px] cursor-pointer rounded-xl p-3',
              isSelected(option) ? 'bg-[#F6F8FE]' : 'bg-surface-50',
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
        <span>{{ option.label }}</span>
      </slot>
    </component>
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
