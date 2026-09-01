<template>
  <div class="mt-6 flex items-center justify-end gap-2">
    <button
      type="button"
      class="btn btn-primary h-10 rounded-lg px-6 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="saving || disabled"
      @click="emit('save')"
    >
      <Icon name="svg:check-check" size="18" />
      <span v-if="saving">در حال ذخیره...</span>
      <span v-else>ثبت و ذخیره</span>
    </button>

    <!-- <button
      type="button"
      class="btn btn-ghost h-10 rounded-lg text-sm text-text-passive"
      @click="emit('cancel')"
    >
      <Icon name="svg:close" size="16" />
      انصراف
    </button> -->
  </div>
</template>

<script setup lang="ts">
defineProps<{
  saving?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  save: [];
  cancel: [];
}>();
</script>
