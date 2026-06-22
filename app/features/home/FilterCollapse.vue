<template>
  <div class="collapse join-item border-base-300 border-b">
    <input v-model="open" type="checkbox" name="my-accordion-4" />
    <div
      class="collapse-title px-3 font-semibold flex justify-between items-center gap-1"
    >
      <div class="flex items-center gap-1">
        <slot name="title" />
      </div>
      <icons-chevron class="transition-all" :class="{ 'rotate-180': open }" />
    </div>
    <div class="collapse-content text-sm px-3">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  expand?: boolean;
}>();

const open = ref(props.expand);

watch(
  () => props.expand,
  (val) => {
    if (props.expand != null) {
      open.value = val;
    }
  },
  { immediate: true },
);
</script>
