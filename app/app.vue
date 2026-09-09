<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <GoToTop v-if="!isDashboard" />
</template>

<script setup lang="ts">
const route = useRoute();

const isDashboard = computed(() => route.path.startsWith("/dashboard"));
</script>
