<!-- <template>
  <div
    class="w-6 h-6 rounded-full flex justify-center items-center"
    :style="`background-color:${colors[0]}`"
  >
    <div
      class="w-4 h-4 rounded-full flex justify-center items-center"
      :style="`background-color:${colors[1]}`"
    >
      <div
        class="w-2 h-2 rounded-full flex justify-center items-center"
        :style="`background-color:${colors[2]}`"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps({
  colors: { type: Array as () => string[], required: true },
});
</script> -->

<template>
  <div
    class="rounded-full flex justify-center items-center"
    :style="{
      width: `${outerSize}px`,
      height: `${outerSize}px`,
      backgroundColor: colors[0],
    }"
  >
    <div
      class="rounded-full flex justify-center items-center"
      :style="{
        width: `${middleSize}px`,
        height: `${middleSize}px`,
        backgroundColor: colors[1],
      }"
    >
      <div
        class="rounded-full flex justify-center items-center"
        :style="{
          width: `${innerSize}px`,
          height: `${innerSize}px`,
          backgroundColor: colors[2],
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  colors: {
    type: Array as () => string[],
    required: true,
  },
  size: {
    type: Number,
    default: 24, // سایز دایره بزرگ بر حسب پیکسل
  },
  scale: {
    type: Number,
    default: 0.65, // نسبت کوچک‌تر شدن هر لایه نسبت به قبلی
  },
});

// محاسبه سایز دایره‌ها بر اساس size و scale
const outerSize = computed(() => props.size);
const middleSize = computed(() => props.size * props.scale);
const innerSize = computed(() => props.size * props.scale * props.scale * props.scale);
</script>
