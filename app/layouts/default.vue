<template>
  <div class="bg-surface-50">
    <div class="max-w-384 w-full m-auto">
      <Header />
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
const { setForcedTheme } = useAppTheme();

setForcedTheme("light");

onUnmounted(() => {
  setForcedTheme(null);
});
</script>
