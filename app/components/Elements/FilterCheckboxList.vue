<template>
  <div
    class="max-h-[280px] space-y-2 overflow-y-auto"
    :class="listClass"
  >
    <div
      v-for="option in options"
      :key="option.value"
      class="flex items-center gap-2"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISelectItem } from '~/types/select-item'

withDefaults(
  defineProps<{
    options: ISelectItem[]
    listClass?: string
  }>(),
  {
    listClass: '',
  },
)

const model = defineModel<Array<string | number>>({ default: () => [] })
</script>
