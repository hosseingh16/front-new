<template>
  <div class="bg-surface-50">
    <SiteTopBanner />
    <Header />
    <div class="m-auto w-full max-w-384">
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
