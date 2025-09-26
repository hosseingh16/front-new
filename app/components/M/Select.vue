<template>
  <div class="grid h-12">
    <svg
      class="pointer-events-none relative left-2 z-10 col-start-1 row-start-1 h-12 w-4 self-center justify-self-end forced-colors:hidden"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M8.00001 11.2C7.53335 11.2 7.06668 11.02 6.71335 10.6667L2.36668 6.32C2.17335 6.12667 2.17335 5.80667 2.36668 5.61333C2.56001 5.42 2.88001 5.42 3.07335 5.61333L7.42001 9.96C7.74001 10.28 8.26001 10.28 8.58001 9.96L12.9267 5.61333C13.12 5.42 13.44 5.42 13.6333 5.61333C13.8267 5.80667 13.8267 6.12667 13.6333 6.32L9.28668 10.6667C8.93335 11.02 8.46668 11.2 8.00001 11.2Z"
        fill="#292C31"
      />
    </svg>
    <Icon
      v-if="icon"
      :name="`svg:${icon}`"
      size="30"
      class="z-10 pointer-events-none relative -top-10 right-2"
    />
    <select
      class="text-gray-500 col-start-1 row-start-1 w-80 appearance-none rounded-lg border-2 border-gray-300 px-2 hover:border-cyan-500 hover:bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-cyan-700 dark:hover:bg-gray-700 forced-colors:appearance-auto"
      :class="{ 'pr-10': icon }"
      placeholder="انتخاب عنوان شغلی"
    >
      <option v-if="placeholder" disabled selected>{{ placeholder }}</option>
      <option v-for="item in options" :value="item.value">{{ item.title }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps({
  options: { type: Object as () => { title: string; value: any }[], required: true },
  icon: String,
  placeholder: String,
});
</script>
