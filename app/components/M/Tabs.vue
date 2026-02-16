<template>
  <div>
    <!-- تب‌ها -->
    <div class="bg-gray-100 rounded-b-sm p-2 flex font-bold [&>div]:cursor-pointer">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="flex-1 text-gray-600 text-center text-sm"
        :class="{
          'border border-primary-900 rounded-sm font-bold text-primary-900 bg-white':
            activeIndex === index,
        }"
        @click="activeIndex = index"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- محتوای تب فعال -->
    <div class="mt-6 relative">
      <transition name="fade" mode="out-in">
        <component :is="tabs[activeIndex]?.component" />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Tab {
  label: string;
  component: any;
}

defineProps<{ tabs: Tab[] }>();

const activeIndex = ref(0);
</script>
