<template>
  <div
    class="mt-2 flex items-center justify-center gap-2 [&>.input]:rounded-lg [&>.input]:border-gray-default [&>.input]:text-center [&>.input]:px-0"
    dir="ltr"
  >
    <input
      v-for="(item, index) in 6"
      :key="index"
      type="text"
      class="input w-10 h-10"
      maxlength="1"
      ref="inputs"
      @input="handleInput($event, index)"
      @keydown.backspace="handleBackspace($event, index)"
    />
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{ codeProp?: string }>();

// Emits
const emits = defineEmits<{
  (e: 'code', code: string): void;
}>();

// Parameters
const inputs = ref<any[]>([]);
const model = ref(['', '', '', '', '', '']);

// Watches
watch(
  () => props.codeProp,
  (newVal) => {
    if (newVal && newVal.length === 6) {
      const chars = newVal.split('');
      model.value = chars;

      nextTick(() => {
        chars.forEach((char, index) => {
          if (inputs.value[index]) inputs.value[index].value = char;
        });
      });
    }
  },
  { immediate: true },
);

// Functions
function handleInput(event: any, index: number) {
  const value = event.target.value;

  if (!/^\d$/.test(value)) {
    event.target.value = '';
    return;
  }

  if (index < inputs.value.length - 1) {
    nextTick(() => {
      inputs.value[index + 1].focus();
    });
  }

  model.value[index] = value;
  emits('code', model.value.join(''));
}

function handleBackspace(event: any, index: number) {
  if (index === 5) {
    model.value[index] = '';
  }
  if (!event.target.value && index > 0) {
    inputs.value[index - 1].focus();
    model.value[index] = '';
    model.value[index - 1] = '';
  }
  emits('code', model.value.join(''));
}
</script>
