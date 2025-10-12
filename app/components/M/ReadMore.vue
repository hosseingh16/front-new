<template>
  <div>
    <div class="relative">
      <div
        class="overflow-hidden leading-7 text-gray-700"
        :class="{ 'h-48': showLess }"
        v-html="text"
      ></div>
      <div
        v-if="showLess"
        class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"
      ></div>
    </div>
    <div class="text-center mt-2">
      <button
        class="btn btn-ghost text-14 text-primary-900 h-10"
        @click="showLess = !showLess"
      >
        <span>مشاهده {{ showLess ? 'بیشتر' : 'کمتر' }}</span>
        <Icon name="svg:arrow-down" :class="{ 'rotate-180': !showLess }" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps({
  text: { type: String, required: true },
});

// Variables
const showLess = ref(true);
</script>
