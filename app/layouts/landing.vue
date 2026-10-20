<template>
  <div class="bg-surface-50">
    <SiteTopBanner />
    <Header />
    <slot />
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
