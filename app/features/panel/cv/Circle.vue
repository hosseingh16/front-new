<template>
  <div class="flex items-center justify-center bg-white">
    <div class="relative w-48 h-48">
      <svg viewBox="0 0 200 200" class="w-full h-full rotate-90">
        <!-- Background arc -->
        <path
          :d="arcPath"
          stroke="#F2F2F2"
          stroke-width="14"
          fill="none"
          stroke-linecap="round"
        />

        <!-- Progress arc -->
        <path
          :d="arcPath"
          stroke="#10b981"
          stroke-width="14"
          fill="none"
          stroke-linecap="round"
          :stroke-dasharray="arcLength"
          :stroke-dashoffset="dashOffset"
          class="transition-all duration-700 ease-out"
        />
      </svg>

      <!-- Text -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-caption text-text-passive">میزان کامل شدن</span>
        <span class="text-3xl font-bold mt-2">{{ percent }}٪</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  percent: {
    type: Number,
    default: 0,
  },
});

const radius = 80;
const startAngle = 135;
const endAngle = 405;

const polarToCartesian = (cx, cy, r, angle) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const describeArc = (x, y, r, start, end) => {
  const startPoint = polarToCartesian(x, y, r, end);
  const endPoint = polarToCartesian(x, y, r, start);

  const largeArcFlag = end - start <= 180 ? '0' : '1';

  return [
    'M',
    startPoint.x,
    startPoint.y,
    'A',
    r,
    r,
    0,
    largeArcFlag,
    0,
    endPoint.x,
    endPoint.y,
  ].join(' ');
};

const arcPath = describeArc(100, 100, radius, startAngle, endAngle);

const arcLength = Math.PI * radius * 1.5;

const dashOffset = computed(() => {
  return (props.percent / 100) * arcLength - arcLength;
});
</script>
