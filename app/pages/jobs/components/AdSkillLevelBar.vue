<template>
  <div class="w-full text-right">
    <div class="mb-2.5 flex items-center justify-start gap-1">
      <img :src="skillCheckIcon" alt="" class="size-6 shrink-0" draggable="false" />
      <p class="text-[11px] leading-5 text-text-passive">{{ label }}</p>
    </div>

    <div class="flex w-full select-none items-start">
      <div
        v-for="(step, index) in steps"
        :key="step"
        class="flex min-w-0 flex-1 flex-col items-center"
      >
        <div class="flex h-4 w-full items-center">
          <div
            class="min-w-0 flex-1 rounded-full"
            :style="leftConnectorStyle(index)"
          />
          <div
            class="shrink-0 rounded-full"
            :class="dotSizeClass(index)"
            :style="{ backgroundColor: isActive(index) ? color : INACTIVE }"
          />
          <div
            class="min-w-0 flex-1 rounded-full"
            :style="rightConnectorStyle(index)"
          />
        </div>
        <span
          class="mt-2 max-w-full text-center text-[9px] leading-tight text-text-passive"
        >
          {{ step }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import skillCheckIcon from "~/assets/vectors/ad-skill-check.svg?url";
import { getProficiencyColor } from "../utils/ad-benefits";

const INACTIVE = "#EBEBEB";

const props = defineProps<{
  label: string;
  level: number;
  steps: string[];
  proficiencyValue: string | boolean | number;
}>();

const color = computed(() => getProficiencyColor(props.proficiencyValue));

const DOT_SIZES = [
  "size-1",
  "size-1.5",
  "size-[7px]",
  "size-2",
  "size-2.5",
  "size-3",
];

const CONNECTOR_PX = [2, 3, 4, 5, 6, 7];

function isActive(index: number) {
  return index < props.level;
}

function isConnectorActive(index: number) {
  return index < props.level - 1;
}

function visualSizeIndex(index: number) {
  if (index < props.level) return index;
  return 0;
}

function dotSizeClass(index: number) {
  return DOT_SIZES[visualSizeIndex(index)] ?? DOT_SIZES[0];
}

function connectorStyle(active: boolean, sizeIndex: number) {
  return {
    backgroundColor: active ? color.value : INACTIVE,
    height: `${CONNECTOR_PX[sizeIndex] ?? CONNECTOR_PX[0]}px`,
  };
}

/** Half-segment toward previous step (visually on the right in RTL). */
function leftConnectorStyle(index: number) {
  if (index === 0) return { height: "0px", backgroundColor: "transparent" };
  const connectorIndex = index - 1;
  return connectorStyle(
    isConnectorActive(connectorIndex),
    visualSizeIndex(connectorIndex),
  );
}

/** Half-segment toward next step (visually on the left in RTL). */
function rightConnectorStyle(index: number) {
  if (index >= props.steps.length - 1) {
    return { height: "0px", backgroundColor: "transparent" };
  }
  return connectorStyle(isConnectorActive(index), visualSizeIndex(index));
}
</script>
