<template>
  <div
    class="mt-2 flex items-center justify-center gap-2 [&>.input]:rounded-lg [&>.input]:border-gray-default [&>.input]:text-center [&>.input]:px-0"
    dir="ltr"
  >
    <input
      v-for="(item, index) in 5"
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
// Model
const model = defineModel({ default: ['', '', '', '', ''] });

// Variables
const inputs = ref<any[]>([]);

// Functions
function handleInput(event: any, index: number) {
  console.log(4);
  const value = event.target.value;

  if (!/^\d$/.test(value) && value !== '') {
    event.target.value = '';
    return;
  }

  if (index < inputs.value.length - 1) {
    nextTick(() => {
      inputs.value[index + 1].focus();
    });
  }

  model.value[index] = value;
}

function handleBackspace(event: any, index: number) {
  if (index === 4) {
    model.value[index] = '';
  }
  if (!event.target.value && index > 0) {
    inputs.value[index - 1].focus();
    model.value[index] = '';
    model.value[index - 1] = '';
  }
}

//
onMounted(() => {
  if (model.value.every((x) => x !== '')) {
    for (let i = 0; i < inputs.value.length; i++) {
      const element = inputs.value[i];
      element.value = model.value[i];
    }
  }
});
</script>
