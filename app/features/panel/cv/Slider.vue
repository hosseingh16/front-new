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
      <div class="relative" @pointerdown.stop="model = 0">
        <div
          class="rounded-full w-1 h-1"
          :style="{ backgroundColor: dotFill(0) }"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">0</span>
      </div>

      <div
        class="rounded-full w-full h-1 cursor-pointer"
        :style="{ backgroundColor: connectorFill(1) }"
      ></div>
      <div class="relative" @pointerdown.stop="model = 1">
        <div
          class="rounded-full w-1.25 h-1.25"
          :style="{ backgroundColor: dotFill(1) }"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">1</span>
      </div>

      <div
        class="rounded-full w-full h-1.25 cursor-pointer"
        :style="{ backgroundColor: connectorFill(2) }"
      ></div>
      <div class="relative" @pointerdown.stop="model = 2">
        <div
          class="rounded-full w-1.5 h-1.5"
          :style="{ backgroundColor: dotFill(2) }"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">2</span>
      </div>

      <div
        class="rounded-full w-full h-1.5 cursor-pointer"
        :style="{ backgroundColor: connectorFill(3) }"
      ></div>
      <div class="relative" @pointerdown.stop="model = 3">
        <div
          class="rounded-full w-1.75 h-1.75"
          :style="{ backgroundColor: dotFill(3) }"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">3</span>
      </div>

      <div
        class="rounded-full w-full h-1.75 cursor-pointer"
        :style="{ backgroundColor: connectorFill(4) }"
      ></div>
      <div class="relative" @pointerdown.stop="model = 4">
        <div
          class="rounded-full w-2 h-2"
          :style="{ backgroundColor: dotFill(4) }"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">4</span>
      </div>

      <div
        class="rounded-full w-full h-2 cursor-pointer"
        :style="{ backgroundColor: connectorFill(5) }"
      ></div>
      <div class="relative" @pointerdown.stop="model = 5">
        <div
          class="rounded-full w-2.25 h-2.25"
          :style="{ backgroundColor: dotFill(5) }"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">5</span>
      </div>

      <div
        class="rounded-full w-full h-2.25 cursor-pointer"
        :style="{ backgroundColor: connectorFill(6) }"
      ></div>
      <div class="relative" @pointerdown.stop="model = 6">
        <div
          class="rounded-full w-2.5 h-2.5"
          :style="{ backgroundColor: dotFill(6) }"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">6</span>
      </div>

      <div
        class="rounded-full w-full h-2.5 cursor-pointer"
        :style="{ backgroundColor: connectorFill(7) }"
      ></div>
      <div class="relative" @pointerdown.stop="model = 7">
        <div
          class="rounded-full w-2.75 h-2.75"
          :style="{ backgroundColor: dotFill(7) }"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">7</span>
      </div>

      <div
        class="rounded-full w-full h-2.75 cursor-pointer"
        :style="{ backgroundColor: connectorFill(8) }"
      ></div>
      <div class="relative" @pointerdown.stop="model = 8">
        <div
          class="rounded-full w-3 h-3"
          :style="{ backgroundColor: dotFill(8) }"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">8</span>
      </div>

      <div
        class="rounded-full w-full h-3 cursor-pointer"
        :style="{ backgroundColor: connectorFill(9) }"
      ></div>
      <div class="relative" @pointerdown.stop="model = 9">
        <div
          class="rounded-full w-3.25 h-3.25"
          :style="{ backgroundColor: dotFill(9) }"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">9</span>
      </div>

      <div
        class="rounded-full w-full h-3.25 cursor-pointer"
        :style="{ backgroundColor: connectorFill(10) }"
      ></div>
      <div class="relative" @pointerdown.stop="model = 10">
        <div
          class="rounded-full w-3.5 h-3.5"
          :style="{ backgroundColor: dotFill(10) }"
        ></div>
        <span class="absolute -right-px top-8 text-[9px]">10</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const INACTIVE_COLOR = "#EBEBEB";

const LEVEL_COLORS = {
  red: "#EF5350",
  orange: "#FFA726",
  yellow: "#FFCA28",
  lightGreen: "#AED581",
  darkGreen: "#2E7D32",
} as const;

const model = defineModel({ default: 0 });

defineProps({
  label: String,
});

const isDragging = ref(false);
const root = ref<HTMLElement | null>(null);

function colorForValue(value: number) {
  if (value <= 0) return INACTIVE_COLOR;

  const tier = Math.ceil((value / 10) * 6);
  if (tier <= 2) return LEVEL_COLORS.red;
  if (tier === 3) return LEVEL_COLORS.orange;
  if (tier === 4) return LEVEL_COLORS.yellow;
  if (tier === 5) return LEVEL_COLORS.lightGreen;
  return LEVEL_COLORS.darkGreen;
}

function dotFill(level: number) {
  const current = Number(model.value);

  if (level === 0) {
    return current > 0 ? colorForValue(current) : INACTIVE_COLOR;
  }

  if (current < level) return INACTIVE_COLOR;
  return colorForValue(current);
}

function connectorFill(level: number) {
  const current = Number(model.value);
  if (current < level) return INACTIVE_COLOR;
  return colorForValue(current);
}

const clamp = (v: number) => Math.max(0, Math.min(10, v));

const getValue = (e: PointerEvent) => {
  if (!root.value) return 0;

  const rect = root.value.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const isRtl = getComputedStyle(root.value).direction === "rtl";
  const normalized = isRtl ? 1 - ratio : ratio;
  return clamp(Math.round(normalized * 10));
};

const setFromEvent = (e: PointerEvent) => {
  model.value = getValue(e);
};

const startDrag = (e: PointerEvent) => {
  isDragging.value = true;
  document.body.style.userSelect = "none";
  setFromEvent(e);
};

const onDrag = (e: PointerEvent) => {
  if (!isDragging.value) return;
  setFromEvent(e);
};

const endDrag = () => {
  isDragging.value = false;
  document.body.style.userSelect = "";
};
</script>
