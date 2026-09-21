<template>
  <button
    type="button"
    class="inline-flex cursor-pointer items-center gap-1.5 bg-transparent p-0 text-sm text-gray-500 transition-colors hover:text-gray-600"
    @click="emit('click')"
  >
    <Icon
      name="lucide:chevron-right"
      size="20"
      class="size-5 shrink-0 [&_svg]:stroke-[1.25]"
    />
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: "بازگشت به صفحه قبل",
  },
);

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>
