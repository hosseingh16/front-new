<template>
  <div>
    <p v-if="label" class="mb-4">{{ label }}</p>
    <div
      class="bg-surface-50 rounded-full py-3 px-1 md:px-1 flex items-center justify-center gap-px [&>div:nth-child(odd)]:cursor-pointer select-none"
      ref="root"
      @pointerdown="startDrag"
      @pointermove="onDrag"
      @pointerup="endDrag"
      @pointerleave="endDrag"
    >
      <div class="relative">
        <div
          class="rounded-full w-1 h-1"
          :style="`background-color: ${model > 0 ? color : '#EBEBEB'}`"
          @click="model = 0"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">0</span>
      </div>

      <div
        class="rounded-full w-full h-1"
        :style="`background-color: ${model >= 1 ? color : '#EBEBEB'}`"
      ></div>
      <div class="relative">
        <div
          class="rounded-full w-1.25 h-1.25"
          :style="`background-color: ${model >= 1 ? color : '#EBEBEB'}`"
          @click="model = 1"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">1</span>
      </div>

      <div
        class="rounded-full w-full h-1.25"
        :style="`background-color: ${model >= 2 ? color : '#EBEBEB'}`"
      ></div>
      <div class="relative">
        <div
          class="rounded-full w-1.5 h-1.5"
          :style="`background-color: ${model >= 2 ? color : '#EBEBEB'}`"
          @click="model = 2"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">2</span>
      </div>

      <div
        class="rounded-full w-full h-1.5"
        :style="`background-color: ${model >= 3 ? color : '#EBEBEB'}`"
      ></div>
      <div class="relative">
        <div
          class="rounded-full w-1.75 h-1.75"
          :style="`background-color: ${model >= 3 ? color : '#EBEBEB'}`"
          @click="model = 3"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">3</span>
      </div>

      <div
        class="rounded-full w-full h-1.75"
        :style="`background-color: ${model >= 4 ? color : '#EBEBEB'}`"
      ></div>
      <div class="relative">
        <div
          class="rounded-full w-2 h-2"
          :style="`background-color: ${model >= 4 ? color : '#EBEBEB'}`"
          @click="model = 4"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">4</span>
      </div>

      <div
        class="rounded-full w-full h-2"
        :style="`background-color: ${model >= 5 ? color : '#EBEBEB'}`"
      ></div>
      <div class="relative">
        <div
          class="rounded-full w-2.25 h-2.25"
          :style="`background-color: ${model >= 5 ? color : '#EBEBEB'}`"
          @click="model = 5"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">5</span>
      </div>

      <div
        class="rounded-full w-full h-2.25"
        :style="`background-color: ${model >= 6 ? color : '#EBEBEB'}`"
      ></div>
      <div class="relative">
        <div
          class="rounded-full w-2.5 h-2.5"
          :style="`background-color: ${model > 6 ? color : '#EBEBEB'}`"
          @click="model = 6"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">6</span>
      </div>

      <div
        class="rounded-full w-full h-2.5"
        :style="`background-color: ${model >= 7 ? color : '#EBEBEB'}`"
      ></div>
      <div class="relative">
        <div
          class="rounded-full w-2.75 h-2.75"
          :style="`background-color: ${model >= 7 ? color : '#EBEBEB'}`"
          @click="model = 7"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">7</span>
      </div>

      <div
        class="rounded-full w-full h-2.75"
        :style="`background-color: ${model >= 8 ? color : '#EBEBEB'}`"
      ></div>
      <div class="relative">
        <div
          class="rounded-full w-3 h-3"
          :style="`background-color: ${model >= 8 ? color : '#EBEBEB'}`"
          @click="model = 8"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">8</span>
      </div>

      <div
        class="rounded-full w-full h-3"
        :style="`background-color: ${model >= 9 ? color : '#EBEBEB'}`"
      ></div>
      <div class="relative">
        <div
          class="rounded-full w-3.25 h-3.25"
          :style="`background-color: ${model >= 9 ? color : '#EBEBEB'}`"
          @click="model = 9"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">9</span>
      </div>

      <div
        class="rounded-full w-full h-3.25"
        :style="`background-color: ${model >= 10 ? color : '#EBEBEB'}`"
      ></div>
      <div class="relative">
        <div
          class="rounded-full w-3.5 h-3.5"
          :style="`background-color: ${model >= 10 ? color : '#EBEBEB'}`"
          @click="model = 10"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">10</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Model
const model = defineModel({ default: 0 });

// Props
defineProps({
  label: String,
  color: { type: String, required: true },
});

const isDragging = ref(false);
const root = ref<HTMLElement | null>(null);

const clamp = (v: number) => Math.max(0, Math.min(10, v));

const getValue = (e: PointerEvent) => {
  if (!root.value) return 0;

  const rect = root.value.getBoundingClientRect();
  const x = e.clientX - rect.left;

  const percent = x / rect.width;
  return clamp(Math.round((1 - percent) * 10));
};

const setFromEvent = (e: PointerEvent) => {
  model.value = getValue(e);
};

const startDrag = (e: PointerEvent) => {
  isDragging.value = true;
  document.body.style.userSelect = 'none';
  setFromEvent(e);
};

const onDrag = (e: PointerEvent) => {
  if (!isDragging.value) return;
  setFromEvent(e);
};

const endDrag = () => {
  isDragging.value = false;
  document.body.style.userSelect = '';
};
</script>
