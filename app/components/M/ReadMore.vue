<template>
  <div>
    <div class="relative">
      <div
        class="overflow-hidden leading-7 text-gray-700 transition-[max-height] duration-500 ease-in-out"
        :style="{ maxHeight: showLess ? '12rem' : '1000px' }"
        v-html="text"
      ></div>

      <Transition name="fade" mode="out-in">
        <div
          v-if="showLess"
          class="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent pointer-events-none"
        ></div>
      </Transition>
    </div>

    <div class="text-center mt-2">
      <button
        class="btn btn-ghost text-sm text-primary-500 h-10"
        @click="showLess = !showLess"
      >
        <span>مشاهده {{ showLess ? 'بیشتر' : 'کمتر' }}</span>
        <Icon
          name="svg:arrow-down"
          :class="['transition-transform duration-300', { 'rotate-180': !showLess }]"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: { type: String, required: true },
});
const showLess = ref(true);
</script>
