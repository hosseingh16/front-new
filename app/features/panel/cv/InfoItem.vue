<template>
  <div>
    <p>{{ title }}</p>
    <button
      type="button"
      class="mt-4 inline-flex items-center gap-1.5 border-none bg-transparent p-0 font-semibold cursor-pointer transition-colors"
      :class="value ? 'text-text-primay hover:text-primary-500' : 'text-text-muted hover:text-primary-500'"
      @click="emit('edit')"
    >
      <Icon name="svg:edit" size="16" class="shrink-0 text-text-muted" />
      <span>{{ value || "داده ای وارد نشده است" }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | undefined;
}>();

const emit = defineEmits<{
  edit: [];
}>();
</script>
