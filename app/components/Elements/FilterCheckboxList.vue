<template>
  <div
    class="max-h-[280px] space-y-2 overflow-y-auto overflow-x-hidden"
    :class="listClass"
  >
    <label
      v-for="option in options"
      :key="option.value"
      class="flex cursor-pointer items-center gap-2 rounded-xl p-3 max-h-[48px]"
      :class="isSelected(option) ? 'bg-[#F6F8FE]' : 'bg-surface-50'"
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
    </label>
  </div>
</template>

<script setup lang="ts">
import type { ISelectItem } from "~/types/select-item";

withDefaults(
  defineProps<{
    options: ISelectItem[];
    listClass?: string;
  }>(),
  {
    listClass: "",
  },
);

const model = defineModel<Array<string | number>>({ default: () => [] });

function isSelected(option: ISelectItem) {
  return model.value.some((value) => String(value) === String(option.value));
}
</script>
