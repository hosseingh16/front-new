<template>
  <div class="grid h-12">
    <icons-chevron-down />
    <Icon
      v-if="icon"
      :name="`svg:${icon}`"
      size="30"
      class="z-10 pointer-events-none relative -top-10 right-2"
    />
    <select
      class="text-gray-500 col-start-1 row-start-1 appearance-none rounded-lg border-gray-300 px-2 hover:border-cyan-500 hover:bg-white forced-colors:appearance-auto focus:outline-0"
      :class="{ 'pr-10': icon, 'border-0': noBorder, 'border-2': !noBorder }"
    >
      <option v-if="placeholder" disabled selected class="text-gray-400 text-sm">
        {{ placeholder }}
      </option>
      <option
        v-for="item in options"
        :key="item.value"
        :value="item.value"
        class="text-gray-700"
      >
        {{ item.title }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps({
  options: { type: Object as () => { title: string; value: any }[], required: true },
  icon: String,
  placeholder: String,
  noBorder: { type: Boolean, default: false },
});
</script>
