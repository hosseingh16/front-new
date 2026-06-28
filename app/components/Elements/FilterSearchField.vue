<template>
  <div
    class="flex items-center gap-2 rounded-lg border border-gray-default px-3 py-2.5"
    :class="wrapperClass"
  >
    <Icon name="svg:search-1" size="16" class="shrink-0 text-text-passive" />
    <input
      v-model="model"
      type="search"
      class="w-full bg-transparent text-sm text-text-tertiary placeholder:text-text-passive focus:outline-none"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    placeholder: string
    wrapperClass?: string
  }>(),
  {
    wrapperClass: '',
  },
)

const model = defineModel<string>({ default: '' })
</script>
